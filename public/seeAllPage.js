var API_KEY = config.API_KEY;

// Saves URL Paramters
var params = (new URL(document.location)).searchParams;
var parkCode = params.get('parkCode');
var target = params.get('target');
var search = params.get('search');
var keyword = params.get('keyword');
var state = params.get('state');
var desig = params.get('desig');
var from = params.get('from');

var parkName = "";
var parkData = [];

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("searchButton").click();
	}
});

// Sets up access to Firestore DB
var config = {
	apiKey: config.FIREBASE_API_KEY,
	projectId: config.FIREBASE_PROJECT_ID
};

const fire = firebase.initializeApp(config);
const db = fire.firestore();

// Based on desig, the full name is saved
var fullDesignation = '';
switch (desig) {

	case 'park':
		fullDesignation = "National Park";
		break;
	case 'monument':
		fullDesignation = "National Monument";
		break;
	case 'preserve':
		fullDesignation = "National Preserve";
		break;
	case 'historicSite':
		fullDesignation = "National Park";
		break;
	case 'historicPark':
		fullDesignation = "National Historical Park";
		break;
	case 'memorial':
		fullDesignation = "National Memorial";
		break;
	case 'battlefield':
		fullDesignation = "National Battlefield";
		break;
	case 'cemetery':
		fullDesignation = "National Cemetery";
		break;
	case 'recreation':
		fullDesignation = "National Recreation";
		break;
	case 'seashore':
		fullDesignation = "National Seashore";
		break;
	case 'lakeshore':
		fullDesignation = "National Lakeshore";
		break;
	case 'river':
		fullDesignation = "National River";
		break;
	case 'parkway':
		fullDesignation = "National Parkway";
		break;
	case 'trail':
		fullDesignation = "National Trail";
		break;
	default:
		fullDesignation = "All";
}

// Full State name is found based on abbreviation
var stateFull = "";
if(state != null && state != "null"){
	var stateUpperCase = state.toUpperCase();
	switch (stateUpperCase){
	  case "AL":
	      stateFull = "ALABAMA";
				break;
	  case "AK":
	      stateFull = "ALASKA";
				break;
	  case "AS":
	      stateFull = "AMERICAN SAMOA";
				break;
	  case "AZ":
	      stateFull = "ARIZONA";
				break;
	  case "AR":
	      stateFull = "ARKANSAS";
				break;
	  case "CA":
	      stateFull = "CALIFORNIA";
				break;
	  case "CO":
	      stateFull = "COLORADO";
				break;
	  case "CT":
	      stateFull = "CONNECTICUT";
				break;
	  case "DE":
	      stateFull = "DELAWARE";
				break;
	  case "DC":
	      stateFull = "DISTRICT OF COLUMBIA";
				break;
	  case "FM":
	      stateFull = "FEDERATED STATES OF MICRONESIA";
				break;
	  case "FL":
	      stateFull = "FLORIDA";
				break;
	  case "GA":
	      stateFull = "GEORGIA";
				break;
	  case "GU":
	      stateFull = "GUAM";
				break;
	  case "HI":
	      stateFull = "HAWAII";
				break;
	  case "ID":
	      stateFull = "IDAHO";
				break;
	  case "IL":
	      stateFull = "ILLINOIS";
				break;
	  case "IN":
	      stateFull = "INDIANA";
				break;
	  case "IA":
	      stateFull = "IOWA";
				break;
	  case "KS":
	      stateFull = "KANSAS";
				break;
	  case "KY":
	      stateFull = "KENTUCKY";
				break;
	  case "LA":
	      stateFull = "LOUISIANA";
				break;
	  case "ME":
	      stateFull = "MAINE";
				break;
	  case "MH":
	      stateFull = "MARSHALL ISLANDS";
				break;
	  case "MD":
	      stateFull = "MARYLAND";
				break;
	  case "MA":
	      stateFull = "MASSACHUSETTS";
				break;
	  case "MI":
	      stateFull = "MICHIGAN";
				break;
	  case "MN":
	      stateFull = "MINNESOTA";
				break;
	  case "MS":
	      stateFull = "MISSISSIPPI";
				break;
	  case "MO":
	      stateFull = "MISSOURI";
				break;
	  case "MT":
	      stateFull = "MONTANA";
				break;
	  case "NE":
	      stateFull = "NEBRASKA";
				break;
	  case "NV":
	      stateFull = "NEVADA";
				break;
	  case "NH":
	      stateFull = "NEW HAMPSHIRE";
				break;
	  case "NJ":
	      stateFull = "NEW JERSEY";
				break;
	  case "NM":
	      stateFull = "NEW MEXICO";
				break;
	  case "NY":
	      stateFull = "NEW YORK";
				break;
	  case "NC":
	      stateFull = "NORTH CAROLINA";
				break;
	  case "ND":
	      stateFull = "NORTH DAKOTA";
				break;
	  case "MP":
	      stateFull = "NORTHERN MARIANA ISLANDS";
				break;
	  case "OH":
	      stateFull = "OHIO";
				break;
	  case "OK":
	      stateFull = "OKLAHOMA";
				break;
	  case "OR":
	      stateFull = "OREGON";
				break;
	  case "PW":
	      stateFull = "PALAU";
				break;
	  case "PA":
	      stateFull = "PENNSYLVANIA";
				break;
	  case "PR":
	      stateFull = "PUERTO RICO";
				break;
	  case "RI":
	      stateFull = "RHODE ISLAND";
				break;
	  case "SC":
	      stateFull = "SOUTH CAROLINA";
				break;
	  case "SD":
	      stateFull = "SOUTH DAKOTA";
				break;
	  case "TN":
	      stateFull = "TENNESSEE";
				break;
	  case "TX":
	      stateFull = "TEXAS";
				break;
	  case "UT":
	      stateFull = "UTAH";
				break;
	  case "VT":
	      stateFull = "VERMONT";
				break;
	  case "VI":
	      stateFull = "VIRGIN ISLANDS";
				break;
	  case "VA":
	      stateFull = "VIRGINIA";
				break;
	  case "WA":
	      stateFull = "WASHINGTON";
				break;
	  case "WV":
	      stateFull = "WEST VIRGINIA";
				break;
	  case "WI":
	      stateFull = "WISCONSIN";
				break;
	  case "WY":
	      stateFull = "WYOMING";
				break;
	}
}

// Sets a blank string if filter isn't present
if (state == "null" || state == null) {
	state = "";
}
if (desig == "null" || desig == null) {
	desig = "";
}

// Changes header based on the target being accessed
switch (target) {

	case 'campgrounds':
		document.title = "Campgrounds";
		document.getElementById("pageHeader").innerHTML = "Campgrounds";
		break;
	case 'visitorcenters':
		document.title = "Visitor Centers";
		document.getElementById("pageHeader").innerHTML = "Visitor Centers";
		break;
	case 'events':
		document.title = "Events"
		document.getElementById("pageHeader").innerHTML = "Events";
		break;
	case 'articles':
		document.title = "Articles"
		document.getElementById("pageHeader").innerHTML = "Articles";
		break;
	case 'newsreleases':
		document.title = "News Releases"
		document.getElementById("pageHeader").innerHTML = "News Releases";
		break;
	case 'lessonplans':
		document.title = "Lesson Plans"
		document.getElementById("pageHeader").innerHTML = "Lesson Plans";
		break;
	case 'places':
		document.title = "Places"
		document.getElementById("pageHeader").innerHTML = "Places";
		break;
	case 'people':
		document.title = "People"
		document.getElementById("pageHeader").innerHTML = "People";
		break;
	case 'parks':
		document.title = "Parks"
		document.getElementById("pageHeader").innerHTML = "Parks";
		break;
}

// Fetches from API based on if displaying a search or not
if (search != "y") {
	fetch("https://developer.nps.gov/api/v1/parks?parkCode=" + parkCode + "&api_key=" + API_KEY)
		.then(res => res.json())
		.then(
			(result) => {
				var parkInfo = result.data[0];
				document.getElementById("parkNameHeader").innerHTML = parkInfo.fullName;
				parkName = parkInfo.fullName;
			},

		)
		.catch((error) => {
			console.log("Error: " + error + ". Setting page h3 to 'National Park'");
		});
} else {

	if(from != "home"){
		// Creates fiter text for search display if filters were used
		let filterAddon = " with filter(s): ";

		if (state != "") {
			filterAddon += "'" + stateFull + "'";
		}

		if (fullDesignation != "All") {
			filterAddon += " '" + fullDesignation + "'";
		}
		if (state == "" && desig == "") {
			document.getElementById("parkNameHeader").innerHTML = "Searching " + document.title + " for '" + keyword + "'";
		} else {
			document.getElementById("parkNameHeader").innerHTML = "Searching " + document.title + " for '" + keyword + "'" + filterAddon;
		}
	}else{
		  document.getElementById("parkNameHeader").innerHTML = stateFull;
			keyword = "";
	}

}

// React class to render results
class FillInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: [],
		};
	}

	componentDidMount() {

		// Fetches information based on if this is a search or not
		if (search != "y") {
			if (target == "campgrounds" || target == "visitorcenters") {

				fetch("https://developer.nps.gov/api/v1/" + target + "?parkCode=" + parkCode + "&api_key=" + API_KEY)
					.then(res => res.json())
					.then(
						(result) => {
							this.setState({
								isLoaded: true,
								items: result.data,
								itemCount: result.total
							});
						})

					.catch((error) => {
						console.log("Error: " + error + ". Displaying text as 'Unavailable'");
					});
			} else {

				fetch("https://developer.nps.gov/api/v1/" + target + "?parkCode=" + parkCode + "&limit=20&api_key=" + API_KEY)
					.then(res => res.json())
					.then(
						(result) => {
							this.setState({
								isLoaded: true,
								items: result.data,
								itemCount: result.total
							});
						})
					.catch((error) => {
						console.log("Error: " + error + ". Displaying text as 'Unavailable'");
					});
			}
		} else {
			fetch("https://developer.nps.gov/api/v1/" + target + "?q=" + keyword + "&stateCode=" + state + "&api_key=" + API_KEY)
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: false,
							items: result.data,
							itemCount: result.total
						});

						if (fullDesignation != "All") {
							this.getParkData();
						} else {
							this.setState({
								isLoaded: true
							});
						}

					},

				)
				.catch((error) => {
					console.log("Error: " + error + ". Displaying text as 'Unavailable'");
				});
		}
	}

	// Gets park data from Firestore DB
	getParkData() {

		var allData = [];

		db.collection("Npsparks")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach(function (doc) {
					//console.log(doc.id, " => ", doc.data());
					allData.push(doc.data());
				});
				parkData = allData;

				// if(fullDesignation != "null" && fullDesignation != "alll" && fullDesignation != null){
				if (fullDesignation != "All") {
					this.filterDesignationResults();
				} else {
					this.setState({
						isLoaded: true,
					});
				}

			})
			.catch(function (error) {
				console.log("Error getting documents: ", error);
			});
	}

	// Filters the results by designation
	filterDesignationResults() {

		const {
			error,
			isLoaded,
			items
		} = this.state;
		var currentData = [];

		for (var i = 0; i < items.length; i++) {
			var parkCode = items[i].parkCode;
			if (this.props.target == "events") {
				parkCode = items[i].sitecode;
			} else if (this.props.target == "places") {
				parkCode = items[i].relatedParks;
			} else if (this.props.target == "lessonplans") {
				parkCode = items[i].parks[0];
			}
			var parkDataIndex = -1;
			for (var j = 0; j < parkData.length; j++) {

				if (parkData[j].parkCode == parkCode) {
					parkDataIndex = j;
					break;
				}
			}

			if (parkDataIndex != -1 && parkData[parkDataIndex].designation == fullDesignation) {
				currentData.push(items[i]);
			}
		}

		this.setState({
			isLoaded: true,
			items: currentData
		});

	}

	// Renders the results
	render() {
		const {
			error,
			isLoaded,
			items
		} = this.state;

		if (error) {
			console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
			return <div > {
				target
			}
			information is currently not available.Please
			try again later. < /div>;
		} else if (!isLoaded) {
			return <div > Loading {
				target
			}
			List... < /div>;
		} else {

			// Prints out text if no results are available
			if (items.length == 0) {
				return ( <p> {"No information available! Continue exploring " + parkName + " or check out another amazing park!"} < /p>
				);
			}

			if (target == "events") {

				return (
          <div>
             {items.map(item => (
             <div class="card-deck">
                <div class="card mb-3">
                   <div class="card-body">
                      <h5 class="card-title">{item.title}</h5>
                      <p class="itemSubtitle text-muted">{item.category}</p>
                      <p class="card-text">{item.description}</p>
                   </div>
                   <div class="card-footer">
                      <a href={"specificPage.html?parkCode=" + item.sitecode + "&name=" + item.title + "&topic=" + target  + "&id=" + item.id + "&q=" + keyword} class="btn btn-secondary my-2">More Information</a>
                   </div>
                </div>
             </div>
             ))}
          </div>
				);
			} else if (target == "articles" || target == "people" || target == "places") {


				// Changes properties for display for each item
				for (var i = 0; i < items.length; i++) {

					let item = items[i];

					// Adds placeholder image if none present
					if (item.listingimage.url.length == 0) {
						item.listingimage.url = "https://www.nps.gov/common/commonspot/templates/images/logos/nps_social_image_02.jpg";
					}

					// Condenses description to 180 characters for display
					if (item.listingdescription.length > 180) {
						item.listingdescription = item.listingdescription.substring(0, 180) + "...";
					}
				}

				return (
          <div class="card-columns">
             {items.map(item => (
             <div>
                <div class="card mb-4 shadow-sm">
                   <img src={item.listingimage.url} width="500px" class="img-fluid card-img-top" alt={item.listingimage.alttext}></img>
                   <div class="card-body">
                      <h4 class="card-title">{item.title}</h4>
                      <p class="card-text">{item.listingdescription}</p>
                   </div>
                   <div class="card-footer">
                      <a href={"specificPage.html?parkCode=" + parkCode + "&name=" + item.title + "&topic=" + target + "&id=" + item.id + "&q=" + keyword} class="btn btn-secondary my-2">More Information</a>
                   </div>
                </div>
             </div>
             ))}
          </div>
				);

			} else if (target == "campgrounds" || target == "visitorcenters") {


				return (
          <div>
             {items.map(item => (
             <div class="card-deck">
                <div class="card mb-3">
                   <div class="card-body">
                      <h5 class="card-title">{item.name}</h5>
                      <p class="card-text">{item.description}</p>
                   </div>
                   <div class="card-footer">
                      <a href={"specificPage.html?parkCode=" + item.parkCode + "&name=" + item.title + "&topic=" + target + "&id=" + item.id + "&q=" + keyword} class="btn btn-secondary my-2">More Information</a>
                   </div>
                </div>
             </div>
             ))}
          </div>
				);

			} else if (target == "lessonplans") {

				return (
          <div>
             {items.map(item => (
             <div class="card-deck">
                <div class="card mb-3">
                   <div class="card-body">
                      <h5 class="card-title">{item.title}</h5>
                      <p class="card-text text-muted">{item.subject}</p>
                      <p class="card-text">{item.questionobjective}</p>
                   </div>
                   <div class="card-footer">
                      <a href={"specificPage.html?parkCode=" + item.parks[0] + "&name=" + item.title + "&topic=" + target + "&id=" + item.id + "&q=" + keyword} class="btn btn-secondary my-2">More Information</a>
                   </div>
                </div>
             </div>
             ))}
          </div>
				);
			} else if (target == "newsreleases") {

				// Changed item properties for display
				for (var i = 0; i < items.length; i++) {

					let item = items[i];

					// Sets a placeholder image to all item without images
					if (item.image.url.length == 0) {
						item.image.url = "https://www.nps.gov/common/commonspot/templates/images/logos/nps_social_image_02.jpg";
					}

					// Condenses descriptions to 100 characters for display
					if (item.abstract.length > 100) {
						item.abstract = item.abstract.substring(0, 100) + "...";
					}
				}

				return (
          <div class="card-columns">
             {items.map(item => (
             <div>
                <div class="card mb-4 shadow-sm">
                   <img src={item.image.url} width="500px" class="img-fluid card-img-top" alt={item.image.alttext}></img>
                   <div class="card-body">
                      <h4 class="card-title">{item.title}</h4>
                      <p class="card-text text-muted">{item.releasedate}</p>
                      <p class="card-text">{item.abstract}</p>
                      <a href={"specificPage.html?parkCode=" + item.parkCode + "&name=" + item.title + "&topic=" + target + "&id=" + item.id + "&q=" + keyword} class="btn btn-secondary my-2">More Information</a>
                   </div>
                </div>
             </div>
             ))}
          </div>
				);

			} else if (target == "parks") {

				return (
          <div>
             {items.map(item => (
             <div class="card-deck">
                <div class="card mb-3">
                   <div class="card-body">
                      <h5 class="card-title">{item.fullName}</h5>
                      <p class="card-text text-muted">{item.states}</p>
                      <p class="card-text">{item.description}</p>
                   </div>
                   <div class="card-footer">
                      <a href={"parkPage.html?parkCode=" + item.parkCode} class="btn btn-secondary my-2">More Information</a>
                   </div>
                </div>
             </div>
             ))}
          </div>
				);
			}
		}
	}
}

ReactDOM.render( < FillInformation / > , document.getElementById("seeAllContainer"));

// Begins the search process by opening the search page
function goToSearch() {
	var keyword = document.getElementById("searchBox").value;

	if (keyword != "") {
		window.location = "searchPage.html?keyword=" + keyword;
	}
}
