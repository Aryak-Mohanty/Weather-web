# Weather Website 🌦️

Live Site: https://aryak-mohanty.github.io/Weather-web/
Daily Degrees is a feature-rich, responsive Progressive Web App (PWA) designed to provide instant weather updates. Accessible via the link above, this application delivers real-time temperature, humidity, and wind data through a polished user interface that works seamlessly across desktop and mobile devices.


<h2>🚀 Key Features</h2>
<ul>
  <li>Real-Time Weather Data: Retrieves current conditions (Temperature, "Feels Like", Humidity, Wind Speed) using the OpenWeatherMap API.</li>
  <li>Smart Search: Features an auto-complete search bar powered by the Open-Meteo Geocoding API to provide accurate city and state suggestions.</li>
  <li>Progressive Web App (PWA): Fully installable on mobile and desktop devices, including a custom Service Worker for resource caching and offline capabilities.</li>
  <li>Theme Toggle: Includes a built-in Dark/Light mode switcher that persists user preference via local storage.</li>
  <li>Responsive Design: Built with Bootstrap 5 and custom CSS to ensure a sleek "glassmorphism" look on any screen size.</li>
</ul>


<h2>🛠️ Tech Stack</h2>

Frontend: HTML5, CSS3, JavaScript (ES6+)
Styling: Bootstrap 5, Custom CSS with Animate.css
APIs:
<ul>
  <li>OpenWeatherMap API (Weather Data)</li>
  <li>Open-Meteo API (Geocoding/Search Suggestions)</li>
</ul>


<h2>📦 Installation & Setup</h2>
To run this project locally: 
<ol>
  <li>Clone the repository:
<pre><code>git clone https://github.com/Aryak-Mohanty/Weather-web.git</code></pre>
</li>
  <li>Run the application: Open index.html in your web browser.  </li>
</ol>

Note: <b>To fully test PWA features (like the service worker), it is recommended to serve the files using a local server (e.g., Live Server) rather than opening the file directly.</b>


<h2>🐞 Known Bugs</h2>
<ol>
  <li>Offline Functionality Limitations: While the Service Worker caches core assets (index.html, style.css, etc.), live weather data retrieval requires an active internet connection. The app currently displays a generic error or stale data when offline.</li>
  <li>API Key Exposure: The API key is stored directly in script.js. This is not secure for production environments and should be moved to a backend proxy server to prevent misuse.</li>
  <li>Search Suggestions Caching: Search suggestions from the Geocoding API are not currently cached, leading to redundant network calls on repeated searches.</li>
</ol>


<h2>✨ Future Scope</h2>
<ol>
  <li>5-Day Forecast Integration: Extend the application to fetch and display a multi-day (e.g., 5-day or 7-day) forecast to provide more utility.</li>
  <li>Current Location Support: Implement a feature to automatically detect the user's current location using the Geolocation API upon launch.</li>
  <li>Enhanced Caching Strategy: Update the Service Worker to use a Cache-and-Network-Race strategy for API calls, improving performance and reliability.</li>
  <li>Error Handling: Improve user-facing error messages, specifically when the OpenWeatherMap API returns a "City not found" or "API limit reached" error.</li>
  <li>Unit Switching: Add a toggle to switch between Celsius (°C) and Fahrenheit (°F).</li>
</ol>


<h2>📄 License & Usage</h2>
This project is developed for educational and personal use. Redistribution or replication without permission is discouraged. API keys included in this project should not be reused for production systems.
