# Ethereum Firebase Push Notifications

> [!NOTE]  
> This project demonstrates how to use Firebase Cloud Functions to send push notifications for any EVM transaction. It is not a production-ready solution and does not cover various aspects of a production app, such as security, performance, or cost optimizations.

## High-Level Architecture

At a high level, the process of sending push notifications for Ethereum transactions can be broken down into three parts:

1. Listening to Ethereum events
2. Decoding and interpreting the events
3. Delivering push notifications

### Listening to Ethereum events

To begin listening for events, we need to store all the addresses we are interested in.

Based on these addresses, we have multiple options to start listening to transactions:

1. Use a third-party service such as Alchemy or Quicknode.
2. Run our own Ethereum node/transaction monitoring service and watch for new blocks.
3. Listen to events directly from the RPC.

By listening directly, we can have a client app that runs in the background and never connects to a third-party service, which can work well for people who want complete independence and privacy. However, such a mechanism is not supported on iOS, and on Android, the app can quickly drain the battery.

For simplicity we are using a third-party service, Alchemy, to listen to events.

### Decoding and interpreting the events

We are using `@3loop/transaction-decoder` and `@3loop/transaction-interpreter` to decode and interpret transactions into human readable. Because the library is written in Typescript, we can use it in the context of Firebase Cloud Functions, or directly on the client, depending on the use case.

### Delivering push notifications

We are using Firebase Cloud Messaging to deliver push notifications to the client. The client app is responsible for registering the device with FCM and sending the token to Firebase Firestore.

One could opt for a different delivery service, such as push.org or directly use platform native push notifications services with APNS and Web Push.
