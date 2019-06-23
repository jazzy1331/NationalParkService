# National Park Service Information Kiosk

A simple and intuitive website that provides information about various units in the National Park System. Website is built primarily using HTML, React JS, and Bootstrap for the frontend, and primarily uses Google Cloud Functions, Firebase Firestore DB, Cloud Scheduler, and the NPS API for backend functions.

## Frontend Components

**React JS**: A JavaScript Library for building dynamic UIs.

**Bootstrap**: A toolkit for designing webpages with a responsive design.

**Google Maps Embed API**: Google Maps API which is used to display a map on the campgrounds, visitor centers, and events pages whenever a latitude and longitude are given.

**Font Awesome**: An icon set that is used for the accordion arrows on the search pages.

## Backend Components
**NPS API:** The National Park Service API is provided by the National Park Service and provides information about parks, campgrounds, events, and more.

**Firebase Firestore DB:** An online, no SQL database. Responsible for holding information about the parks in the National Park system.

**Google Cloud Functions:** An event-driven, serverless platform. Responsible for fetching park information from the NPS API, parsing through the result, and sending information to the Firestore DB.

**Google Cloud Scheduler:** An online cron job scheduler. Responsible for starting the cloud function every 3 hours.

**Google Cloud Storage**: An online bucket in which all site files are loaded and used for website hosting. (Not required for development)

## Usage

This website can be visited using any standard web browser. It requires JavaScript to be enabled for most content. The live address for the site is [nps.bawa.io]("http://nps.bawa.io").

## Requirements for Development

* No installation is necessary for the frontend, however a text editor such as Atom or Notepad++ is preferred.
* NPS API requires an API Key, which can be obtained from [here.]("https://www.nps.gov/subjects/developer/get-started.htm")
* The website must be hosted in a way as to prevent CORS Policy Violations with the NPS API.
* Google Cloud Functions, Firebase Firestore, Google Maps Embed API, Google Cloud Storage, and Cloud Scheduler require a Google account and must be enabled through the [Google Cloud Console.]("https://console.cloud.google.com/console")
* Firebase API Key and Project ID, and NPS API Key must be updated in the `config.js` file. An example of the file is listed as `config-dummy.js` in `/public`
* Google Cloud Storage Bucket, if used for public hosting, must be made public by adding Read permissions to `allUsers`.
* Font Awesome requires an account and an kit number which can created [here]("https://fontawesome.com/start")
* Bootstrap and React JS require certain scripts for full functionality:

````html
<!-- In <head> of code. -->
<!-- Bootstrap: Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

<!-- At end of code. -->

<!-- ## React JS ## -->
<!-- Load React JS Components. -->
<!-- Note: when deploying, replace "development.js" with "production.min.js". -->
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/babel-standalone@6.19.0/babel.min.js"></script>
<!-- Load your React component. -->
<script src="index.js" type="text/babel"></script>

<!-- ## Bootstrap ## -->
<!-- Load Bootstrap 4.3.1 Components -->
<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<!-- Popper JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
````

## Known Issues with NPS API
* The model given in the docs do not accurately represent the actual API output. I recommend making API calls with [Postman]("https://www.getpostman.com/") to see the actual output.
* Asking the API for more then a certain number of items will often result in a bad output.
* The `events` API does not take in the same GET Parameters as listed in the API Docs (specifically the `limit` and `start` parameters should actually be passed in as `pagesize` and `pagenumber` respectively).
* The time from call to result is variable and can some times take upwards of 10 seconds (see Future Work below).

## Future Work

Possible future work includes:
* Adding all NPS Data to Firestore DB for quicker and more efficient access
* Adding more icons and images
