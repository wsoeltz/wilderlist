# Wilderlist

Wilderlist is an online tool for planning and tracking your hiking adventures. Plan the mountains you want to hike, find the best trails, view upcoming weather forecasts, and check the latest trail conditions leading up to your trip. Record your activity post hike, share your trail conditions with your friends, and see how far you have to go to complete your hiking list.

If you would like to get involved in the development, please contact us at dev@wilderlist.app

Live website - https://www.wilderlist.app

License - [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Table of Contents
  - [Contributing](#contributing)
    - [Getting Started](#gettingstarted)
    - [Creating Commits and Pulls Requests](#commitsandpullrequests)
  - [Our Technology Stack Hooks](#techstack)

<a name="contributing"/>

## Contributing

Please follow the guidelines below for getting started and making commits.

<a name="gettingstarted"/>

### Getting started

1. Download the repo to your machine
1. Run `npm install` in both the root directory AND `/client/` directory
1. Create a `.env` file in the root directory
1. In the `.env` file, add the variable `PORT=5050`
1. Also add the variable `COOKIE_KEY` and set its value to any random string of characters.
1. You will need to setup a MongoDB account at https://www.mongodb.com/ and create a new cluster for this project
1. Add in the following variables to `.env`, replacing `XXX` with your respective values from your MongoDB cluster:

   ```
   MONGO_URI=XXX
   MONGO_AUTH_SOURCE=XXX
   MONGO_DATABASE_NAME=XXX
   ```

1. You will need to setup a Google OAuth flow for logging in at https://console.developers.google.com/. Once that has been setup, add the following environment keys: 

    ```
    GOOGLE_CLIENT_ID=XXX
    GOOGLE_CLIENT_SECRET=XXX
    ```

1. You will need to setup a seperate Google OAuth flow for sending emails from a specfic account as well at https://console.developers.google.com/. Once that has been setup, add the following environment keys: 

    ```
    GMAIL_USERNAME=XXX
    GMAIL_PASSWORD=XXX
    GOOGLE_EMAIL_CLIENT_ID=XXX
    GOOGLE_EMAIL_CLIENT_SECRET=XXX
    GOOGLE_EMAIL_CLIENT_REFRESH_TOKEN=XXX
    GOOGLE_EMAIL_CLIENT_ACCESS_TOKEN=XXX
    ```

1. You will need to setup a Facebook OAuth flow. Once that has been setup, add the following environment keys: 

    ```
    FACEBOOK_APP_ID=XXX
    FACEBOOK_APP_SECRET=XXX
    FACEBOOK_REDIRECT_URI=XXX
    ```

1. You will need to setup a Reddit OAuth flow. Once that has been setup, add the following environment keys (`REDDIT_STATE` can be any random string of characters): 

    ```
    REDDIT_CLIENT_ID=XXX
    REDDIT_CLIENT_SECRET=XXX
    REDDIT_STATE=XXX
    ```

1. In `/client/` create another `.env` file.
1. You will need to create a Mapbox account at https://www.mapbox.com/
1. Once you have your Mapbox account setup, in `/client/.env` add the following variable, replacing `XXX` with your Mapbpx API key:

   ```
   REACT_APP_MAPBOX_ACCESS_TOKEN=XXX
   ```

1. You will need to create a Hiking Project account at https://www.hikingproject.com/
1. Once you have your Hiking Project account setup, in `/client/.env` add the following variable, replacing `XXX` with your Hiking Project API key:

   ```
   REACT_APP_HIKING_PROJECT_KEY=XXX
   ```

1. You will need to create a Google Analytics account.
1. Once you have your Google Analytics account setup, in `/client/.env` add the following variable, replacing `XXX` with your GA ID:

   ```
   REACT_APP_GOOGLE_ANALYTICS_ID=XXX
   ```

1. *Optional*: Create an account at https://www.geoplugin.com/ and obtain an API key. If you do not add this key, the initial geolocation of the user will fail and revert to the default set location. Add that API key like so, again replacing `XXX`:

   ```
   REACT_APP_GEO_PLUGIN_API_KEY=XXX
   ```

1. With your environment variables setup, naviagate to the root directory and run `npm run dev`. The project should be running at [http://localhost:3000/](http://localhost:3000/)

<a name="commitsandpullrequests"/>

### Creating Commits and Pulls Requests

When contributing please follow the below rules:

- Always work off of feature branches that branch off from the `develop` branch
- Before committing your code, run `npm run lint:fix` to make sure your code is formatted to the same standards as the rest of the project
- Make pull-requests from your feature branch into the `develop` branch. Once your contribution has been tested in the staging environment (visible at https://wilderlist-dev.herokuapp.com/) we will merge it into the master/production.

<a name="techstack"/>

## Our Technology Stack

Wilderlist uses the following primary technologies. Their respective documentation has been linked to for reference -

- [ReactJS](https://reactjs.org/docs/getting-started.html)
- [TypeScript](https://www.typescriptlang.org/docs/home.html)
- [NodeJS](https://nodejs.org/en/docs/)
- [MongoDB](https://docs.mongodb.com/manual/introduction/)
- [GraphQL](https://graphql.org/learn/)
- [Express](https://expressjs.com/)
- [Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/)
