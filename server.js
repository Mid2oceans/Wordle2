const PORT = 8000
var express = require('express');
var app = express();
const cors = require('cors');
app.use(cors())

app.set('view engine','ejs')

let hashWord
app.get('/word/:wordId',(req, res,next) =>{
    // console.log(tools.unhash(req.params.wordId));
    hashWord = req.params.wordId;
    // res.send("hi")
    res.render('test');
    next()
});

app.get('/answer123', (req,res) =>{

    res.json({hashWord})
})

app.listen(PORT);