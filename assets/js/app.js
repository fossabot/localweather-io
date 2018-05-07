(function () {
  const app = {
    cacheTimeKey: 'cacheTime',
    cacheTimeSpan: 600, // 10 minutes (number of minutes * 60 seconds)
    errorMessageSelector: '.error-message',
    hideClassName: 'hidden',
    loadFromCache: false,
    loadingSpinnerSelector: '.loading-spinner',
    locationDataKey: 'locationData',
    locationName: 'loading...',
    weatherDataKey: 'weatherData',

    getBodyBgClass: () => {
      const hourNum = new Date().getHours();
      let bodyClass = 'night';

      if (hourNum >= 5 && hourNum <= 7) {
        bodyClass = 'morning';
      } else if (hourNum > 7 && hourNum <= 17) {
        bodyClass = 'day';
      } else if (hourNum > 17 && hourNum <= 20) {
        bodyClass = 'evening';
      }

      return bodyClass;
    },

    setBodyBgClass: () => {
      const bodyEl = document.querySelector('body');
      bodyEl.classList.add(app.getBodyBgClass());
    },

    showEl: (el) => {
      if (el !== 'undefined') {
        switch (typeof el) {
          case 'NodeList':
            Array.from(el).forEach(function (item) {
              // console.log('item: \n' + item);
              item.classList.remove(app.hideClassName);
            });
            break;
          case 'object':
            if (el.length) {
              Array.from(el).forEach(function (item) {
                // console.log('item: \n' + item);
                item.classList.remove(app.hideClassName);
              });
            } else {
              if (el.length !== 0) {
                el.classList.remove(app.hideClassName);
              }
            }
            break;
          case 'string':
            document.querySelector(el).classList.remove(app.hideClassName);
            break;
        }
      }
    },

    hideEl: (el) => {
      if (el !== 'undefined') {
        switch (typeof el) {
          case 'NodeList':
            Array.from(el).forEach(function (item) {
              // console.log('item: \n' + item);
              item.classList.add(app.hideClassName);
            });
            break;
          case 'object':
            if (el.length) {
              Array.from(el).forEach(function (item) {
                // console.log('item: \n' + item);
                item.classList.add(app.hideClassName);
              });
            } else {
              if (el.length !== 0) {
                el.classList.add(app.hideClassName);
              }
            }
            break;
          case 'string':
            document.querySelector(el).classList.add(app.hideClassName);
            break;
        }
      }
    },

    showLoading: () => {
      const loadingSpinner = document.querySelector(app.loadingSpinnerSelector);
      app.showEl(loadingSpinner);
      app.hideUi();
    },

    hideLoading: () => {
      const loadingSpinner = document.querySelector(app.loadingSpinnerSelector);
      app.hideEl(loadingSpinner);
      app.showUi();
    },

    hideUi: () => {
      const hrAll = document.querySelectorAll('hr');
      const poweredBy = document.querySelector('.powered-by-dark-sky');
      app.hideEl(hrAll);
      app.hideEl(poweredBy);
    },

    showUi: () => {
      const hrAll = document.querySelectorAll('hr');
      const poweredBy = document.querySelector('.powered-by-dark-sky');
      app.showEl(hrAll);
      app.showEl(poweredBy);
    },

    initTooltips: () => {
      tippy('.has-tooltip', {
        arrow: true,
        size: 'large',
        livePlacement: true,
        performance: true,
      });
    },

    populateLocation: (data) => {
      const locationArray = data.split(',');
      const city = locationArray[0].trim();
      const region = locationArray[1].trim();
      const country = locationArray[2].trim();
      const locationTemplate = `<h1 class="location">${city}, ${region} <small>${country}</small></h1>`;
      const locationEl = document.querySelector('.location');
      locationEl.innerHTML = locationTemplate;
    },

    populatePrimaryData: (data) => {
      const primaryDataTemplate = `
        <div class="col-xs-3 current-icon"><p><i class="wi wi-forecast-io-${data.currently.icon} has-tooltip" title="${data.currently.summary}"></i></p></div>
        <div class="col-xs-5 text-center current-conditions">
            <h2>${data.currently.summary}</h2>
        </div>
        <div class="col-xs-4 current-temp has-tooltip text-right" title="Feels like ${Math.floor(data.currently.apparentTemperature)}&deg;">
          <p class="primary-unit text-right">${Math.floor(data.currently.temperature)}&deg;</p>
        </div>
      `;
      const priamryDataEl = document.querySelector('.primary-conditions-data');
      priamryDataEl.innerHTML = primaryDataTemplate;
    },

    populateWeatherDataRowOne: (data) => {
      const weatherDataRowOneTemplate = `
      <div class="col-xs-4 text-center has-tooltip" title="Wind Speed">
        <p><i class="wi wi-wind wi-towards-${data.currently.windBearing}"></i> ${Math.round(data.currently.windSpeed)} mph</p>
      </div>
      <div class="col-xs-4 text-center has-tooltip" title="Humidity">
        <p><i class="wi wi-humidity"></i> ${Math.round(data.currently.humidity * 100)}%</p>
      </div>
      <div class="col-xs-4 text-center has-tooltip" title="Today's Sunrise">
        <p><i class="wi wi-sunrise"></i> ${app.formatUnixTimeForSun(data.daily.data[0].sunriseTime)} am</p>
      </div>
    `;
      const weatherDataRowOneEl = document.querySelector('.weather-data-row-1');
      weatherDataRowOneEl.innerHTML = weatherDataRowOneTemplate;
    },

    populateWeatherDataRowTwo: (data) => {
      const weatherDataRowTwoTemplate = `
      <div class="col-xs-4 text-center has-tooltip" title="Barometric Pressue">
        <p><i class="wi wi-barometer"></i> ${data.currently.pressure}in</i></p>
      </div>
      <div class="col-xs-4 text-center has-tooltip" title="Visibility">
        <p><i class="fa fa-eye"></i> ${data.currently.visibility} mi</p>
      </div>
      <div class="col-xs-4 text-center has-tooltip" title="Today's Sunset">
        <p><i class="wi wi-sunset"></i> ${app.formatUnixTimeForSun(data.daily.data[0].sunsetTime)} pm</p>
      </div>
    `;
      const weatherDataRowTwoEl = document.querySelector('.weather-data-row-2');
      weatherDataRowTwoEl.innerHTML = weatherDataRowTwoTemplate;
    },

    populateErrorMessage: (msg) => {
      const errorMessageTemplate = `
      <div class="alert alert-danger alert-dismissible error-message" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <span class="sr-only">Error:</span>
        <p>
          <span class="far fa-exclamation-circle" aria-hidden="true"></span> ${msg}
        </p>
      </div>
    `;
      const errorMessageEl = document.querySelector('.error-message');
      errorMessageEl.innerHTML = errorMessageTemplate;
    },

    populateForecastData: (data, numDays = 5) => {
      for (let i = 0; i < numDays; i++) {
        let forecastTemplate = `
        <p class="has-tooltip" title="${data.daily.data[i].summary}">
          <strong>${app.getDayFromUnixTime(data.daily.data[i].time)}</strong>
          <br>
          <i class="wi wi-forecast-io-${data.daily.data[i].icon}"></i>
          <br>
          ${Math.floor(data.daily.data[i].temperatureHigh)}&deg;/${Math.floor(data.daily.data[i].temperatureLow)}&deg;
        </p>
      `;
        let forecastEl = document.querySelector(`.forecast-${i}`);
        forecastEl.innerHTML = forecastTemplate;
      }
    },

    populateLastUpdated: (data) => {
      const lastUpdatedString = `
        Weather data cached at: ${app.formatUnixTimeAsLocalString(data.currently.time)}
        <br>
        Weather data is cached for 10 minutes.
        <br>
        Next data refresh available after: 
        ${app.formatUnixTimeAsLocalString(data.currently.time + app.cacheTimeSpan)} 
      `;
      const lastUpdatedTemplate = `
      <p class="last-updated has-tooltip" title="${lastUpdatedString}"> 
        Weather data last updated ${app.getTimeFromUnixTime(data.currently.time)}
      </p>
    `;
      const lastUpdatedEl = document.querySelector('.last-updated');
      lastUpdatedEl.innerHTML = lastUpdatedTemplate;
    },

    formatUnixTimeAsLocalString: (unixtime) => {
      const date = new Date(unixtime * 1000);
      // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
      return date.toLocaleString().replace(', ', ' '); // '5/6/2018 3:41:21 PM'
    },

    formatUnixTimeForSun: (unixtime) => {
      const hours = app.getHoursFromUnixTime(unixtime);
      const minutes = app.getMinutesFromUnixTime(unixtime);
      return `${hours}:${minutes}`;
    },

    getShortDateFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
      return date.toLocaleString().split(',')[0]; // returns '5/6/2018'
    },

    getTimeFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      // example date.toLocaleString() '5/6/2018, 3:41:21 PM'
      return date.toLocaleString().split(',')[1].trim(); // returns '3:41:21 PM'
    },

    getHoursFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      let hours = date.getHours();
      hours = hours > 12 ? hours - 12 : hours;
      return hours;
    },

    getMinutesFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      let minutes = date.getMinutes();
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return minutes;
    },

    getMonthFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      // example date.toDateSTring() 'Sun May 06 2018'
      return date.toDateString().split(' ')[1]; // returns 'May'
    },

    getDayFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      // example date.toDateSTring() 'Sun May 06 2018'
      return date.toDateString().split(' ')[0]; // returns 'Sun'
    },

    getYearFromUnixTime: (unixtime) => {
      const date = new Date(unixtime * 1000);
      return date.getFullYear();
    },

    useCache: (cacheTime) => {
      const now = Math.floor(new Date().getTime() / 1000);
      const nextUpdateTime = cacheTime + app.cacheTimeSpan;
      if (nextUpdateTime > now) {
        return true;
      } else {
        return false;
      }
    },

    areCachesEmpty: () => {
      return (
        (app.getData(app.cacheTimeKey) === null) ||
        (app.getData(app.weatherDataKey) === null) ||
        (app.getData(app.locationDataKey) === null)
      );
    },

    initCache: () => {
      if (app.areCachesEmpty()) {
        app.resetData();
        app.setCacheTime();
      } else {
        app.loadFromCache = app.useCache(app.getData(app.cacheTimeKey));
      }
      if (!app.loadFromCache) {
        app.resetData();
        app.setCacheTime();
      }
    },

    setCacheTime: () => {
      const cacheTime = Math.floor(new Date().getTime() / 1000);
      app.setData(app.cacheTimeKey, cacheTime);
      return cacheTime;
    },

    setData: (key, data) => {
      const dataToSet = JSON.stringify(data);
      localStorage.setItem(key, dataToSet);
    },

    getData: (key) => {
      const dataToGet = localStorage.getItem(key);
      return JSON.parse(dataToGet);
    },

    clearData: (key) => {
      localStorage.removeItem(key);
    },

    resetData: () => {
      localStorage.clear();
    },

    throwFetchError: (response) => {
      let errorMessage = `${response.status} ({response.statusText)`;
      let error = new Error(errorMessage);
      throw (error);
    },

    renderAppWithData: (data) => {
      app.populatePrimaryData(data);
      app.populateWeatherDataRowOne(data);
      app.populateWeatherDataRowTwo(data);
      app.populateForecastData(data);
      app.populateLastUpdated(data);
      app.populateLocation(app.locationName);
      app.initTooltips();
      app.hideLoading();
      return true;
    },

    getLocationNameFromLatLng: async (lat, lng) => {
      const url = `https://mikesprague-api.glitch.me/location-name/?lat=${lat}&lng=${lng}`;
      if (app.loadFromCache) {
        const cachedLocationData = app.getData(app.locationDataKey);
        app.locationName = cachedLocationData.results[0].formatted_address;
        return cachedLocationData.results[0].formatted_address;
      } else {
        const locationData = fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              app.throwFetchError(response);
            }
          })
          .then(json => {
            app.setData(app.locationDataKey, json);
            app.locationName = json.results[0].formatted_address;
            return json.results[0].formatted_address;
          })
          .catch(error => {
            console.error(`Error in getLocationNameFromLatLng:\n ${error.message}`);
          });
        return locationData;
      }
    },

    getWeather: async (lat, lng) => {
      const url = `https://mikesprague-api.glitch.me/weather/?lat=${lat}&lng=${lng}`;
      if (app.loadFromCache) {
        const cachedWeatherData = app.getData(app.weatherDataKey);
        return cachedWeatherData;
      } else {
        const weatherData = fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              app.throwFetchError(response);
            }
          })
          .then(json => {
            app.setData(app.weatherDataKey, json);
            return json;
          })
          .catch(error => {
            console.error(`Error in getWeather:\n ${error.message}`);
            app.hideLoading();
          });
        return weatherData;
      }
    },

    getLocationAndPopulateAppData: async () => {
      app.showLoading();
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          app.getLocationNameFromLatLng(
            position.coords.latitude,
            position.coords.longitude
          ).then(name => {
            app.locationName = name;
            app.getWeather(
              position.coords.latitude,
              position.coords.longitude
            ).then(json => {
              app.renderAppWithData(json);
            }).then(loaded => {
              if (loaded) {
                app.hideLoading();
              }
            });
          }).catch(error => {
            cosole.error(`ERROR: ${error}`);
          });
        });
      } else {
        console.error('ERROR: Your browser must support geolocation and you must approve sharing your location with the site for the app to work')
      }
    },

    init: () => {
      app.setBodyBgClass();
      app.initCache();
      app.getLocationAndPopulateAppData();
    }
  };

  document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
      app.init();
    }
  };
})();