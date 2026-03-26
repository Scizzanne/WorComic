// Constants
const MAX_INDEX = 101; // 0–101 allowed in normal flow
const SECRET_INDICES = [102, 103, 104, 105];

// Globals
let pagesData = [];
let currPage = 0;
let initialized = false;
let secret = false;

// get the json!!!
async function initRouter() {
    if (initialized) return;

    const res = await fetch("./Backend/Pages.json");
    pagesData = await res.json();

    const saved = localStorage.getItem("currPage");
    currPage = saved ? parseInt(saved) : 0;

    initialized = true;
}

// getters
function getCurrentPage() {
    return currPage;
}

function getPageData(index = currPage) {
    return pagesData[index];
}

function getPageType(index) {
    if ([5, 16, 30, 40, 49, 64].includes(index)) return "interactable";
    if (index === 77) return "fly";
    if ([85, 91, 94, 95, 96, 97, 99].includes(index)) return "chat";
    return "comic";
}

function getCurrentPageType() {
    const path = window.location.pathname;

    if (path.includes("Interactable")) return "interactable";
    if (path.includes("FlyMinigame")) return "fly";
    if (path.includes("ChitChatTime")) return "chat";

    if (path.includes("VRPages")) return "vr";
    if (path.includes("WebPages")) return "web";

    return "comic";
}

function setCurrPage(thePage) {
    currPage = thePage;
}

function goToPage(index) {
    if (index < 0 || index >= pagesData.length) return;

    const newType = getPageType(index);
    const currentType = getCurrentPageType();

    let newRenderType = newType;
    if (newType === "comic") {
        newRenderType = index < 25 ? "vr" : "web";
    }

    currPage = index;
    localStorage.setItem("currPage", index);

    // SAME PAGE TYPE, no reload
    if (newRenderType === currentType) {
        if (newType === "comic" && typeof showPage === "function") {
            showPage(index);
        } else if (newType === "chat" && typeof renderPage === "function") {
            renderPage();
        } else if (newType === "interactable") {
            if (typeof loadPage === "function") {
                currInteract = index;
                currPage = index;
                localStorage.setItem("currPage", index);
                loadPage();
            } else {
                // defer until interactable is initialized
                window.addEventListener("DOMContentLoaded", () => {
                    currInteract = index;
                    currPage = index;
                    localStorage.setItem("currPage", index);
                    loadPage();
                });
            }
        }
        return;
    }

    // DIFFERENT PAGE TYPE, navigate
    switch (newRenderType) { 
        case "interactable":
            window.location.replace("Interactable.html");
            break;
        case "fly":
            window.location.replace("FlyMinigame.html");
            break;
        case "chat":
            window.location.replace("ChitChatTime.html");
            break;
        case "vr":
            window.location.replace("VRPages.html");
            break;
        case "web":
            window.location.replace("WebPages.html");
            break;
    }
} 

// indices 102, 103, 104, and 105 are easter eggs and separate from the flow. 
