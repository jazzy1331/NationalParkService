var API_KEY = config.API_KEY;

// Sets up access to Firestore DB
var config = {
	apiKey: config.FIREBASE_API_KEY,
	projectId: config.FIREBASE_PROJECT_ID
};

const fire = firebase.initializeApp(config);
const db = fire.firestore();

// Gets URL Params
let params = (new URL(document.location)).searchParams;
let keyword = params.get('keyword');
var stateFilterValue = params.get('statecode');
var stateFilterFull = params.get('state');
var designationFilter = params.get('desig');

// Based on desig param, the full designation name is found
var fullDesignation = '';
switch (designationFilter) {

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

// Target names used for rendering later
var target = ["parks", "visitorcenters", "campgrounds", "articles", "events", "newsreleases", "lessonplans", "people", "places"];
var targetReadable = ["Parks", "Visitor Centers", "Campgrounds", "Articles", "Events", "News Releases", "Lesson Plans", "People", "Places"];

var parkData = [];
var isEmpty = true;

// Changes dropdown menu text
if (stateFilterFull != null) {
	document.getElementById("stateDropdownMenuButton").innerHTML = stateFilterFull;
}

if (fullDesignation != "All") {
	document.getElementById("desigDropdownMenuButton").innerHTML = fullDesignation;
}

var lastIcon = null;

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("searchButton").click();
	}
});

document.getElementById("searchBox").value = keyword;

// React class to dislay search results on page
class FillInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: [],
		};
	}

	componentDidMount() {

		this.pullData();

	}

	// Fecthes information from the NPS API
	pullData() {
		this.setState({
			isLoaded: false
		})
		if (stateFilterValue == null || stateFilterValue == "all" || stateFilterValue == "null") {
			// fetch("https://developer.nps.gov/api/v1/"+ this.props.target +"?q=" + keyword + "&limit=5&pagesize=5&api_key=" + API_KEY)
			fetch("https://developer.nps.gov/api/v1/" + this.props.target + "?q=" + keyword + "&api_key=" + API_KEY)
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: false,
							items: result.data
						});
						this.getParkData();
					},

				)
				.catch((error) => {
					console.log("Error: " + error + ". Displaying text as 'Unavailable'");
				});
		} else {
			// fetch("https://developer.nps.gov/api/v1/"+ this.props.target +"?q=" + keyword + "&stateCode=" + stateFilterValue + "&limit=5&pagesize=5&api_key=" + API_KEY)
			fetch("https://developer.nps.gov/api/v1/" + this.props.target + "?q=" + keyword + "&stateCode=" + stateFilterValue + "&api_key=" + API_KEY)
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: false,
							items: result.data
						});
						this.getParkData();
					},

				)
				.catch((error) => {
					console.log("Error: " + error + ". Displaying text as 'Unavailable'");
				});
		}
	}

	// Gets park data from the Firestore DB
	getParkData() {

		var allData = [];

		db.collection("Npsparks")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach(function (doc) {
					allData.push(doc.data());
				});
				parkData = allData;

				// Filters by designation if such a filter is being used
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

	// Filters results by the chosen designation
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

	// Changes arrow icon for the accordion based on open and close
	changeIcon(target) {
		var x = document.getElementById(target);
		if (x.className === "fas fa-chevron-right") {
			x.className = "fas fa-chevron-down";

			if (lastIcon != null && lastIcon != target) {
				var y = document.getElementById(lastIcon);
				y.className = "fas fa-chevron-right";
			}
			lastIcon = target;
		} else {
			x.className = "fas fa-chevron-right";

		}
	}

	// Renders the results of the search into the accordion
	render() {

		// Saves state as local scoped variables
		const {
			error,
			isLoaded,
			items
		} = this.state;

		if (error) {
			console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
			return <div > {
				this.props.target
			}
			information is currently not available.Please
			try again later. < /div>;
		} else if (!isLoaded) {
			return <div > Loading {
				this.props.target
			}
			List... < /div>;
		} else {
			// If there are results for the search, then they are displayed
			if (items.length > 0) {
				isEmpty = false;
				document.getElementById("emptyText").innerHTML = "";
				if (this.props.target == "parks") {
					var iconChange = "iconParks";

					return (
            <div class="card">
               <div class="card-header" id="headingOne">
                  <h2 class="mb-0">
                     <button class="btn btn-link collapsed" type="button" data-toggle="collapse" onClick={() =>
                        this.changeIcon(this.props.target)} data-target="#collapseParks" aria-expanded="true" aria-controls="collapseOne">
                        <p>{this.props.targetReadable} <span id={this.props.target} class="fas fa-chevron-right"></span></p>
                     </button>
                  </h2>
               </div>
               <div id="collapseParks" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div class="card-body">
                     <ul class="list-group">
                        {items.slice(0, 5).map(item => (
                        <li class="list-group-item"><a href={"parkPage.html?parkCode=" + item.parkCode}>
                           {item.fullName}
                           </a>
                        </li>
                        ))}
                     </ul>
                  </div>
                  <div class="card-footer">
                     <a href={"seeAllPage.html?keyword=" + keyword + "&search=y&target=" + this.props.target + "&state=" + stateFilterValue + "&desig=" + designationFilter} class="btn btn-secondary">See More</a>
                  </div>
               </div>
            </div>
					);

				} else if (this.props.target == "campgrounds" || this.props.target == "visitorcenters") {

					return (
            <div class="card">
               <div class="card-header" id="headingOne">
                  <h2 class="mb-0">
                     <button class="btn btn-link collapsed" onClick={() =>
                        this.changeIcon(this.props.target)} type="button" data-toggle="collapse" data-target={"#collapse" + this.props.target} aria-expanded="true" aria-controls="collapseOne">
                        <p>{this.props.targetReadable} <span id={this.props.target} class="fas fa-chevron-right"></span></p>
                     </button>
                  </h2>
               </div>
               <div id={"collapse" + this.props.target} class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div class="card-body">
                     <ul class="list-group">
                        {items.slice(0, 5).map(item => (
                        <li class="list-group-item"><a href={"specificPage.html?parkCode=" + item.parkCode + "&name=" + item.name + "&topic=" + this.props.target + "&id=" + item.id  + "&q=" + keyword}>
                           {item.name}
                           </a>
                        </li>
                        ))}
                     </ul>
                  </div>
                  <div class="card-footer">
                     <a href={"seeAllPage.html?keyword=" + keyword + "&search=y&target=" + this.props.target + "&state=" + stateFilterValue + "&desig=" + designationFilter} class="btn btn-secondary">See More</a>
                  </div>
               </div>
            </div>
					);

				} else if (this.props.target == "events") {

					return (
            <div class="card">
               <div class="card-header" id="headingOne">
                  <h2 class="mb-0">
                     <button class="btn btn-link collapsed" onClick={() =>
                        this.changeIcon(this.props.target)} type="button" data-toggle="collapse" data-target={"#collapse" + this.props.target} aria-expanded="true" aria-controls="collapseOne">
                        <p>{this.props.targetReadable} <span id={this.props.target} class="fas fa-chevron-right"></span></p>
                     </button>
                  </h2>
               </div>
               <div id={"collapse" + this.props.target} class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div class="card-body">
                     <ul class="list-group">
                        {items.slice(0, 5).map(item => (
                        <li class="list-group-item"><a href={"specificPage.html?parkCode=" + item.sitecode + "&name=" + item.title + "&topic=" + this.props.target + "&id=" + item.id + "&q=" + keyword}>
                           {item.title}
                           </a>
                        </li>
                        ))}
                     </ul>
                  </div>
                  <div class="card-footer">
                     <a href={"seeAllPage.html?keyword=" + keyword + "&search=y&target=" + this.props.target + "&state=" + stateFilterValue + "&desig=" + designationFilter} class="btn btn-secondary">See More</a>
                  </div>
               </div>
            </div>
					);

				} else {

					return (
            <div class="card">
               <div class="card-header" id="headingOne">
                  <h2 class="mb-0">
                     <button class="btn btn-link collapsed" onClick={() =>
                        this.changeIcon(this.props.target)} type="button" data-toggle="collapse" data-target={"#collapse" + this.props.target} aria-expanded="true" aria-controls="collapseOne">
                        <p>{this.props.targetReadable} <span id={this.props.target} class="fas fa-chevron-right"></span></p>
                     </button>
                  </h2>
               </div>
               <div id={"collapse" + this.props.target} class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div class="card-body">
                     <ul class="list-group">
                        {items.slice(0, 5).map(item => (
                        <li class="list-group-item"><a href={"specificPage.html?parkCode=" + item.parkCode + "&name=" + item.title + "&topic=" + this.props.target + "&id=" + item.id + "&q=" + keyword}>
                           {item.title}
                           </a>
                        </li>
                        ))}
                     </ul>
                  </div>
                  <div class="card-footer">
                     <a href={"seeAllPage.html?keyword=" + keyword + "&search=y&target=" + this.props.target + "&state=" + stateFilterValue + "&desig=" + designationFilter} class="btn btn-secondary">See More</a>
                  </div>
               </div>
            </div>
					);
				}
			} else {
				// Displays text if no results are available
				if (isEmpty) {
					document.getElementById("emptyText").innerHTML = "No Results!";
				} else {
					document.getElementById("emptyText").innerHTML = "";
				}

				return null;
			}
		}
	}
}

// Starts renders for all sections of the results
for (var i = 0; i < 10; i++) {
	var elementName = "search" + target[i] + "Container";
	ReactDOM.render( < FillInformation target = {target[i]} targetReadable = {targetReadable[i]}/>, document.getElementById(elementName));
	}

	// Applies a filter option when selected
	function filterResults(filter) {

		if (filter.length <= 3) {
			if (designationFilter == null) {
				designationFilter = "All";
			}
			var stateFull = document.getElementById(filter).innerHTML;
			window.location = "searchPage.html?keyword=" + keyword + "&statecode=" + filter + "&state=" + stateFull + "&desig=" + designationFilter;
		} else {

			if (stateFilterFull == null) {
				stateFilterFull = "All";
			}

			window.location = "searchPage.html?keyword=" + keyword + "&statecode=" + stateFilterValue + "&state=" + stateFilterFull + "&desig=" + filter;
		}
	}

	// Begins the search process by opening the search page
	function goToSearch() {
		var keyword = document.getElementById("searchBox").value;

		if (keyword != "") {
			window.location = "searchPage.html?keyword=" + keyword;
		}
	}
