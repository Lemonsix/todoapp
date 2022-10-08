document.addEventListener('click',(event)=>{
    if (event.target.classList.contains("edit-me")){
        let userInput = prompt('Enter your desired new text')
        axios.post('/update-item',{text: userInput}).then(()=>{ //funcion de tipo try catch
            //hacer algo interesante aca
        }).catch(()=>{ // si la funcion falla ejecuta el catch
            console.log("proba despues")
        })
    }
})