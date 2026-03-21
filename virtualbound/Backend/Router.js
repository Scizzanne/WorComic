let pagesData = [];
let currPage = 0;
let initialized = false;

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
    if ([5, 30, 49, 64].includes(index)) return "interactable";
    if (index === 76) return "fly";
    if ([85, 91, 94, 95, 96, 97, 99].includes(index)) return "chat";
    return "comic";
}

function getCurrentPageType() {
    const path = window.location.pathname;

    if (path.includes("Interactable")) return "interactable";
    if (path.includes("FlyMinigame")) return "fly";
    if (path.includes("ChitChatTime")) return "chat";
    return "comic";
}

function goToPage(index) {
    if (index < 0 || index >= pagesData.length) return;

    const newType = getPageType(index);
    const currentType = getCurrentPageType();

    currPage = index;
    localStorage.setItem("currPage", index);

    // SAME PAGE TYPE, no reload
    if (newType === currentType) {
        if (newType === "comic" && typeof showPage === "function") {
            showPage(index);
        }
        return;
    }

    // DIFFERENT PAGE TYPE, navigate
    switch (newType) {
        case "interactable":
            window.location.replace("Interactable.html");
            break;
        case "fly":
            window.location.href = "FlyMinigame.html";
            break;
        case "chat":
            window.location.href = "ChitChatTime.html";
            break;
        default:
            window.location.href = "Page.html";
    }
}