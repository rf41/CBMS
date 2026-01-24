const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const analysisEmpty = document.getElementById('analysisEmpty');
const analysisResults = document.getElementById('analysisResults');
const recommendationEmpty = document.getElementById('recommendationEmpty');
const recommendationResults = document.getElementById('recommendationResults');

const riskIcon = document.getElementById('riskIcon');
const riskLabel = document.getElementById('riskLabel');
const scoreValue = document.getElementById('scoreValue');
const progressFill = document.getElementById('progressFill');
const riskExplanation = document.getElementById('riskExplanation');
const resetBtn = document.getElementById('resetBtn');

const heartRateValue = document.getElementById('heartRateValue');
const heartRateStatus = document.getElementById('heartRateStatus');
const temperatureValue = document.getElementById('temperatureValue');
const temperatureStatus = document.getElementById('temperatureStatus');
const touchValue = document.getElementById('touchValue');
const touchStatus = document.getElementById('touchStatus');
const movementValue = document.getElementById('movementValue');
const movementStatus = document.getElementById('movementStatus');
const soundValue = document.getElementById('soundValue');
const soundStatus = document.getElementById('soundStatus');

const recommendationTitle = document.getElementById('recommendationTitle');
const recommendationContent = document.getElementById('recommendationContent');

const notificationToast = document.getElementById('notificationToast');
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById("menuToggle");

// API Base URL - akan otomatis menggunakan domain Vercel saat deployed
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : '';

// Chart instances
let analysisChartInstance = null;
let recommendationChartInstance = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    console.log('%c=== CBMS Dynamic Initialized ===', 'color: #2563eb; font-size: 14px; font-weight: bold;');
    console.log('Navigation should now work correctly');
});

function initializeEventListeners() {
    // Menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // Nav links - close menu when clicked
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu) navMenu.classList.remove("active");
        });
    });

    // Add event listeners to nav links for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            console.log('Navigating to:', sectionId);
            navigateToSection(sectionId);
        });
    });

    // File upload event listeners
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            if (fileInput) fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-blue)';
            uploadArea.style.background = 'rgba(37, 99, 235, 0.1)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-300)';
            uploadArea.style.background = 'var(--gray-50)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-300)';
            uploadArea.style.background = 'var(--gray-50)';
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFileSelect(e.target.files[0]);
        });
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnalysis);
    }

    // Save data form
    const saveDataForm = document.getElementById('saveDataForm');
    if (saveDataForm) {
        saveDataForm.addEventListener('submit', handleSaveDataForm);
    }
}

function showConnectionNotification() {
    notificationToast.classList.remove('hide');
    notificationToast.classList.add('show');

    playNotificationSound();

    setTimeout(() => {
        notificationToast.classList.remove('show');
        notificationToast.classList.add('hide');
    }, 4000);
}

/**
 * Web Audio API
 */
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Could not play notification sound');
    }
}

/**
 * Navigate to a specific section
 * @param {string} sectionId - Section ID to navigate to
 */
function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Highlight active nav link
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add event listeners to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        navigateToSection(sectionId);
    });
});

/**
 * ============================================
 * TEST API FUNCTIONS (DASHBOARD TAB)
 * ============================================
 */

// Save Data Form Handler
async function handleSaveDataForm(e) {
    e.preventDefault();
    
    const data = {
        heartRate: parseInt(document.getElementById('heartRateInput').value),
        bodyTemperature: parseFloat(document.getElementById('temperatureInput').value),
        touchIntensity: document.getElementById('touchInput').value,
        movementPattern: document.getElementById('movementInput').value,
        soundActivity: document.getElementById('soundInput').value,
        deviceId: 'WEB_APP'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/save-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const saveResult = document.getElementById('saveResult');
        
        if (result.success) {
            saveResult.style.display = 'block';
            saveResult.style.background = '#d1fae5';
            saveResult.style.color = '#065f46';
            saveResult.innerHTML = `
                <strong>✓ Success!</strong><br>
                Data saved with ID: ${result.data.id}<br>
                <small>Created at: ${new Date(result.data.created_at).toLocaleString()}</small>
            `;
        } else {
            throw new Error(result.error || 'Failed to save data');
        }
    } catch (error) {
        const saveResult = document.getElementById('saveResult');
        saveResult.style.display = 'block';
        saveResult.style.background = '#fee2e2';
        saveResult.style.color = '#991b1b';
        saveResult.innerHTML = `<strong>✗ Error:</strong> ${error.message}`;
    }
}

// Test Get Latest Data
async function testGetLatestData() {
    const limit = document.getElementById('limitInput').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/get-latest-data?limit=${limit}`);
        const result = await response.json();
        
        displayApiResponse(result);
    } catch (error) {
        displayApiResponse({ error: error.message });
    }
}

// Test Get Data by ID
async function testGetDataById() {
    const id = document.getElementById('dataIdInput').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/get-data?id=${id}`);
        const result = await response.json();
        
        displayApiResponse(result);
    } catch (error) {
        displayApiResponse({ error: error.message });
    }
}

// Display API Response
function displayApiResponse(data) {
    const card = document.getElementById('apiResponseCard');
    const responseElement = document.getElementById('apiResponse');
    
    card.style.display = 'block';
    responseElement.textContent = JSON.stringify(data, null, 2);
    
    // Scroll to response
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * ============================================
 * ANALYSIS FUNCTIONS
 * ============================================
 */

async function analyzeLatestData() {
    try {
        showConnectionNotification();
        
        const response = await fetch(`${API_BASE_URL}/api/get-latest-data?limit=10`);
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            alert('No data available in database');
            return;
        }

        const dataArray = result.data.reverse(); // Reverse untuk urutan chronological
        
        // Calculate risk scores
        const riskScores = dataArray.map(data => {
            const formattedData = {
                heartRate: data.heart_rate,
                bodyTemperature: parseFloat(data.body_temperature),
                touchIntensity: data.touch_intensity,
                movementPattern: data.movement_pattern,
                soundActivity: data.sound_activity
            };
            return calculateRiskScore(formattedData);
        });

        // Show results
        document.getElementById('analysisEmpty').style.display = 'none';
        document.getElementById('analysisResults').style.display = 'block';

        // Update statistics
        document.getElementById('totalRecords').textContent = riskScores.length;
        document.getElementById('avgRisk').textContent = (riskScores.reduce((a, b) => a + b, 0) / riskScores.length).toFixed(1);
        document.getElementById('maxRisk').textContent = Math.max(...riskScores);
        document.getElementById('minRisk').textContent = Math.min(...riskScores);

        // Display latest data details
        const latestData = dataArray[dataArray.length - 1];
        const formattedLatestData = {
            heartRate: latestData.heart_rate,
            bodyTemperature: parseFloat(latestData.body_temperature),
            touchIntensity: latestData.touch_intensity,
            movementPattern: latestData.movement_pattern,
            soundActivity: latestData.sound_activity
        };
        
        displayLatestAnalysis(formattedLatestData, riskScores[riskScores.length - 1]);

        // Draw chart
        drawAnalysisChart(dataArray, riskScores);

        // Navigate to analysis section
        navigateToSection('analysis');

    } catch (error) {
        console.error('Error analyzing data:', error);
        alert('Failed to analyze data. Please try again.');
    }
}

function calculateRiskScore(data) {
    let score = 0;
    
    // Heart rate
    if (data.heartRate < 60 || data.heartRate > 130) score += 2;
    else if (data.heartRate < 70 || data.heartRate > 120) score += 1;
    
    // Temperature
    if (data.bodyTemperature < 36.0 || data.bodyTemperature > 38.0) score += 2;
    else if (data.bodyTemperature < 36.5 || data.bodyTemperature > 37.5) score += 1;
    
    // Touch
    if (data.touchIntensity === 'high') score += 2;
    else if (data.touchIntensity === 'low') score += 1;
    
    // Movement
    if (data.movementPattern === 'extreme') score += 2;
    else if (data.movementPattern === 'repetitive') score += 1;
    
    // Sound
    if (data.soundActivity === 'intense') score += 2;
    else if (data.soundActivity === 'frequent') score += 1;
    
    return score;
}

function displayLatestAnalysis(data, riskScore) {
    // Analyze sensors
    analyzeHeartRate(data.heartRate);
    analyzeTemperature(data.bodyTemperature);
    analyzeTouchIntensity(data.touchIntensity);
    analyzeMovementPattern(data.movementPattern);
    analyzeSoundActivity(data.soundActivity);

    // Display risk score
    scoreValue.textContent = riskScore;
    const progressPercentage = (riskScore / 10) * 100;
    progressFill.style.width = progressPercentage + '%';

    // Determine risk level
    if (riskScore <= 2) {
        riskIcon.textContent = '🟢';
        riskLabel.textContent = 'Low Risk';
        riskExplanation.innerHTML = '<strong>Assessment:</strong> The sensor data indicates normal behavioral patterns. All parameters are within expected ranges.';
    } else if (riskScore <= 5) {
        riskIcon.textContent = '🟡';
        riskLabel.textContent = 'Needs Observation';
        riskExplanation.innerHTML = '<strong>Assessment:</strong> Some behavioral indicators require closer attention. Monitor the child more closely.';
    } else {
        riskIcon.textContent = '🔴';
        riskLabel.textContent = 'Professional Consultation';
        riskExplanation.innerHTML = '<strong>Assessment:</strong> Multiple behavioral indicators suggest professional evaluation is warranted. Please consult with healthcare professionals.';
    }
}

function drawAnalysisChart(dataArray, riskScores) {
    const ctx = document.getElementById('analysisChart');
    
    // Destroy previous chart if exists
    if (analysisChartInstance) {
        analysisChartInstance.destroy();
    }

    const labels = dataArray.map((d, i) => `#${d.id}`);
    
    analysisChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Risk Score',
                data: riskScores,
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Risk Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data ID'
                    }
                }
            }
        }
    });
}

/**
 * ============================================
 * RECOMMENDATION FUNCTIONS
 * ============================================
 */

async function analyzeRecommendations() {
    try {
        showConnectionNotification();
        
        const response = await fetch(`${API_BASE_URL}/api/get-latest-data?limit=10`);
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            alert('No data available in database');
            return;
        }

        const dataArray = result.data.reverse();
        
        // Calculate risk scores
        const riskScores = dataArray.map(data => {
            const formattedData = {
                heartRate: data.heart_rate,
                bodyTemperature: parseFloat(data.body_temperature),
                touchIntensity: data.touch_intensity,
                movementPattern: data.movement_pattern,
                soundActivity: data.sound_activity
            };
            return calculateRiskScore(formattedData);
        });

        // Show results
        document.getElementById('recommendationEmpty').style.display = 'none';
        document.getElementById('recommendationResults').style.display = 'block';

        // Calculate average risk
        const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
        
        // Generate recommendation
        generateRecommendation(avgRisk, riskScores);

        // Draw chart
        drawRecommendationChart(dataArray, riskScores);

        // Navigate to recommendation section
        navigateToSection('recommendation');

    } catch (error) {
        console.error('Error generating recommendations:', error);
        alert('Failed to generate recommendations. Please try again.');
    }
}

function generateRecommendation(avgRisk, riskScores) {
    const title = document.getElementById('recommendationTitle');
    const content = document.getElementById('recommendationContent');
    
    title.textContent = 'Recommendations Based on Data Analysis';
    
    let recommendation = '<div style="line-height: 1.8;">';
    recommendation += `<p><strong>Analysis Summary:</strong></p>`;
    recommendation += `<ul style="margin-left: 20px;">`;
    recommendation += `<li>Total records analyzed: ${riskScores.length}</li>`;
    recommendation += `<li>Average risk score: ${avgRisk.toFixed(2)} / 10</li>`;
    recommendation += `<li>Highest risk: ${Math.max(...riskScores)} / 10</li>`;
    recommendation += `<li>Lowest risk: ${Math.min(...riskScores)} / 10</li>`;
    recommendation += `</ul><br>`;
    
    if (avgRisk <= 2) {
        recommendation += `<p><strong>✓ Overall Assessment: Low Risk</strong></p>`;
        recommendation += `<p>The child's behavioral patterns are generally within normal ranges. Continue with:</p>`;
        recommendation += `<ul style="margin-left: 20px;">`;
        recommendation += `<li>Regular monitoring and observation</li>`;
        recommendation += `<li>Maintain current healthy routines</li>`;
        recommendation += `<li>Encourage positive behavioral patterns</li>`;
        recommendation += `<li>Document any changes for future reference</li>`;
        recommendation += `</ul>`;
    } else if (avgRisk <= 5) {
        recommendation += `<p><strong>⚠ Overall Assessment: Moderate - Needs Observation</strong></p>`;
        recommendation += `<p>Some behavioral indicators warrant closer attention. Recommended actions:</p>`;
        recommendation += `<ul style="margin-left: 20px;">`;
        recommendation += `<li>Increase monitoring frequency</li>`;
        recommendation += `<li>Document specific behavioral patterns</li>`;
        recommendation += `<li>Communicate with teachers and caregivers</li>`;
        recommendation += `<li>Schedule follow-up assessment in 1-2 weeks</li>`;
        recommendation += `<li>Consider environmental factors</li>`;
        recommendation += `</ul>`;
    } else {
        recommendation += `<p><strong>⚠️ Overall Assessment: High Risk - Professional Consultation Recommended</strong></p>`;
        recommendation += `<p>Multiple indicators suggest professional evaluation. Immediate actions:</p>`;
        recommendation += `<ul style="margin-left: 20px;">`;
        recommendation += `<li><strong>Schedule appointment with pediatrician</strong></li>`;
        recommendation += `<li>Prepare detailed documentation of behaviors</li>`;
        recommendation += `<li>Consult with child development specialist</li>`;
        recommendation += `<li>Share assessment data with healthcare professionals</li>`;
        recommendation += `<li>Do not delay professional evaluation</li>`;
        recommendation += `<li>Ensure supportive environment for the child</li>`;
        recommendation += `</ul>`;
    }
    
    recommendation += `</div>`;
    content.innerHTML = recommendation;
}

function drawRecommendationChart(dataArray, riskScores) {
    const ctx = document.getElementById('recommendationChart');
    
    // Destroy previous chart if exists
    if (recommendationChartInstance) {
        recommendationChartInstance.destroy();
    }

    const labels = dataArray.map((d, i) => {
        const date = new Date(d.created_at);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    });
    
    recommendationChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Risk Score Trend',
                data: riskScores,
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: riskScores.map(score => {
                    if (score <= 2) return 'rgb(16, 185, 129)';
                    if (score <= 5) return 'rgb(245, 158, 11)';
                    return 'rgb(239, 68, 68)';
                }),
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const score = context.parsed.y;
                            if (score <= 2) return 'Status: Low Risk';
                            if (score <= 5) return 'Status: Needs Observation';
                            return 'Status: Professional Consultation';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Risk Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

/**
 * ============================================
 * ORIGINAL FUNCTIONS (kept for compatibility)
 * ============================================
 */

// Handle file selection and validation (untuk upload manual)
function handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
        alert('Please upload a valid JSON file');
        return;
    }

    // Display file info
    fileName.textContent = file.name;
    fileInfo.style.display = 'flex';

    // Show notification
    showConnectionNotification();

    // Read and parse file
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            // Add 3-second delay before processing
            setTimeout(() => {
                processData(data);
            }, 3000);
        } catch (error) {
            alert('Error parsing JSON file. Please ensure the file is valid.');
            console.error('Parse error:', error);
        }
    };
    reader.readAsText(file);
}

/**
 * FUNGSI BARU: Fetch data terbaru dari API
 */
async function fetchLatestData() {
    try {
        showConnectionNotification();
        
        const response = await fetch(`${API_BASE_URL}/api/get-latest-data?limit=1`);
        const result = await response.json();

        if (!result.success || result.data.length === 0) {
            alert('No data available from database');
            return;
        }

        const latestData = result.data[0];
        
        // Convert ke format yang sesuai
        const formattedData = {
            heartRate: latestData.heart_rate,
            bodyTemperature: parseFloat(latestData.body_temperature),
            touchIntensity: latestData.touch_intensity,
            movementPattern: latestData.movement_pattern,
            soundActivity: latestData.sound_activity
        };

        // Display file info
        fileName.textContent = `Data from database (${new Date(latestData.created_at).toLocaleString()})`;
        fileInfo.style.display = 'flex';

        // Process data after 3 seconds
        setTimeout(() => {
            processData(formattedData);
        }, 3000);

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from database. Please try again.');
    }
}

/**
 * FUNGSI BARU: Fetch data berdasarkan ID
 */
async function fetchDataById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/get-data?id=${id}`);
        const result = await response.json();

        if (!result.success) {
            alert('Data not found');
            return;
        }

        const data = result.data;
        
        // Convert ke format yang sesuai
        const formattedData = {
            heartRate: data.heart_rate,
            bodyTemperature: parseFloat(data.body_temperature),
            touchIntensity: data.touch_intensity,
            movementPattern: data.movement_pattern,
            soundActivity: data.sound_activity
        };

        // Display file info
        fileName.textContent = `Data ID: ${id} (${new Date(data.created_at).toLocaleString()})`;
        fileInfo.style.display = 'flex';

        showConnectionNotification();
        
        // Process data after 3 seconds
        setTimeout(() => {
            processData(formattedData);
        }, 3000);

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from database. Please try again.');
    }
}

/**
 * Process sensor data and calculate risk score
 * @param {Object} data - Parsed sensor data from JSON file
 */
function processData(data) {
    // Validate data structure
    if (!validateData(data)) {
        alert('Invalid data format. Please check the JSON structure.');
        return;
    }

    // Initialize risk score and factors
    let riskScore = 0;
    const riskFactors = [];

    // Analyze each sensor parameter
    const heartRateRisk = analyzeHeartRate(data.heartRate);
    const temperatureRisk = analyzeTemperature(data.bodyTemperature);
    const touchRisk = analyzeTouchIntensity(data.touchIntensity);
    const movementRisk = analyzeMovementPattern(data.movementPattern);
    const soundRisk = analyzeSoundActivity(data.soundActivity);

    // Calculate total risk score
    riskScore += heartRateRisk.score;
    riskScore += temperatureRisk.score;
    riskScore += touchRisk.score;
    riskScore += movementRisk.score;
    riskScore += soundRisk.score;

    // Collect risk factors
    if (heartRateRisk.score > 0) riskFactors.push(heartRateRisk.factor);
    if (temperatureRisk.score > 0) riskFactors.push(temperatureRisk.factor);
    if (touchRisk.score > 0) riskFactors.push(touchRisk.factor);
    if (movementRisk.score > 0) riskFactors.push(movementRisk.factor);
    if (soundRisk.score > 0) riskFactors.push(soundRisk.factor);

    // Display results
    displayResults(data, riskScore, riskFactors);
}

/**
 * Validate sensor data structure
 * @param {Object} data - Data to validate
 * @returns {boolean} - Whether data is valid
 */
function validateData(data) {
    return (
        data.hasOwnProperty('heartRate') &&
        data.hasOwnProperty('bodyTemperature') &&
        data.hasOwnProperty('touchIntensity') &&
        data.hasOwnProperty('movementPattern') &&
        data.hasOwnProperty('soundActivity')
    );
}

/**
 * Analyze heart rate data
 * Normal range for children: 70-120 bpm
 */
function analyzeHeartRate(heartRate) {
    heartRateValue.textContent = heartRate;

    if (heartRate < 60 || heartRate > 130) {
        heartRateStatus.textContent = 'Abnormal Range';
        heartRateStatus.className = 'sensor-status alert';
        return { score: 2, factor: 'Heart rate outside normal range' };
    } else if (heartRate < 70 || heartRate > 120) {
        heartRateStatus.textContent = 'Slightly Elevated';
        heartRateStatus.className = 'sensor-status warning';
        return { score: 1, factor: 'Heart rate slightly elevated' };
    } else {
        heartRateStatus.textContent = 'Normal';
        heartRateStatus.className = 'sensor-status normal';
        return { score: 0, factor: null };
    }
}

/**
 * Analyze body temperature data
 * Normal range: 36.5-37.5°C
 */
function analyzeTemperature(temperature) {
    temperatureValue.textContent = temperature.toFixed(1);

    if (temperature < 36.0 || temperature > 38.0) {
        temperatureStatus.textContent = 'Abnormal Range';
        temperatureStatus.className = 'sensor-status alert';
        return { score: 2, factor: 'Body temperature abnormal' };
    } else if (temperature < 36.5 || temperature > 37.5) {
        temperatureStatus.textContent = 'Slightly Off';
        temperatureStatus.className = 'sensor-status warning';
        return { score: 1, factor: 'Body temperature slightly off' };
    } else {
        temperatureStatus.textContent = 'Normal';
        temperatureStatus.className = 'sensor-status normal';
        return { score: 0, factor: null };
    }
}

/**
 * Analyze touch intensity data
 * Expected: "normal", abnormal: "low" or "high"
 */
function analyzeTouchIntensity(intensity) {
    const intensityLower = intensity.toLowerCase();
    touchValue.textContent = intensity.charAt(0).toUpperCase() + intensity.slice(1);

    if (intensityLower === 'high') {
        touchStatus.textContent = 'High Intensity Detected';
        touchStatus.className = 'sensor-status alert';
        return { score: 2, factor: 'High touch intensity detected' };
    } else if (intensityLower === 'low') {
        touchStatus.textContent = 'Low Intensity Detected';
        touchStatus.className = 'sensor-status warning';
        return { score: 1, factor: 'Low touch sensitivity' };
    } else {
        touchStatus.textContent = 'Normal';
        touchStatus.className = 'sensor-status normal';
        return { score: 0, factor: null };
    }
}

/**
 * Analyze movement pattern data
 * Expected: "normal", abnormal: "repetitive" or "extreme"
 */
function analyzeMovementPattern(pattern) {
    const patternLower = pattern.toLowerCase();
    movementValue.textContent = pattern.charAt(0).toUpperCase() + pattern.slice(1);

    if (patternLower === 'extreme') {
        movementStatus.textContent = 'Extreme Movements';
        movementStatus.className = 'sensor-status alert';
        return { score: 2, factor: 'Extreme movement patterns detected' };
    } else if (patternLower === 'repetitive') {
        movementStatus.textContent = 'Repetitive Patterns';
        movementStatus.className = 'sensor-status warning';
        return { score: 1, factor: 'Repetitive movement patterns' };
    } else {
        movementStatus.textContent = 'Normal';
        movementStatus.className = 'sensor-status normal';
        return { score: 0, factor: null };
    }
}

/**
 * Analyze sound activity data
 * Expected: "normal", abnormal: "frequent" or "intense"
 */
function analyzeSoundActivity(activity) {
    const activityLower = activity.toLowerCase();
    soundValue.textContent = activity.charAt(0).toUpperCase() + activity.slice(1);

    if (activityLower === 'intense') {
        soundStatus.textContent = 'Intense Sounds';
        soundStatus.className = 'sensor-status alert';
        return { score: 2, factor: 'Intense sound activity detected' };
    } else if (activityLower === 'frequent') {
        soundStatus.textContent = 'Frequent Activity';
        soundStatus.className = 'sensor-status warning';
        return { score: 1, factor: 'Frequent sound activity' };
    } else {
        soundStatus.textContent = 'Normal';
        soundStatus.className = 'sensor-status normal';
        return { score: 0, factor: null };
    }
}

/**
 * Display analysis results with risk level and explanation
 * @param {Object} data - Original sensor data
 * @param {number} riskScore - Calculated total risk score
 * @param {Array} riskFactors - List of identified risk factors
 */
function displayResults(data, riskScore, riskFactors) {
    // Show analysis results
    analysisEmpty.style.display = 'none';
    analysisResults.style.display = 'block';

    // Show recommendation results
    recommendationEmpty.style.display = 'none';
    recommendationResults.style.display = 'block';

    // Display risk score
    scoreValue.textContent = riskScore;

    // Update progress bar (0-10 scale)
    const progressPercentage = (riskScore / 10) * 100;
    progressFill.style.width = progressPercentage + '%';

    // Determine risk level and styling
    let riskLevel, explanation, recommendation;

    if (riskScore <= 2) {
        // Low Risk
        riskIcon.textContent = '🟢';
        riskLabel.textContent = 'Low Risk';
        explanation = '<strong>Assessment:</strong> The sensor data indicates normal behavioral patterns. ';

        if (riskFactors.length > 0) {
            explanation += `Minor observations: ${riskFactors.join(', ').toLowerCase()}. Continue regular monitoring.`;
        } else {
            explanation += 'All parameters are within expected ranges. Continue regular monitoring and healthy routines.';
        }

        recommendation = '<strong>Recommendation Summary:</strong><br><br>Based on the analysis, the child displays normal behavioral indicators. Continue with regular monitoring and maintain current healthy practices.';

    } else if (riskScore <= 5) {
        // Needs Observation
        riskIcon.textContent = '🟡';
        riskLabel.textContent = 'Needs Observation';
        explanation = '<strong>Assessment:</strong> Some behavioral indicators require closer attention. ';
        explanation += `<br><br><strong>Dominant factors:</strong><br>`;
        explanation += riskFactors.map(f => `• ${f}`).join('<br>');
        explanation += '<br><br>Recommendation: Monitor the child more closely over the next few days and consult with educators or caregivers.';

        recommendation = '<strong>Recommendation Summary:</strong><br><br>The child shows some behavioral patterns that warrant closer monitoring. We recommend:<br><br>• Increase observation frequency<br>• Document behavioral changes<br>• Communicate with teachers or caregivers<br>• Schedule a follow-up assessment in 1-2 weeks<br>• Monitor for any escalating patterns';

    } else {
        // High Risk - Recommended Consultation
        riskIcon.textContent = '🔴';
        riskLabel.textContent = 'Recommended Professional Consultation';
        explanation = '<strong>Assessment:</strong> Multiple behavioral indicators suggest the need for professional evaluation. ';
        explanation += `<br><br><strong>Key concerns:</strong><br>`;
        explanation += riskFactors.map(f => `• ${f}`).join('<br>');
        explanation += '<br><br><strong>Recommendation:</strong> Please consult with a qualified healthcare professional, pediatrician, or child development specialist for comprehensive assessment and guidance.';

        recommendation = '<strong>Recommendation Summary:</strong><br><br>Multiple behavioral indicators suggest professional consultation is warranted. We recommend:<br><br>• Schedule an appointment with a pediatrician<br>• Prepare documentation of observed behaviors<br>• Consult with a child development specialist<br>• Share this assessment with healthcare professionals<br>• Do not delay professional evaluation<br>• Ensure supportive environment for the child';
    }

    riskExplanation.innerHTML = explanation;
    recommendationTitle.textContent = 'Next Steps & Recommendations';
    recommendationContent.innerHTML = recommendation;

    // Navigate to analysis section
    navigateToSection('analysis');
}

/**
 * Reset the analysis and return to dashboard
 */
function resetAnalysis() {
    if (analysisEmpty) analysisEmpty.style.display = 'block';
    if (analysisResults) analysisResults.style.display = 'none';
    if (recommendationEmpty) recommendationEmpty.style.display = 'block';
    if (recommendationResults) recommendationResults.style.display = 'none';

    // Destroy charts
    if (analysisChartInstance) {
        analysisChartInstance.destroy();
        analysisChartInstance = null;
    }
    if (recommendationChartInstance) {
        recommendationChartInstance.destroy();
        recommendationChartInstance = null;
    }
    // Navigate back to dashboard
    navigateToSection('dashboard');
}

console.log('%c=== Child Behavior Monitoring System (Dynamic) ===', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cAPI Base URL:', API_BASE_URL, 'color: #059669;');
console.log('%cAvailable functions:', 'color: #6b7280;');
console.log('  - testGetLatestData()');
console.log('  - testGetDataById(id)');
console.log('  - analyzeLatestData()');
console.log('  - analyzeRecommendations()');
console.log('  - navigateToSection(sectionId)');