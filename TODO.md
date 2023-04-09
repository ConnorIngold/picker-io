# Build a Shopify App

Building a Shopify app starter kit

## Setup

- [X] create a route to install the app
- [X] Dockerize and deploy to Railway
  - [X] Update the app URL in the Shopify app settings
- [x] Create a DB model to store the session data
- [] On any route call check for a session in the DB if it exists, check if it's expired or if the permissions have changed, if it's not expired or the permissions haven't changed, use the session data, if it's expired or the permissions have changed, delete the session and force reinstall
