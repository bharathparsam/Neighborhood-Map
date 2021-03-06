/*global google*/
import React, {
  Component
} from 'react';
import SideNav from './SideNav';
class App extends Component {
  //Setting up of states
  state = {
    places: [{
        name:'Begumpet Airport',
        lat: 17.4496,
        lng: 78.471228
      },
      {
        name:'Osmania University',
        lat: 17.418004,
        lng: 78.527336
      },
      {
        name:'Public Gardens',
        lat:17.398599,
        lng:78.468801
      },
      {
        name:'Snow World',
        lat:17.414571,
        lng:78.480923
      },
      {
        name:'Salarjung Museum',
        lat: 17.371923,
        lng: 78.480199
      }
    ],
    map: '',
    markers: [],
    defaultMarkers: [],
    infowindow: '',
    isOpen: true
  }

  //Loding Map Reference take from http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
  componentDidMount = () => {
    /*
    *   Connect the initMap() function within this class to the global window context,
    *   so Google Maps can invoke it
    *   Loading google api using the key provided
    */
    window.initMap = this.initMap;
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyD753Z4GDEJ1IK-MHqzwdK04oZD3O1zRk8&callback=initMap')
  }
  /*
   *   initMap() ---> Initializtion of map
   *   Only center zoom is set
   *
   */
  initMap = () => {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 17.385044,
        lng: 78.486671
      },
      zoom: 11
    });
    this.setState({
      map: map
    })

    /*
     *     Array of markers is set
     *     Bounds for map -> To enable autozoom and pan itself depending on the screen size)
     */

    var bounds = new google.maps.LatLngBounds();
    var listOfLocations = [];
    this.state.places.forEach(locs => {
      var marker = new google.maps.Marker({
        position: {
          lat: locs.lat,
          lng: locs.lng
        },
        map: map,
        // we can add type if required like title: locs.type
        // for this we need to set type:bar or etc..
        title: locs.name,
        animation: window.google.maps.Animation.DROP
      })
      //push the marker to the array of listOfLocations[]
      listOfLocations.push(marker);
      var locaations = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      //To extend the boundaries of the map for each marker

      bounds.extend(locaations);
      // Addition of eventListener to the marker to open the information window

      google.maps.event.addListener(marker,'click',()=> {
        this.openInfoWindow(marker);
      })
    })
      this.setState({
      markers: listOfLocations,
      defaultMarkers: listOfLocations
    })

    /*
     *    Retrive the current center
     *    Refrence taken from -->  https://codepen.io/alexgill/pen/NqjMma
     *    Eventlistener to resize and reset the zoom size of the marker
     */
    var currentCenters = map.getCenter();
    google.maps.event.addDomListener(window, 'resize', ()=> {
      this.state.map.setCenter(currentCenters);
      this.state.map.fitBounds(bounds);
      this.state.map.panToBounds(bounds);

    });

    /*
    *   Creating the info window and setting a state -->
    *   Setting the maximum size of InfoWindow
    */

    var infowindow = new google.maps.InfoWindow({ maxWidth: 200 });
    this.setState({
      infowindow:infowindow
    })


  }
  /*
   *    Function to display when clicked and view information regarding the location
   */
  openInfoWindow = (marker) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1500);
    /*
    * Get the latitude and longitude of the marker
    */
    this.state.map.setCenter(marker.getPosition());
    var clientsId = 'XXP2WMKXG0E1CYL21PCIFCRDVFSQFCJYIKFRHEYBZLPLJMVY'
    var clientsSecret = 'YBXA4XAOOEPCRZR4PUMUAG55DILNQ3Y0S13WKXGRLJIROQZ4'
    // variables created to us it in fetching the details

    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    /*
     *     url to fetch the marked locations or selected locations
     */
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientsId + "&client_secret=" + clientsSecret + "&v=20180516&ll=" + lat + "," + lng + "";

    this.state.infowindow.setContent("Loading Information..")
    fetch(url)
      .then((res)=>{
        if (res.status !== 200) {
          this.state.infowindow.setContent('Error in retriving the data');
          return;
        }
        res.json()
          .then((data) => {
            //get the first response
            var json = data.response.venues[0];
            /*
             *   resp is where all the location information is being stored
             */
            fetch("https://api.foursquare.com/v2/venues/" + json.id + "/?client_id=" + clientsId + "&client_secret=" + clientsSecret + "&v=20180516")
              .then((resp) => {
                resp.json()
                  .then(data=>{
                    var infos = data.response.venue;
                    var viewMore = '<a href="https://foursquare.com/v/'+ infos.id +'"target="_blank"><b>View More</b></a>' + '<br>';
                    console.log(infos);
                    // Setting the content of the marker
                    this.state.infowindow.setContent(`As per Foursquare Website: <br>Number of Tips : ${infos.tips.count}<br>Number of Likes: ${infos.likes.count} <br> ${viewMore}`)
                  })
              })
              .catch(function (err){
                alert("Sorry Foursquare API limit has been exceeded for the day");
              });
          })
      })
      .catch(function (err){
        alert("Sorry Foursquare API limit has been exceeded for the day");
      });

    this.state.infowindow.open(this.state.map,marker);
  }
  /*
   *  Filter Function to filter the text entered.
   */
  filter = (event) => {
    this.state.infowindow.close();
    var filterLocations = [];
    if (event.target.value === '' || filterLocations.length === 0) {
      this.state.defaultMarkers.forEach((marker) => {
        if (marker.title.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
          marker.setVisible(true);
          filterLocations.push(marker);
        } else {
          marker.setVisible(false);
        }
      });
    } else {
      this.state.markers.forEach((marker) => {
        if (marker.title.toLowerCase().indexOf(event.target.value) >= 0) {
          marker.setVisible(true);
          filterLocations.push(marker);
        } else {
          marker.setVisible(false);
        }
      });
    }
    this.setState({
      markers: filterLocations
    })
  }
  /*
   *   toggleNav = It is used to toggle when hamburger icon is being clicked
   */
  toggleNav = () => {

    document.getElementById('filter-navigator').classList.toggle('close')
    if (document.getElementById('filter-navigator').className === 'close') {
      this.setState({
        isOpen: false
      })
    }
    this.state.infowindow.close();
  }
  render = () => {
    return (
      <div id = "container" role = "main" >
      <span id = "toggle-nav" onClick = {this.toggleNav} aria-label = "toggle Navigation" >&#9776;</span>
      <SideNav places= {this.state.markers}openInfoWindow = { this.openInfoWindow} filter = { this.filter}isOpen = {this.props.isOpen}/>
      <div id = "map-container" role = "application" tabIndex = "-1" >
      <div id = "map" style = {{ height: window.innerHeight + "px" }} >
      </div>
      </div>
      </div>
    );
  }
}

export default App;

function loadMapJS(src) {

  var refers = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  script.onerror = () => {
    document.getElementById('map').innerHTML = "Script Cannot be loaded"
  }
  refers.parentNode.insertBefore(script, refers);
}
