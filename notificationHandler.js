const { Expo } = require('expo-server-sdk');

const expo = new Expo();

const sendNotifications = async (somePushTokens) => {
  let messages = [];
  for (let pushToken of somePushTokens) {
    messages.push({
      to: pushToken,
      sound: 'default',
      body: 'There\'s A Vaccine Near You!',
    })
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk).catch(console.error);
  }
}


module.exports = {
  sendNotifications
}
