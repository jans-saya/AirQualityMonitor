// Configuration
const API_KEY = '7ee4d6ec368f68230ddbd2dab8e7d2e1';
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCATION = {
    lat: 35.234017,
    lon: 129.080699
};

const CHART_COLORS = {
    primary: '#40E0D0',
    secondary: '#4DA6FF',
    tertiary: '#7C4DFF',
    quaternary: '#FF4D4D',
    quinary: '#FFD700'
};

// charts
function createGauge(canvasId, value, min, max) {
    return new Chart(document.getElementById(canvasId), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, max - value],
                backgroundColor: [CHART_COLORS.primary, '#2a2a2a'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: -90,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            layout: { padding: 8 }
        }
    });
}

// Update charts with new data
function updateCharts(data) {
    // Gas levels chart
    new Chart(document.getElementById('gasLevelsChart'), {
        type: 'bar',
        data: {
            labels: ['NOx', 'NH3', 'CO2', 'SO2', 'VOC'],
            datasets: [{
                label: 'Concentration',
                data: [data.no2, data.nh3, data.co, data.so2, data.nh3],
                backgroundColor: CHART_COLORS.primary,
                barThickness: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#333' },
                    ticks: { 
                        color: '#fff',
                        font: { size: 10 }
                    }
                },
                x: {
                    grid: { color: '#333' },
                    ticks: { 
                        color: '#fff',
                        font: { size: 10 }
                    }
                }
            }
        }
    });

    // Particle distribution chart
    new Chart(document.getElementById('particleChart'), {
        type: 'doughnut',
        data: {
            labels: ['PM2.5', 'PM10', 'NOx', 'SO2', 'VOC'],
            datasets: [{
                data: [data.pm2_5, data.pm10, data.no2, data.so2, data.nh3],
                backgroundColor: Object.values(CHART_COLORS)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { 
                        color: '#fff',
                        font: { size: 10 },
                        boxWidth: 12,
                        padding: 6
                    }
                }
            }
        }
    });
}

// Fetch air pollution data
async function fetchAirPollution() {
    try {
        const response = await fetch(
            `${AIR_POLLUTION_URL}?lat=${LOCATION.lat}&lon=${LOCATION.lon}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Air pollution API error');
        }
        
        const data = await response.json();
        console.log('Air pollution data:', data); 
        const components = data.list[0].components;
        
        return {
            pm2_5: components.pm2_5,
            pm10: components.pm10,
            no2: components.no2,
            so2: components.so2,
            co: components.co,
            nh3: components.nh3
        };
    } catch (error) {
        console.error('Error fetching air pollution:', error);
        throw error;
    }
}

// Fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch(
            `${WEATHER_URL}?lat=${LOCATION.lat}&lon=${LOCATION.lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Weather API error');
        }
        
        const data = await response.json();
        console.log('Weather data:', data); 
        
        return {
            temperature: data.main.temp,
            humidity: data.main.humidity
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Update dashboard with new data
function updateDashboard(data) {
    console.log('Updating dashboard with:', data); 
    
    // Update charts
    createGauge('temperatureGauge', data.temperature, -20, 40);
    createGauge('humidityGauge', data.humidity, 0, 100);
    createGauge('pm25Gauge', data.pm2_5, 0, 150);

    // Update values
    updateValue('temperatureValue', `${data.temperature.toFixed(1)}°C`);
    updateValue('humidityValue', `${data.humidity.toFixed(1)}%`);
    updateValue('pm25Value', `${data.pm2_5.toFixed(1)} µg/m³`);
    updateValue('noxValue', `${data.no2.toFixed(1)} ppb`);
    updateValue('so2Value', `${data.so2.toFixed(1)} ppb`);
    updateValue('co2Value', `${data.co.toFixed(1)} ppm`);
    updateValue('vocValue', `${data.nh3.toFixed(1)} ppb`);

    // Update charts
    updateCharts(data);
}

// Helper function to update values
function updateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.transition = 'opacity 0.3s';
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.opacity = '1';
        }, 300);
    }
}

// Show/hide loading indicator
function showLoading(isLoading) {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'flex' : 'none';
    }
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Main function to fetch all data
async function fetchAirQualityData() {
    try {
        showLoading(true);
        const [airData, weatherData] = await Promise.all([
            fetchAirPollution(),
            fetchWeather()
        ]);

        const combinedData = {
            ...airData,
            ...weatherData
        };

        console.log('Combined data:', combinedData); 
        updateDashboard(combinedData);
        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError('Unable to fetch air quality data. Please try again later.');
        showLoading(false);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add loading and error elements
    document.body.insertAdjacentHTML('beforeend', `
        <div id="loadingIndicator">
            <div class="loading-content">
                <p>Loading data...</p>
            </div>
        </div>
        <div id="errorMessage"></div>
    `);
    
    // Initial fetch
    fetchAirQualityData();

    // Set up periodic updates (every 5 minutes)
    setInterval(fetchAirQualityData, 5 * 60 * 1000);
});

const DANGER_LEVELS = {
    temperature: {
        good: [-10, 25],
        moderate: [-20, 30],
        dangerous: [-30, 35],
        color: {
            good: '#40E0D0',      // Turquoise
            moderate: '#FFD700',   // Yellow
            dangerous: '#FF4D4D'   // Red
        }
    },
    humidity: {
        good: [30, 50],
        moderate: [20, 60],
        dangerous: [0, 100],
        color: {
            good: '#40E0D0',
            moderate: '#FFD700',
            dangerous: '#FF4D4D'
        }
    },
    pm25: {
        good: [0, 12],
        moderate: [12.1, 35.4],
        dangerous: [35.5, 150],
        color: {
            good: '#40E0D0',
            moderate: '#FFD700',
            dangerous: '#FF4D4D'
        }
    },
    pollutants: {
        no2: {
            good: [0, 53],
            moderate: [54, 100],
            dangerous: [101, 360],
        },
        so2: {
            good: [0, 35],
            moderate: [36, 75],
            dangerous: [76, 185],
        },
        co: {
            good: [0, 4400],
            moderate: [4500, 9400],
            dangerous: [9500, 15400],
        },
        voc: {
            good: [0, 100],
            moderate: [101, 200],
            dangerous: [201, 300],
        }
    }
};

// Function to get color based on value and thresholds
function getDangerColor(value, type) {
    const levels = DANGER_LEVELS[type];
    if (!levels) return CHART_COLORS.primary;

    if (value >= levels.good[0] && value <= levels.good[1]) {
        return levels.color.good;
    } else if (value >= levels.moderate[0] && value <= levels.moderate[1]) {
        return levels.color.moderate;
    }
    return levels.color.dangerous;
}

// Update the createGauge function
function createGauge(canvasId, value, min, max, type) {
    const color = getDangerColor(value, type);
    return new Chart(document.getElementById(canvasId), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, max - value],
                backgroundColor: [color, '#2a2a2a'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: -90,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            return getHealthStatus(value, type);
                        }
                    }
                }
            },
            layout: { padding: 8 }
        }
    });
}

// Function to get health status message
function getHealthStatus(value, type) {
    const levels = DANGER_LEVELS[type];
    if (!levels) return '';

    if (value >= levels.good[0] && value <= levels.good[1]) {
        return 'Good - Safe levels';
    } else if (value >= levels.moderate[0] && value <= levels.moderate[1]) {
        return 'Moderate - Sensitive individuals may be affected';
    }
    return 'Dangerous - Health warnings required';
}

// Update value display with color
function updateValue(elementId, newValue, type) {
    const element = document.getElementById(elementId);
    if (element) {
        const color = type ? getDangerColor(parseFloat(newValue), type) : 'white';
        element.style.transition = 'all 0.3s';
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.color = color;
            element.style.opacity = '1';
        }, 300);
    }
}

// Update the dashboard function
function updateDashboard(data) {
    // Update gauge charts with types
    createGauge('temperatureGauge', data.temperature, -20, 40, 'temperature');
    createGauge('humidityGauge', data.humidity, 0, 100, 'humidity');
    createGauge('pm25Gauge', data.pm2_5, 0, 150, 'pm25');

    // Update values with colors
    updateValue('temperatureValue', `${data.temperature.toFixed(1)}°C`, 'temperature');
    updateValue('humidityValue', `${data.humidity.toFixed(1)}%`, 'humidity');
    updateValue('pm25Value', `${data.pm2_5.toFixed(1)} µg/m³`, 'pm25');

    // Update pollutant values with colors
    const pollutants = DANGER_LEVELS.pollutants;
    updateValue('noxValue', `${data.no2.toFixed(1)} ppb`, 'no2');
    updateValue('so2Value', `${data.so2.toFixed(1)} ppb`, 'so2');
    updateValue('co2Value', `${data.co.toFixed(1)} ppm`, 'co');
    updateValue('vocValue', `${data.nh3.toFixed(1)} ppb`, 'voc');

    updateCharts(data);
}

// Add tooltips to the bottom metrics
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltips to metric cards
    const addTooltip = (elementId, type) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.title = `
                Good: ${DANGER_LEVELS.pollutants[type].good.join(' - ')}
                Moderate: ${DANGER_LEVELS.pollutants[type].moderate.join(' - ')}
                Dangerous: ${DANGER_LEVELS.pollutants[type].dangerous.join(' - ')}
            `;
        }
    };

    addTooltip('noxValue', 'no2');
    addTooltip('so2Value', 'so2');
    addTooltip('co2Value', 'co');
    addTooltip('vocValue', 'voc');

});