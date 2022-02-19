const PORT = 8000
var express = require('express');
var app = express();
const cors = require('cors');
app.use(cors())

app.set('view engine','ejs')
app.use(express.static('public'));

let hashWord
// This is the word of the day json
const data = require('./public/data/words.json');
// const words = JSON.parse(data)
let day = 1;

//Firebase things
//=========================================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { add } from "nodemon/lib/rules";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzVe4hNu9CtGe-fWsKxzUc1DbXnkIByf8",
  authDomain: "wordle-afc37.firebaseapp.com",
  databaseURL: "https://wordle-afc37-default-rtdb.firebaseio.com",
  projectId: "wordle-afc37",
  storageBucket: "wordle-afc37.appspot.com",
  messagingSenderId: "544820127245",
  appId: "1:544820127245:web:cabbae95a59e5bd2419744",
  measurementId: "G-PP1W4J1B91"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const analytics = getAnalytics(firebaseApp);


//============================================================================

app.get('/word-of-the-day',(req, res,next) =>{
    hashWord = data["words"][day];
    res.render('index');
    next() 
});

app.get('/game/:gameID/:player/:wordID',(req, res,next) =>{
    validGame = checkForGame(req.params.gameID);
    if(validGame){
        res.render('index');
    }
    hashWord = req.params.wordID;
    
    next() 
});

//make your own and send to friend option?
app.get('/word/:wordID',(req, res,next) =>{
    hashWord = req.params.wordID;
    res.render('index');
    next() 
});
//this is where the answer will be
//need to change to answer/:hash and get the correct word from database
app.get('/answer123', (req,res) =>{

    res.json({hashWord})
})

app.listen(PORT);


const checkForGame =(gameID) =>{
    //check if game exists
    database.ref('/games/'+gameID).eqaulTo(gameID).once("value",snapshot =>{
        if (snapshot.exists()){
            console.log("exists!");
            return true;
         }
         else{
             console.log("error game doesnt exist");
             return false;
         }
    })
}


const addGame =(gameID,player1,player2) =>{
    set(database.ref('/games/'+gameID),{
        gameID:gameID,
        players:[player1,player2]
    })
    
}