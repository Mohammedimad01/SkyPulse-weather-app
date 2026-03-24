# 🌤️ SkyPulse — Live Weather App

A beautiful, real-time weather application built with HTML, CSS, and Vanilla JavaScript. SkyPulse allows users to instantly check current weather conditions for any city worldwide, featuring dynamic backgrounds that change based on the weather, a sleek modern UI with glassmorphism, and a responsive design.

<img width="1321" height="916" alt="Screenshot 2026-03-24 113129" src="https://github.com/user-attachments/assets/0fd67bfe-bae6-4f11-8e4f-719c91f71618" />
 <!-- Replace this with an actual screenshot of your app -->

## ✨ Features

- **🌍 Global Search:** Get accurate, real-time weather data for any city.
- **📍 Geolocation:** Instantly see the weather in your current location with one click.
- **🌡️ Unit Toggling:** Seamlessly switch between Celsius (°C) and Fahrenheit (°F).
- **🎨 Dynamic Backgrounds:** The app's gradient background changes dynamically to match the current weather conditions (e.g., clear, rain, clouds, snow).
- **📊 Comprehensive Data:** Displays temperature, "feels like" temperature, humidity, wind speed, pressure, visibility, and sunrise/sunset times.
- **📱 Fully Responsive:** Optimized for both desktop and mobile devices.

## 🛠️ Built With

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Styling:** Custom CSS with CSS Variables, Flexbox, Grid, and Glassmorphism effects.
- **API:** [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather Data).
- **Icons:** SVG icons embedded directly into the HTML.

## Getting Started Locally

To run this project on your local machine, follow these steps:

### Prerequisites

You will need a free API key from OpenWeatherMap.
1. Go to [OpenWeatherMap](https://openweathermap.org/) and sign up for a free account.
2. Navigate to your API Keys section and generate a new key.

### Installation

1. **Clone or Download the Repository:**
   Download the source code as a ZIP file or clone it using Git:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   ```

2. **Set up the API Key:**
   - Create a file named `config.js` in the root folder of the project.
   - Add your API key to the file like this:
     ```javascript
     const API_KEY = 'ENTER_YOUR_API_KEY_HERE';
     ```
   *(Note: `config.js` is ignored by `.gitignore` to keep your key secure!)*

3. **Run the App:**
   - Simply open `index.html` in your web browser.
   - For a better development experience, use an extension like **Live Server** in VS Code.

## 🔒 Security Note (For GitHub Deployments)

Since this is a front-end only application, API keys cannot be perfectly hidden from the browser. However, to prevent automated bots from scraping the key from the public GitHub repository:
- The API key is stored locally in `config.js` (which is in `.gitignore`).
- For the live site on GitHub Pages, the key is securely injected during the build process using **GitHub Secrets** and **GitHub Actions**.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is available under the [MIT License](LICENSE).
