# Firebase Push Notifications

NOTE: This project is an example of how to use Firebase Cloud Functions to send push notifications.
It is not by any means a production ready project, and does not cover many aspects of a production app, such as security, performance or cost optimisations.

## Build

Firebase Cloud Functions does not support monorepos. To solve this issues,
we user rollup to prebuild all the local packages, and then use a custom script
to remove these packages from the package.json.
