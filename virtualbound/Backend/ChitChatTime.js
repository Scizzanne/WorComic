// Constants
const CHAT_INDICES = [85, 91, 94, 95, 96, 97, 99]; // for debug
const DEBUG_MODE = true;

// Elements
const container = document.querySelector(".text-biscord");
const img = document.querySelector(".img");
const containerParent = document.querySelector(".container");

// Profile mapping
const profiles = {
    "KimiwimiUwU": {
        img: "./Images/kimiko_pfp.PNG",
        class: "ye"
    },
    "xXDyedFeatherXx": {
        img: "./Images/nyle_pfp.PNG",
        class: "pu"
    }
};

async function initChat() {
    await initRouter(); 
    renderPage();
}

initChat(); // init

window.onkeydown = function(event) { 
    if (!DEBUG_MODE) return;

    const key = parseInt(event.key);

    // Keys 1–7 map to CHAT_INDICES[0–6]
    if (key >= 1 && key <= CHAT_INDICES.length) {
        currentIndex = key - 1;
        console.log("DEBUG!! Jumping to index:", CHAT_INDICES[currentIndex]);
        renderPage();
    }
};

// Render page
function renderPage() {
    const pageNum = getCurrentPage();
    const page = getPageData();

    console.log("Index " + pageNum + " loaded.");

    const file = page.media;
    const ext = file.split(".").pop().toLowerCase();

    let element;

    const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif"];
    const VIDEO_TYPES = ["mp4", "mov", "webm"];

    if (IMAGE_TYPES.includes(ext)) {
        element = document.createElement("img");
        element.src = file;
    } else if (VIDEO_TYPES.includes(ext)) {
        element = document.createElement("video");
        element.src = file;
        element.autoplay = true;
        element.loop = true;
        element.muted = true; // needed for autoplay
        element.playsInline = true;
    } else {
        console.warn("Unsupported media type:", ext);
        return;
    }

    element.classList.add("img");

    // remove existing media (img or video)
    const oldMedia = document.querySelector(".container .img");
    if (oldMedia) oldMedia.remove();

    // insert media ABOVE the chat container
    containerParent.insertBefore(element, container);

    // clear chat
    container.innerHTML = "";

    const lines = (page.text || "")
        .split("\n")
        .filter(line => line.trim() !== "");

    // group consecutive messages by same speaker
    const grouped = [];

    lines.forEach(line => {
        const [name, ...rest] = line.split(" : ");
        const message = rest.join(" : ").trim();

        if (!profiles[name]) return;

        const lastGroup = grouped[grouped.length - 1];

        if (lastGroup && lastGroup.name === name) {
            // same speaker, append message
            lastGroup.messages.push(message);
        } else {
            // new speaker, create new group
            grouped.push({
                name: name,
                messages: [message]
            });
        }
    });

    // render grouped messages
    grouped.forEach(group => {
        const profile = profiles[group.name];

        const combinedMessage = group.messages
            .map(msg => msg.replace(/\n/g, "<br>"))
            .join("<br>");

        const chatHTML = `
            <div class="biscord-body">
                <img src="${profile.img}" class="pfp">
                <p class="top ${profile.class}">${group.name}</p>
                <p class="bot">${combinedMessage}</p>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", chatHTML);
    });
    
}

// Navigation
function nextPageCC() {
    goToPage(getCurrentPage() + 1);
}

function prevPageCC() {
    goToPage(getCurrentPage() - 1);
}