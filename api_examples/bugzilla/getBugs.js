/*jshint esversion: 6 */

// TODO: If there is an email address in local
// storage, set the variable to that value.
var email_address = '';
var bugzillaApi = 'https://bugzilla.mozilla.org/rest/bug?assigned_to=';

var request = new XMLHttpRequest();
var bugs = [];

function getBugs() {
  if (email_address === '') {
    // If the value is not set, try to get it
    // from the form.
    email_address = document.forms[0].email.value;
    document.getElementById('legend').textContent += ' ' + email_address;
  }

  // By now, email_address should not be blank. Assign
  // add it to the URL.
  bugzillaApi += email_address;

  request.open('GET', bugzillaApi, true);
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    // If the call succeeded, insert the data into
    // the table with each bug in a row.
    if (request.status >= 200 && request.status < 400) {
      let bugTable = document.getElementById('bug-list');
      bugs = data.bugs;
      bugs.forEach(bug => {
        let row = makeRow(bug.id, bug.status, bug.summary);
        bugTable.appendChild(row);
      });
    } else {
      // eslint-disable-next-line no-console
      console.error('error loading resource');
    }
  };
  request.send();
  return false;
}

function makeRow(bugId, bugStatus, bugSummary) {
  // Create an empty row element.
  const newRow = document.createElement('tr');

  // Put the bug information into the cells
  const col1 = document.createElement('td');
  col1.textContent = bugId;
  const col2 = document.createElement('td');
  col2.textContent = bugStatus;
  const col3 = document.createElement('td');
  col3.textContent = bugSummary;

  // Add the cells to the new row
  newRow.appendChild(col1);
  newRow.appendChild(col2);
  newRow.appendChild(col3);

  return newRow;
}
