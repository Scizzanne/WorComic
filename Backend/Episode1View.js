// also needs access to current page number and json
// this loads links to any page in the pages html files. 

const CHAPTERS = [
    { id: "Chapter1", start: 0, end: 25 },
    { id: "Chapter2", start: 26, end: 101 },
    { id: "Chapter3", start: null, end: null },
    { id: "Chapter4", start: null, end: null },
    { id: "Chapter5", start: null, end: null },
    { id: "Chapter6", start: null, end: null }
];

async function initEpisode1View() {
    await initRouter();

    let unlockedPages = JSON.parse(localStorage.getItem("unlockedPages")) || [0];

    if (!unlockedPages.includes(0)) {
        unlockedPages.push(0);
        localStorage.setItem("unlockedPages", JSON.stringify(unlockedPages));
    }

    console.log("Unlocked Pages:", unlockedPages);

    loadAllPages(unlockedPages);
}

document.addEventListener("DOMContentLoaded", initEpisode1View);

function loadAllPages(unlockedPages) {
    CHAPTERS.forEach(chapter => {
        const container = document.getElementById(chapter.id);
        if (!container) return;

        container.innerHTML = "";

        // Skip undefined chapters
        if (chapter.start === null || chapter.end === null) return;

        for (let i = chapter.start; i <= chapter.end; i++) {
            const pageNumber = i + 1;

            const link = document.createElement("a");
            link.classList.add("not-visit");

            let href;
            const type = getPageType(i);

            if (type === "comic") {
                href = i < 25 ? "VRPages.html" : "WebPages.html";
            } else if (type === "interactable") {
                href = "Interactable.html";
            } else if (type === "fly") {
                href = "FlyMinigame.html";
            } else if (type === "chat") {
                href = "ChitChatTime.html";
            }

            link.href = href;
            link.textContent = `Page ${pageNumber}`;

            // Mark visited pages
            if (unlockedPages.includes(i)) {
                link.classList.add("visit");
                link.classList.remove("not-visit");
            }

            // Navigation still works for ALL pages
            link.addEventListener("click", (e) => {
                e.preventDefault();
                goToPage(i);
            });

            container.appendChild(link);
            container.appendChild(document.createElement("br"));
        }
    });
}