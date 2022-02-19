const tileDisplay = document.querySelector('.tile-container');
const messageDisplay = document.querySelector('.message-container');
const keybaord = document.querySelector('.key-container');
const popUpDisplay = document.querySelector('.popUp-container');



// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const analytics = getAnalytics(firebaseApp);

let wordle = "SUPER";
let scoreText =''
let shareUrl = ''


document.querySelector(".word-day").onclick = function(){
    console.log("pressed");
    document.location = "http://localhost:8000/word/helloWorld";    
};

document.querySelector(".challenge-friend").onclick = function(){
    console.log("clicked 2");
    document.location = "http://localhost:8000/word/byeWorld";    
};

fetch('http://localhost:8000/answer123')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        setWordle(data['hashWord'])
        console.log(wordle)
    }
    );

const setWordle = (word) => {
    console.log(word)
    if(word.length > 5){
        wordle = decryptWord(word).toUpperCase()
    }
    else{
        wordle = (word).toUpperCase()
    }
    
}

console.log(wordle)

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
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
]

let currentRow = 0;
let currentTile = 0;
let word = "";
guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', "guessRow-" + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tile = document.createElement('div');
        tile.setAttribute('id', "guessRow-" + guessRowIndex + "-tile-" + guessIndex);
        tile.classList.add('tile');
        rowElement.append(tile);
    })

    tileDisplay.append(rowElement);

});


// For each key in the array
keys.forEach(key => {
    // create a button 
    const buttonElement = document.createElement('button')
    // make the text content of the button the key
    buttonElement.textContent = key;
    // set the id so we can use it later
    buttonElement.setAttribute('id', key)
    // add an event listener to the function 
    buttonElement.addEventListener('click', () => handleClick(key))
    //append it to the keyboard container
    keybaord.append(buttonElement)
})


const handleClick = (key) => {
    if (key == "ENTER") {
        enter()
    }
    else if (key == "⌫") {
        backspace()
    }
    else {

        addLetter(key)
    }
}

const addLetter = (letter) => {
    if (currentTile < 5) {
        const tile = document.getElementById("guessRow-" + currentRow + "-tile-" + currentTile)
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter
        currentTile = currentTile + 1
        tile.setAttribute('data', letter)
        //This will add letter to the current word
        word = word + letter;
    }
}

const backspace = () => {
    if (word.length > 0) {
        //do minus first because currently we moved to the next block
        currentTile--;
        const tile = document.getElementById("guessRow-" + currentRow + "-tile-" + currentTile)
        tile.textContent = '';
        word = word.slice(0, -1);

    }
}

const enter = () => {
    if (word.length == 5) {
        checkAnswer();
        if (allCorrect == false) {
            notAllCorrect()
        }
        else {
            //This is where they press enter and they win
            
            setTimeout(() => {
                showMessage("Magnificent!")
            }, 500 * 5)

            setTimeout(() => {
                showPopUp()
            }, 500 *7)

        }
    }
    else if (word.length < 5) {
        showMessage("Too Short!")
    }
    else {
        //Maybe make them shake 
    }


}

const checkAnswer = () => {
    row = guessRows[currentRow]
    allCorrect = true
    for (let i = 0; i < 5; i++) {
        if (wordle[i] != guessRows[currentRow][i]) {
            allCorrect = false
        }
        else{
            
        }
        
    }
    scoreText+=('\n')
    tempWord = wordle

    row.forEach((answerLetter, letterIndex) => {
        const tile = document.getElementById("guessRow-" + currentRow + "-tile-" + letterIndex)
        let letter = tile.getAttribute("data")
        let correctLetter = tempWord[letterIndex]
        const keyButton = document.getElementById(letter)


        setTimeout(() => {
            tile.classList.add('flip')
            if (correctLetter == letter) {
                console.log("correct", letter);
                tile.classList.add('correct')
                tempWord = tempWord.replace(correctLetter, '*')
                keyButton.classList.add('correctButton')
                scoreText+=('🟩')
            }
            else if (tempWord.includes(letter)) {

                if (letterIndex < 4 && row.slice(letterIndex + 1).includes(letter)) {
                    console.log("its in but later too", letter)
                    tile.classList.add('incorrect')
                    scoreText +=('⬛')
                }
                else {
                    console.log("its in", letter)
                    tile.classList.add('inside')
                    scoreText+=('🟧')
                    
                    
                }


            }
            else {
                console.log('wrong', letter)
                if (!wordle.includes(letter)) {
                    keyButton.classList.add('incorrectButton')
                }
                tile.classList.add('incorrect')
                scoreText +=('⬛')


            }


        }, 500 * letterIndex)

    })



}

const showMessage = (message) => {
    if (message == "Magnificent!") {
        //if there is a message but it is not the winning one
        if (messageActive == true && messageElement.textContent != "Magnificent!") {
            const messageElement = document.createElement('p')
            messageElement.textContent = message
            messageDisplay.append(messageElement)
            messageActive = true;

        }
        if (messageActive == false) {
            const messageElement = document.createElement('p')
            messageElement.textContent = message
            messageDisplay.append(messageElement)
            messageActive = true;
        }


    }
    else if (messageActive == false) {
        const messageElement = document.createElement('p')
        messageElement.textContent = message
        messageDisplay.append(messageElement)
        messageActive = true;
        setTimeout(() => {
            messageActive = false
            messageDisplay.removeChild(messageElement)
        }, 500 * 4)
    }



}

const showPopUp = () => {
    //Create div for modal so you cannot touch screen
    const popUp = document.createElement('div')
    popUp.classList.add('modal')
    popUpDisplay.append(popUp)
    // create the inner modal div for all content
    const content = document.createElement('div')
    content.classList.add('popUp-content')
    popUp.append(content)
    //create Title
    const pText = document.createElement('p')
    pText.textContent = "Share With A Friend?"
    content.append(pText)
    //create div for input
    const inputContainer = document.createElement('div')
    inputContainer.classList.add('input-container')
    content.append(inputContainer)
    //create Input for word
    const inputWord = document.createElement('INPUT')
    inputWord.setAttribute("maxlength","5")
    inputContainer.append(inputWord)
    //create share button
    const shareButton = document.createElement('button')
    shareButton.classList.add('shareButton')
    shareButton.textContent = "SHARE"
    content.append(shareButton)

    const alertText = document.createElement('p')
    alertText.classList.add('alertText')

    //Share to friend
    shareButton.addEventListener('click', () => {
        //make sure 5 letters
        if(inputWord.value.length==5){
            // inputWord.value.text
            eWord = encryptWord(inputWord.value)
            shareUrl= makeUrl(eWord)
            // console.log(inputWord.value)
            if(navigator.share){
                navigator.share({
                    title:'WORDLE',
                    text:`${copyText}`,
                    url:`${copyURL}`
                }).then(()=>{
                    console.log("Shared")
                }).catch(console.error);
    
            }
            else{

                alertText.textContent = "Link Copied!"
                content.append(alertText)
                //copy to clipboard
                navigator.clipboard.writeText(shareUrl)
            }
        }
        else{
            alertText.textContent = "6 Letters Required!"
            content.append(alertText)

        }

       
    })

    const shareScoreText = document.createElement('p')
    shareScoreText.textContent = "Share Score?"
    content.append(shareScoreText)
    //Share Score button
    const shareScoreButton = document.createElement('button')
    shareScoreButton.classList.add('shareScoreButton')
    shareScoreButton.textContent = "SHARE SCORE"
    content.append(shareScoreButton)
    shareScoreButton.addEventListener('click', () => {
        //make sure 5 letters

        alertText.textContent = "Score Copied!"
        content.append(alertText)
        //copy to clipboard
        navigator.clipboard.writeText(scoreText)
        

       
    })

    // render the modal with child on DOM

}

const encryptWord = (word) =>{
    console.log(word)
    let newWord= window.btoa(word);
    console.log(newWord)
    return newWord
}
const decryptWord = (word) =>{
    return window.atob( word );
}
const makeUrl = (hash) =>{
    console.log(hash)
    console.log(window.location.href)
    //This needs to be fixed for taking out prev word hash
    let currentUrl = window.location.href.replace('word-of-the-day','word/')
    return  currentUrl+hash

}

const notAllCorrect = () => {

    if (currentRow < 6) {
        currentRow++
        currentTile = 0
        word = ""
        tempWord = wordle

    }
}

