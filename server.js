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
console.log()

app.get('/word-of-the-day',(req, res,next) =>{
    hashWord = data["words"][day];
    res.render('index');
    next() 
});


app.get('/word/:wordId',(req, res,next) =>{
    hashWord = req.params.wordId;
    res.render('index');
    next() 
});

app.get('/answer123', (req,res) =>{

    res.json({hashWord})
})

app.listen(PORT);