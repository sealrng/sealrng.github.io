let game = {
    balance: 0,
    weight: 0
};
let viewingFishCard = false;

const fish = [
    // Common
    { name: "Salmon", emoji: "🐟", weight: 100, "category": "Common" },
    { name: "Tropical Fish", emoji: "🐠", weight: 58, "category": "Common" },
    // Uncommon
    { name: "Cod", emoji: "🎣", weight: 857, "category": "Uncommon" },
    // Rare
    { name: "Clownfish", emoji: "🤡", weight: 468, "category": "Rare" },
    { name: "Mackerel", emoji: "🎣", weight: 600, "category": "Legendary" },
    { name: "Pufferfish", emoji: "🐡", weight: 300, "category": "Legendary" },
    // Legendary
    { name: "Sword Fish", emoji: "⚔️", weight: 2599, "category": "Legendary" },
    { name: "European Sea Sturgeon", emoji: "🦈", weight: 3896, "category": "Legendary" },
    // Epic
    { name: "Golden Seal", emoji: "🪙", weight: 10000, "category": "Epic" },
];

const exchangeRates = {
    "Common": 0.01,
    "Uncommon": 0.7,
    "Rare": 1,
    "Legendary": 3,
    "Epic": 10,
};

const rollSound = new Audio("./assets/click.wav");

function loadGame() {
    try {
        let savedData = JSON.parse(localStorage.getItem("seal_rng_data"));
        game = { ...game, ...savedData };
    } catch (err) {
        console.error(`Error fetching save data: ${err}`);
    };
};

function saveGame() {
    try {
        localStorage.setItem("seal_rng_data", JSON.stringify(game));
    } catch (err) {
        console.error(`Error saving game data: ${err}`);
    };
};

function getRandomFish() {
    let res = Math.floor(Math.random() * 100);
    let selection = fish;
    if (res < 5) {
        if (Math.random() > 0.8) {
            selection = selection.filter(f => f.category == "Epic");
        } else {
            return getRandomFish();
        };
    } else if (res < 20) {
        selection = selection.filter(f => f.category == "Legendary");
    } else if (res < 40) {
        selection = selection.filter(f => f.category == "Rare");
    } else if (res < 60) {
        selection = selection.filter(f => f.category == "Uncommon");
    } else {
        selection = selection.filter(f => f.category == "Common");
    };
    console.log(`You rolled a ${res}`);
    return selection[Math.floor(Math.random() * selection.length)]; // TODO: make it random based off of categories
};

function playSound(src) {
    let a = new Audio(src);
    a.play();
    a.addEventListener("ended", () => { a.remove(); delete a; });
};

// https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

loadGame();

// Actions
// document.getElementById("game").addEventListener("click", () => {
//     let card = document.getElementById("fishCard");
//     if (!viewingFishCard) {
//         viewingFishCard = true;

//         document.getElementById("catchText").textContent = "Waiting for fish...";
//         setTimeout(() => {
//             document.getElementById("catchText").textContent = "Caught!";
//         }, 1000);
//         setTimeout(() => {
//             let caughtFish = getRandomFish();
//             card.querySelectorAll("p")[0].textContent = `Category: ${caughtFish.category}`;
//             card.querySelectorAll("p")[1].textContent = `Weight: ${caughtFish.weight}`;
//             card.querySelectorAll("p")[2].textContent = `Price: $${caughtFish.weight * 5}`;

//             game.balance += caughtFish.weight * 5;
//             game.weight += caughtFish.weight;

//             card.classList.remove("fadeout");
//             card.classList.add("fadein");
            
//             document.getElementById("catchText").textContent = "Click to cast!";
//         }, 1500);
//     } else {
//         card.classList.add("fadeout");
//         card.classList.remove("fadein");
//         setTimeout(() => { viewingFishCard = false; }, 500);
//     };
// });

document.getElementById("roll").addEventListener("click", () => {
    let card = document.getElementById("fishCard");
    if (!viewingFishCard) {
        viewingFishCard = true;
        document.getElementById("roll").classList.add("disabled");

        let a = Math.floor(Math.random() * 20);
        let caughtFish = getRandomFish();

        for (let i = 0; i < a; i++) {
            setTimeout(() => {
                caughtFish = getRandomFish();
                rollSound.currentTime = 0;
                rollSound.play();

                card.querySelector("h5").textContent = `${caughtFish.emoji} ${caughtFish.name}`;
                document.getElementById("fishCategory").textContent = `Category: ${caughtFish.category}`;
                document.getElementById("fishWeight").textContent = `Weight: ${formatNumber(caughtFish.weight)}`;
                document.getElementById("fishPrice").textContent = `Price: $${formatNumber(caughtFish.weight * exchangeRates[caughtFish.category])}`;
            }, i * 100);
        };

        setTimeout(() => {
            game.weight += caughtFish.weight;
            game.balance += caughtFish.weight * exchangeRates[caughtFish.category];
            game.balance = Number(game.balance.toFixed(2));
            viewingFishCard = false;
            document.getElementById("roll").classList.remove("disabled");
        }, a * 100 + 500);
    };
});

// Balance & Weight update
setInterval(() => {
    document.getElementById("balance").textContent = `Balance: $${formatNumber(game.balance)}`;
    document.getElementById("weight").textContent = `Weight: ${formatNumber(game.weight)}lb`;
}, 100);

// Auto-save data
setInterval(() => {
    saveGame();
}, 10000);
