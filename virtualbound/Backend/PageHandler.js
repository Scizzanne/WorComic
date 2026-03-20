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

    console.log("Page " + currPage + " loaded.");

    preloadNextPage();
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

// edge cases (0 indexed)
// Pages 5, 30, 49, 64, 76 leads to different html pages
// Pages 85, 91, 94, 95, 96, 97, 99 Different html types

// Page 77 is the fly minigame (different js)