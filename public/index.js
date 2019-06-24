var API_KEY = config.API_KEY;
var allData = [];

document.getElementById("searchBox").value = "";

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("searchButton").click();
	}
});

// Sets up access to Firestore Database
var config = {
	apiKey: config.FIREBASE_API_KEY,
	projectId: config.FIREBASE_PROJECT_ID
};

const fire = firebase.initializeApp(config);
const db = fire.firestore();

// React JS class for the Parks Dropdown
class Parks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: []
		};
	}

	componentDidMount() {

    // Gets all the park data from the DB
		db.collection("Npsparks")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach(function (doc) {
						console.log(doc.id, " => ", doc.data().parkCode);
            // Saves DB data to variable
						allData.push(doc.data());
					}),
					console.log("Setting State"),
					this.setState({
						isLoaded: true,
						items: allData
					})
			})
			.catch(function (error) {
				console.log("Error getting documents: ", error);
			});
	}

	render() {
    // Saves the state locally in scope
		const {
			error,
			isLoaded,
			items
		} = this.state;

		// Based on current status, the appropriate display/action will be rendered
		if (error) {
			console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
			return <div > Park list currently not available.Please Try again later. < /div>;
		} else if (!isLoaded) {
			return <div > Loading Park List... < /div>;
		} else {

			// Adds the options to the dropdown menu using the DB Call results
			return (
        <div>
           {items.map(item => (
           <a class="dropdown-item" href={"parkPage.html?parkCode=" + item.parkCode}>{item.title}</a>
           ))}
        </div>
			);
		}
	}
}

// React JS Class for news section
class News extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			items: []
		};
	}

	componentDidMount() {

		// Calls API for list of the 6 latest news articles from anywhere in the NPS system. Upon result, the data is saved to the state of the object
		fetch("https://developer.nps.gov/api/v1/newsreleases?limit=6&api_key=" + API_KEY)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						items: result.data
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			);

	}

	render() {
    // Saves state as local constants
		const {
			error,
			isLoaded,
			items
		} = this.state;

    // Goes through all news articles and adjusts picture and description properties for display
		for (var i = 0; i < items.length; i++) {

			let item = items[i];

      // Adds placeholder picture if item does not have one
			if (item.image.url.length == 0) {
				item.image.url = "https://www.nps.gov/common/commonspot/templates/images/logos/nps_social_image_02.jpg";
			}

      // Restricts description to 100 characters and adds an ellipsis
			if (item.abstract.length > 100) {
				item.abstract = item.abstract.substring(0, 100) + "...";
			}

			// Beautifies the date
			if(item.releasedate.length > 0){
				var month = item.releasedate.substring(5,7);
				var day = item.releasedate.substring(8,10);
				var year = item.releasedate.substring(0,4);

				switch(month){
					case "01":
						month = "January";
						break;
					case "02":
						month = "February";
						break;
					case "03":
						month = "March";
						break;
					case "04":
						month = "April";
						break;
					case "05":
						month = "May";
						break;
					case "06":
						month = "June";
						break;
					case "07":
						month = "July";
						break;
					case "08":
						month = "August";
						break;
					case "09":
						month = "September";
						break;
					case "10":
						month = "October";
						break;
					case "11":
						month = "November";
						break;
					case "12":
						month = "December";
						break;
				}

				item.releasedate = month + " " + day + ", " + year;
			}

		}

		// Based on the status, the appropriate diplay/action is rendered
		if (error) {
			console.log("Error: " + error.message + ". Setting text to say 'News not available. Please Try Again'");
			return <div > News is currently not available.Please
			try again later. < /div>;
		} else if (!isLoaded) {
			return <div > Loading... < /div>;
		} else {

			// The news Bootstrap cards are returned, each with its own news article from the API Call
			return (
        <div class="card-columns">
           {items.map(item => (
           <div>
              <div class="card mb-4 shadow-sm">
                 <img src={item.image.url} width="300" class="img-fluid card-img-top" alt={item.image.alttext}></img>
                 <div class="card-body">
                    <h4 class="card-title">{item.title}</h4>
                    <p class="card-text">
                       {item.releasedate.length > 0 && <span class="text-muted">{item.releasedate} - </span>}
                       {item.abstract}
                    </p>
                 </div>
                 <div class="card-footer">
                    <a href={"specificPage.html?parkCode=" + item.parkCode + "&name=" + item.title + "&topic=newsreleases" + "&id=" + item.id + "&q=null"} class="btn btn-secondary my-2">Read More</a>
                 </div>
              </div>
           </div>
           ))}
        </div>
			);
		}
	}
}

// Renders each React JS class with the appropriate DOM Element to render into
ReactDOM.render( < Parks / > , document.getElementById("parkChooserDomContainer"));
ReactDOM.render( < News / > , document.getElementById("newsArticlesDomContainer"));

function goTo(stateCode){
	window.location = "seeAllPage.html?target=parks&state=" + stateCode + "&from=home&search=y";
}

// Begins the search process by opening the search page
function goToSearch() {
	var keyword = document.getElementById("searchBox").value;

	// Checks to make sure the search box is not empty
	if (keyword != "") {
		window.location = "searchPage.html?keyword=" + keyword;
	}
}
