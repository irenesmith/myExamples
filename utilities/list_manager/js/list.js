var listItems = [];

window.addEventListener('load', (e) => {
  document.getElementById('addButton').addEventListener('click', addClick);
})

function addClick() {
  let newItem = document.getElementById('newItem');
  if(newItem.value === '') {
    return;
  }

  // Add the new item to the list
  let newTask = new Task(Date.now(), false, newItem.value);
  listItems.push(newTask);
  console.log(listItems);

  let newRow = createRow(newTask);
  document.getElementById('list').appendChild(newRow);

  // Update the UI
  newItem.value = '';

}

function createRow(task) {
  let newRow = document.createElement('tr');
  newRow.id = task.id;

  let isDone = document.createElement('input');
  isDone.type = 'checkbox';
  isDone.value = task.done;

  let col1 = document.createElement('td');
  col1.appendChild(isDone);

  let col2 = document.createElement('td');
  col2.innerText = task.title;

  newRow.appendChild(col1);
  newRow.appendChild(col2);

  return newRow;
}

class Task {
  constructor(id, done, title) {
    this.id = id;
    this.done = done;
    this.title = title;
  }
}