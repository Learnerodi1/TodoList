const form = document.querySelector("#todoForm")
const saveBtn = document.querySelector("#save")
const input = document.querySelector("#input")
const showBtn = document.querySelector(".showBtn")
const clearBtn = document.querySelector(".clearBtn")
const hideBtn = document.querySelector(".hideBtn")
const ul = document.querySelector("section > ul")
const li = document.querySelector("li")
const alertMsg = document.querySelector(".alert")
const audio =  document.querySelectorAll("audio")
const audio1 = audio[0]
const audio2 = audio[1]

// Functions
// ALERTMESSAGE
function Alert_message(msg, msgType) {
    alertMsg.textContent = msg
    alertMsg.classList.add(`alert-${msgType}`)
    setTimeout(()=>{
        alertMsg.classList.remove(`alert-${msgType}`)
        input.style.outline = "none"
        input.classList.remove("active")
    }, 2000)
    if(msgType == "sucess"){
        audio1.currentTime = 0
        audio1.play()
    }
    else{
        audio2.currentTime = 0
        audio2.play()
    }
}
// Alert_message("Item added sucessfully", "danger")
// ADD ITEM FUNCTION

function addItem(e){
    let id = Date.now() ;//Gives you date in miliseconds
    e.preventDefault()
    const valueOfInput = input.value
    if(valueOfInput){
        if (valueOfInput.trim()&& !editFlag){
            createListItem(id, valueOfInput);
            addToLocalStorage(id,valueOfInput);
            Alert_message("You've successfully added a Task ","sucess")
            setBackToDefault()
        }
        else if(valueOfInput && editFlag){
            editElement.textContent = valueOfInput
            editLocalStorage(editId, valueOfInput)
            Alert_message("You've successfully edited the Task ","sucess")
            // alert(editId)
            // alert(valueOfInput)
            setBackToDefault()
        }
        else{
            Alert_message("Input should not be an empty space","danger")
            input.classList.add("active")
            input.style.outline = "1px solid red"
        }
    }
    else{
        Alert_message("Please Enter a task","danger")
        input.classList.add("active")
        input.style.outline = "1px solid red"
    }
    // console.log(id)
}
function createListItem(id, valueOfInput){
    const listItem = document.createElement("li")
    const customId = document.createAttribute("data-Id")
    customId.value = id
    listItem.setAttributeNode(customId)
    listItem.innerHTML =`<span>${valueOfInput}</span>
    <div class="bottonContainer">
    <button class="editBtn" type="button"><i class="fa fa-edit"></i></button>
    <button class="deleteBtn" type="button"><i class="fa fa-trash"></i></button>
    </div>
    `
    listItem.setAttribute("title",`${valueOfInput}`)
    ul.appendChild(listItem)
    const deleteBtn = document.querySelectorAll(".deleteBtn")
    const editBtn = document.querySelectorAll(".editBtn")
    editBtn.forEach((btn)=>{
        btn.addEventListener("click", editItem)
    }) 
    deleteBtn.forEach((btn)=>{
        btn.addEventListener("click", deleteItem)
        
    })
    console.table(listItem.outerHTML)
}
let editElement;
let editId;
let editFlag = false;
console.log(editElement)
function editItem(event) {
    // const element = event.currentTarget.parentElement.parentElement
    
    editFlag = true
    saveBtn.value = "Edit"
    const element = event.currentTarget.closest("li");
    editElement = element.firstElementChild
    input.value = editElement.textContent.trim()
    editId = parseInt(element.dataset.id)
    // element.textContent = element.textContent.trim()
    // editElement = event.currentTarget.parentElement.parentElement.firstChild
    console.log(editElement)
    // console.log(editElement.childNodes[0])
    // element.textContent
    // console.log(element.dataset.id)
    // editLocalStorage()
}
// editItem()
function setBackToDefault(){
    input.value = ""
    saveBtn.value = "Save"
    editFlag = false
    editId = null
}
function clearItems(){
    // for(const child of ul.children){
    //     ul.removeChild()
    // }
    while(ul.firstElementChild){
        ul.removeChild(ul.firstElementChild)
    }
    console.log(ul.children)
    localStorage.setItem("todoList", [])
}
clearBtn.addEventListener("click", clearItems)
function deleteItem(e) {
    const element = e.currentTarget.closest("li") 
    listId = parseInt(element.dataset.id)
    ul.removeChild(element)
    console.log(listId)
    if(ul.children.length == 0){
        Alert_message("list Emptied","sucess")
    }
    else{
        Alert_message("item removed", "sucess")
    }
    setBackToDefault()
    
    // console.log( element.firstElementChild.textContent, element.dataset.id)
    deleteFromItemLocalStorage(listId)
}
function deleteFromItemLocalStorage(id){
    let listItemArray = getInLocalStorage()
    listItemArray = listItemArray.filter((item)=>{
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem("todoList",JSON.stringify(listItemArray))
}
function addToLocalStorage(id, valueOfInput){
    const listItemObject = {
        id:id,
        value: valueOfInput.trim()
    }
    let listItemArray = getInLocalStorage()
    // console.log(getInLocalStorage())
    listItemArray.push(listItemObject)
    localStorage.setItem("todoList", JSON.stringify(listItemArray));
}
function editLocalStorage(id,valueOfInput){
    let listItemArray = getInLocalStorage()
    let result = listItemArray.map((item)=>{
        if (item.id === id){
            item.value = valueOfInput
        }
        console.log(item)
        return item
    })
    localStorage.setItem("todoList",JSON.stringify(result))
    // console.log(result)
}
// editLocalStorage(3 ,"correction")

function getInLocalStorage(){
    return localStorage.getItem("todoList") ?  JSON.parse(localStorage.getItem("todoList")) :  []
}
function setUpItems (){
    let listItemArray = getInLocalStorage()
    if (listItemArray.length > 0 ){
        listItemArray.forEach((listItem)=>{
            createListItem(listItem.id, listItem.value)
            console.log(listItem)
        })} 
    }
    
    // setUpItems()
    
    
    // Events
form.addEventListener("submit", addItem)
window.addEventListener("load", setUpItems)

hideBtn.addEventListener("click",hideItems)
function hideItems(){
    if(ul.children.length > 0){
        hideBtn.classList.add("active","disapperBtn")
        showBtn.classList.remove("disapperBtn")
        ul.style.height = "fit-content"
        ul.classList.add("hide")
    }
}
showBtn.addEventListener("click",showItems)
function showItems(){
    if(ul.children.length > 0){
        hideBtn.classList.remove("active","disapperBtn")
        showBtn.classList.add("disapperBtn")
        ul.classList.remove("hide")
    }
}

document.querySelector("#clear").addEventListener("click",()=>{
    localStorage.clear()
})
