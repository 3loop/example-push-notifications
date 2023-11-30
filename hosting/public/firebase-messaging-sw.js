/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAvXqEHk9Mh7aiUJlExXtxFHp2MvDhi8ww",
  authDomain: "example-push-3a54c.firebaseapp.com",
  projectId: "example-push-3a54c",
  storageBucket: "example-push-3a54c.appspot.com",
  messagingSenderId: "528678070111",
  appId: "1:528678070111:web:533721184296f0740378ea"
});

firebase.messaging();