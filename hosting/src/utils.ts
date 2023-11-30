import {
  collection,
  doc,
  getFirestore,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';
import { firebaseApp } from './firebase';

export const db = getFirestore(firebaseApp);

export async function saveMessagingDeviceToken(address: string): Promise<void> {
  const addressRef = doc(db, 'address_tokens', address.toLowerCase())
  const tokensRef = collection(addressRef, 'tokens')

  try {
    const currentToken = await getToken(getMessaging(firebaseApp));

    if (currentToken) {
      console.info('Saving device token:', currentToken);

      const tokenRef = doc(tokensRef, currentToken);
      runTransaction(db, async (transaction) => {
        await Promise.all([transaction.set(tokenRef, {
          token: currentToken,
          updatedAt: serverTimestamp(),
          platform: "webpush"
        }),
        // HACK: trigger document creation to generate new webhook
        transaction.set(addressRef, {
          updatedAt: serverTimestamp(),
          address
        })])
      })

    } else void requestNotificationsPermissions(address);
  } catch (error) {
    console.error('Unable to get and sync messaging token.', error);
  }
}

async function requestNotificationsPermissions(address: string): Promise<void> {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.info('Notification permission granted.');
    await saveMessagingDeviceToken(address);
  } else console.error('Unable to get permissions.');
}