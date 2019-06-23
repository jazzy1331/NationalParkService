# Google Cloud Functions

A Google Cloud Function is used in conjunction with a Cloud Scheduler Job to update the Firebase Firestore DB on a regular basis.

## Firebase Firestore DB

The Firebase Firestore DB is used to hold all the information sent to it by the Cloud Function and sends all the information requested by the website. The setup of the database is as follows:

![Cloud Scheduler Creation Image](screenshots/Firestore-Diagram.jpg?raw=true "Cloud Scheduler Creation")

## Google Cloud Function

A Cloud Function called `getParkData()` was created with the task of pulling all the park information from the NPS API, parsing through it, and sending certain parts to the Firestore DB. The node.js file `index.js` contains the function code, and `package.json` is responsible for the dependencies. When creating the Cloud Function, note down the trigger URL, which in general is: `https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME`.

## Google Cloud Scheduler

Google Cloud Scheduler is responsible for triggering the `getParkData()` function every 3 hours to keep the data updated on a regular basis. The process for setting up the job is below.

### Creating the Cloud Function

Via the Google Cloud Console, the Cloud Functions Console can be reached. On that page, select the *Create a Job* button and fill in the information as below.

![Cloud Scheduler Creation Image](screenshots/Cloud-Scheduler.png?raw=true "Cloud Scheduler Creation")

Notes:
1. The frequency must be typed in unix-cron format
2. The target must be HTTP
3. The URL should be the Cloud Function's trigger URL
