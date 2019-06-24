var API_KEY = config.API_KEY;
var allData = [];
var parkName = "";

// Gets URL paramters, given by previous page, to fetch the appropriate information from the API
let params = (new URL(document.location)).searchParams;
let parkCode = params.get('parkCode');

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function(event) {
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

// Gets all the park data from the DB
db.collection("Npsparks")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach(function (doc) {
        // Saves DB data to variable
        allData.push(doc.data());
      }),
      displayParkData()
  })
  .catch(function (error) {
    console.log("Error getting documents: ", error);
  });

// Uses DB info to display park name and description
function displayParkData(){

  for(var i = 0; i < allData.length; i++){
    if(allData[i].parkCode == parkCode){
      document.title = allData[i].title;
      document.getElementById("parkNameHeader").innerHTML = allData[i].title;
      parkName = allData[i].title;
      document.getElementById("description").innerHTML = allData[i].description;
      break;
    }
  }
}

// React JS class that adds alerts to the modal for alerts
class Alerts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      items: [],
      itemCount: 0
    };
  }

  componentDidMount() {

    // Calls API for information about alerts at the current park
    fetch("https://developer.nps.gov/api/v1/alerts?parkCode=" + parkCode + "&api_key=" + API_KEY)
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
    // Renders the alerts on the modal
    render() {
      const { error, isLoaded, items } = this.state;

      if (error) {
              console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
        return <div>{this.props.target} information is currently not available. Please try again later.</div>;
      } else if (!isLoaded) {
        return <div>Loading {this.props.target} List...</div>;
      } else {

          // Gives a value to the badge
          document.getElementById("alertsBadge").innerHTML = items.length

          // Adds a color property to each alert based on its category
          for(var i = 0; i < items.length; i++){

            switch(items[i].category){

              case "Park Closure":
                items[i].colorClass = "text-primary";
                break;
              case "Information":
                items[i].colorClass = "text-info";
                break;

              case "Caution":
                items[i].colorClass = "text-warning";
                break;

              case "Danger":
                items[i].colorClass = "text-danger";
                break;
              default:
                items[i].colorClass = "text-body";

            }
          }

          // Adds alerts to modal if there are any, otherwise sets a placeholder text
          if(items.length > 0){
            return (
              <div>
                 {items.map(item => (
                 <div>
                    <h6>{item.title}</h6>
                    <p><strong className={item.colorClass}>{item.category}</strong>: {item.description} {item.url.length > 0 &&
                       <a href={item.url}>More Info</a>}
                    </p>
                 </div>
                 ))}
              </div>
            );
          }else{
            return (<div>No alerts at this time</div>)
          }
      }
    }
  }

  // Renders React JS class to display alerts
  ReactDOM.render(<Alerts/>, document.getElementById("alertsContainer"));


// Begins the search process by opening the search page
function goToSearch(){
  var keyword = document.getElementById("searchBox").value;

  if(keyword != ""){
    window.location = "searchPage.html?keyword=" + keyword;
  }
}

// Used as onClick function for buttons, going to the appropriate page
function nextPage(targetPage){

  switch(targetPage) {
  case "things":
        window.location = "thingsToDoPage.html?parkCode=" + parkCode + "&parkName=" + parkName;
    break;
  case "learn":
        window.location = "learnMorePage.html?parkCode=" + parkCode  + "&parkName=" + parkName;
    break;
  }
}
