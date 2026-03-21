// constants
let currPage = 0;
let comicData = [];

let mediaContainer = document.getElementById("comic-media");
const textContainer = document.getElementById("comic-text");
let mediaParent = mediaContainer?.parentElement;

// declare all media types that can be displayed
const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif"];
const VIDEO_TYPES = ["mp4", "webm", "mov"];

document.addEventListener("DOMContentLoaded", init);

async function init() {
    try {
        const response = await fetch("./Backend/Pages.json"); // det da file
        const data = await response.json(); 

        comicData = data;

        const savedPage = localStorage.getItem("currPage");

        currPage = savedPage ? parseInt(savedPage) : 0;

        showPage(currPage);
    } catch (error) {
        console.error("Error fetching pages:", error);
    }
}

function showPage(pageNum) {
    if (pageNum < 0 || pageNum >= comicData.length) return;

    const page = comicData[pageNum];
    const file = page.media;
    const ext = file.split(".").pop().toLowerCase();

    // get da div
    mediaContainer = document.getElementById("comic-media");
    mediaParent = mediaContainer?.parentElement;

    // Clear old media container div 
    if (mediaContainer) {
        mediaContainer.innerHTML = "";
    }
    textContainer.innerHTML = "";

    let element;

    // is it an image or a video? :3c hmmm
    if (IMAGE_TYPES.includes(ext)) {
        element = document.createElement("img");
        element.src = file;
    } else if (VIDEO_TYPES.includes(ext)) {
        element = document.createElement("video");
        element.src = file;
        element.autoplay = true;
        element.loop = true;
        element.muted = false;
        element.playsInline = true;
    } else { // if neither... GET OUT
        console.warn("Unsupported media type:", ext);
        return;
    }

    // set them attributessss
    element.id = "comic-media";
    element.classList.add("img");

    if (mediaParent && mediaContainer) {
        mediaParent.replaceChild(element, mediaContainer);
    } else if (mediaContainer) {
        mediaContainer.appendChild(element);
    }

    mediaContainer = element; // replace da old div :3

    textContainer.innerText = page.text || "";

    currPage = pageNum;
    localStorage.setItem("currPage", currPage);

    console.log("Index " + currPage + " loaded.");

    preloadNextPage();
    switchStyles(currPage);
}

function nextPage() {
    if (currPage < comicData.length - 1) {
        showPage(currPage + 1);

    }
}

function prevPage() {
    if (currPage > 0) {
        showPage(currPage - 1);
    }
}

function preloadNextPage() {
    if (currPage + 1 >= comicData.length) return;

    const nextPage = comicData[currPage + 1].media;
    const ext = nextPage.split(".").pop().toLowerCase();

    if (IMAGE_TYPES.includes(ext)) {
        const img = new Image();
        img.src = nextPage;
    }

    if (VIDEO_TYPES.includes(ext)) {
        const video = document.createElement("video");
        video.src = nextPage;
    }
}

const background = document.querySelector(".background");
const header = document.querySelector(".header");
const text = document.querySelector(".text");
const swit = document.querySelector(".switch");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

function switchStyles(theCurrPage) {
    if (theCurrPage >= 25) {
        background.src = "./Images/web_backgroud.png";
        header.classList.remove("vr-ship-header");
        const buttons = document.querySelectorAll('.button');
        buttons.forEach(el => {
            el.classList.remove('button-vr-ship', 'vr-ship-a');
        });
        text.classList.remove("text-vr-ship");
        swit.classList.remove("switch-vr-ship");
        previous.className = "web-a";
        next.className = "web-a";
    } else {
        background.src = "./Images/vr_ship_background.png";
        header.classList.add("vr-ship-header");
        const buttons = document.querySelectorAll('.button');
        buttons.forEach(el => {
            el.classList.add('button-vr-ship', 'vr-ship-a');
        });
        text.classList.add("text-vr-ship");
        swit.classList.add("switch-vr-ship");
        previous.className = "vr-ship-a";
        next.className = "vr-ship-a";
    }
}

// indices 102, 103, 104, and 105 are easter eggs and separate from the flow. 

// edge cases (0 indexed) so [index = page - 1]

// we need to find a way to have other js files use this file and their own logic/functions for each html type
// html types: Interactable.html, FlyMinigame.html, and ChitChatTime.html

// index 5 is a different html and can branch off to 2 other indices - uses Interactable.html
// route 1: index 6, which will go sequentially until index 10
// route 2: index 11, which will go sequentially until index 13
// both routes (index 10 & 13) converge to index 14

// index 30 is another different html and can branch off to 3 other indices - uses Interactable.html
// route 1: index 31, which will go sequentially until index 34
// route 2: index 35, which will go sequentially until index 37
// route 3: index 38, which will go sequentially until index 40
// all routes (index 34, 37 & 40) converge to index 41

// index 49 is another different html and can branch off to  other indices - uses Interactable.html
// route 1: index 50, which will go sequentially until index 53
// route 2: index 54, which will go sequentially until index 55
// route 3: index 56
// all routes (index 53, 55 & 56) converge to index 57

// index 64 is another different html and can branch off to 8 other indices - uses Interactable.html
// route 1: index 65
// route 2: index 66
// route 3: index 67
// route 4: index 68
// route 5: index 69
// route 6: index 70
// route 7: index 71
// route 8: index 72
// all routes converge to index 74

// index 76 leads to the FlyMinigame.html, which then leads to index 80

// index 85, 91, 94, 95, 96, 97, and 99 use ChitChatTime.html
 

