const newTodoBtn = document.getElementById('newTodo');
const searchBar = document.getElementById('search');
const todoList = document.querySelector('.todoList');
const searchForm = document.getElementById('searchForm');
const newTodoForm = document.getElementById('newTodoForm');
const newTitle = document.getElementById('title');
const newDescription = document.getElementById('description');


const ids = [];
const completeds = [];
const baseUrl = 'http://13.55.238.167:83/api/tasks';

getTodoList(baseUrl);

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchedTitle = searchBar.value;
    const url = baseUrl + '?title=' + searchedTitle;
    getTodoList(url);
})

newTodoBtn.addEventListener('click', () => {
    newTodoForm.classList.add('show');
})

newTodoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = newTitle.value;
    const description = newDescription.value;
    const data = { title: title, description: description };
    postTodo(data);
    newTodoForm.classList.remove('show');
})


//axios
//http://localhost:PORT/api/tasks
async function getTodoList(url) {
    console.log('getTodoList');
    try {
        const response = await axios.get(url);
        const data = response.data;
        displayData(data);
        editSaveDelete();
    } catch (error) {
        console.log('getTodoList error:', error);
        //errorHandler();
    }
}
//http://localhost:PORT/api/tasks
async function postTodo(data) {
    try {
        const response = await axios.post(baseUrl, data);
        getTodoList(baseUrl);
    } catch (error) {
        console.log(error);
        //errorHandler();
    }
}
//http://localhost:PORT/api/tasks/64fac5c0b5fae705ee99d966
async function updateTodo(url, data) {
    try {
        console.log(url);
        console.log(data);
        const response = await axios.put(url, data);
        getTodoList(baseUrl);
    } catch (error) {
        console.log(error);
        //errorHandler();
    }
}
//http://localhost:PORT/api/tasks/64fac5c0b5fae705ee99d966
async function deleteTodo(url) {
    try {
        console.log('delete todo');
        const response = await axios.delete(url);
        getTodoList(baseUrl);
    } catch (error) {
        console.log(error);
        //errorHandler();
    }
}


//utils
function displayData(data) {
    let liForm = "";
    const list = data.map((todo, index) => {
        ids[index] = todo._id;
        completeds[index] = todo.completed;
        const createdAt = todo.createdAt;
        const UTCtoLocal = new Date(createdAt);
        console.log(UTCtoLocal);
        const month = UTCtoLocal.getMonth() + 1;
        const day = UTCtoLocal.getDate();
        liForm = `<form>
                        <input type="text" class="listTitle" value="${todo.title}" disabled><br>
                        <input type="text" class="listDescription" value="${todo.description}" disabled>
                        <input type="submit" class="save" value="Save">
                    </form>`;

        return `<li>
                    <div class="dateNform" title="Click to toggle the status">
                        <div class="date">${day}/${month}</div>
                        ${liForm}
                    </div>
                    <div>
                        <button class="edit">Edit</button>
                        <button class="delete">—</button>
                    </div>
                </li>`
    }).join("");
    todoList.innerHTML = list;
    const listTitles = document.querySelectorAll('.listTitle');
    listTitles.forEach((title, index) => {
        if (completeds[index]) {
            title.classList.add('completed');
        }
    })
    const listDescriptions = document.querySelectorAll('.listDescription');
    listDescriptions.forEach((descriptions, index) => {
        if (!descriptions.value) {
            descriptions.style.display = "none";
        }
    })
}
function editSaveDelete() {
    const dates = document.querySelectorAll('.date');
    const forms = document.querySelectorAll('.todoList li form');
    const listTitles = document.querySelectorAll('.listTitle');
    const listDescriptions = document.querySelectorAll('.listDescription');
    const editBtns = document.querySelectorAll('.edit');
    const saveBtns = document.querySelectorAll('.save');
    const deleteBtns = document.querySelectorAll('.delete');

    editBtns.forEach((editBtn, index) => {
        editBtn.classList.add('show');
        editBtn.addEventListener('click', (e) => {
            editBtn.classList.remove('show');
            saveBtns[index].classList.add('show');
            listTitles[index].removeAttribute('disabled');
            listTitles[index].focus();
            listDescriptions[index].removeAttribute('disabled');
            listDescriptions[index].style.display = "block";
            listDescriptions[index].focus();

            forms[index].addEventListener('submit', () => {
                e.preventDefault();
                editBtn.classList.add('show');
                saveBtns[index].classList.remove('show');
                console.log(ids[index]);
                console.log(index);
                const url = baseUrl + "/" + ids[index];
                const data = {
                    title: listTitles[index].value,
                    description: listDescriptions[index].value
                };
                updateTodo(url, data);
            })
        })
    })

    deleteBtns.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener('click', () => {
            const url = baseUrl + "/" + ids[index];
            const confirmed = confirm('Are you sure to delete this item?');
            if (confirmed) {
                deleteTodo(url);
                getTodoList(baseUrl);
            }
        })
    })

    dates.forEach((date, index) => {
        toggleComplete(date, index);
    })
    // listTitles.forEach((title,index)=>{
    //     toggleComplete(title, index);
    // })
}
function toggleComplete(item, index) {
    item.addEventListener('click', () => {
        console.log('clicked');
        completeds[index] = !completeds[index];
        console.log(completeds[index]);
        const data = { completed: completeds[index] };
        const url = baseUrl + "/" + ids[index];
        updateTodo(url, data);
        getTodoList(baseUrl);
    })
}
function errorHandler() {
    weatherData.querySelector('.icon').innerHTML = '';
    weatherData.querySelector('.temperature').textContent = '';
    weatherData.querySelector('.description').textContent = 'An error occurred, please try again later';
    weatherData.querySelector('.details').innerHTML = '';
}