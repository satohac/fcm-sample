const auth = firebase.auth();
const messaging = firebase.messaging();
const database = firebase.database();
let uid = null;

// ----------------------
// Login
// ----------------------

// Switch panel by login state
auth.onAuthStateChanged(async (user) => {
  $(".panel").addClass("d-none");
  if (user != null) {
    uid = user.uid;

    listenFCMToken(user.uid);

    listenTopic(user.uid);

    $("#main").removeClass("d-none");
  } else {
    uid = null;
    $("#login").addClass("d-none");
  }
});

// Login
$("#login-form").submit((e) => {
  e.preventDefault();
  $("#login-error").addClass("d-none");
  auth
    .signInWithEmailAndPassword($("#email").val(), $("#password").val())
    .catch((error) => {
      $("#login-error").removeClass("d-none");
    });
});

// ----------------------
// Messaging
// ----------------------
// Watch fcm token registerd state
const listenFCMToken = (uid) => {
  database.ref(`users/${uid}/fcmToken`).on("value", (snapshot) => {
    if (snapshot.exists()) {
      $("#subscribe").attr("aria-disabled", "false").prop("disabled", false);
      $("#saveFCMToken").addClass("d-none");
      $("#deleteFCMToken").removeClass("d-none");
      $("#token-indicator").text(snapshot.val());
    } else {
      $("#subscribe").attr("aria-disabled", "true").prop("disabled", true);
      $("#saveFCMToken").removeClass("d-none");
      $("#deleteFCMToken").addClass("d-none");
      $("#token-indicator").html("<i>Not Saved</i>");
    }
  });
};

// Get FCM Token and save to database
$("#saveFCMToken").click(() => {
  messaging
    .getToken({
      vapidKey:
        "BKI1RMRnbr1hQurMpaW3Uervkzmo3oKHiM4q7CJ7kUkqsPUw94JC_k3OrTvigQ14z5YkBaH5OqRJafU_gVLsP1c",
    })
    .then((currentToken) => {
      if (currentToken) {
        database.ref(`users/${uid}/fcmToken`).set(currentToken);
      }
    })
    .catch((err) => {
      console.error("An error occurred while retrieving token. ", err);
    });
});

// Remove FCM Token from database
$("#deleteFCMToken").click(() => {
  messaging.deleteToken().then(() => {
    database.ref(`users/${uid}/fcmToken`).remove();
  });
});

// Add Topic button
const addTopicButton = (uid, topic) => {
  const btn = $(`
    <button type="button" class="btn btn-info mr-3" id="btn-${topic}">${topic}
      <i class="far fa-trash-alt"></i>
    </button>
  `);
  btn.click(() => {
    database.ref(`users/${uid}/subscribes/${topic}`).remove();
  });
  btn.appendTo("#topics");
};

// Watch subscribed topic on database
const listenTopic = (uid) => {
  database.ref(`users/${uid}/subscribes`).on("child_added", (snap) => {
    addTopicButton(uid, snap.key);
  });
  database.ref(`users/${uid}/subscribes`).on("child_removed", (snap) => {
    $(`#btn-${snap.key}`).remove();
  });
};

// Add subscribe topic to database
$("#subscribe").click(() => {
  $("#topic-error").addClass("d-none");
  const topic = $("#topic-input").val();
  if (topic && /^[0-9a-zA-Z]{1,10}$/.test(topic)) {
    database.ref(`users/${uid}/subscribes/${topic}`).set(true);
    $("#topic-input").val("");
  } else {
    $("#topic-error").removeClass("d-none");
  }
});

// Add notification to the list
const appendMessage = (key, ts, title, body) => {
  if ($(`#msg-${key}`).length == 0) {
    const timestamp = new Date();
    timestamp.setTime(Number.parseFloat(ts) * 1000);
    $("#messages > tbody").append(
      $(`
      <tr id="msg-${key}">
        <td>${timestamp.toString()}</td>
        <td>${title}</td>
        <td>${body}</td>
      </tr>
    `)
    );
  }
};

// Add the received notification to the list
messaging.onMessage((payload) => {
  appendMessage(
    payload.collapseKey || payload.collapse_key,
    payload.data["google.c.a.ts"],
    payload.notification.title,
    payload.notification.body
  );
});

// Add the received backend notification to the list
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data && event.data.notification) {
    appendMessage(
      event.data.collapseKey || event.data.collapse_key,
      event.data.data["google.c.a.ts"],
      event.data.notification.title,
      event.data.notification.body
    );
  }
});
