let typingHandler = null;
document.addEventListener("DOMContentLoaded",function(){
    const textbox=document.querySelector(".textbox");
    const resetbut=document.querySelector(".restart button");
    resetbut.addEventListener("click",() => reset(textbox));
    const trybutton=document.querySelector(".modal-content #cl");
    trybutton.addEventListener("click",() => reset(textbox));
    const closebutton=document.querySelector(".modal-content .close");
    closebutton.addEventListener("click",() => reset(textbox));
    const paragraph=document.querySelector(".paragraph");
    paragraph.addEventListener("click",function(){
    textbox.focus();
});

    



randomParagraph(textbox);
textbox.addEventListener("focus", () => {
    const chars = document.querySelectorAll(".paragraph span");
    if (charIndex === 0) {
        chars[0].classList.add("active");
    } else if (charIndex < chars.length) {
        chars[charIndex].classList.add("active");
    }
});

const currentPage=window.location.pathname.split("/").pop();
    const links=Array.from(document.getElementsByClassName("nav-link"));
    links.forEach(link => {
        if(link.getAttribute("href") === currentPage){
            link.classList.add("active-page");
        }
    })


});
let mistakeTag=document.querySelector('#mistakesCount span'),
timeTag=document.querySelector(".s .secs"),
wpmTag=document.querySelector('.wds .words'),
cpmTag=document.querySelector(".chrs .chars");
timeValueSpan=document.getElementById("time-value");


let timer,
maxTime=60  ,
leftTime=maxTime,
charIndex=0,
mistakes=0;
let timeStarted=false;

function initTimer(inputbox){
    if(leftTime>0){
        leftTime--;
        timeValueSpan.innerText=leftTime;
    }else{
        clearInterval(timer);
        inputbox.value="";
        let accuracy = charIndex > 0 
        ? Math.round(((charIndex - mistakes) / charIndex) * 100)
        : 0;
            showResults(wpmTag.innerText, cpmTag.innerText, mistakes, accuracy);
    }
}

function randomParagraph(inputbox){
    let randIndex=Math.floor(Math.random()*paragraphs.length);
    let typingTxt=document.querySelector(".testbox .paragraph");
    typingTxt.innerHTML="";
    paragraphs[randIndex].split("").forEach(spanElement=>{
        const span = document.createElement("span");
        span.textContent = spanElement;
        typingTxt.appendChild(span);
    });
    inputbox.removeEventListener("input", typingHandler);
    typingHandler = () => initTyping(typingTxt, inputbox);
    inputbox.addEventListener("input", typingHandler);
}




function initTyping(typingTxt, inputbox) {
    const characters = typingTxt.querySelectorAll("span");
    const typedChar = inputbox.value.charAt(charIndex);
    if (inputbox.value.length < charIndex) {
        charIndex--;
        const char = typingTxt.querySelectorAll("span")[charIndex];
        if (char.classList.contains("incorrect")) {
            mistakes--;
            mistakeTag.innerText = mistakes;
            char.classList.remove("correct","incorrect");
        }else{
            char.classList.remove("correct");
        }

        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime) / 60));
        let cpm = charIndex - mistakes;
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        mistakeTag.innerText = mistakes;
        wpmTag.innerText = wpm;
        cpmTag.innerText = cpm;

        characters.forEach(c => c.classList.remove("active"));
        characters[charIndex].classList.add("active");

        
        
        return;
    }
    if (!timeStarted) {
        timer = setInterval(() =>initTimer(inputbox), 1000);
        timeStarted = true;
    }

    if (charIndex < characters.length && leftTime > 0) {
        if (typedChar === characters[charIndex].innerText) {
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        
characters.forEach(c => c.classList.remove("active"));
charIndex++;
if (charIndex < characters.length) {
    characters[charIndex].classList.add("active");
}

        

        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime) / 60));
        let cpm = charIndex - mistakes;
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;

        mistakeTag.innerText = mistakes;
        wpmTag.innerText = wpm;
        cpmTag.innerText = cpm;

        if (charIndex === characters.length) {
            clearInterval(timer);
            inputbox.value ="";
            let accuracy = charIndex > 0 
            ? Math.round(((charIndex - mistakes) / charIndex) * 100)
            : 0;
        
                    showResults(wpmTag.innerText, cpmTag.innerText, mistakes, accuracy);
        }
    }
}





//show results
function showResults(WPM,CPM,mistakes,accuracy){
    document.getElementById("resultModal").classList.remove("hidden");
    document.querySelector(".mainblock").classList.add("blurred")
    document.getElementById('wordspm').
    innerText=`WPM:${WPM}`;
    document.getElementById("charspm").innerText=`CPM:${CPM}`;
    document.getElementById('mistakesCount').innerText=`Mistakes: ${mistakes}`;
    document.getElementById('accuracy').innerText=`Accuracy:${accuracy}%`;
    let appreciationText = "";

if (accuracy > 90) {
    if (CPM > 250) {
        appreciationText = "Excellent speed and accuracy!";
    } else if (CPM > 200) {
        appreciationText = "Excellent accuracy, great speed!";
    } else if (CPM > 150) {
        appreciationText = "Excellent accuracy, good speed!";
    } else {
        appreciationText = "Excellent accuracy, keep improving speed!";
    }
}
else if (accuracy > 60) {
    if (CPM > 200) {
        appreciationText = "Great accuracy and speed!";
    } else if (CPM > 150) {
        appreciationText = "Great work, just a bit more speed!";
    } else if (CPM > 100) {
        appreciationText = "Good accuracy, work on speed!";
    } else {
        appreciationText = "Nice effort! Try to type faster.";
    }
}
else {
    if (CPM > 200) {
        appreciationText = "Fast typing, work on accuracy!";
    } else if (CPM > 150) {
        appreciationText = "Decent speed, but more focus needed.";
    } else if (CPM > 100) {
        appreciationText = "You're getting there. Improve both speed and accuracy.";
    } else {
        appreciationText = "Keep practicing — you'll get better with time!";
    }
}

document.getElementById('appreciation').innerText = appreciationText;

}




function reset(inputbox) {
    randomParagraph(inputbox);
    leftTime = maxTime;
    charIndex = mistakes = 0;
    timeStarted = false;
    clearInterval(timer);
    timeValueSpan.innerText = leftTime;
    mistakeTag.innerText = 0;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    inputbox.value = "";
    inputbox.focus(); // ensure it's active again
    document.querySelectorAll(".paragraph span").forEach(span => {
        span.classList.remove("correct", "incorrect", "active");
    });
    document.getElementById("resultModal").classList.add("hidden");
    document.querySelector(".mainblock").classList.remove("blurred");
}










