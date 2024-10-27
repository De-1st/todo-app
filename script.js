// First will declare all the declarations with the help of document object, the document object represents the owner of all other objects on your web page.

const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

todoValue.addEventListener('keypress', function (e){
  if (e.key === 'Enter') {
    addUpdate.click();
  }
});

// Next will declare the localstorage object with the help of key:todo-list.

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

//Next will add the functions for CREATE, READ, UPDATE & DELETE

//This below function will help to CREATE new tasks into the list and some additional features:

function CreateToDoItems() {
  if (todoValue.value === "") {
    todoAlert.innerText = "Please enter your todo text!";
    todoValue.focus();
  } else {
    let IsPresent = false;
    todo.forEach((element) => {
      if (element.item == todoValue.value) {
        IsPresent = true;
      }
    });

    if (IsPresent) {
      setAlertMessage("This item already present in the list!");
      return;
    }

    let li = document.createElement("li");
    const todoItems = `<div title="Double-click To Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div><div>
                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/img/pen-solid.svg" />
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/img/trash-can-solid.svg" /></div></div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);

    if (!todo) {
      todo = [];
    }
    let itemList = { item: todoValue.value, status: false };
    todo.push(itemList);
    setLocalStorage();

    todoValue.value = "";
    setAlertMessage("Todo item Created Successfully!");
  }
  
}

//This below function helps us to READ data from localstorage and display in the todo list some additional features:

function ReadToDoItems() {
  todo.forEach((element) => {
    let li = document.createElement("li");
    let style = "";
    if (element.status) {
      style = "style='text-decoration: line-through; color: red;'";
    }
    const todoItems = `<div ${style} title="Double-click To Complete" ondblclick="CompletedToDoItems(this)">${
      element.item
    }
    ${
      style === ""
        ? ""
        : '<img class="todo-controls" src="/img/check-solid.svg" style="background: limegreen; border-radius: 15px;" />'
    }</div><div>
    ${
      style === ""
        ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/img/pen-solid.svg" />'
        : ""
    }
    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/img/trash-can-solid.svg" /></div></div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}
ReadToDoItems();

//This below function will help to UPDATE the task added by the user into the same list with some additional features:

function UpdateToDoItems(e) {
  if (
    e.parentElement.parentElement.querySelector("div").style.textDecoration ===
    ""
  ) {
    todoValue.value =
      e.parentElement.parentElement.querySelector("div").innerText;
    updateText = e.parentElement.parentElement.querySelector("div");
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "/img/arrows-rotate-solid.svg");
    todoValue.focus();
  }
}

// This below function will help to UPDATE the task added by the user into the same list with some additional features:

function UpdateOnSelectionItems() {
  let IsPresent = false;
  todo.forEach((element) => {
    if (element.item == todoValue.value) {
      IsPresent = true;
    }
  });

  if (IsPresent) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item == updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "/img/circle-plus.svg");
  todoValue.value = "";
  setAlertMessage("Todo item Updated Successfully!");
}

//This below function helps to DELETE a task data from the list as well as localstorage with some additional features:

function DeleteToDoItems(e) {
  let deleteValue =
    e.parentElement.parentElement.querySelector("div").innerText;

  if (confirm(`Are you sure? Do you want to delete "${deleteValue}"!`)) {
    e.parentElement.parentElement.setAttribute("class", "deleted-item");
    todoValue.focus();

    todo.forEach((element) => {
      if (element.item == deleteValue.trim()) {
        todo.splice(element, 1);
      }
    });

    setTimeout(() => {
      e.parentElement.parentElement.remove();
    }, 1000);

    setLocalStorage();
  }
}

//This below function helps to change the status of the task if it’s COMPLETE ✔ or not with some additional features:

function CompletedToDoItems(e) {
  if (e.parentElement.querySelector("div").style.textDecoration === "") {
    const img = document.createElement("img");
    img.src = "/img/check-solid.svg";
    img.style = "background: limegreen; border-radius: 15px;";
    img.className = "todo-controls";
    e.parentElement.querySelector("div").style.textDecoration = "line-through";
    e.parentElement.querySelector("div").style.color = "red";
    e.parentElement.querySelector("div").appendChild(img);
    e.parentElement.querySelector("img.edit").remove();

    todo.forEach((element) => {
      if (
        e.parentElement.querySelector("div").innerText.trim() == element.item
      ) {
        element.status = true;
      }
    });
    setLocalStorage();
    setAlertMessage("Todo item Completed Successfully!");
  }
}

//This below function will help to set localstorage item, i have segregated this as separate function and invoked this on CREATE, UPDATE and DELETE functions, with the help of this we are not using same code at multiple places.

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

//This below function will help to set the alert messages based on user activity in the app, based on user function call will send and reserve messages into the parameter, will set the alert into an HTML element with the help of innerText.

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}