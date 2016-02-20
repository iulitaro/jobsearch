  var map;
  var service;
  var infowindow;
  var resultList = "";
  var fruits = {};
  var searchTerm = $('#query').val();
  if (searchTerm.length < 1)
    var coords = [];

  var key = "AIzaSyB0yflWwoIPndExhWhoHKOC8pSYCeG_fF8";

$(document).ready(function(){

   $('#search-form').submit(function(event){

    var searchTerm = $('#query').val();
    event.preventDefault();
    //now for the second step
    var city = new google.maps.LatLng(coords[0], coords[1]);
    var service = new google.maps.places.PlacesService(map);

    var request = {
              location: city,
              radius: '5000',
              query:  searchTerm //new categories later?
      };
          
      console.log("Searching city" , city, "with q", searchTerm);
      service.textSearch(request, callback);
  });

});



function createInfoWindow(place) {
    var bounds = new google.maps.LatLngBounds();    
    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
        placeId: place.place_id
    }, function(place, status) 
        {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
              var marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location
              });
              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent('<div><strong>' +
                      place.name + '</strong><br>' +
                      place.formatted_address + '<br/>' +
                      '<a href=' + getWebsite(place).value +
                      ' target=\"_blank\">' + getWebsite(
                          place).value + '</a></div>');
                  infowindow.open(map, this);
              });
          }
    });
}

function callback(results, status, pagination) 
{
    if (status == google.maps.places.PlacesServiceStatus.OK) 
    {
        if (results && results.length === 0) showError("No results!");
        else {                     
            console.log("PAGINATION? ", pagination);

            if (pagination.hasNextPage) 
            {
                var moreButton = document.getElementById('more');
                moreButton.disabled = false;
                moreButton.addEventListener('click', function() {
                    moreButton.disabled = true;
                    pagination.nextPage();
                });
            }

            for (var i = 0; i < results.length; i++) 
            {
                var place = results[i];
                //initialize(searchTerm);
                createMarkers(place);
                createInfoWindow(place);
                showResults(place);                

                var request1 = {
                    reference: place.reference
                };
            }
        }
    }
    else
      return;
}

function createMarkers(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}


function getWebsite(place) {
        var fruits = _.map(place, function(value, key) {
            return {
                name: key,
                value: value
            };
        });
        var website = _.findWhere(fruits, {
            name: "website"
        });
        return website;
    }
    

function showResults(place)
{
  var html = "";    
  var display = ""; 
  
  //console.log(place);

    if (typeof place == 'undefined') 
    {
        showError("No results!")
    }
    else
    {
          fruits = _.map(place, function(value, key)
                  {
                          return { name : key, value : value };
                  });

        
          var name = _.findWhere(fruits, {name: "name"});
          var icon = _.findWhere(fruits, {name: "icon"});
          var website = _.findWhere(fruits, {name: "website"});          

          var service = new google.maps.places.PlacesService(map);

        service.getDetails({
        placeId: place.place_id
        }, function(place, status) 
            {
              if (status === google.maps.places.PlacesServiceStatus.OK) {                  

                  html = html + '<li><a href=' + getWebsite(place).value +
                          ' target=\"_blank\">' + place.name + '</a></li>';

                  resultList = resultList + html;  
                  $('#search-results ul').html(resultList)
              }
        });       
    }
}
  
  function showError(error){    
    $('#error').html('<p>'+ error + '<p>');
  }




function initialize(searchTerm) {


    if ( coords.length === 0 )      
        coords = [-33.867, 151.195]; //default coords

     map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: coords[0], lng: coords[1]},
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });


    //markers
    var markers = [];
    searchBox.addListener('places_changed', function() {

        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        coords = [];
        var bounds = new google.maps.LatLngBounds();
        createMarker (places, bounds, markers);
        map.fitBounds(bounds);
       
    }); 
}
/*
$(document).on('keydown', '#pac-input', function(e) {
    if (e.which == 13) {
      $('#pac-input').show();
      return false;
    }
});
*/


//create marker for the city chosen
function createMarker( places, bounds, markers )
{
      places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
           

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            coords.push(place.geometry.location.lat(), place.geometry.location.lng());
      
        });
}

/*

Resources

https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
https://developers.google.com/maps/documentation/javascript/examples/place-search

*/
