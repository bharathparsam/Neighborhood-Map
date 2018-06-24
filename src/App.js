/*global google*/
import React, {
  Component
} from 'react';
import SideNav from './SideNav';
class App extends Component {
  //Setting up of states
  state = {
    places: [{
        name: 'Rangamahal Theater',
        lat: 13.20658,
        lng: 78.743786
      },
      {
        name: 'Padmasree Theater',
        lat: 13.202664,
        lng: 78.744788
      },
      {
        name: 'LNSP',
        lat: 13.205529,
        lng: 78.747077
      },
      {
        name: 'Manjunatha Theater',
        lat: 13.204473,
        lng: 78.74491
      },
      {
        name: 'V V MAHAL',
        lat: 13.203343,
        lng: 78.745324
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
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyD753Z4GDEJ1IK-MHqzwdK04oZD3O1zRk8&callback=initMap')
  }
  /*initMap() ---> Initializtion of map
   *    Only center zoom is set
   *
   */
  initMap = () => {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 13.20824,
        lng: 78.759867
      },
      zoom: 14
    });
    this.setState({
      map: map
    })
    /*
     *     Array of markers
     *     Bounds for map -> To enavble autozoom and pan itself depending on the screen size)
     */
    var bounds = new google.maps.LatLngBounds();
    var marking = [];
    this.state.places.forEach(locs => {
      var marker = new google.maps.Marker({
        position: {
          lat: locs.lat,
          lng: locs.lng
        },
        map: map,
        title: locs.name,
        animation: window.google.maps.Animation.BOUNCE
      })
      marking.push(marker);

      var locaations = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      bounds.extend(locaations);
      google.maps.event.addListener(marker, 'click', () => {
        this.openInfoWindow(marker);
      })
    })
    this.setState({
      markers: marking,
      defaultMarkers: marking
    })

    /*
     *    Retrive the current center
     *    Refrence taken from -->  https://codepen.io/alexgill/pen/NqjMma
     *    Eventlistener to resize and and set the center
     */
    var currentCenters = map.getCenter();
    google.maps.event.addDomListener(window, 'resize', () => {
      this.state.map.setCenter(currentCenters);
      this.state.map.fitBounds(bounds);
      this.state.map.panToBounds(bounds);

    });

    /* Creating the infowindow */

    var infowindow = new google.maps.InfoWindow({

    });
    this.setState({
      infowindow: infowindow
    })


  }
  /*
   *    Function to display when clicked and view information regarding the location
   */
  openInfoWindow = (marker) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 2100);
    /*set the marker as the center of the map*/
    this.state.map.setCenter(marker.getPosition());
    var clientsId = 'RMPRLWDMPYYCFIE3XBU51ZENNIE4KYCP42TX3MXYEB0YIEAA'
    var clientsSecret = '53MWGHEGNVXJM113JAWDJ0T3LWPNIEEPRGTEOHRDOYEZCOOO'
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    /*
     *     url to fetch the marked locations or selected locations
     */
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientsId + "&client_secret=" + clientsSecret + "&v=20180516&ll=" + lat + "," + lng + "";

    this.state.infowindow.setContent("Loading Information..")
    fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          this.state.infowindow.setContent('Error in retriving the data');
          return;
        }
        res.json()
          .then((data) => {
            var json = data.response.venues[0];
            /*
             *   resp is where all the location information is being stored
             */
            fetch("https://api.foursquare.com/v2/venues/" + json.id + "/?client_id=" + clientsId + "&client_secret=" + clientsSecret + "&v=20180516")
              .then((resp) => {
                resp.json()
                  .then(data => {
                    var datas = data.response.venue;
                    console.log(datas);
                    // Setting the content of the marker
                    this.state.infowindow.setContent(`As per Foursquare Website : <br>Number of Tips : ${d.tips.count}<br>Number of Likes: ${d.likes.count} Likes`)

                  })
              })
          })
      })

    this.state.infowindow.open(this.state.map, marker);
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

    document.getElementById('nav').classList.toggle('close')
    if (document.getElementById('nav').className === 'close') {
      this.setState({
        isOpen: false
      })
    }
    this.state.infowindow.close();
  }
  render = () => {
    return (

      <
      div id = "container"
      role = "main" >
      <
      span id = "toggle-nav"
      onClick = {
        this.toggleNav
      }
      aria - label = "toggle Navigation" > & #9776;</span>

        <SideNav places= {
        this.state.markers
      }
      openInfoWindow = {
        this.openInfoWindow
      }
      filter = {
        this.filter
      }
      isOpen = {
        this.props.isOpen
      }
      />  <
      div id = "map-container"
      role = "application"
      tabIndex = "-1" >
      <
      div id = "map"
      style = {
        {
          height: window.innerHeight + "px"
        }
      } >
      </div>  </div>  </div>
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
  ref.parentNode.insertBefore(script, refers);
}
