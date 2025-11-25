const apiKey = "3e04dee986b3b9b37bbda3d8cf171a1f"; // Note: Exposing API keys in client-side code is not secure for production.

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Search Suggestions
const cityInput = document.getElementById("city");
const suggestionsBox = document.getElementById("suggestions");

let debounceTimer;

cityInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    const query = this.value.trim();

    if (query.length < 2) {
        suggestionsBox.innerHTML = "";
        return;
    }

    debounceTimer = setTimeout(() => {
        fetchSuggestions(query);
    }, 300);
});

function fetchSuggestions(query) {
    const limit = 5;
    // Use Open-Meteo Geocoding API which supports states and broader regions
    // Filter by country_code=IN for Indian-centric results
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=${limit}&language=en&format=json&country_code=IN`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            suggestionsBox.innerHTML = "";
            if (!data.results || data.results.length === 0) return;

            data.results.forEach(location => {
                const item = document.createElement("a");
                item.className = "list-group-item list-group-item-action";
                // Open-Meteo returns 'admin1' which is usually the state/province
                // Avoid redundant display if name and state are the same
                const state = (location.admin1 && location.admin1 !== location.name) ? `, ${location.admin1}` : "";
                const country = location.country_code ? `, ${location.country_code}` : "";
                item.textContent = `${location.name}${state}${country}`;

                item.addEventListener("click", function () {
                    cityInput.value = location.name; // Optional: update input
                    suggestionsBox.innerHTML = ""; // Clear suggestions
                    fetchWeatherByCoords(location.latitude, location.longitude, location.name, location.admin1, location.country_code);
                });

                suggestionsBox.appendChild(item);
            });
        })
        .catch(err => console.error("Error fetching suggestions:", err));
}

// Close suggestions when clicking outside
document.addEventListener("click", function (e) {
    if (e.target !== cityInput && e.target !== suggestionsBox) {
        suggestionsBox.innerHTML = "";
    }
});

function fetchWeatherByCoords(lat, lon, name, state, country) {
    const result = document.getElementById("result");
    const searchBtn = document.querySelector('.btn-search');

    // Stop animation
    if (searchBtn) {
        searchBtn.classList.add('no-animation');
    }

    // Show loading state
    result.innerHTML = `<div class="text-center mt-4"><div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div></div>`;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en&aqi=yes`;

    fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
            const weatherDescription = data.weather[0].description;
            const icon = data.weather[0].icon;
            const temp = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Avoid redundant display if name and state are the same
            const stateStr = (state && state !== name) ? `, ${state}` : "";

            result.innerHTML = `
                <div class="animate__animated animate__fadeInUp">
                    <h2 class="text-center mb-4">${name}${stateStr}, ${country}</h2>
                    <div class="text-center mb-4">
                        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${weatherDescription}" class="weather-icon">
                        <h3 class="display-4 fw-bold">${temp}°C</h3>
                        <p class="lead text-capitalize">${weatherDescription}</p>
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="weather-details-card text-center">
                                <i class="bi bi-thermometer-half fs-3 mb-2"></i>
                                <p class="mb-0">Feels Like</p>
                                <h5 class="fw-bold">${feelsLike}°C</h5>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="weather-details-card text-center">
                                <i class="bi bi-droplet-fill fs-3 mb-2"></i>
                                <p class="mb-0">Humidity</p>
                                <h5 class="fw-bold">${humidity}%</h5>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="weather-details-card text-center">
                                <i class="bi bi-wind fs-3 mb-2"></i>
                                <p class="mb-0">Wind Speed</p>
                                <h5 class="fw-bold">${windSpeed} m/s</h5>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch((error) => {
            console.error(error);
            result.innerHTML = `
                <div class="alert alert-danger animate__animated animate__shakeX" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Error fetching weather data.
                </div>
            `;
        });
}

// Keep original getWeather for Enter key / Search button if user doesn't pick from list
function getWeather() {
    const cityInput = document.getElementById("city");
    const city = sanitizeInput(cityInput.value.trim());

    if (!city) return;

    // Use Open-Meteo for manual search as well to support states
    // Filter by country_code=IN for Indian-centric results
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json&country_code=IN`;

    const result = document.getElementById("result");
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.classList.add('no-animation');
    }

    fetch(geoUrl)
        .then(res => res.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                result.innerHTML = `<div class="alert alert-warning">Location not found.</div>`;
                return;
            }
            const loc = data.results[0];
            fetchWeatherByCoords(loc.latitude, loc.longitude, loc.name, loc.admin1, loc.country_code);
        })
        .catch(err => {
            console.error(err);
            result.innerHTML = `<div class="alert alert-danger">Error searching location.</div>`;
        });
}


// Dark Mode Toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        toggleSwitch.checked = false;
    } else {
        document.body.classList.remove('light-mode');
        toggleSwitch.checked = true;
    }
} else {
    // Default to Dark Mode if no preference
    document.body.classList.remove('light-mode');
    toggleSwitch.checked = true;
}

// Enter key support
document.getElementById("city").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getWeather();
    }
});

// PWA Install Prompt Logic
let deferredPrompt;
const pwaInstallPrompt = document.getElementById('pwa-install-prompt');
const installBtn = document.getElementById('pwa-install-btn'); // Mobile button
const dismissBtn = document.getElementById('pwa-dismiss-btn');
const desktopInstallBtn = document.getElementById('desktop-install-btn'); // Desktop button

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    // Check if user is on mobile (simple check)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // Update UI notify the user they can install the PWA
        pwaInstallPrompt.classList.remove('d-none');
    } else {
        // Desktop: Show navbar button
        if (desktopInstallBtn) {
            desktopInstallBtn.style.display = 'inline-block';
        }
    }
});

// Mobile Install Action
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        // Hide the app provided install promotion
        pwaInstallPrompt.classList.add('d-none');
        // Show the install prompt
        if (deferredPrompt) {
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
        }
    });
}

// Desktop Install Action
if (desktopInstallBtn) {
    desktopInstallBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            // Hide button after install
            desktopInstallBtn.style.display = 'none';
        }
    });
}

if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
        pwaInstallPrompt.classList.add('d-none');
    });
}

window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    if (pwaInstallPrompt) pwaInstallPrompt.classList.add('d-none');
    if (desktopInstallBtn) desktopInstallBtn.style.display = 'none';

    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    console.log('PWA was installed');
});
