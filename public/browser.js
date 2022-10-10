
function itemTemplate(item){ //para no repetir codigo se utiliza este html
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>`
}
//Carga inicial
let ourHTML = items.map((item)=>{ //recorre el array de items y los arma con el template
    return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)

// agregar items
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", e =>{
    e.preventDefault()
    axios.post("/create-item", { text: createField.value }).then((response) => {
          //create the html for the new item
          document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
          createField.value="" //limpia el field
          createField.focus() //pone focus en el field
        })
        .catch(() => {
          console.log("Please try again later.");
        });

})
document.addEventListener("click", e =>{
  //borrar items
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Confirmar borrado")) {
      axios.post("/delete-item", { id: e.target.getAttribute("data-id") })
        .then(() => {
          e.target.parentElement.parentElement.remove();
        })
        .catch(() => {
          console.log("Please try again later.");
        });
    }
  }
  //editar items
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
    if (userInput) {
        axios.post("/update-item", {text: userInput,id: e.target.getAttribute("data-id"),}).then(() =>{
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
        })
        .catch(() =>{
          console.log("Please try again later.");
        });
    }
  }
});
