const quoteTag = document.querySelector('.quote');
const authorTag = document.querySelector('.author');

//I'll build a function that goes and get the Quote

async function setBackgroundText() {

  const response = await fetch("https://type.fit/api/quotes");

  const data = await response.json();


  let random = Math.floor(Math.random() * 1000)
  console.log(data[random].text);
  console.log(data[random].author);
  quoteTag.textContent = data[random].text;
  document.querySelectorAll('[data-type]').forEach(draw);
  await wait(7000);
  authorTag.textContent = data[random].author;


}

setBackgroundText()


function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


async function draw(element) {
  let index = 1;
  const text = element.textContent;
  const { typeMin, typeMax } = element.dataset;

  async function drawLetter() {
    element.textContent = text.slice(0, index);
    index += 1;
    const amountOfTimeToWait = 42;
    await wait(amountOfTimeToWait);
    if(index <= text.length) {
      drawLetter();
      //wait for someTime...outside if statement
    }
  }
  //when this function draw() runs, kick off DrawLetter
  drawLetter();
}

document.querySelectorAll('[data-type]').forEach(draw);

// console.log('working');

const inputForm = document.querySelector('.inputForm');
const taskWrapper = document.querySelector('.task-wrapper');

const markAll = document.querySelector('.markAll');
const clearAll = document.querySelector('.clearAll');

const allS = document.querySelector('.allS');
const uncompeleteS = document.querySelector('.uncompeleteS');
const compeletedS = document.querySelector('.compeletedS');


//DS to store Display different Data
let taskList = [];
let unTaskList = [];
let doneTaskList = [];

function handleSubmit(event) {
  event.preventDefault();
  console.log(event.target['text-input'].value);
  const taskName = event.target['text-input'].value;


  if(!taskName) return;

  const singlrTask = {
    name: taskName,
    compelete: false,
    id: Date.now(), //to make it unique everyTime
  }
  console.log(taskName);
  taskList.push(singlrTask);
  event.target.reset();

  //Creating custom event and listening it on the taskWraper(list)
  taskWrapper.dispatchEvent(new CustomEvent('taskListUpdated'))

}

function displayTasks() {
  const html = taskList.map(item => {
    return `
    <br>
    <li class="task-display box">
     <input class="check-box" type="checkbox" value="${item.id}" ${item.compelete ? 'checked' : ''}>
      <div class="task-text">${item.name}</div>
     <button class="deleteButton" type="button" value="${item.id}">DEL</button>
   </li>
   <br>
    `;
  }).join('');//as it returns arry of string

  taskWrapper.innerHTML = html;
  console.log(taskWrapper);
}

function displayUndoneTasks() {
  const html = unTaskList.map(item => {
    return `
    <br>
    <li class="task-display box">
     <input class="check-box" type="checkbox" value="${item.id}" ${item.compelete ? 'checked' : ''}>
      <div class="task-text">${item.name}</div>
     <button class="deleteButton" type="button" value="${item.id}">DEL</button>
   </li>
   <br>
    `;
  }).join('');

  taskWrapper.innerHTML = html;
  console.log(taskWrapper);
}

function displayDoneTasks() {
  const html = doneTaskList.map(item => {
    return `
    <br>
    <li class="task-display box">
     <input class="check-box" type="checkbox" value="${item.id}" ${item.compelete ? 'checked' : ''}>
      <div class="task-text">${item.name}</div>
     <button class="deleteButton" type="button" value="${item.id}">DEL</button>
   </li>
   <br>
    `;
  }).join('');

  taskWrapper.innerHTML = html;
  console.log(taskWrapper);
}

//Way to store information on the users web (refresh won't evaporate the data)
function transferInLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(taskList))
}

function transferbackFromLocalStorage() {
  const lsItems =JSON.parse(localStorage.getItem('tasks'));
  if(lsItems.length) {
    taskList.push(...lsItems);
    taskWrapper.dispatchEvent(new CustomEvent('taskListUpdated'))
  }
}
inputForm.addEventListener('submit', handleSubmit);

function completdTask(id) {
  const taskRef = taskList.find(item => item.id === id);
  console.log(taskRef);
  taskRef.compelete = (!(taskRef.compelete));
  taskWrapper.dispatchEvent(new CustomEvent('taskListUpdated'))
}

function deleteTask(id) {
  taskList = taskList.filter(item => item.id !== id);
  taskWrapper.dispatchEvent(new CustomEvent('taskListUpdated'));
}


taskWrapper.addEventListener('taskListUpdated', displayTasks);
taskWrapper.addEventListener('taskListUpdated', transferInLocalStorage);

taskWrapper.addEventListener('click', function(event) {
  const id = parseInt(event.target.value);

  if(event.target.matches('button')) {
    deleteTask(id);
  }

  if (event.target.matches('input[class="check-box"]')) {
    completdTask(id)
  }
})


markAll.addEventListener('click', function() {
  console.log('here');
  taskList.forEach(element => {
    element.compelete = true;
  })
  taskWrapper.dispatchEvent(new CustomEvent('taskListUpdated'));
});


clearAll.addEventListener('click', function(event){
  taskList = [];
  taskWrapper.dispatchEvent(new CustomEvent('taskListUpdated'));
});


allS.addEventListener('click' , function(event) {
  displayTasks();
});

uncompeleteS.addEventListener('click' , function(event) {
  taskList.forEach(element => {
    if(!element.compelete){
      unTaskList.push(element)
    }
  });

  displayUndoneTasks();
  unTaskList =[];
});

compeletedS.addEventListener('click' , function(event) {
  taskList.forEach(element => {
    if(element.compelete){
      doneTaskList.push(element)
    }
  });
  displayDoneTasks();
  doneTaskList =[];
});

transferbackFromLocalStorage();
