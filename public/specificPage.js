var API_KEY = config.API_KEY;

// Gets URL Param variables
let params = (new URL(document.location)).searchParams;
let topic = params.get('topic');
let name = params.get('name');
let id = params.get('id');
let q = params.get('q');
var parkCode = params.get('parkCode');
var parkName = "";
// Variables for the possible use of a map
var lat = "";
var long = "";

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("searchButton").click();
	}
});

// Changes header depending on if a park code is available
if (parkCode != "undefined") {

	fetch("https://developer.nps.gov/api/v1/parks" + "?parkCode=" + parkCode + "&api_key=" + API_KEY)
		.then(res => res.json())
		.then(
			(result) => {
				var parkInfo = result.data[0];
				document.getElementById("subtitle").innerHTML = parkInfo.fullName;
			},

		)
		.catch((error) => {
			console.log("Error: " + error + ". Displaying text as 'Unavailable'");
		});
} else {
	document.getElementById("subtitle").innerHTML = "National Park Service";
}

// Changes title depending on topic
switch (topic) {

	case 'campgrounds':
		document.getElementById("title").innerHTML = "Campgrounds";
		break;
	case 'visitorcenters':
		document.getElementById("title").innerHTML = "Visitor Centers";
		break;
	case 'events':
		document.getElementById("title").innerHTML = "Events"
		break;
	case 'articles':
		document.getElementById("title").innerHTML = "Articles"
		break;
	case 'newsreleases':
		document.getElementById("title").innerHTML = "News Releases"
		break;
	case 'lessonplans':
		document.getElementById("title").innerHTML = "Lesson Plans"
		break;
	case 'places':
		document.getElementById("title").innerHTML = "Places"
		break;
	case 'people':
		document.getElementById("title").innerHTML = "People"
		break;
}

// React class to fill out the information
class FillInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: [],
		};
	}

	// Fetches information from the API
	componentDidMount() {

		if (parkCode.length == 4 && parkCode != null) {
			fetch("https://developer.nps.gov/api/v1/" + topic + "?parkCode=" + parkCode + "&api_key=" + API_KEY)
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: true,
							items: result.data
						});
					},

				)
				.catch((error) => {
					console.log("Error: " + error + ". Displaying text as 'Unavailable'");
				});
		} else {
			fetch("https://developer.nps.gov/api/v1/" + topic + "?q=" + q + "&api_key=" + API_KEY)
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: true,
							items: result.data
						});
					},

				)
				.catch((error) => {
					console.log("Error: " + error + ". Displaying text as 'Unavailable'");
				});
		}
	}

	// Renders the information
	render() {
		const {
			error,
			isLoaded,
			items
		} = this.state;

		if (error) {
			console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
			return <div > {
				topic
			}
			information is currently not available.Please
			try again later. < /div>;
		} else if (!isLoaded) {
			return <div > Loading {
				topic
			}
			List... < /div>;
		} else {

			if (items.length > 0) {

				var correctItem;
				var foundCorrectItem = false;

				// Finds the item that was selected
				for (var i = 0; i < items.length; i++) {
					if (items[i].id == id) {
						correctItem = items[i];
						foundCorrectItem = true;
						break;
					}
				}

				if (topic == "newsreleases") {

					return (
            <div class="container">
               <div class="card mb-4">
                  <div class="card-body">
                     <h3>{correctItem.title}</h3>
                     <p class="text-muted">{correctItem.releasedate}</p>
                     {correctItem.image.url.length > 0 &&
                     <img src={correctItem.image.url} class="" alt={correctItem.image.altText} width="400px"></img>
                     }
                     <br></br>
                     <br></br>
                     <p>{correctItem.abstract}</p>
                  </div>
                  {correctItem.url.length > 0 &&
                  <div class="card-footer">
                     <a class="btn btn-secondary" href={correctItem.url}>Full Article</a>
                  </div>
                  }
               </div>
            </div>
					);

				} else if (topic == "people") {

					return (
            <div class="container">
               <div class="card mb-4">
                  <div class="card-body">
                     <h3>{correctItem.title}</h3>
                     {correctItem.listingimage.url.length > 0 &&
                     <img src={correctItem.listingimage.url} class="" alt={correctItem.listingimage.altText} width="400px"></img>
                     }
                     <br></br>
                     <br></br>
                     <p>{correctItem.listingdescription}</p>
                  </div>
                  {correctItem.url.length > 0 &&
                  <div class="card-footer">
                     <a class="btn btn-secondary" href={correctItem.url}>More Information</a>
                  </div>
                  }
               </div>
            </div>
					);


				} else if (topic == "places") {


					return (
            <div class="container">
               <div class="card mb-4">
                  <div class="card-body">
                     <h3>{correctItem.title}</h3>
                     <p class="text-muted">{correctItem.latLong}</p>
                     {correctItem.listingimage.url.length > 0 &&
                     <img src={correctItem.listingimage.url} class="" alt={correctItem.listingimage.altText} width="400px"></img>
                     }
                     <br></br>
                     <br></br>
                     <p>{correctItem.listingdescription}</p>
                  </div>
                  {correctItem.url.length > 0 &&
                  <div class="card-footer">
                     <a class="btn btn-secondary" href={correctItem.url}>More Information</a>
                  </div>
                  }
               </div>
            </div>
					);
				} else if (topic == "visitorcenters") {

					// Gives a value to lat and long to be used with the map
					if(correctItem.latLong.length > 0){
						var commaIndex = correctItem.latLong.indexOf(",");
						lat = correctItem.latLong.substring(5, commaIndex);
						long = correctItem.latLong.substring(commaIndex + 6, correctItem.latLong.length-1);
					}

					return (
            <div class="container">
               <div class="card-deck">
                  <div class="card mb-3">
                     <div class="card-body">
                        <h3 class="card-title">{correctItem.name}</h3>
                        <p class="card-text">{correctItem.description}</p>
                        {correctItem.latLong.length > 0 &&
													<iframe
													   width="100%"
													   height="400px"
													   frameborder="0"
													   src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyAYpKgnwJxQ_r7Pcpp8hGNIUEIwp6s0jEI&q=+" + lat + "+,+" + long + "+"} allowfullscreen>
													 </iframe>
                        }
                     </div>
                     {correctItem.url.length > 0 &&
                     <div class="card-footer">
                        <a class="btn btn-secondary" href={correctItem.url}>More Information</a>
                     </div>
                     }
                  </div>
               </div>
            </div>
					);

				} else if (topic == "articles") {

					return (
            <div class="container">
               <div class="card mb-4">
                  <div class="card-body">
                     <h3>{correctItem.title}</h3>
                     <p class="text-muted">{correctItem.releasedate}</p>
                     {correctItem.listingimage.url.length > 0 &&
                     <img src={correctItem.listingimage.url} alt={correctItem.listingimage.altText} width="400px"></img>
                     }
                     <br></br>
                     <br></br>
                     <p>{correctItem.listingdescription}</p>
                  </div>
                  {correctItem.url.length > 0 &&
                  <div class="card-footer">
                     <a class="btn btn-secondary" href={correctItem.url}>Full Article</a>
                  </div>
                  }
               </div>
            </div>
					);

					return (
            <div>
               <h1>{correctItem.title}</h1>
               {correctItem.relatedparks.length > 0 &&
               <p>Lat/Long: {correctItem.relatedparks}</p>
               }
               {correctItem.listingimage.url.length > 0 &&
               <img src={correctItem.listingimage.url} alt={correctItem.listingimage.altText} width="400" height="200"></img>
               }
               <p>{correctItem.listingdescription}</p>
               {correctItem.url.length > 0 &&
               <button onClick = {() => nextPage(correctItem.url)}>See Full Article</button>
               }
            </div>
					);
				} else if (topic == "lessonplans") {

					return (
            <div>
               <div>
                  <div class="container">
                     <div class="card-deck">
                        <div class="card mb-3">
                           <div class="card-body">
                              <h3 class="card-title">{correctItem.title}</h3>
                              <p class="card-text">{correctItem.questionobjective}</p>
                           </div>
                        </div>
                     </div>
                     <div class="card-deck d-flex justify-content-center">
                        <div class="card mb-3">
                           <div class="card-body">
                              <h3 class="card-title">Information</h3>
                              {correctItem.subject.length > 0 ?
                              <p><strong>Subject(s): </strong>{correctItem.subject}</p>
                              :
                              <p><strong>Subject(s): </strong>Not Available</p>
                              }
                              {correctItem.commoncore.statestandards.length > 0 ?
                              <p><strong>State Standards: </strong>{correctItem.commoncore.statestandards}</p>
                              :
                              <p><strong>State Standards: </strong>None</p>
                              }
                              {correctItem.commoncore.mathstandards.length > 0 ?
                              <p><strong>Math Standards: </strong>{correctItem.commoncore.mathstandards}</p>
                              :
                              <p><strong>Math Standards: </strong>None</p>
                              }
                              {correctItem.commoncore.elastandards.length > 0 ?
                              <p><strong>ELA Standards: </strong>{correctItem.commoncore.elastandards}</p>
                              :
                              <p><strong>ELA Standards: </strong>None</p>
                              }
                              {correctItem.commoncore.additionalstandards.length > 0 &&
                              <p><strong>Additional Standards: </strong>{correctItem.commoncore.additionalstandards}</p>
                              }
                              {correctItem.gradelevel.length > 0 ?
                              <p><strong>Grade Level: </strong>{correctItem.gradelevel}</p>
                              :
                              <p><strong>Grade Level: </strong>Mot Available</p>
                              }
                              {correctItem.duration.length > 0 ?
                              <p><strong>Duration: </strong>{correctItem.duration}</p>
                              :
                              <p><strong>Duration: </strong>Not Available</p>
                              }
                           </div>
                           {correctItem.url.length > 0 &&
                           <div class="card-footer">
                              <a class="btn btn-secondary" href={correctItem.url}>Full Lesson Plan</a>
                           </div>
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </div>
					);
				} else if (topic == "events") {

					// Creates a combined variable of multiple properties to make the time field
					var times = "";
					for (var i = 0; i < correctItem.times.length; i++) {
						if (correctItem.times[i].sunrisestart == "true") {
							times += "Sunrise to ";
						} else {
							times += correctItem.times[i].timestart + " to ";
						}

						if (correctItem.times[i].sunsetend == "true") {
							times += "Sunset";
						} else {
							times += correctItem.times[i].timestart;
						}
						if (i + 1 < correctItem.times.length) {
							times += " and "
						}
					}

					// Checks if long and lat are present for map use
					var isLongLat = correctItem.latitude.length > 0 && correctItem.longitude.length > 0;

					// Creates a readable reccurence field
					var freq = "Single Event";
					var recurrencerule = correctItem.recurrencerule;
					if (recurrencerule.length > 0 && recurrencerule.indexOf("FREQ") > -1) {
						var index = recurrencerule.indexOf("FREQ");
						var endIndex = recurrencerule.indexOf(";", index);
						freq = correctItem.recurrencerule.substring(index + 5, endIndex);
					}

					return (
            <div>
               <div class="container">
                  <div class="card-deck">
                     <div class="card mb-3">
                        <div class="card-body">
                           <h3 class="card-title">{correctItem.title}</h3>
                           <p class="text-muted">{correctItem.category}</p>
                           <p class="card-text">{correctItem.description}</p>
                        </div>
                     </div>
                  </div>
                  <div class="card-deck d-flex justify-content-center">
                     <div class="card mb-3">
                        <div class="card-body">
                           <h3 class="card-title">Timing</h3>
                           {freq.length > 0 &&
                           <p><strong>Frequency:</strong> {freq}</p>
                           }
                           {correctItem.recurrencedatestart.length > 0 &&
                           <p><strong>Start Date: </strong>{correctItem.recurrencedatestart}</p>
                           }
                           {correctItem.recurrencedateend.length > 0 &&
                           <p><strong>End Date: </strong>{correctItem.recurrencedateend}</p>
                           }
                           <p><strong>Times: </strong>{times}</p>
                        </div>
                     </div>
                     <div class="card mb-3">
                        <div class="card-body">
                           <h3 class="card-title">Details</h3>
                           {correctItem.types.length > 0 &&
                           <p><strong>Type of Event: </strong>{correctItem.types}</p>
                           }
                           {correctItem.contactname.length > 0 &&
                           <p><strong>Contact Name: </strong>{correctItem.contactname}</p>
                           }
                           {correctItem.contactemailaddress.length > 0 &&
                           <p><strong>Contact Email: </strong>
                              <a href={"mailto:" + correctItem.contactemailaddress}>{correctItem.contactemailaddress}</a>
                           </p>
                           }
                           {correctItem.contacttelephonenumber.length > 0 &&
                           <p><strong>Contact Phone: </strong>{correctItem.contacttelephonenumber}</p>
                           }
													 {correctItem.location.length > 0 &&
														 <p><strong>Location: </strong>{correctItem.location}</p>
													 }
													 {isLongLat &&
														 <iframe
														   width="100%"
														   height="400px"
														   frameborder="0"
														   src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyAYpKgnwJxQ_r7Pcpp8hGNIUEIwp6s0jEI&q=+" + correctItem.latitude + "+,+" + correctItem.longitude + "+"} allowfullscreen>
														 </iframe>
													 }
                        </div>
                        {correctItem.infourl.length > 0 &&
                        <div class="card-footer">
                           <button class="btn btn-secondary" onClick = {() => nextPage(correctItem.infourl)}>Full Event Details</button>
                        </div>
                        }
                     </div>
                  </div>
               </div>
            </div>
					);

				} else if (topic == "campgrounds") {

					var buttonOnClick = "nextPage('" + correctItem.url + "')";

					// Gives a value to lat and long to be used with map
					if(correctItem.latLong.length > 0){
						var commaIndex = correctItem.latLong.indexOf(",");
						lat = correctItem.latLong.substring(5, commaIndex);
						long = correctItem.latLong.substring(commaIndex + 6, correctItem.latLong.length-1);
					}

					// Creates variables combining multiple properties
					var internet = "";
					if (correctItem.amenities.internetconnectivity.length > 0) {
						internet += correctItem.amenities.internetconnectivity;

						if (correctItem.accessibility.internetinfo.length > 0) {
							internet += ". " + correctItem.accessibility.internetinfo;
						}
					} else if (correctItem.accessibility.internetinfo.length > 0) {
						internet += correctItem.accessibility.internetinfo;
					}

					var cellphone = "";
					if (correctItem.amenities.cellphonereception.length > 0) {
						cellphone += correctItem.amenities.cellphonereception;

						if (correctItem.accessibility.cellphoneinfo.length > 0) {
							cellphone += ". " + correctItem.accessibility.cellphoneinfo;
						}
					} else if (correctItem.accessibility.cellphoneinfo.length > 0) {
						cellphone += correctItem.accessibility.cellphoneinfo;
					}

					return (
            <div>
               <div class="container">
                  <div class="card-deck d-flex justify-content-center">
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           <h3 class="card-title">{correctItem.name}</h3>
                           <p class="card-text">{correctItem.description}</p>
                        </div>
                     </div>
                  </div>
                  <h3>Information</h3>
                  <div class="card-deck d-flex justify-content-center">
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           <h3>Directions</h3>
                           {correctItem.directionsoverview.length > 0 ?
                           <p><strong>Overview: </strong>{correctItem.directionsoverview}</p>
                           :
                           <p><strong>Overview: </strong>Not Available </p>
                           }

                           {correctItem.latLong.length > 0 ?
														 <iframe
														   width="100%"
														   height="400px"
														   frameborder="0"
														   src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyAYpKgnwJxQ_r7Pcpp8hGNIUEIwp6s0jEI&q=+" + lat + "+,+" + long + "+"} allowfullscreen>
														 </iframe>
                           :
                           <p><strong>Latitude/Longitude: </strong>Not Available </p>
                           }

                        </div>
                     </div>
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           {correctItem.weatheroverview.length > 0 ?
                           <div>
                              <h3>Weather</h3>
                              <p>{correctItem.weatheroverview}</p>
                           </div>
                           :
                           <div>
                              <h3>Weather</h3>
                              <p>Not Available </p>
                           </div>
                           }
                        </div>
                     </div>
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           <h3>Accessibility</h3>
                           {correctItem.accessibility.adainfo.length > 0 ?
                           <p><strong>ADA Info: </strong>{correctItem.accessibility.adainfo}</p>
                           :
                           <p><strong>ADA Info: </strong>Not Available </p>
                           }
                           {correctItem.accessibility.wheelchairaccess.length > 0 ?
                           <p><strong>Wheelchair Access: </strong>{correctItem.accessibility.wheelchairaccess}</p>
                           :
                           <p><strong>Wheelchair Access: </strong> Not Available </p>
                           }
                           {correctItem.accessibility.accessroads.length > 0 ?
                           <p><strong>Access Roads: </strong>{correctItem.accessibility.accessroads}</p>
                           :
                           <p><strong>Access Roads: </strong>Not Available </p>
                           }
                        </div>
                     </div>
                  </div>
               </div>
               <div class="container">
                  <h3>Camping</h3>
                  <div class="card-deck d-flex justify-content-center">
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           {correctItem.campsites.electricalhookups.length > 0 ?
                           <p><strong>Electrical Hookups: </strong>{correctItem.campsites.electricalhookups}</p>
                           :
                           <p><strong>Electrical Hookups: </strong>Not Available </p>
                           }
                           {correctItem.campsites.rvonly.length > 0 ?
                           <p><strong>RV Only: </strong>{correctItem.campsites.rvonly}</p>
                           :
                           <p><strong>RV Only: </strong> Not Available </p>
                           }
                           {correctItem.campsites.tentonly.length > 0 ?
                           <p><strong>Tent Only: </strong>{correctItem.campsites.tentonly}</p>
                           :
                           <p><strong>Tent Only: </strong> Not Available </p>
                           }
                           {correctItem.campsites.walkboatto.length > 0 ?
                           <p><strong>Walk to/Boat to: </strong>{correctItem.campsites.walkboatto}</p>
                           :
                           <p><strong>Walk to/Boat to: </strong> Not Available </p>
                           }
                           {correctItem.campsites.group.length > 0 ?
                           <p><strong>Group: </strong>{correctItem.campsites.group}</p>
                           :
                           <p><strong>Group: </strong> Not Available </p>
                           }
                           {correctItem.campsites.horse.length > 0 ?
                           <p><strong>Horse: </strong>{correctItem.campsites.horse}</p>
                           :
                           <p><strong>Horse: </strong> Not Available </p>
                           }
                           {correctItem.campsites.other.length > 0 ?
                           <p><strong>Other: </strong>{correctItem.campsites.other}</p>
                           :
                           <p><strong>Other: </strong>Not Available </p>
                           }
                           {correctItem.accessibility.rvallowed.length > 0 ?
                           <p><strong>RVs Allowed: </strong>{correctItem.accessibility.rvallowed}</p>
                           :
                           <p><strong>RVs Allowed: </strong>Not Available </p>
                           }
                           {correctItem.accessibility.rvmaxlength.length > 0 ?
                           <p><strong>RV Max Length: </strong>{correctItem.accessibility.rvmaxlength}</p>
                           :
                           <p><strong>RV Max Length: </strong>Not Available </p>
                           }
                           {correctItem.accessibility.trailerallowed.length > 0 ?
                           <p><strong>Trailers Allowed: </strong>{correctItem.accessibility.trailerallowed}</p>
                           :
                           <p><strong>Trailers Allowed: </strong>Not Available </p>
                           }
                           {correctItem.accessibility.trailermaxlength.length > 0 ?
                           <p><strong>Trailer Max Length: </strong>{correctItem.accessibility.trailermaxlength}</p>
                           :
                           <p><strong>Trailer Max Length: </strong>Not Available </p>
                           }
                        </div>
                     </div>
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           <h5>Regulations</h5>
                           {correctItem.regulationsoverview.length > 0 ?
                           <p><strong>Overview: </strong>{correctItem.regulationsoverview}</p>
                           :
                           <p><strong>Overview: </strong>Not Available </p>
                           }
                           {correctItem.accessibility.firestovepolicy.length > 0 ?
                           <p><strong>Firestove Policy: </strong>{correctItem.accessibility.firestovepolicy}</p>
                           :
                           <p><strong>Firestove Policy: </strong>Not Available </p>
                           }
                           {correctItem.regulationsurl.length > 0 &&
                           <p><a href={correctItem.regulationsurl}><strong>More Information</strong></a></p>
                           }
                        </div>
                     </div>
                  </div>
                  <h3>Amenities</h3>
                  <div class="card-deck d-flex justify-content-center">
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           <h5>Communication</h5>
                           {cellphone.length > 0 ?
                           <p><strong>Cell Service: </strong>{cellphone}</p>
                           :
                           <p><strong>Cell Service: </strong>Not Available </p>
                           }
                           {internet.length > 0 ?
                           <p><strong>Internet/WiFi: </strong>{internet}</p>
                           :
                           <p><strong>Internet/WiFi: </strong>Not Available </p>
                           }
                           {correctItem.amenities.stafforvolunteerhostonsite.length > 0 ?
                           <p><strong>Staff on Site: </strong>{correctItem.amenities.stafforvolunteerhostonsite}</p>
                           :
                           <p><strong>Staff on Site: </strong>Not Available </p>
                           }
                        </div>
                     </div>
                     <div class="card mb-4 shadow-sm">
                        <div class="card-body">
                           <h5>Facilities</h5>
                           {correctItem.amenities.laundry.length > 0 ?
                           <p><strong>Laundry: </strong>{correctItem.amenities.laundry}</p>
                           :
                           <p><strong>Laundry: </strong>Not Available </p>
                           }
                           {correctItem.amenities.toilets.length > 0 ?
                           <p><strong>Toilets: </strong>{correctItem.amenities.toilets}</p>
                           :
                           <p><strong>Toilets: </strong>Not Available </p>
                           }
                           {correctItem.amenities.showers.length > 0 ?
                           <p><strong>Showers: </strong>{correctItem.amenities.showers}</p>
                           :
                           <p><strong>Showers: </strong>Not Available </p>
                           }
                           {correctItem.amenities.potablewater.length > 0 ?
                           <p><strong>Potable Water: </strong>{correctItem.amenities.potablewater}</p>
                           :
                           <p><strong>Potable Water: </strong>Not Available </p>
                           }
                           {correctItem.amenities.trashrecyclingcollection.length > 0 ?
                           <p><strong>Trash/Recyling Collection: </strong>{correctItem.amenities.trashrecyclingcollection}</p>
                           :
                           <p><strong>Trash/Recyling Collection: </strong>Not Available </p>
                           }
                           {correctItem.amenities.dumpstation.length > 0 ?
                           <p><strong>Dumpstation: </strong>{correctItem.amenities.dumpstation}</p>
                           :
                           <p><strong>Dumpstation: </strong>Not Available </p>
                           }
                           {correctItem.amenities.foodstoragelockers.length > 0 ?
                           <p><strong>Food Storage Lockers: </strong>{correctItem.amenities.foodstoragelockers}</p>
                           :
                           <p><strong>Food Storage Lockers: </strong>Not Available </p>
                           }
                           {correctItem.amenities.amphitheater.length > 0 ?
                           <p><strong>Amphitheater: </strong>{correctItem.amenities.amphitheater}</p>
                           :
                           <p><strong>Amphitheater: </strong>Not Available </p>
                           }
                           {correctItem.amenities.campstore.length > 0 ?
                           <p><strong>Campstore For Sale: </strong>{correctItem.amenities.campstore}</p>
                           :
                           <p><strong>Campstore For Sale: </strong>Not Available </p>
                           }
                           {correctItem.amenities.iceavailableforsale.length > 0 ?
                           <p><strong>Ice For Sale: </strong>{correctItem.amenities.iceavailableforsale}</p>
                           :
                           <p><strong>Ice For Sale: </strong>Not Available </p>
                           }
                           {correctItem.amenities.firewoodforsale.length > 0 ?
                           <p><strong>Firewood For Sale: </strong>{correctItem.amenities.firewoodforsale}</p>
                           :
                           <p><strong>Firewood For Sale: </strong>Not Available </p>
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </div>
					);
				}
			}
		}
	}
}

// Calls the render
ReactDOM.render( < FillInformation / > , document.getElementById("informationContainer"));

// Changes page on button click
function nextPage(targetPage) {
	window.location = targetPage;
}

// Begins the search process by opening the search page
function goToSearch() {
	var keyword = document.getElementById("searchBox").value;

	if (keyword != "") {
		window.location = "searchPage.html?keyword=" + keyword;
	}
}
