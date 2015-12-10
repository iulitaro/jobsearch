function findKey(obj, value){
    var key;

    _.each(_.keys(obj), function(k){
      var v = obj[k];
      if (v === value){
        key = k;
      }
    });

    return key;
}

//API KEY
//AIzaSyB0yflWwoIPndExhWhoHKOC8pSYCeG_fF8