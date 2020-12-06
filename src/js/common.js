const input = document.querySelector('#todo-in')
const btn = document.querySelector('.btn')
const form = document.querySelector('.form-inline')
const todoUl = document.querySelector('.list-group')

const todoItems = JSON.parse(localStorage.getItem('todoList')) || []

displayTodoList()

form.addEventListener('submit', getTodo)

function getTodo(e){
    e.preventDefault()
    let todo = input.value
    let lastId = todoItems.length
    const todoHtml = `<li class="list-group-item">${todo} <span class="badge">${lastId + 1}</span></li>`
    
    todoUl.insertAdjacentHTML('beforeend', todoHtml)
    input.value = ''

    saveTodo(todo)
}

function saveTodo(todo){
    let id = todoItems.length
    let todoItem = {id: id,todo: todo}
    todoItems.push(todoItem)

    localStorage.setItem('todoList',JSON.stringify(todoItems))
}

function displayTodoList(){
    if(todoItems.length > 0){
        const list = todoItems.map((item) => {
            return `<li class="list-group-item">${item.todo} <span class="badge">${item.id + 1}</span></li>`
        }).join('')
        todoUl.insertAdjacentHTML('afterbegin', list)
    } else return
}