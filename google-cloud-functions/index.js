const https = require("https");
const parkurl = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=INSERT_NPS_API_KEY_HERE";

const admin = require('firebase-admin');

// Google Cloud Functions do not require explicit authentication when done through the console
admin.initializeApp({
	credential: admin.credential.applicationDefault()
});

let db = admin.firestore();

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getParkData = (req, res) => {

	var allParkData = '';

	https.get(parkurl, (resp) => {
		let data = '';

		// A chunk of data has been recieved.
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			console.log(JSON.parse(data));
			allParkData = JSON.parse(data);

			for (var i = 0; i < allParkData.data.length; i++) {

				db.collection("Npsparks").doc(allParkData.data[i].parkCode).set({
					title: allParkData.data[i].fullName,
					description: allParkData.data[i].description,
					parkCode: allParkData.data[i].parkCode,
					designation: allParkData.data[i].designation
				});

			}
		});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});

	return allParkData;

};
