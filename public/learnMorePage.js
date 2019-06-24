var API_KEY = config.API_KEY;

// Gets URL paramters, given by previous page, to fetch the appropriate information from the API
let params = (new URL(document.location)).searchParams;
let parkCode = params.get('parkCode');
let parkName = params.get('parkName');
document.getElementById("parkNameHeader").innerHTML = parkName;

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("searchButton").click();
	}
});

// React JS class that fills in information into the topic containers
// Requires the class property 'target' to be passed in to get the appropriate information
class FillInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: [],
			itemCount: 0
		};
	}

	componentDidMount() {

		// While limit is stated as 3, news gives the limit number of entries, articles gives {1 + limit}
		// Calls API for information about the passed in target and the current park
		// Limits to 5 pieces of information
		fetch("https://developer.nps.gov/api/v1/" + this.props.target + "?parkCode=" + parkCode + "&limit=5&api_key=" + API_KEY)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						items: result.data,
						itemCount: result.total
					});
				},

			)
			.catch((error) => {
				console.log("Error: " + error + ". Setting " + this.props.target + " to 'Unavailable'");
			});

	}
	// Renders the links inside the first two cards
	render() {
		const {
			error,
			isLoaded,
			items
		} = this.state;

		var title = "";
		if(this.props.target == "articles"){
			title = "Articles"
		}else{
			title = "News Releases";
		}
		if (error) {
			console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
			return <div > {
				this.props.target
			}
			information is currently not available.Please
			try again later. < /div>;
		} else if (!isLoaded) {
			return(
				<div class="px-2">
					<div class="spinner-border" role="status">
					  <span class="sr-only">Loading...</span>
					</div>
					<p>{"Loading " + title + "..."}</p>
				</div>
			);
		} else {


			if(items.length > 0){
				return (
					<div class="card mb-4 shadow-sm">
						<div class="card-body">
							<h2 class="card-title">{title}</h2>
			        <ul class="list-group">
			           {items.map(item => (
			           <div>
			              <li class="list-group-item"><a href={"specificPage.html?parkCode=" + parkCode + "&id=" + item.id + "&topic=" + this.props.target + "&name=" + item.title}>
			                 {item.title}
			                 </a>
			              </li>
			           </div>
			           ))}
			        </ul>
						</div>
						<div class="card-footer">
							 <a type="button" class="btn btn-secondary" href={"seeAllPage.html?parkCode=" + parkCode + "&target=" + this.props.target} role="button">See All  &#187;</a>
						</div>
					</div>
				);
			}else{
				return (
					<div class="card mb-4 shadow-sm">
						<div class="card-body">
							<h2 class="card-title">{title}</h2>
			        <p>{"No " + title + " At This Park"}</p>
						</div>
					</div>
				);
			}
		}
	}
}

// React Class that combines all three columns and renders them together
class Columns extends React.Component{

	render(){

		// Makes instances of the FillInformation class for each column
		return(

			<div class="card-deck d-flex justify-content-center">
				<FillInformation target="newsreleases"/>
				<FillInformation target="articles"/>
				<div class="card mb-4 shadow-sm">
					 <div class="card-body">
							<h2 class="card-title">Education</h2>
							<ul class="list-group">
								<li class="list-group-item">
									<a href={"seeAllPage.html?parkCode=" + parkCode + "&target=lessonplans"} class="card-text">Lesson Plans</a>
								</li>
								<br></br>
								<li class="list-group-item">
									<a href={"seeAllPage.html?parkCode=" + parkCode + "&target=places"} class="card-text">Places</a>
								</li>
								<br></br>
								<li class="list-group-item">
									<a href={"seeAllPage.html?parkCode=" + parkCode + "&target=people"} class="card-text">People</a>
								</li>
								<br></br>
							</ul>
					 </div>
				</div>
			</div>
		);

	}
}

// Renders Columns class with creates all three columns in a card deck
ReactDOM.render( < Columns / > , document.getElementById("contentContainer"));

// Used as onClick function for buttons and some links, going to the appropriate page
function nextPage(targetPage) {

	switch (targetPage) {
		case "articles":
			window.location = "seeAllPage.html?parkCode=" + parkCode + "&target=articles";
			break;
		case "news":
			window.location = "seeAllPage.html?parkCode=" + parkCode + "&target=newsreleases";
			break;
		case "lessons":
			window.location = "seeAllPage.html?parkCode=" + parkCode + "&target=lessonplans";
			break;
		case "places":
			window.location = "seeAllPage.html?parkCode=" + parkCode + "&target=places";
			break;
		case "people":
			window.location = "seeAllPage.html?parkCode=" + parkCode + "&target=people";
			break;
	}
}

// Begins the search process by opening the search page
function goToSearch() {
	var keyword = document.getElementById("searchBox").value;

	if (keyword != "") {
		window.location = "searchPage.html?keyword=" + keyword;
	}
}
