$(document).ready(function(){ 
  
      var map;
    var service;
    var infowindow;
    var resultList = ""; 
    var fruits = {};
    var key = "AIzaSyB0yflWwoIPndExhWhoHKOC8pSYCeG_fF8";

    function getCoords ( request )
    {     
        $.ajax({url: request}).success(function (data) {

          if (data.status === "OK")
          {
            
            var results = _.map(data.results[0], function (value, key)
                            {
                              return {name: key, value: value};
                            });

               console.log("Results", results);   

            var geometry = _.findWhere(results, {name: "geometry"});
            var latit = geometry.value.location.lat;
            var longit = geometry.value.location.lng;

            console.log("lat", latit);
            console.log("long", longit);
            console.log("geometry", geometry);
              
            return(latit); 
          }
          else
          {
            showError("No results!");      
            return;      
          }
          
        });
     

    }


    function initialize(searchTerm) 
    {
        var constructRequest = "https://maps.googleapis.com/maps/api/geocode/json?address="+ searchTerm+"&key="+key;
        console.log("Returned", getCoords(constructRequest));

        var city = new google.maps.LatLng(50.7323,7.1847);
        //center of city
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: city,
            zoom: 15
          });

        //request      
        var request = {
          location: city,
          radius: '500', //enable search
          query: 'software development companies' //new categories later?
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    }

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
           if (results && results.length === 0 )
              showError("No results!");
            else
            {              
              for (var i = 0; i < results.length; i++) {
                var place = results[i];    
                var request1 = {
                  reference: place.reference
                };
                
                 service.getDetails(request1, function (place, status) {                     
                      
                      showResults(place);                      
                });              
            }        
          }
        }
    }

  $('#search-form').submit(function(event){
    event.preventDefault();
    var searchTerm = $('#query').val();
    initialize(searchTerm);        
    
  
  });
    


function showResults(place)
{
  var html = "";    
  var display = "";
 
  
  console.log(place);

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
          
          console.log(fruits);

          html = html + "<li><p>" +    name.value   + "</p></li>";

          resultList = resultList + html;  
          $('#search-results ul').html(resultList);       
    }    
}
  
  function showError(error){    
    $('#error').html('<p>'+ error + '<p>');
  }
  
  });
  
  