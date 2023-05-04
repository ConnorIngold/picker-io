# Build a Shopify App

Building a Shopify app starter kit

## Setup

- [X] create a route to install the app
- [X] Dockerize and deploy to Railway
  - [X] Update the app URL in the Shopify app settings
- [x] Create a DB model to store the session data

## frontend
- [] Navigation: Orders, Locations, Customers, Settings and Support

## backend
- [] Create a flag in your database to track whether it's their first time using the app
    - [] Update your database schema: Add a new column (e.g., is_first_login) to your users or shops table. This column should be of type boolean and default to true.
    - [] Authenticate and store user data: When a user installs your app and goes through the authentication process, store their shop or user data in your database if it doesn't already exist. Set the is_first_login flag to true by default.
    - [] Check the flag on app load: When the user opens your app, check the is_first_login flag in your database for the corresponding user or shop. If the flag is true, show the welcome page and update the flag to false afterward.

## backlog
- [] Make it so the app is embedded in the admin on first install
- - [] Add a thank you for installing page