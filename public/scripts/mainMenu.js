document.querySelector(".word-day").onclick = function(){
    console.log("pressed");
    document.location = "http://localhost:8000/word-of-the-day";    
};

document.querySelector(".challenge-friend").onclick = function(){
    console.log("clicked 2");
    document.location = "http://localhost:8000/word/byeWorld";    
};