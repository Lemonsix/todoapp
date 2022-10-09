document.addEventListener('click',(e)=>{
    if (e.target.classList.contains("edit-me")){
        let userInput = prompt('Enter your desired new text',e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput){ //si userInput tiene algo entonces ejecuta el axios para modificar el text
        axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(()=>{ //funcion de tipo try catch
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput // actualiza el texto editado en tiempo real
        }).catch(()=>{ // si la funcion falla ejecuta el catch
            console.log("proba despues")
        })
    }
    }
})