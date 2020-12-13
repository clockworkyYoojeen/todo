const input = document.querySelector('#todo-in')
const dateInput = document.querySelector('#todo-time')
const btn = document.querySelector('.btn')
const form = document.querySelector('.form-inline')
const todoUl = document.querySelector('.list-group')

let todoItems = JSON.parse(localStorage.getItem('todoList')) || []

displayTodoList()

form.addEventListener('submit', getTodo)
todoUl.addEventListener('click', deleteTodo)
todoUl.addEventListener('click', editTodo)
todoUl.addEventListener('click', doneTodo)
document.addEventListener('click', closeModal)
document.addEventListener('click', saveTodo)

function getTodo(e){
    e.preventDefault()
    let todo = input.value
    let todoTime = dateInput.value

    let timeInfo = timeHandler(todoTime)
    
    let lastId = todoItems.length
    const todoHtml = `<li class="list-group-item" data-id="${lastId}"><strong>${todo}</strong>  ${timeInfo}<span class="badge">mark it</span><span class="glyphicon glyphicon-edit"></span><span class="glyphicon glyphicon-remove"></span></li>`
    
    todoUl.insertAdjacentHTML('beforeend', todoHtml)
    input.value = ''
    dateInput.value = ''

    addTodo(todo, todoTime)
}

function timeHandler(timeStr){
    if(!timeStr) return `<span class="lazy">no date set</span>`
    let now = new Date
    let nowMls = now.getTime()

    let monthStr = now.getMonth() < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1) 
    let dateStr = now.getDate() < 10 ? '0' + now.getDate() : now.getDate() 
    let nowTimestr = now.getFullYear() + '-' + monthStr + '-' + dateStr

    let daysLeft
    let timeInfo
    if(nowTimestr === timeStr) 
        {
        daysLeft =  'Do it now!'

    }
    else{
        let millisec = Date.parse(timeStr)
        let mlsLeft = millisec - nowMls
        if(mlsLeft < 0){
            timeInfo = `<span class="deadline">Your time is over!</span>`
            return timeInfo 
        }
        daysLeft = Math.round(mlsLeft / (3600 * 1000 * 24))
    }
    timeInfo = daysLeft === 'Do it now!' ? `<span class="deadline">${daysLeft}</span>` : `<span class="lazy">${daysLeft} days left</span>`
    return timeInfo
}

function deleteTodo(e){
    let target = e.target
    if(target.classList.contains('glyphicon-remove')){
        let id = parseInt(target.parentNode.dataset.id)
        console.log(deleteItem(id))
        target.parentNode.remove()
    }
}

function addTodo(todo, todoTime = null){
    const now = new Date
    const id = now.getTime() 
    let todoItem = {id: id,todo: todo, time: todoTime, done: false}
    todoItems.push(todoItem)

    localStorage.setItem('todoList',JSON.stringify(todoItems))
}

function editTodo(e){
    let target = e.target
    console.log(target.parentNode.querySelector('strong'))
    if(target.classList.contains('glyphicon-edit')){
        let text = target.parentNode.querySelector('strong').innerText
        let id = target.parentNode.dataset.id
        createModal(text, id)
    }
}

function saveTodo(e){
    if(e.target.id === 'save'){
        const target = e.target
        const textarea = target.parentNode.previousElementSibling
        const text = textarea.value
        const id = parseInt(textarea.dataset.id)
        
        const edited = todoItems.map((item) => {
            if(item.id === id){
                item.todo = text
            }
            return item
        })
        localStorage.setItem('todoList', JSON.stringify(edited))
        closeModal()
    }    
}

function doneTodo(e){
    if(e.target.classList.contains('badge')){
        const target = e.target
        const id = parseInt(target.parentNode.dataset.id)
        target.parentNode.classList.toggle('done')

        const edited = todoItems.map((item) => {
            if(item.id === id){
                item.done = !item.done
            }
            return item
        })
        localStorage.setItem('todoList', JSON.stringify(edited))
    }
}
function createModal(todoText, id){
    let modalOuter = document.createElement('div')
    let modalInner = `<div class="modalInner">
    <textarea data-id=${id}>${todoText}</textarea>
    <div>
    <button class='btn btn-danger' id="cancel">Cancel</button>
    <button class='btn btn-success' id="save">Save</button>
    </div>
</div>`
    modalOuter.classList.add('modalOuter')
    
    document.body.appendChild(modalOuter)
    modalOuter.insertAdjacentHTML('afterbegin', modalInner)
    
    setTimeout(function(){
        modalOuter.classList.add('modalShow')
        // modalInner.classList.add('modalShow')
    },500)
}

function closeModal(e){
    if(e.target.classList.contains('modalOuter') || e.target.id === 'cancel' || e.target.id === 'save'){
        let modal = document.querySelector('.modalOuter')
        modal.classList.remove('modalShow')
        modal.remove()
    } else {
        return
    }
}
function deleteItem(id){   
    let todos = todoItems.filter((item) => {
       return item.id !== id
    })
    localStorage.setItem('todoList',JSON.stringify(todos))
    return todos
}



function displayTodoList(){
    if(todoItems.length > 0){
        const list = todoItems.map((item) => {
            let timeInfo = timeHandler(item.time)
            return `<li class="list-group-item ${item.done ? "done" : ""}" data-id="${item.id}"><strong>${item.todo}</strong> ${timeInfo}  <span class="badge">mark it</span><span class="glyphicon glyphicon-edit"></span><span class="glyphicon glyphicon-remove"></span></li>`
        }).join('')
        todoUl.insertAdjacentHTML('afterbegin', list)
    } else return
}