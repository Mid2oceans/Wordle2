const tileDisplay = document.querySelector('.tile-container');
const messageDisplay = document.querySelector('.message-container')
const keybaord = document.querySelector('.key-container');

let wordle = "SUPER";



// fetch('http://localhost:8000/answer123')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data)
//     setWordle(data['hashWord'])
//   }
//     );

// const setWordle = (word) =>{
//     wordle = word
// }

console.log(wordle)
// wordle = fetchedData

// const getWordle = () =>{
    
// }
let tempWord = wordle
let allCorrect = true
let messageActive = false
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '⌫'
        ]




const guessRows = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
]

let currentRow = 0;
let currentTile=0;
let word = "";
guessRows.forEach((guessRow,guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id',"guessRow-"+guessRowIndex)
    guessRow.forEach((guess,guessIndex)=>{
        const tile = document.createElement('div');
        tile.setAttribute('id',"guessRow-"+guessRowIndex+"-tile-"+guessIndex);
        tile.classList.add('tile');
        rowElement.append(tile);
    })

    tileDisplay.append(rowElement);
    
});


// For each key in the array
keys.forEach(key =>{
    // create a button 
    const buttonElement = document.createElement('button')
    // make the text content of the button the key
    buttonElement.textContent = key;
    // set the id so we can use it later
    buttonElement.setAttribute('id',key)
    // add an event listener to the function 
    buttonElement.addEventListener('click',() => handleClick(key))
    //append it to the keyboard container
    keybaord.append(buttonElement)
})


const handleClick = (key) => {
    if(key == "ENTER"){
        enter()
    }
    else if(key == "⌫"){
        backspace()
    }
    else{

    addLetter(key)
    }
} 

const addLetter = (letter) =>{
    if(currentTile < 5){
        const tile = document.getElementById("guessRow-"+currentRow+"-tile-"+currentTile)
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter
        currentTile = currentTile+1
        tile.setAttribute('data',letter)
        //This will add letter to the current word
        word = word+letter;
    }
}

const backspace =() =>{
    if(word.length >0){
        //do minus first because currently we moved to the next block
        currentTile--;
        const tile = document.getElementById("guessRow-"+currentRow+"-tile-"+currentTile)
        tile.textContent = '';
        word = word.slice(0,-1);
        
    }
}

const enter = () =>{
    if(word.length ==5){
        checkAnswer();
        if(allCorrect == false){
            notAllCorrect()
        }
        else{
            setTimeout(()=>{
                showMessage("Magnificent!")
            }, 500* 5)
            
        }
    }
    else if(word.length < 5){
        showMessage("Too Short!")
    }
    else{
        //Maybe make them shake 
    }


}

const checkAnswer = () =>{
    // const row = document.getElementById("guessRow-"+currentRow)
    row = guessRows[currentRow]
    allCorrect = true
    for (let i =0; i<5; i++){
        if (wordle[i] != guessRows[currentRow][i]){
            allCorrect = false
        }
    }
    tempWord = wordle

    row.forEach((answerLetter,letterIndex) => {
        const tile = document.getElementById("guessRow-"+currentRow+"-tile-"+letterIndex)
        let letter = tile.getAttribute("data")
        let correctLetter = tempWord[letterIndex]
        const keyButton = document.getElementById(letter)


        setTimeout(()=>{
            // console.log(correctLetter,letter,letterIndex,tempWord,wordle,word)
            tile.classList.add('flip')
            if(correctLetter == letter){
    
                console.log("correct",letter);
                tile.classList.add('correct')
                tempWord = tempWord.replace(correctLetter,'*')
                keyButton.classList.add('correctButton')
            }
            else if(tempWord.includes(letter)){
                
                if(letterIndex < 4 && row.slice(letterIndex+1).includes(letter)){
                    console.log("its in but later too",letter)
                    tile.classList.add('incorrect')
                }
                else{
                    console.log("its in",letter)
                    tile.classList.add('inside')
                }
                
                
            }
            else{
    
                console.log('wrong',letter)
                if(!wordle.includes(letter)){
                    keyButton.classList.add('incorrectButton')
                }
                tile.classList.add('incorrect')
                
                
            }
    
            
        }, 500* letterIndex)

        })


    
}

const showMessage = (message) =>{
    if(message == "Magnificent!"){
        //if there is a message but it is not the winning one
        if (messageActive == true && messageElement.textContent != "Magnificent!"  ){
            const messageElement = document.createElement('p')
            messageElement.textContent = message
            messageDisplay.append(messageElement)
            messageActive = true;

        }
        if (messageActive == false){
            const messageElement = document.createElement('p')
            messageElement.textContent = message
            messageDisplay.append(messageElement)
            messageActive = true;
        }
        

    }
    else if(messageActive == false){
        const messageElement = document.createElement('p')
        messageElement.textContent = message
        messageDisplay.append(messageElement)
        messageActive = true;
        setTimeout(()=>{
            messageActive =false
            messageDisplay.removeChild(messageElement)
        }, 500* 4)
    }

        

}

const notAllCorrect = () =>{

    if(currentRow < 6){
        currentRow++
        currentTile = 0
        word=""
        tempWord = wordle
        
    }
}