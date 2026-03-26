// Constants
const DEBUG_MODE = false;
const INTERACT_PAGES = [5, 16, 30, 40, 49, 64]; 

// Globals
let currInteract = INTERACT_PAGES[0];
let isHovering = false;
let blinkOn= true;
let blinkInterval = null;
let outlineImages = [];
let nextIndex;

console.log(currInteract);

document.addEventListener("DOMContentLoaded", initInteract);

async function initInteract() {
    await initRouter();

    const currPage = getCurrentPage();
    currInteract = currPage;

    console.log("Index " + currInteract + " loaded.");

    loadPage();
}

// gather elements
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const interactArea = document.querySelector(".interact-area");
const interactText = document.getElementById("interact-text");
const interactBG = document.querySelector(".interact-bg");

const background = document.querySelector(".background");
const header = document.querySelector(".header");
const buttons = document.querySelectorAll(".button");
const textBox = document.querySelector(".text");
const swit = document.querySelector(".switch");

window.onkeydown = function(event) { 
    if (DEBUG_MODE) {
        if (event.key  === '1') { 
            loadInteract5(); currInteract = 5; 
        } else if (event.key  === '2') {
            loadInteract16(); currInteract = 16; 
        } else if (event.key  === '3') { 
            loadInteract30(); currInteract = 30; setWebStyle();
        } else if (event.key  === '4') { 
            loadInteract49(); currInteract = 49; setWebStyle();
        } else if (event.key  === '5') { 
            loadInteract64(); currInteract = 64; setWebStyle();
        } else if (event.key === '6') {
            loadInteract40(); currInteract = 40; setWebStyle();
        }
    }
    console.log("Index " + currInteract + " loaded.");
    setCurrPage(currInteract);
}

// Function
function nextPageIn() { // goes to next page depending on current page
    goToPage(nextIndex);
}
function prevPageIn() {
    const curr = getCurrentPage();

    const prev = curr - 1;

    if (prev !== undefined) {
        goToPage(prev);
    } else {
        console.warn("No previous mapping for interact page:", curr);
    }
}

function loadPage() {
    // this is where this script decides which page to load 
    switch (currInteract) {
        case 5: 
            loadInteract5(); 
            nextIndex = 14;
            break;
        case 16:
            loadInteract16();
            nextIndex = 20;
            break;
        case 30: 
            loadInteract30(); 
            nextIndex = 41;
            break;
        case 40:
            loadInteract40();
            nextIndex = 30;
            break;
        case 49: 
            loadInteract49(); 
            nextIndex = 57;
            break;
        case 64: 
            loadInteract64(); 
            break;
    }
}
function purpleBoatSelect() {
    console.log("ourple");
    goToPage(6);
}
function orangeBoatSelect() {
    console.log("orange");
    goToPage(11);
}
function cannonSelect() {
    console.log("cannon");
    goToPage(17);
}
function swordSelect() {
    console.log("sword");
    goToPage(18);
}
function fruitsSelect() {
    console.log("fruits");
    goToPage(19);
}
function bedSelect() {
    console.log("bed");
    goToPage(31);
}
function recordsSelect() {
    console.log("records");
    goToPage(38);
}
function shelfSelect() {
    console.log("shelf");
    goToPage(35);
}
function toasterSelect() {
    console.log("toaster");
    goToPage(56);
}
function coffeeSelect() {
    console.log("coffee");
    goToPage(50);
}
function fruitBowlSelect() {
    console.log("fruit bowl");
    goToPage(54);
}

function setVRStyle() {
    // this should only happen in index 5
    background.src = "./Images/vr_ship_background.png";
    header.classList.add("vr-ship-header");
    buttons.forEach(el => { el.classList.add('button-vr-ship', 'vr-ship-a'); });
    textBox.classList.add("text-vr-ship"); 
    swit.classList.add("switch-vr-ship"); 
    previous.className = "vr-ship-a"; 
    next.className = "vr-ship-a";
}

function setWebStyle() { // for debugging - not needed in deployment
    background.src = "./Images/web_backgroud.png"; 
    header.classList.remove("vr-ship-header"); 
    buttons.forEach(el => { el.classList.remove('button-vr-ship', 'vr-ship-a'); }); 
    textBox.classList.remove("text-vr-ship"); 
    swit.classList.remove("switch-vr-ship"); 
    previous.className = "web-a"; 
    next.className = "web-a";
}

function buildHitbox({ top, left, width, height, onEnter, onLeave, onClick }) {
    const hitbox = document.createElement("div");

    hitbox.classList.add("hitbox");

    hitbox.style.position = "absolute";
    hitbox.style.top = top;
    hitbox.style.left = left;
    hitbox.style.width = width;
    hitbox.style.height = height;
    hitbox.style.zIndex = "20";
    hitbox.style.cursor = "pointer";

    if (DEBUG_MODE) {
        hitbox.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    }

    hitbox.addEventListener("mouseenter", () => {
        isHovering = true;

        outlineImages.forEach(img => img.style.opacity = "0");

        onEnter();
    });

    hitbox.addEventListener("mouseleave", () => {
        isHovering = false;
        onLeave();
    });

    if (onClick) {
        hitbox.addEventListener("mousedown", onClick);
    }

    interactArea.appendChild(hitbox);

    return hitbox;
}

function resetInteract() {
    // stop blinking loop
    if (blinkInterval) {
        clearInterval(blinkInterval);
        blinkInterval = null;
    }

    // remove ONLY dynamic elements
    const elementsToRemove = interactArea.querySelectorAll(
        ".interact-parts, .hitbox"
    );

    elementsToRemove.forEach(elem => elem.remove());

    if (interactText) { // reset text
        interactText.innerText = "";
    }

    // reset globals
    outlineImages = [];
    isHovering = false;
    blinkOn = true;
    next.hidden = false;
}

function startBlinking() {
    if (blinkInterval) return;

    blinkInterval = setInterval(() => {
        if (!isHovering) {
            blinkOn = !blinkOn;

            outlineImages.forEach(img => {
                img.style.opacity = blinkOn ? "1" : "0";
            });
        }
    }, 750); // ms
}

// load interactable pages
function loadInteract5() {
    setVRStyle();
    resetInteract();
    
    currInteract = 5;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_6_img/6_background.png";

    const purpleBoat = document.createElement("img");
    purpleBoat.src = "./Images/id_6_img/6_purple_boat.png";
    purpleBoat.classList.add("interact-parts", "boat");

    const orangeBoat = document.createElement("img");
    orangeBoat.src = "./Images/id_6_img/6_orange_boat.png";
    orangeBoat.classList.add("interact-parts", "boat");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_6_img/6_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(purpleBoat);
    interactArea.appendChild(orangeBoat);
    interactArea.appendChild(foreground);

    purpleBoat.style.opacity = "0";
    outlineImages.push(purpleBoat);

    orangeBoat.style.opacity = "0";
    outlineImages.push(orangeBoat);

    // hitbox for purple boat
    buildHitbox({
        top: "40%",
        left: "4%",
        width: "43%",
        height: "50%",
        onEnter: () => purpleBoat.style.opacity = "1",
        onLeave: () => purpleBoat.style.opacity = "0",
        onClick: () => purpleBoatSelect()
    });

    // hitbox for orange boat
    buildHitbox({
        top: "7.5%",
        left: "50.5%",
        width: "49%",
        height: "72.5%",
        onEnter: () => orangeBoat.style.opacity = "1",
        onLeave: () => orangeBoat.style.opacity = "0",
        onClick: () => orangeBoatSelect()
    });

    startBlinking();
} 

function loadInteract16() {
    setVRStyle();
    resetInteract();
    
    currInteract = 16;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_17_img/17_background.png";

    const cannon = document.createElement("img");
    cannon.src = "./Images/id_17_img/17_cannon.png";
    cannon.classList.add("interact-parts", "think");

    const sword = document.createElement("img");
    sword.src = "./Images/id_17_img/17_sword.png";
    sword.classList.add("interact-parts", "think");

    const fruits = document.createElement("img");
    fruits.src = "./Images/id_17_img/17_fruits.png";
    fruits.classList.add("interact-parts", "think");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_17_img/17_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(cannon);
    interactArea.appendChild(sword);
    interactArea.appendChild(fruits);
    interactArea.appendChild(foreground);

    cannon.style.opacity = "0"; // initial
    outlineImages.push(cannon);

    sword.style.opacity = "0";
    outlineImages.push(sword);

    fruits.style.opacity = "0";
    outlineImages.push(fruits);

    // hitbox for think
    buildHitbox({ 
        top: "13%",
        left: "13%",
        width: "23%",
        height: "28%",
        onEnter: () => cannon.style.opacity = "1",
        onLeave: () => cannon.style.opacity = "0",
        onClick: () => cannonSelect()
    });

    buildHitbox({ 
        top: "5%",
        left: "41%",
        width: "23%",
        height: "28%",
        onEnter: () => sword.style.opacity = "1",
        onLeave: () => sword.style.opacity = "0",
        onClick: () => swordSelect()
    });

    buildHitbox({ 
        top: "15%",
        left: "69%",
        width: "23%",
        height: "28%",
        onEnter: () => fruits.style.opacity = "1",
        onLeave: () => fruits.style.opacity = "0",
        onClick: () => fruitsSelect()
    });

    startBlinking();
}

function loadInteract30() {
    resetInteract();
    
    currInteract = 30;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_31_img/31_background.png";

    const bed = document.createElement("img");
    bed.src = "./Images/id_31_img/31_bed.png";
    bed.classList.add("interact-parts", "bedroom");

    const records = document.createElement("img");
    records.src = "./Images/id_31_img/31_records.png";
    records.classList.add("interact-parts", "bedroom");

    const shelf = document.createElement("img");
    shelf.src = "./Images/id_31_img/31_shelf.png";
    shelf.classList.add("interact-parts", "bedroom");

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_31_img/31_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(bed);
    interactArea.appendChild(records);
    interactArea.appendChild(shelf);
    interactArea.appendChild(foreground);

    bed.style.opacity = "0"; // initial
    outlineImages.push(bed);

    records.style.opacity = "0";
    outlineImages.push(records);

    shelf.style.opacity = "0";
    outlineImages.push(shelf);

    // hitbox for bed
    buildHitbox({ // lower hitbox
        top: "56%",
        left: "2.5%",
        width: "35%",
        height: "20%",
        onEnter: () => bed.style.opacity = "1",
        onLeave: () => bed.style.opacity = "0",
        onClick: () => bedSelect()
    });
    buildHitbox({ // upper hitbox
        top: "45%",
        left: "2.5%",
        width: "20%",
        height: "11%",
        onEnter: () => bed.style.opacity = "1",
        onLeave: () => bed.style.opacity = "0",
        onClick: () => bedSelect()
    });

    // hitbox for records
    buildHitbox({
        top: "43.5%",
        left: "25%",
        width: "10%",
        height: "12.5%",
        onEnter: () => records.style.opacity = "1",
        onLeave: () => records.style.opacity = "0",
        onClick: () => recordsSelect()
    });

    // hitbox for shelf
    buildHitbox({
        top: "38%",
        left: "35%",
        width: "35%",
        height: "18%",
        onEnter: () => shelf.style.opacity = "1",
        onLeave: () => shelf.style.opacity = "0",
        onClick: () => shelfSelect()
    });
    buildHitbox({
        top: "20%",
        left: "30%",
        width: "45%",
        height: "18%",
        onEnter: () => shelf.style.opacity = "1",
        onLeave: () => shelf.style.opacity = "0",
        onClick: () => shelfSelect()
    });

    startBlinking();
}

function loadInteract40() { 
    resetInteract();
    
    currInteract = 40;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/41.png";

    buildHitbox({
        top: "50%",
        left: "42%",
        width: "25%",
        height: "18%",
        onEnter: () => {},
        onLeave: () => {},
        onClick: () => loadFunny()
    });
}

function loadFunny() {
    goToPage(105);
}

function loadInteract49() {
    resetInteract();

    currInteract = 49;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    interactBG.src = "./Images/id_50_img/50_background.png";

    const toaster = document.createElement("img");
    toaster.src = "./Images/id_50_img/50_clearlyyouownatoaster.png";
    toaster.classList.add("interact-parts", "kitchen");

    const coffee = document.createElement("img");
    coffee.src = "./Images/id_50_img/50_coffee.png";
    coffee.classList.add("interact-parts", "kitchen");

    const fruitBowl = document.createElement("img");
    fruitBowl.src = "./Images/id_50_img/50_fruit_bowl.png";
    fruitBowl.classList.add("interact-parts", "kitchen");

    interactArea.appendChild(toaster);
    interactArea.appendChild(coffee);
    interactArea.appendChild(fruitBowl);

    toaster.style.opacity = "0"; // initial
    outlineImages.push(toaster);

    coffee.style.opacity = "0";
    outlineImages.push(coffee);

    fruitBowl.style.opacity = "0";
    outlineImages.push(fruitBowl);

    // toaster hitbox
    buildHitbox({ 
        top: "58%",
        left: "64%",
        width: "15%",
        height: "16%",
        onEnter: () => toaster.style.opacity = "1",
        onLeave: () => toaster.style.opacity = "0",
        onClick: () => toasterSelect()
    });

    // coffee hitbox
    buildHitbox({ 
        top: "38%",
        left: "61%",
        width: "12%",
        height: "15%",
        onEnter: () => coffee.style.opacity = "1",
        onLeave: () => coffee.style.opacity = "0",
        onClick: () => coffeeSelect()
    });

    // fruitBowl hitbox
    buildHitbox({ 
        top: "50%",
        left: "15%",
        width: "17%",
        height: "17%",
        onEnter: () => fruitBowl.style.opacity = "1",
        onLeave: () => fruitBowl.style.opacity = "0",
        onClick: () => fruitBowlSelect()
    });

    startBlinking();
}

function loadInteract64() {
    resetInteract();

    currInteract = 64;
    next.hidden = true;

    const page = getPageData(currInteract); // grab page
    interactText.innerText = page?.text || ""; // set text

    const sweaters = [];
    const sweaterConfigs = [
        { letter: "a", top: "20%", left: "0%", width: "15%", height: "75%" },
        { letter: "b", top: "20%", left: "15%", width: "14%", height: "75%" },
        { letter: "c", top: "20%", left: "29%", width: "9%", height: "75%" },
        { letter: "d", top: "20%", left: "38%", width: "12.5%", height: "75%" },
        { letter: "e", top: "20%", left: "50.5%", width: "14%", height: "75%" },
        { letter: "f", top: "20%", left: "64.5%", width: "13%", height: "75%" },
        { letter: "g", top: "20%", left: "77.5%", width: "11.5%", height: "75%" },
        { letter: "h", top: "20%", left: "89%", width: "11%", height: "75%" }
    ];

    let basePath = "./Images/id_65_img/65"; // can be a - h 
    let fileType = ".png" // append after specifier

    interactBG.src = "./Images/id_65_img/65_background.png";

    // iteration for all 8 sweater images, all will have the sweater class
    sweaterConfigs.forEach((config, i) => {
        const sweater = document.createElement("img");
        sweater.src = `${basePath}${config.letter}${fileType}`;
        sweater.classList.add("interact-parts", "sweater");
        sweater.style.opacity = "0";

        sweater.dataset.choice = config.letter;

        interactArea.appendChild(sweater);
        outlineImages.push(sweater);
        sweaters.push(sweater);

        buildHitbox({
            top: config.top,
            left: config.left,
            width: config.width,
            height: config.height,
            onEnter: () => sweater.style.opacity = "1",
            onLeave: () => sweater.style.opacity = "0",
            onClick: () => handleSweaterClick(config.letter)
        });
    });

    const foreground = document.createElement("img");
    foreground.src = "./Images/id_65_img/65_foreground.png";
    foreground.classList.add("interact-parts", "foreground");

    interactArea.appendChild(foreground);

    startBlinking();
}

function handleSweaterClick(theEvent) { // implement later

    switch(theEvent) {
        case "a": 
            // go to index 65 (different html)
            console.log("Selection A");
            goToPage(65);
            break;
        case "b": 
            // go to index 66 (different html)
            console.log("Selection B");
            goToPage(66);
            break;
        case "c": 
            // go to index 67 (different html) 
            console.log("Selection C");
            goToPage(67);
            break;
        case "d": 
            // go to index 68 (different html)
            console.log("Selection D");
            goToPage(68);
            break;
        case "e": 
            // go to index 69 (different html)
            console.log("Selection E");
            goToPage(69);
            break;
        case "f": 
            // go to index 70 (different html)
            console.log("Selection F");
            goToPage(70);
            break;
        case "g": 
            // go to index 71 (different html)
            console.log("Selection G");
            goToPage(71);
            break;
        case "h": 
            // go to index 72 (different html)
            console.log("Selection H");
            goToPage(72);
            break;
    }
}