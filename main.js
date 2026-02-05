var saveDataObject = {
    // Depth dug so far in feet, resets every requiredDepth feet and is converted to a well
    depth : 0,
    // Default depth required to create a well is 10 feet. This will increase with more wells dug
    requiredDepth : 10,
    // Number of wells dug so far, these contribute to the water gain amount
    wells : 0,
    // Number of diggers hired to dig more wells for you
    diggers : 0,
    // Gallons of water currently owned
    water : 0,
    // Maximum gallons of water you can store
    maxWater : 10,
    // How much money you currently have
    money : 0,
    // How much money you are selling each gallon of water for
    waterPrice : 1,
    // Current demand for water in gallons based on the current price
    // This is basically how much water is sold per 1 second interval
    demand : 1,
    // Demand multiplier from advertisements
    demandBoost : 1,
    // Certain policies like finding new land will increase the efficiency
    // of digging wells, lowering the required depth per well by this %
    depthSavings : 1,
    // City population, effects demand
    population : 1,
    // Price to expand water storage
    waterStoragePrice : 10,
    // Price to buy rights to new dig spots
    findNewDigSpotsPrice : 30,
    // Price to encourage population growth
    encouragePrice : 15,
    // Price to advertise well business
    advertisePrice : 10,
    // Depth to dig per player click
    digPower : 1,
    // Price to upgrade player equipment
    equipPrice : 5,
    // Switch to determine if population should naturally increase over time
    allowNaturalPopulationGrowth : true,
    naturalGrowthAmount : 1,
    secondsForPopulationGrowth : 60,
    currentPopulationGrowthCounter : 0,
    increaseNaturalGrowthPrice : 5
};

// Do all initialization tasks like hiding locked elements
function init() {
    document.getElementById("pWells").style.display = 'none';
    document.getElementById("pWater").style.display = 'none';
    document.getElementById("pLandRights").style.display = 'none';
    document.getElementById("pEncourage").style.display = 'none';
    document.getElementById("pHire").style.display = 'none';
    document.getElementById("pAdvert").style.display = 'none';
    document.getElementById("pEquipment").style.display = 'none';
    document.getElementById("pFliers").style.display = 'none';
}
init();

// Save all current data as a JSON object and download that as a file
function saveData() {
    const jsonString = JSON.stringify(saveDataObject);
    localStorage.setItem('userData', jsonString);
    console.log(jsonString);
};

// Load game data from a given JSON file
function loadData() {
    const storedString = localStorage.getItem('userData');
    saveDataObject = JSON.parse(storedString);
    console.log(saveDataObject);
    unlockWater();
    unlockMoney();
};

function digClick(number) {
    saveDataObject.depth = saveDataObject.depth + number;
    while (saveDataObject.depth >= saveDataObject.requiredDepth) {
        saveDataObject.depth -= saveDataObject.requiredDepth;
        saveDataObject.wells += 1;
        unlockWater()
    }
    saveDataObject.requiredDepth = (10 + saveDataObject.wells**2) * saveDataObject.depthSavings;
    document.getElementById("depth").innerHTML = Math.round(saveDataObject.depth * 10) / 10;
    document.getElementById("requiredDepth").innerHTML = saveDataObject.requiredDepth;
    document.getElementById("wells").innerHTML = saveDataObject.wells;
};

function unlockWater() {
    document.getElementById("pWells").style.display = 'block';
    document.getElementById("pWater").style.display = 'block';
};

function unlockMoney() {
    if (saveDataObject.money >= 30) {
        document.getElementById("pLandRights").style.display = 'block';
    }
    if (saveDataObject.money >= 15) {
        document.getElementById("pEncourage").style.display = 'block';
    }
    if (saveDataObject.money >= 10) {
        document.getElementById("pHire").style.display = 'block';
        document.getElementById("pAdvert").style.display = 'block';
    }
    if (saveDataObject.money >= 5) {
        document.getElementById("pEquipment").style.display = 'block';
        document.getElementById("pFliers").style.display = 'block';
    }
};

function gainWater() {
    var waterGain = saveDataObject.wells * 0.1;
    saveDataObject.water += waterGain;
    if (saveDataObject.water > saveDataObject.maxWater) {
        saveDataObject.water = saveDataObject.maxWater;
    }
    document.getElementById("water").innerHTML = Math.round(saveDataObject.water * 10) / 10;
    document.getElementById("maxWater").innerHTML = saveDataObject.maxWater;
};

function increaseWaterPrice(amount) {
    saveDataObject.waterPrice += amount;
    document.getElementById("waterPrice").innerHTML = Math.round(saveDataObject.waterPrice * 10) / 10;
};

function decreaseWaterPrice(amount) {
    if (saveDataObject.waterPrice - amount > 0) {
        saveDataObject.waterPrice -= amount;
    }
    document.getElementById("waterPrice").innerHTML = Math.round(saveDataObject.waterPrice * 10) / 10;
};

function sellWater() {
    // Calculate current demand based on set price
    saveDataObject.demand = saveDataObject.demandBoost * (0.15 * (saveDataObject.population / saveDataObject.waterPrice));
    if (saveDataObject.demand > 0 & saveDataObject.water >= saveDataObject.demand) {
        saveDataObject.water -= saveDataObject.demand;
        saveDataObject.money += saveDataObject.demand * saveDataObject.waterPrice;
    }
    document.getElementById("water").innerHTML = Math.round(saveDataObject.water * 10) / 10;
    document.getElementById("demand").innerHTML = Math.round(saveDataObject.demand * 100) / 100;
    document.getElementById("money").innerHTML = Math.round(saveDataObject.money * 100) / 100;
    var waterProducedPerSecond = saveDataObject.wells * 0.1;
    document.getElementById("galProducedPerSecond").innerHTML = Math.round(waterProducedPerSecond * 100) / 100;
    document.getElementById("galSellPercentage").innerHTML = Math.round((saveDataObject.demand / waterProducedPerSecond) * 100);
    document.getElementById("moneyPerSecond").innerHTML = Math.round(saveDataObject.demand * saveDataObject.waterPrice * 100) / 100;
    unlockMoney();
};

function hireDigger(){
    var diggerCost = Math.floor(10 * Math.pow(1.1,saveDataObject.diggers));     //works out the cost of this digger
    if(saveDataObject.money >= diggerCost){                                   //checks that the player can afford the digger
        saveDataObject.diggers = saveDataObject.diggers + 1;                                   //increases number of diggers
    	saveDataObject.money = saveDataObject.money - diggerCost;                          //removes the cookies spent
        document.getElementById('diggers').innerHTML = saveDataObject.diggers;  //updates the number of diggers for the user
        document.getElementById('depth').innerHTML = saveDataObject.depth;  //updates the number of cookies for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,saveDataObject.diggers));       //works out the cost of the next digger
    document.getElementById('diggerCost').innerHTML = nextCost;  //updates the digger cost for the user
};

function playerDigClick() {
    digClick(saveDataObject.digPower);
};

function buyWaterStorage(number) {
    if (saveDataObject.money >= saveDataObject.waterStoragePrice) {
        saveDataObject.money -= saveDataObject.waterStoragePrice;
        saveDataObject.maxWater += number;
    }
    document.getElementById('money').innerHTML = Math.round(saveDataObject.money * 100) / 100;
    document.getElementById('maxWater').innerHTML = saveDataObject.maxWater;
};

function findNewDigSpots(percentChange) {
    if (saveDataObject.money >= saveDataObject.findNewDigSpotsPrice) {
        saveDataObject.money -= saveDataObject.findNewDigSpotsPrice;
        saveDataObject.findNewDigSpotsPrice = 2 * saveDataObject.findNewDigSpotsPrice;
        saveDataObject.depthSavings -= saveDataObject.percentChange;
        document.getElementById('money').innerHTML = Math.round(saveDataObject.money * 100) / 100;
        document.getElementById('depthSavings').innerHTML = Math.round(saveDataObject.depthSavings * 100);
        document.getElementById('requiredDepth').innerHTML = Math.round(((10 + saveDataObject.wells^2) * saveDataObject.depthSavings * 10) / 10);
        document.getElementById('findNewDigSpotsPrice').innerHTML = Math.round((saveDataObject.findNewDigSpotsPrice * 10) / 10);
    }
};

function encourageGrowth(number) {
    if (saveDataObject.money >= saveDataObject.encouragePrice) {
        saveDataObject.money -= saveDataObject.encouragePrice;
        saveDataObject.population = (saveDataObject.population + 1) * 2;
        saveDataObject.encouragePrice = saveDataObject.encouragePrice * 2;
    }
    document.getElementById('money').innerHTML = Math.round(saveDataObject.money * 100) / 100;
    document.getElementById('population').innerHTML = saveDataObject.population;
    document.getElementById('encouragePrice').innerHTML = saveDataObject.encouragePrice;
};

function buyEquipment() {
    if (saveDataObject.money >= saveDataObject.equipPrice) {
        saveDataObject.money -= saveDataObject.equipPrice;
        saveDataObject.digPower = saveDataObject.digPower * 2;
        saveDataObject.equipPrice = saveDataObject.equipPrice * 3;
    }
    document.getElementById('money').innerHTML = Math.round(saveDataObject.money * 100) / 100;
    document.getElementById('digPower').innerHTML = saveDataObject.digPower;
    document.getElementById('digPower2').innerHTML = saveDataObject.digPower;
    document.getElementById('equipPrice').innerHTML = saveDataObject.equipPrice;
};

function advertise(number) {
    if (saveDataObject.money >= saveDataObject.advertisePrice) {
        saveDataObject.money -= saveDataObject.advertisePrice;
        saveDataObject.demandBoost += 0.1;
        saveDataObject.advertisePrice = saveDataObject.advertisePrice * 3;
    }
    document.getElementById('money').innerHTML = Math.round(saveDataObject.money * 100) / 100;
    document.getElementById("demand").innerHTML = Math.round(saveDataObject.demand * 100) / 100;
    document.getElementById('advertisePrice').innerHTML = saveDataObject.advertisePrice;
};

function toggleNaturalGrowth() {
    saveDataObject.allowNaturalPopulationGrowth = !saveDataObject.allowNaturalPopulationGrowth;
    if (saveDataObject.allowNaturalPopulationGrowth) {
        document.getElementById('natGrowthOnOrOff').innerHTML = "OFF";
    }
    else {
        document.getElementById('natGrowthOnOrOff').innerHTML = "ON";
    }
};

function increaseNaturalGrowthAmount(number) {
    if (saveDataObject.money >= saveDataObject.increaseNaturalGrowthPrice) {
        saveDataObject.money -= saveDataObject.increaseNaturalGrowthPrice;
        saveDataObject.naturalGrowthAmount += number;
        saveDataObject.increaseNaturalGrowthPrice = saveDataObject.increaseNaturalGrowthPrice * 2;
    }
    document.getElementById('money').innerHTML = Math.round(saveDataObject.money * 100) / 100;
    document.getElementById('increaseNaturalGrowthPrice').innerHTML = saveDataObject.increaseNaturalGrowthPrice;
    document.getElementById('naturalGrowthAmount').innerHTML = saveDataObject.naturalGrowthAmount;
};

// Main loop
window.setInterval(function() {
    // By default diggers dig 0.5 feet per second
	digClick(saveDataObject.diggers * 0.5);
    // Determine how much water to sell based on demand
    sellWater();
    // Calculate and gain water based on your number of wells
    gainWater();
    // Determine if population should grow naturally
    if (saveDataObject.allowNaturalPopulationGrowth) {
        saveDataObject.currentPopulationGrowthCounter += 1;
        if (saveDataObject.currentPopulationGrowthCounter >= saveDataObject.secondsForPopulationGrowth) {
            saveDataObject.population += saveDataObject.naturalGrowthAmount;
            saveDataObject.currentPopulationGrowthCounter = 0;
            document.getElementById('population').innerHTML = saveDataObject.population;
        }
        document.getElementById('currentNatGrowth').innerHTML = saveDataObject.currentPopulationGrowthCounter;
    }
}, 1000);
