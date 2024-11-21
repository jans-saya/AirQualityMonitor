# Air Quality Monitoring Dashboard

A real-time air quality monitoring system that visualizes various environmental parameters including temperature, humidity, and air pollutants. The dashboard provides instant visual feedback about air quality conditions with color-coded health status indicators.

## Features

- **Real-time Monitoring**
  - Temperature (°C)
  - Humidity (%)
  - PM2.5 (µg/m³)
  - Various gas levels (NOx, CO2, SO2, VOC)

- **Visual Indicators**
  - Gauge charts for main metrics
  - Bar chart for gas levels
  - Donut chart for pollutant distribution
  - Color-coded health status:
    - 🟢 Turquoise: Safe Level
    - 🟡 Yellow: Caution Level
    - 🔴 Red: Warning Level

- **Auto-updating Data**
  - Refreshes every 5 minutes
  - Location-based measurements
  - Real-time API integration

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js for visualizations
- OpenWeatherMap API for data
- Tailwind CSS for styling

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/air-quality-monitor.git
```

2. Navigate to project directory:
```bash
cd air-quality-monitor
```

3. Set up API key:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/)
   - Get your API key
   - Replace `YOUR_API_KEY` in `script.js` with your actual API key

4. Configure location:
   - Update latitude and longitude in `script.js`:
```javascript
const LOCATION = {
    lat: YOUR_LATITUDE,
    lon: YOUR_LONGITUDE
};
```

5. Open `index.html` in a web browser

## Usage

The dashboard displays:
- Top row: Main metrics with gauge charts
- Middle row: Detailed gas levels and pollutant distribution
- Bottom row: Individual pollutant measurements
- Color indicators show health risk levels for each measurement

## API Integration

This project uses the OpenWeatherMap API:
- Air Pollution API for pollutant data
- Weather API for temperature and humidity
- Updates every 5 minutes
- Requires valid API key

## Project Structure

```
air-quality-monitor/
│
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```
