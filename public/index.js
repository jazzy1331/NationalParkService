var API_KEY = config.API_KEY;

var config = {
  apiKey: config.FIREBASE_API_KEY,
  projectId: config.FIREBASE_PROJECT_ID
};

document.getElementById("searchBox").value = "";

// Creates listener to "click" the Go button by just pressed enter key while focused on the search box
var input = document.getElementById("searchBox");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("searchButton").click();
  }
});


const fire = firebase.initializeApp(config);
const db = fire.firestore();

    var allData = [];

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

    db.collection("Npsparks")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data().parkCode);
                allData.push(doc.data());
            }),
            console.log("Setting State"),
            this.setState({
            isLoaded: true,
            items: allData
          })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

  }

  render() {
    const { error, isLoaded, items } = this.state;

    // Based on current status, the appropriate display/action will be rendered
    if (error) {
            console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
      return <div>Park list currently not available. Please Try again later.</div>;
    } else if (!isLoaded) {
      return <div>Loading Park List...</div>;
    } else {

      // Adds the options to the dropdown menu using the API Call results
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
    const { error, isLoaded, items } = this.state;


    for(var i = 0; i < items.length; i++){

      let item = items[i];

      if(item.image.url.length == 0){
        item.image.url = "https://www.nps.gov/common/commonspot/templates/images/logos/nps_social_image_02.jpg";
      }

      if(item.abstract.length > 100){
        item.abstract = item.abstract.substring(0, 100) + "...";
      }
    }

    // Based on the status, the appropriate diplay/action is rendered
    if (error) {
      console.log("Error: " + error.message + ". Setting text to say 'News not available. Please Try Again'");
      return <div>News is currently not available. Please try again later.</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
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
                {item.abstract}</p>
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
ReactDOM.render(<Parks />, document.getElementById("parkChooserDomContainer"));
ReactDOM.render(<News />, document.getElementById("newsArticlesDomContainer"));

// Begins the search process by opening the search page
function goToSearch(){
  var keyword = document.getElementById("searchBox").value;

  // Checks to make sure the search box is not empty
  if(keyword != ""){
    window.location = "searchPage.html?keyword=" + keyword;
  }
}
