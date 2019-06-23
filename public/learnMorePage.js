var API_KEY = config.API_KEY;

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

// Calls NPS API for information about the current viewed park
// Sets park title element from HTML to values from the call
fetch("https://developer.nps.gov/api/v1/parks?parkCode=" + parkCode + "&api_key=" + API_KEY)
  .then(res => res.json())
  .then(
    (result) => {
      var parkInfo = result.data[0];
      document.getElementById("parkNameHeader").innerHTML = parkInfo.fullName;
    },

  )
  .catch((error) => {
    console.log("Error: " + error + ". Setting page h3 to 'National Park'");
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
    fetch("https://developer.nps.gov/api/v1/"+ this.props.target +"?parkCode=" + parkCode + "&limit=3&api_key=" + API_KEY)
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
    render() {
      const { error, isLoaded, items } = this.state;

      if (error) {
              console.log("Error: " + error.message + ". Setting text to say 'Please Try Again'");
        return <div>{this.props.target} information is currently not available. Please try again later.</div>;
      } else if (!isLoaded) {
        return <div>Loading {this.props.target} List...</div>;
      } else {

          return (

            <ul class="list-group">

            {items.map(item => (

              <div>
                <li class="list-group-item"><a href={"specificPage.html?parkCode=" + parkCode + "&id=" + item.id + "&topic=" + this.props.target + "&name=" + item.title}>
                  {item.title}
                </a></li>
              </div>
              ))}
            </ul>
          );
      }
    }
  }

// Renders each React JS class with the appropriate DOM Element to render into
// Takes in property 'target' to get the correct information
ReactDOM.render(<FillInformation target="newsreleases" />, document.getElementById("newsContainer"));
ReactDOM.render(<FillInformation target="articles" />, document.getElementById("articlesContainer"));

// Used as onClick function for buttons and some links, going to the appropriate page
function nextPage(targetPage){

  switch(targetPage) {
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
function goToSearch(){
  var keyword = document.getElementById("searchBox").value;

  if(keyword != ""){
    window.location = "searchPage.html?keyword=" + keyword;
  }
}
