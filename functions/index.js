const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendChatNotification = functions.firestore
  .document('Chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.data();
    const senderId = messageData.sendBy;
    const recipientId = messageData.sendTo;

    // Retrieve recipient's device token from Firestore
    const recipientSnapshot = await admin.firestore().collection('Users').doc(recipientId).get();
    const recipientToken = recipientSnapshot.data().deviceToken;

    // Construct the notification message
    const payload = {
      notification: {
        title: 'New Message',
        body: 'You have received a new message.',
      },
    };

    // Send the notification
    await admin.messaging().sendToDevice(recipientToken, payload);
  });
