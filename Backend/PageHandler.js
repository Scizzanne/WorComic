// declare all media types that can be displayed
const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif"];
const VIDEO_TYPES = ["mp4", "webm", "mov"];
const FIRST_PAGE = 0;
const LAST_PAGE = 101; // change as needed

// gather elements
const textContainer = document.getElementById("comic-text");
const prev = document.getElementById("previous");
const next = document.getElementById("next");

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

    console.log("Index " + pageNum + " loaded.");

    updateNavigation(); 

    preloadNextPage();
}

function nextPage() {
    const curr = getCurrentPage();
    const nav = INTERACTABLE_NAV[curr];

    if (nav) {
        if (nav.next === null) {
            // next button disabled, do nothing
            console.log("Next button disabled at index", curr);
            return;
        }
        goToPage(nav.next);
    } else {
        // fallback for normal sequential pages
        goToPage(curr + 1);
    }
}

function prevPage() {
    const curr = getCurrentPage();
    const nav = INTERACTABLE_NAV[curr];

    if (nav) {
        if (nav.prev === null) {
            // prev button disabled, do nothing
            console.log("Previous button disabled at index", curr);
            return;
        }
        goToPage(nav.prev);
    } else {
        // fallback for normal sequential pages
        goToPage(curr - 1);
    }
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

function updateNavigation() {
    const curr = getCurrentPage();

    if (curr === FIRST_PAGE) {
        prev.style.display = "none";
    } else {
        prev.style.display = "inline"
    }

    if (curr === LAST_PAGE) {
        next.style.display = "none";
    } else {
        next.style.display = "inline";
    }

}

const INTERACTABLE_NAV = {
    // index 5
    5: { next: 6, prev: 4 }, // interact 
    6: { next: 7, prev: 5 },
    7: { next: 8, prev: 6 },
    8: { next: 9, prev: 7 },
    9: { next: 10, prev: 8 },
    10: { next: 5, prev: 9 }, 
    11: { next: 12, prev: 5 },
    12: { next: 13, prev: 11 },
    13: { next: 5, prev: 12 },
    14: { next: 15, prev: 5 }, // end

    16: { next: 20, prev: 15 },
    17: { next: 16, prev: 16 }, // cannon
    18: { next: 16, prev: 16 }, // sword
    19: { next: 16, prev: 16 }, // fruits
    20: { next: 21, prev: 16 },

    // index 30
    30: { next: 41, prev: 29 }, // interact 
    31: { next: 32, prev: 30 },  // bed
    32: { next: 33, prev: 31 },
    33: { next: 34, prev: 32 },
    34: { next: 30, prev: 33 },
    35: { next: 36, prev: 30 }, // shelf
    36: { next: 37, prev: 35 },
    37: { next: 30, prev: 36 },
    38: { next: 39, prev: 30 }, // records
    39: { next: 40, prev: 38 },
    40: { next: 30, prev: 39 },
    41: { next: 42, prev: 30 }, // end

    // index 49
    49: { next: 57, prev: 48 }, // interact 
    50: { next: 51, prev: 49 },
    51: { next: 52, prev: 50 },
    52: { next: 53, prev: 51 },
    53: { next: 49, prev: 52 },
    54: { next: 55, prev: 49 },
    55: { next: 49, prev: 54 },
    56: { next: 49, prev: 49 },
    57: { next: 58, prev: 49 }, // end

    // index 64
    64: { next: null, prev: 63 }, // interact 
    65: { next: 74, prev: 64 },
    66: { next: 74, prev: 64 },
    67: { next: 74, prev: 64 },
    68: { next: 74, prev: 64 },
    69: { next: 74, prev: 64 },
    70: { next: 74, prev: 64 },
    71: { next: 74, prev: 64 },
    72: { next: 74, prev: 64 },
    74: { next: 75, prev: 64 }, // end

    105: { next: 40, prev: 40 },
};