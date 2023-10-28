# Firebase Push Notifications

## Build

Firebase Cloud Functions does not support monorepos. To solve this issues,
we user rollup to prebuild all the local packages, and then use a custom script
to remove these packages from the package.json.
