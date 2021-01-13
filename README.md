# fcm-sample
This sample code is  implimentetion of Firebase Cloud Messaging by JavaScript(Web).

### Required
- Node.js
- firebase-tools
- Firebase Project( Setuped biling account. it need by Functions to use. )

### How to run
1. clone this repository or download zip file.
```
git clone https://github.com/satohac/fcm-sample.git
```

2. deploy firebase hosting and functions
```
firebase deploy
```

3. Access hosting site
```
https://<project-id>
```

4. Click [Save FCM Token] button

5. Send message from firebase console  
   Send to app seguments or 'all' topic.  then recive messages

6. The received message is displayed

### Futures
- Get FCM token
- Subscribe and unsubscribe a topic
- Show recived messages
