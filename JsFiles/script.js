let typingHandler = null;

document.addEventListener("DOMContentLoaded", function () {
    const textbox     = document.querySelector(".textbox");
    const resetbut    = document.querySelector(".restart button");
    const trybutton   = document.querySelector(".modal-content #cl");
    const closebutton = document.querySelector(".modal-content .close");
    const paragraph   = document.querySelector(".paragraph");

    resetbut.addEventListener("click",    () => reset(textbox));
    trybutton.addEventListener("click",   () => reset(textbox));
    closebutton.addEventListener("click", () => reset(textbox));

    paragraph.addEventListener("click", () => textbox.focus());
    document.querySelector(".testbox").addEventListener("click", () => textbox.focus());

    document.querySelectorAll(".pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".pill").forEach(p => p.classList.remove("active-pill"));
            pill.classList.add("active-pill");
            maxTime  = parseInt(pill.dataset.time);
            leftTime = maxTime;
            reset(textbox);
        });
    });

    const currentPage = window.location.pathname.split("/").pop();
    Array.from(document.getElementsByClassName("nav-link")).forEach(link => {
        if (link.getAttribute("href") === currentPage) link.classList.add("active-page");
    });

    randomParagraph(textbox);

    textbox.addEventListener("focus", () => {
        const chars = document.querySelectorAll(".paragraph span");
        if (charIndex === 0 && chars.length > 0) {
            chars[0].classList.add("active");
        } else if (charIndex < chars.length) {
            chars[charIndex].classList.add("active");
        }
    });
});

// ── Selectors ──────────────────────────────────────────────
let mistakeTag    = document.querySelector('#mistakesCount span'),
    wpmTag        = document.querySelector('.wds .words'),
    cpmTag        = document.querySelector(".chrs .chars"),
    timeValueSpan = document.getElementById("time-value"),
    progressFill  = document.getElementById("progress-fill");

// ── State ──────────────────────────────────────────────────
let timer,
    maxTime     = 60,
    leftTime    = maxTime,
    charIndex   = 0,
    mistakes    = 0,
    totalChars  = 0,
    timeStarted = false;

// ── Timer tick ─────────────────────────────────────────────
function initTimer(inputbox) {
    if (leftTime > 0) {
        leftTime--;
        timeValueSpan.innerText = leftTime;
    } else {
        clearInterval(timer);
        inputbox.value = "";
        const accuracy = charIndex > 0
            ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;
        showResults(wpmTag.innerText, cpmTag.innerText, mistakes, accuracy);
    }
}

// ── Load random paragraph ──────────────────────────────────
function randomParagraph(inputbox) {
    const randIndex = Math.floor(Math.random() * paragraphs.length);
    const typingTxt = document.querySelector(".testbox .paragraph");
    typingTxt.innerHTML = "";

    paragraphs[randIndex].split("").forEach(ch => {
        const span = document.createElement("span");
        span.textContent = ch;
        typingTxt.appendChild(span);
    });

    totalChars = paragraphs[randIndex].length;
    inputbox.removeEventListener("input", typingHandler);
    typingHandler = () => initTyping(typingTxt, inputbox);
    inputbox.addEventListener("input", typingHandler);
}

// ── Core typing logic ──────────────────────────────────────
function initTyping(typingTxt, inputbox) {
    const characters = typingTxt.querySelectorAll("span");

    // Backspace
    if (inputbox.value.length < charIndex) {
        charIndex--;
        const char = characters[charIndex];
        if (char.classList.contains("incorrect")) {
            mistakes--;
            char.classList.remove("correct", "incorrect");
        } else {
            char.classList.remove("correct");
        }
        updateStats();
        characters.forEach(c => c.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
            scrollToActive(typingTxt);
        }
        updateProgress(charIndex, totalChars);
        return;
    }

    // Start timer on first keypress
    if (!timeStarted) {
        timer = setInterval(() => initTimer(inputbox), 1000);
        timeStarted = true;
    }

    if (charIndex < characters.length && leftTime > 0) {
        const typedChar = inputbox.value.charAt(charIndex);

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
            scrollToActive(typingTxt);
        }

        updateStats();
        updateProgress(charIndex, totalChars);

        if (charIndex === characters.length) {
            clearInterval(timer);
            inputbox.value = "";
            const accuracy = charIndex > 0
                ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 0;
            showResults(wpmTag.innerText, cpmTag.innerText, mistakes, accuracy);
        }
    }
}

// ── Scroll active char into view ───────────────────────────
function scrollToActive(typingTxt) {
    const active = typingTxt.querySelector("span.active");
    if (!active) return;
    typingTxt.scrollTop = active.offsetTop - typingTxt.clientHeight / 2;
}

// ── Update WPM / CPM ───────────────────────────────────────
function updateStats() {
    const elapsed = maxTime - leftTime || 1;
    let wpm = Math.round(((charIndex - mistakes) / 5) / (elapsed / 60));
    let cpm = charIndex - mistakes;
    wpm = (wpm < 0 || !wpm || wpm === Infinity) ? 0 : wpm;
    cpm = (cpm < 0 || !cpm || cpm === Infinity) ? 0 : cpm;
    wpmTag.innerText = wpm;
    cpmTag.innerText = cpm;
    if (mistakeTag) mistakeTag.innerText = mistakes;
}

// ── Progress bar ───────────────────────────────────────────
function updateProgress(current, total) {
    if (!progressFill || !total) return;
    progressFill.style.width = Math.min((current / total) * 100, 100) + "%";
}

// ── Show results ───────────────────────────────────────────
function showResults(WPM, CPM, mistakes, accuracy) {
    document.getElementById("resultModal").classList.remove("hidden");
    document.querySelector(".mainblock").classList.add("blurred");

    document.getElementById("wordspm").innerText      = WPM;
    document.getElementById("charspm").innerText      = CPM;
    document.getElementById("mistakesCount").innerText = mistakes;
    document.getElementById("accuracy").innerText     = accuracy + "%";

    let appreciationText = "";
    const cpmNum = parseInt(CPM);

    if (accuracy > 90) {
        if      (cpmNum > 250) appreciationText = "Excellent speed and accuracy!";
        else if (cpmNum > 200) appreciationText = "Excellent accuracy, great speed!";
        else if (cpmNum > 150) appreciationText = "Excellent accuracy, good speed!";
        else                   appreciationText = "Excellent accuracy — keep pushing speed!";
    } else if (accuracy > 60) {
        if      (cpmNum > 200) appreciationText = "Great accuracy and speed!";
        else if (cpmNum > 150) appreciationText = "Great work, just a bit more speed!";
        else if (cpmNum > 100) appreciationText = "Good accuracy — work on speed!";
        else                   appreciationText = "Nice effort! Try to type faster.";
    } else {
        if      (cpmNum > 200) appreciationText = "Fast typing — work on accuracy!";
        else if (cpmNum > 150) appreciationText = "Decent speed, but more focus needed.";
        else if (cpmNum > 100) appreciationText = "You're getting there. Improve both!";
        else                   appreciationText = "Keep practicing — you'll get better!";
    }

    document.getElementById("appreciation").innerText = appreciationText;
}

// ── Reset ──────────────────────────────────────────────────
function reset(inputbox) {
    clearInterval(timer);
    leftTime    = maxTime;
    charIndex   = 0;
    mistakes    = 0;
    timeStarted = false;

    timeValueSpan.innerText = leftTime;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    if (mistakeTag)   mistakeTag.innerText = 0;
    if (progressFill) progressFill.style.width = "0%";

    inputbox.value = "";
    randomParagraph(inputbox);

    document.querySelectorAll(".paragraph span").forEach(span => {
        span.classList.remove("correct", "incorrect", "active");
    });

    document.getElementById("resultModal").classList.add("hidden");
    document.querySelector(".mainblock").classList.remove("blurred");

    inputbox.focus();
}