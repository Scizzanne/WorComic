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
    if ([5, 30, 40, 49, 64].includes(index)) return "interactable";
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

// edge cases (0 indexed) so [index = page - 1]

// we need to find a way to have other js files use this file and their own logic/functions for each html type
// html types: Interactable.html, FlyMinigame.html, and ChitChatTime.html

// index 5 is a different html and can branch off to 2 other indices - uses Interactable.html
// route 1: index 6, which will go sequentially until index 10
// route 2: index 11, which will go sequentially until index 13
// both routes (index 10 & 13) head back to index 5, clicking on next leads to index 14
// clicking previous in all indices 6 and 11 would lead back to index 5
// clicking previous in index 14 would lead back to index 5

// index 30 is another different html and can branch off to 3 other indices - uses Interactable.html
// route 1: index 31, which will go sequentially until index 34
// route 2: index 35, which will go sequentially until index 37
// route 3: index 38, which will go sequentially until index 39, then to interactable index 40
// all routes (index 34, 37 & interactable 40) head back to index 30, clicking on next leads to index 41
// clicking previous in all indices 31 35 and 38 would lead back to index 30
// clicking previous in index 41 would lead back to index 30

// index 49 is another different html and can branch off to  other indices - uses Interactable.html
// route 1: index 50, which will go sequentially until index 53 
// route 2: index 54, which will go sequentially until index 55
// route 3: index 56
// all routes (index 53, 55 & 56) head back to index 49, clicking on next leads to index 57
// clicking previous in all indices 50 54 and 56 would lead back to index 49
// clicking previous in index 57 would lead back to index 49

// index 64 is another different html and can branch off to 8 other indices - uses Interactable.html
// route 1: index 65
// route 2: index 66
// route 3: index 67
// route 4: index 68
// route 5: index 69
// route 6: index 70
// route 7: index 71
// route 8: index 72
// all routes converge to index 74, hitting previous heads back to 64
// clicking previous in all routes would lead back to index 64
// clicking previous in index 74 would lead back to index 64

// index 77 is the FlyMinigame.html, which then leads to index 80
// the previous button would lead back to 76

// index 85, 91, 94, 95, 96, 97, and 99 use ChitChatTime.html
 

