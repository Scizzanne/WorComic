// declare all media types that can be displayed
const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif"];
const VIDEO_TYPES = ["mp4", "webm", "mov"];

// gather elements
const textContainer = document.getElementById("comic-text");

let mediaContainer;
let mediaParent;

document.addEventListener("DOMContentLoaded", init); // wait for router...

async function init() {
    await initRouter();

    const currPage = getCurrentPage();

    // GUARD 
    const expectedType = getPageType(currPage);
    const currentType = getCurrentPageType?.(); // safe call

    let expectedRenderType = expectedType;
    if (expectedType === "comic") {
        expectedRenderType = currPage < 25 ? "vr" : "web";
    }

    if (expectedRenderType !== currentType) {
        goToPage(currPage);
        return;
    }

    // normal setup
    mediaContainer = document.getElementById("comic-media");
    mediaParent = mediaContainer?.parentElement;

    showPage(currPage);
}

function showPage(pageNum) {
    const page = getPageData(pageNum);
    if (!page) return;

    const file = page.media;
    const ext = file.split(".").pop().toLowerCase();

    // get da div
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

    console.log("Index " + pageNum + " loaded.")

    preloadNextPage();
}

function nextPage() {
    const curr = getCurrentPage();
    goToPage(curr + 1);
}

function prevPage() {
    const curr = getCurrentPage();
    goToPage(curr - 1);
}

function preloadNextPage() {
    const curr = getCurrentPage();
    const nextPageData = getPageData(curr + 1);
    if (!nextPageData) return;

    const nextMedia = nextPageData.media;
    const ext = nextMedia.split(".").pop().toLowerCase();

    if (IMAGE_TYPES.includes(ext)) {
        const img = new Image();
        img.src = nextMedia;
    }

    if (VIDEO_TYPES.includes(ext)) {
        const video = document.createElement("video");
        video.src = nextMedia;
    }
}