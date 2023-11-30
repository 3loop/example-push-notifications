import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseApp } from './firebase';
import { useLocalStorage } from 'usehooks-ts'
import { saveMessagingDeviceToken } from './utils';
import {
  useMutation,
} from '@tanstack/react-query'

export function Home() {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(() => Notification.permission === 'granted');
  const [currentAddress, setAddress] = useLocalStorage('address', '')

  useEffect(() => {
    let unsubscribe: () => void | undefined;

    if (pushNotificationsEnabled)
      unsubscribe = onMessage(getMessaging(firebaseApp), (message) => {
        const { title, icon, body } = message.notification as {
          [key: string]: string;
        };
        new Notification(title, {
          icon,
          body
        });
      });

    return () => unsubscribe && unsubscribe();
  }, [pushNotificationsEnabled]);

  const enablePushNotifications = () => {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          setPushNotificationsEnabled(true);
        }
      })
    }
  }

  // Mutations
  const { mutate: subscribeToPushNotifications, isPending } = useMutation({
    mutationFn: () => {
      if (currentAddress === '') throw new Error('Address is empty')
      return saveMessagingDeviceToken(currentAddress)
    },
    onSuccess: () => {
      // Invalidate and refetch
      alert('Subscribed to push notifications!')
    },
  })

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Loop Decoder Push Notification</h1>
      <div className="card">
        {pushNotificationsEnabled ? (
          <div className='column'>
            <p>Demo works for contract: <pre>0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9</pre></p>
            <input
              type="text"
              value={currentAddress}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
            <button onClick={() => subscribeToPushNotifications()}>
              {isPending ? 'Subscribing...' : 'Subscribe to Push Notifications'}
            </button>
          </div>
        ) :
          <button onClick={enablePushNotifications}>
            Enable Push Permissions
          </button>}
      </div>
    </>
  )
}