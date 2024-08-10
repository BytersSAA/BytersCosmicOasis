// Initialize station parameters with ideal values for fuel storage
let oxygenLevel = 20;       // in percentage
let temperature = -30;      // ideal temperature for fuel storage in °C
let humidity = 10;          // ideal humidity level in percentage
let pressure = 200;         // ideal pressure in hPa (2 bar)
let fuelLevel = 5;          // set initial fuel level to 5%
let docked = false;         // docking status
let refuelingInterval;      // variable to hold the refueling interval

// Load fuel level from localStorage if it exists, otherwise keep the initial value
//if (localStorage.getItem("fuelLevel")) {
   // fuelLevel = parseInt(localStorage.getItem("fuelLevel"));
//}

// Function to update the display for station parameters
function updateStationDisplay() {
    document.getElementById("oxygen-level").innerText = oxygenLevel;
    document.getElementById("temperature").innerText = temperature;
    document.getElementById("humidity").innerText = humidity;
    document.getElementById("pressure").innerText = pressure;
    document.getElementById("fuel-level").innerText = fuelLevel;
    document.getElementById("dock-status").innerText = docked ? "Docked" : "Undocked";
    document.getElementById("refuel-button").disabled = !docked; // Enable refuel only when docked
}

// Function to dock the rocket
function dockRocket() {
    if (!docked) {
        docked = true;
        alert("Rocket has been docked!");
        updateStationDisplay();
    } else {
        alert("Rocket is already docked!");
    }
}

// Function to undock the rocket
function undockRocket() {
    if (docked) {
        docked = false;
        clearInterval(refuelingInterval); // Stop refueling
        alert("Rocket has been undocked! Refueling stopped.");
        updateStationDisplay();
    } else {
        alert("Rocket is already undocked!");
    }
}

// Function to start refueling the rocket
function startRefueling() {
    if (docked) {
        // Start the refueling interval only if it's not already running
        if (!refuelingInterval) {
            refuelingInterval = setInterval(() => {
                if (fuelLevel < 100) {
                    const fuelIncrease = Math.floor(Math.random() * 1) + 1; // Increase by 1-5
                    fuelLevel += fuelIncrease;

                    // Ensure fuel level does not exceed 100
                    if (fuelLevel > 100) {
                        fuelLevel = 100;
                    }

                    // Store the new fuel level in localStorage
                    localStorage.setItem("fuelLevel", fuelLevel);
                    updateStationDisplay();
                    console.log(`Rocket refueled by ${fuelIncrease}%. Current fuel level: ${fuelLevel}%`);
                } else {
                    alert("Rocket is already fully fueled!"); // Alert if already full
                    clearInterval(refuelingInterval); // Stop refueling when full
                    refuelingInterval = null; // Reset interval reference
                }
            }, 600); // Refuel every 1 seconds
        } else {
            alert("Refueling is already in progress."); // Alert if trying to start refueling again
        }
    } else {
        alert("Cannot refuel as the rocket is UNDOCKED!"); // Error message when undocked
    }
}

// Function to stop refueling the rocket
function stopRefueling() {
    if (refuelingInterval) {
        clearInterval(refuelingInterval); // Stop refueling
        refuelingInterval = null; // Reset interval reference
        alert("Refueling stopped manually.");
    } else {
        alert("Refueling is not currently in progress.");
    }
}

// Function to get the real-time location of the ISS
async function fetchIssLocation() {
    try {
        const response = await fetch("https://api.open-notify.org/iss-now.json");
        const data = await response.json();
        const { latitude, longitude } = data.iss_position;

        document.getElementById("latitude").innerText = latitude;
        document.getElementById("longitude").innerText = longitude;
    } catch (error) {
        console.error("Error fetching ISS location:", error);
    }
}

// Set interval to fetch location every 5 seconds
setInterval(fetchIssLocation, 5000);

// Initial fetch of ISS location
fetchIssLocation();

// Add event listeners to the buttons
document.getElementById("dock-button").addEventListener("click", dockRocket);
document.getElementById("undock-button").addEventListener("click", undockRocket);
document.getElementById("refuel-button").addEventListener("click", startRefueling);
document.getElementById("stop-refuel-button").addEventListener("click", stopRefueling);

// Display initial values
updateStationDisplay();