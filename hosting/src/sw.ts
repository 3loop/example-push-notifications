import { getMessaging } from 'firebase/messaging/sw';
import { firebaseApp } from './firebase';

getMessaging(firebaseApp);
