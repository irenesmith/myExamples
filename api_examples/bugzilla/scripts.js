var email_address = "ismith@mozilla.com";
var bugzillaApi = "https://bugzilla.mozilla.org/rest/bug?assigned_to=" + email_address;
var urlGhibliapi = 'https://ghibliapi.herokuapp.com/films';

var request = new XMLHttpRequest();

/* function getMovies() {
  request.open('GET', urlGhibliapi, true);
  request.onload = function () {
  
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
  
    if (request.status >= 200 && request.status < 400) {
      data.forEach(movie => {
        console.log(movie.title);
      });
    } else {
      console.log('error');
    }
  }  
}
 */

function getBugs() {
  request.open('GET', bugzillaApi, true);
  request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      data.bugs.forEach(bug => {
        console.log(bug.summary);
      });
    } else {
      console.log('error');
    }
  }
}

getBugs();
request.send();