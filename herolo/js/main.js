jQuery(document).ready(function () {


  // Get location
  navigator.geolocation.getCurrentPosition(function (position) {
    jQuery.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyDH3DNrD-ZxoTRJ_3TMaT4rr2wrZLMwpj8", function (location) {
      var autoCityName = location.results[3].formatted_address;
      getWeather(autoCityName);
    });
  });
  // -----------------

  // weather API
  jQuery('.submitWeather').on('click', function () {
    var city = jQuery('#city').val();
    getWeather(city);
  });
  // -------------------




});//end document ready

//show weather 
function getWeather(city) {
  jQuery('.items-wrapper').html('');


  if (city != '') {
    jQuery('.error').html('');

    jQuery.ajax({
      url: 'http://api.apixu.com/v1/forecast.json?key=613d0ff3f3214e9a95a143729190405&q=' + city + '&days=7',
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data) {
          console.log(data);

          // Today data after selected
          var selectedCity = data.location.name;
          jQuery('.today-wrapper .selected-city').html(selectedCity);

          var currentTemp = parseInt(data.current.feelslike_c);
          jQuery('.today-wrapper .temperature').html(currentTemp + '&#176');

          var currentDescription = data.current.condition.text;
          jQuery('.today-wrapper .description').html(currentDescription);

          var days = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday'
          ];

          // --------

          for (var i = 1; i < data.forecast.forecastday.length; i++) {

            var day = days[new Date(data.forecast.forecastday[i].date).getDay()];
            var maxTemp = parseInt(data.forecast.forecastday[i].day.maxtemp_c);
            var minTemp = parseInt(data.forecast.forecastday[i].day.mintemp_c);
            var description = data.forecast.forecastday[i].day.condition.text;
            var code = data.forecast.forecastday[i].day.condition.code;
            var icon = '';

            if (code == 1000) {
              icon = 'sun.png';
            } else if (code == 1003 || code == 1006 || code == 1009 || code == 1030) {
              icon = 'cloudy.png';
            } else {
              icon = 'rain.png';
            };
            jQuery('.items-wrapper').append(
              ' <div class="weather-item">' +
              ' <div class="item-filter"></div> ' +
              ' <div class="content-box">' +
              '<h2 class="day">' + day + '</h2>' +
              '<img class="weather-pic" src="assets/' + icon + '" alt="">' +
              '<div class="temperature">' +
              ' <span class="max">' + maxTemp + '</span><span>&#176</span>/<span class="min">' + minTemp + '</span><span>&#176</span>' +
              ' </div>' +
              '<span class="description">' + description + '</span> ' +
              '</div>' +
              '</div>'
            );
          }

          // responsive
          if (jQuery(window).width() <= 1024) {
            var weatherItemHeight = jQuery('.weather-item').outerHeight(true);
            jQuery('.items-wrapper').height(weatherItemHeight * 3 + 60);
          }

          jQuery(window).resize(function () {
            if (jQuery(window).width() <= 1024) {
              weatherItemHeight = jQuery('.weather-item').outerHeight(true);
              jQuery('.items-wrapper').height(weatherItemHeight * 3 - 30);
            } else {
              jQuery('.items-wrapper').height('auto');
            }
          });

          if (jQuery(window).width() <= 1024) {
            jQuery('.next-btn').insertAfter('.content-wrapper');
          }


          //slider movement
          jQuery('.next-btn').on('click', function () {
            var wrapper = jQuery('.items-wrapper');
            var itemWidth = jQuery('.weather-item').outerWidth(true);
            var itemHeight = jQuery('.weather-item').outerHeight(true);
            if (wrapper.is(':animated')) {
              return false;
            } else {
              if (jQuery(window).width() >= 1024) {
                wrapper.animate({
                  right: itemWidth + 'px'
                }, 500, function () {
                  wrapper.append(wrapper.find('.weather-item').first());
                  wrapper.css('right', '0');
                });
              } else {
                wrapper.animate({
                  bottom: itemHeight + 'px'
                }, 500, function () {
                  wrapper.append(wrapper.find('.weather-item').first());
                  wrapper.css('bottom', '0');
                });

              }
            }
          });



        } else {
          jQuery('.error').html('Please insert a valid city name');
        };
      }
    });

  };

};