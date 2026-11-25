// Global variables
let currentPin = '';
let currentSlide = 0;
let analysisData = null;
let analysisChart = null;
let recommendationChart = null;

// API Base URL - Ambil dari config.js
const API_BASE_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) 
    ? CONFIG.API_URL 
    : '';  // Fallback ke relative path jika tidak ada config

// Debug: Log API URL saat app start
console.log('=== CBMS App Started ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('CONFIG:', typeof CONFIG !== 'undefined' ? CONFIG : 'CONFIG not loaded');
console.log('BUILD_TIME:', typeof CONFIG !== 'undefined' && CONFIG.BUILD_TIME ? CONFIG.BUILD_TIME : 'unknown');

// Create debug console for mobile (long press on logo to show)
let debugLogs = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = function(...args) {
    debugLogs.push('[LOG] ' + args.join(' '));
    if (debugLogs.length > 100) debugLogs.shift();
    originalConsoleLog.apply(console, args);
};

console.error = function(...args) {
    debugLogs.push('[ERROR] ' + args.join(' '));
    if (debugLogs.length > 100) debugLogs.shift();
    originalConsoleError.apply(console, args);
};

// Function to show debug logs
function showDebugLogs() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:10000;padding:20px;overflow:auto;';
    modal.innerHTML = `
        <div style="background:white;padding:20px;border-radius:10px;max-height:90vh;overflow:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h3 style="margin:0;">Debug Console</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding:10px 20px;border:none;background:#ef4444;color:white;border-radius:5px;font-size:16px;">Close</button>
            </div>
            <div style="background:#1a1a1a;color:#00ff00;padding:15px;border-radius:5px;font-family:monospace;font-size:12px;white-space:pre-wrap;word-break:break-all;">
API URL: ${API_BASE_URL}
Build: ${typeof CONFIG !== 'undefined' && CONFIG.BUILD_TIME ? CONFIG.BUILD_TIME : 'unknown'}
User Agent: ${navigator.userAgent}
Online: ${navigator.onLine}
---
${debugLogs.join('\\n')}
            </div>
            <button onclick="testConnectionNow()" style="width:100%;padding:15px;margin-top:10px;border:none;background:#10b981;color:white;border-radius:5px;font-size:16px;font-weight:bold;">Test Connection</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Test connection function
async function testConnectionNow() {
    console.log('=== Testing Connection ===');
    console.log('Testing URL:', API_BASE_URL + '/api/get-latest-data?limit=1');
    
    try {
        const result = await apiRequest('/api/get-latest-data?limit=1');
        console.log('Connection Test: SUCCESS');
        console.log('Data received:', JSON.stringify(result));
        alert('✅ Connection Success!\\n\\nReceived: ' + JSON.stringify(result).substring(0, 100) + '...');
    } catch (error) {
        console.error('Connection Test: FAILED');
        console.error('Error:', error.message);
        alert('❌ Connection Failed!\\n\\nError: ' + error.message + '\\n\\nCheck debug console for details.');
    }
}

// Helper function untuk fetch dengan error handling
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', url);
    
    try {
        const response = await fetch(url, {
            ...options,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        console.error('URL was:', url);
        throw error;
    }
}

// Landing Page Functions
function showPinLogin() {
    document.getElementById('landingScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
}

function showLanding() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('landingScreen').classList.add('active');
    currentPin = '';
    updatePinDisplay();
}

// Setup debug trigger (long press on brand name)
document.addEventListener('DOMContentLoaded', function() {
    let longPressTimer;
    const brandName = document.querySelector('.brand-name');
    
    if (brandName) {
        brandName.addEventListener('touchstart', function() {
            longPressTimer = setTimeout(function() {
                showDebugLogs();
            }, 3000); // 3 seconds long press
        });
        
        brandName.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });
        
        brandName.addEventListener('touchmove', function() {
            clearTimeout(longPressTimer);
        });
    }
});

// PIN Login
function enterPin(num) {
    if (currentPin.length < 4) {
        currentPin += num;
        updatePinDisplay();
        
        if (currentPin.length === 4) {
            setTimeout(checkPin, 300);
        }
    }
}

function deletePin() {
    if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDisplay();
    }
}

function updatePinDisplay() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById('pinDot' + i);
        if (i <= currentPin.length) {
            dot.textContent = currentPin[i-1];
            dot.classList.add('filled');
        } else {
            dot.textContent = '';
            dot.classList.remove('filled');
        }
    }
}

function checkPin() {
    // Default PIN from config or fallback to 1234
    const defaultPin = (typeof CONFIG !== 'undefined' && CONFIG.DEFAULT_PIN) ? CONFIG.DEFAULT_PIN : '1234';
    
    if (currentPin === defaultPin) {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('mainScreen').classList.add('active');
        loadDashboardStats();
        initCarousel();
        currentPin = '';
        updatePinDisplay();
    } else {
        alert(`Incorrect PIN. Default PIN is ${defaultPin}`);
        currentPin = '';
        updatePinDisplay();
    }
}

// Carousel
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = track.querySelectorAll('.carousel-slide');
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // Auto-slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }, 5000);
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            currentSlide = Math.min(currentSlide + 1, slides.length - 1);
            updateCarousel();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right
            currentSlide = Math.max(currentSlide - 1, 0);
            updateCarousel();
        }
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    const slideWidth = track.querySelector('.carousel-slide').offsetWidth;
    const gap = 15; // gap between slides
    
    track.style.transform = `translateX(-${currentSlide * (slideWidth + gap)}px)`;
    
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageName).classList.add('active');
    
    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
}

function showDisclaimer() {
    document.getElementById('disclaimerModal').classList.add('active');
}

function hideDisclaimer() {
    document.getElementById('disclaimerModal').classList.remove('active');
}

function showLogout() {
    if (confirm('Are you sure you want to logout?')) {
        document.getElementById('mainScreen').classList.remove('active');
        document.getElementById('landingScreen').classList.add('active');
        currentPin = '';
    }
}

// Dashboard Stats
async function loadDashboardStats() {
    try {
        const result = await apiRequest('/api/get-latest-data?limit=100');
        
        if (result.success && result.data) {
            const data = result.data;
            document.getElementById('totalDataCount').textContent = data.length;
            
            if (data.length > 0) {
                const avgRisk = (data.reduce((sum, d) => sum + calculateRiskScore(d), 0) / data.length).toFixed(1);
                document.getElementById('avgRiskDashboard').textContent = avgRisk;
            }
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        document.getElementById('totalDataCount').textContent = '-';
        document.getElementById('avgRiskDashboard').textContent = '-';
    }
}

// Test API Functions
document.getElementById('saveDataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        heartRate: parseInt(document.getElementById('heartRateInput').value),
        bodyTemperature: parseFloat(document.getElementById('temperatureInput').value),
        touchIntensity: document.getElementById('touchInput').value,
        movementPattern: document.getElementById('movementInput').value,
        soundActivity: document.getElementById('soundInput').value,
        deviceId: "MOBILE_APP"
    };
    
    try {
        const result = await apiRequest('/api/save-data', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const resultDiv = document.getElementById('saveResult');
        
        if (result.success) {
            resultDiv.className = 'result-message success';
            resultDiv.textContent = '✓ Data saved successfully!';
            resultDiv.style.display = 'block';
            
            // Refresh dashboard stats
            loadDashboardStats();
        } else {
            resultDiv.className = 'result-message error';
            resultDiv.textContent = '✗ Error: ' + result.error;
            resultDiv.style.display = 'block';
        }
        
        setTimeout(() => {
            resultDiv.style.display = 'none';
        }, 3000);
    } catch (error) {
        const resultDiv = document.getElementById('saveResult');
        resultDiv.className = 'result-message error';
        resultDiv.textContent = '✗ Network error';
        resultDiv.style.display = 'block';
    }
});

async function testGetLatestData() {
    const limit = document.getElementById('limitInput').value;
    
    try {
        const result = await apiRequest(`/api/get-latest-data?limit=${limit}`);
        
        document.getElementById('apiResponseCard').style.display = 'block';
        document.getElementById('apiResponse').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('apiResponseCard').style.display = 'block';
        document.getElementById('apiResponse').textContent = 'Error: ' + error.message;
    }
}

async function testGetDataById() {
    const id = document.getElementById('dataIdInput').value;
    
    try {
        const result = await apiRequest(`/api/get-data?id=${id}`);
        
        document.getElementById('apiResponseCard').style.display = 'block';
        document.getElementById('apiResponse').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('apiResponseCard').style.display = 'block';
        document.getElementById('apiResponse').textContent = 'Error: ' + error.message;
    }
}

// Risk Score Calculation
function calculateRiskScore(data) {
    let risk = 0;
    
    // Heart rate analysis
    if (data.heart_rate < 60 || data.heart_rate > 100) risk += 2;
    else if (data.heart_rate < 70 || data.heart_rate > 90) risk += 1;
    
    // Temperature analysis
    if (data.body_temperature < 36.0 || data.body_temperature > 37.5) risk += 2;
    else if (data.body_temperature < 36.5 || data.body_temperature > 37.2) risk += 1;
    
    // Touch intensity
    if (data.touch_intensity === 'high') risk += 3;
    else if (data.touch_intensity === 'low') risk += 1;
    
    // Movement pattern
    if (data.movement_pattern === 'extreme') risk += 3;
    else if (data.movement_pattern === 'repetitive') risk += 2;
    
    // Sound activity
    if (data.sound_activity === 'intense') risk += 2;
    else if (data.sound_activity === 'frequent') risk += 1;
    
    return Math.min(risk, 10);
}

// Analysis Functions
function toggleSensorDetails() {
    const details = document.getElementById('sensorDetails');
    if (details.style.display === 'none') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

async function analyzeLatestData() {
    try {
        const result = await apiRequest('/api/get-latest-data?limit=10');
        
        if (result.success && result.data && result.data.length > 0) {
            analysisData = result.data;
            
            // Calculate risk scores
            analysisData.forEach(d => {
                d.riskScore = calculateRiskScore(d);
            });
            
            // Show results
            document.getElementById('chartPlaceholder').style.display = 'none';
            document.getElementById('analysisChart').style.display = 'block';
            document.getElementById('analysisResults').style.display = 'block';
            
            // Update statistics
            updateAnalysisStats();
            
            // Update chart
            updateAnalysisChart();
            
            // Update latest data details
            updateLatestDataDetails();
        } else {
            alert('No data available in database');
        }
    } catch (error) {
        alert('Error fetching data: ' + error.message);
    }
}

function updateAnalysisStats() {
    const riskScores = analysisData.map(d => d.riskScore);
    
    document.getElementById('totalRecords').textContent = analysisData.length;
    document.getElementById('avgRisk').textContent = (riskScores.reduce((a, b) => a + b, 0) / riskScores.length).toFixed(1);
    document.getElementById('minRisk').textContent = riskScores.filter(s => s <= 2).length;
    document.getElementById('moderateRisk').textContent = riskScores.filter(s => s > 2 && s <= 5).length;
    document.getElementById('maxRisk').textContent = riskScores.filter(s => s > 5).length;
}

function updateLatestDataDetails() {
    const latest = analysisData[0];
    const risk = latest.riskScore;
    
    // Update risk badge
    const riskBadge = document.getElementById('riskBadge');
    const progressFill = document.getElementById('progressFill');
    const riskExplanation = document.getElementById('riskExplanation');
    
    progressFill.style.width = (risk * 10) + '%';
    
    if (risk <= 2) {
        riskBadge.textContent = 'LOW RISK';
        riskBadge.className = 'risk-badge low';
        riskExplanation.textContent = 'The sensor data indicates normal behavioral patterns. All parameters are within expected ranges.';
    } else if (risk <= 5) {
        riskBadge.textContent = 'MODERATE RISK';
        riskBadge.className = 'risk-badge moderate';
        riskExplanation.textContent = 'Some parameters show mild deviations from normal ranges. Increased monitoring is recommended.';
    } else {
        riskBadge.textContent = 'HIGH RISK';
        riskBadge.className = 'risk-badge high';
        riskExplanation.textContent = 'Multiple parameters show significant deviations. Professional consultation is strongly advised.';
    }
    
    // Update sensor values
    document.getElementById('heartRateValue').textContent = latest.heart_rate + ' bpm';
    document.getElementById('temperatureValue').textContent = latest.body_temperature + ' °C';
    document.getElementById('touchValue').textContent = latest.touch_intensity;
    document.getElementById('movementValue').textContent = latest.movement_pattern;
    document.getElementById('soundValue').textContent = latest.sound_activity;
}

function updateAnalysisChart() {
    const filter = document.getElementById('analysisChartFilter').value;
    const canvas = document.getElementById('analysisChart');
    const ctx = canvas.getContext('2d');
    
    if (analysisChart) {
        analysisChart.destroy();
    }
    
    const labels = analysisData.map((d, i) => {
        const date = new Date(d.created_at);
        return date.getDate() + '/' + (date.getMonth() + 1);
    }).reverse();
    
    let data, label, color;
    
    switch(filter) {
        case 'riskScore':
            data = analysisData.map(d => d.riskScore).reverse();
            label = 'Risk Score';
            color = '#ef4444';
            break;
        case 'heartRate':
            data = analysisData.map(d => d.heart_rate).reverse();
            label = 'Heart Rate (bpm)';
            color = '#ec4899';
            break;
        case 'bodyTemperature':
            data = analysisData.map(d => d.body_temperature).reverse();
            label = 'Temperature (°C)';
            color = '#f59e0b';
            break;
        case 'touchIntensity':
            data = analysisData.map(d => {
                const map = {'low': 1, 'normal': 2, 'high': 3};
                return map[d.touch_intensity] || 0;
            }).reverse();
            label = 'Touch Intensity';
            color = '#8b5cf6';
            break;
        case 'movementPattern':
            data = analysisData.map(d => {
                const map = {'normal': 1, 'repetitive': 2, 'extreme': 3};
                return map[d.movement_pattern] || 0;
            }).reverse();
            label = 'Movement Pattern';
            color = '#3b82f6';
            break;
        case 'soundActivity':
            data = analysisData.map(d => {
                const map = {'normal': 1, 'frequent': 2, 'intense': 3};
                return map[d.sound_activity] || 0;
            }).reverse();
            label = 'Sound Activity';
            color = '#10b981';
            break;
    }
    
    analysisChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 10 }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 0
                    }
                }
            }
        }
    });
}

// Recommendation Functions
async function analyzeRecommendations() {
    try {
        const result = await apiRequest('/api/get-latest-data?limit=10');
        
        if (result.success && result.data && result.data.length > 0) {
            analysisData = result.data;
            
            // Calculate risk scores
            analysisData.forEach(d => {
                d.riskScore = calculateRiskScore(d);
            });
            
            // Show results
            document.getElementById('recommendationResults').style.display = 'block';
            
            // Generate recommendations
            generateRecommendation();
        } else {
            alert('No data available in database');
        }
    } catch (error) {
        alert('Error fetching data: ' + error.message);
    }
}

function generateRecommendation() {
    const riskScores = analysisData.map(d => d.riskScore);
    const avgRisk = (riskScores.reduce((a, b) => a + b, 0) / riskScores.length).toFixed(2);
    
    const lowCount = riskScores.filter(s => s <= 2).length;
    const moderateCount = riskScores.filter(s => s > 2 && s <= 5).length;
    const highCount = riskScores.filter(s => s > 5).length;
    
    // Update summary
    document.getElementById('recTotalRecords').textContent = analysisData.length;
    document.getElementById('recAvgRisk').textContent = avgRisk;
    document.getElementById('recLowRisk').textContent = lowCount;
    document.getElementById('recModerateRisk').textContent = moderateCount;
    document.getElementById('recHighRisk').textContent = highCount;
    
    // Determine overall assessment
    let assessmentTitle, assessmentContent, nextSteps;
    
    if (avgRisk <= 2) {
        assessmentTitle = '✓ Overall Assessment: Low Risk';
        assessmentContent = `
            <p>Based on the analysis of ${analysisData.length} data records, the child shows normal behavioral patterns with minimal risk indicators.</p>
            <p><strong>Key Findings:</strong></p>
            <ul>
                <li>All physiological parameters (heart rate, temperature) are within normal ranges</li>
                <li>Sensory responses (touch, sound) show typical patterns</li>
                <li>Movement patterns are age-appropriate and well-regulated</li>
            </ul>
            <p>The current data suggests healthy behavioral development with no immediate concerns.</p>
        `;
        nextSteps = `
            <ul>
                <li><strong>Continue Regular Monitoring:</strong> Maintain current observation schedule to track ongoing development</li>
                <li><strong>Document Progress:</strong> Keep detailed records of behavioral patterns for future reference</li>
                <li><strong>Maintain Routine:</strong> Continue current care routines that are working well</li>
                <li><strong>Schedule Check-ups:</strong> Regular pediatric visits for general health monitoring</li>
            </ul>
        `;
    } else if (avgRisk <= 5) {
        assessmentTitle = '⚠️ Overall Assessment: Moderate Risk';
        assessmentContent = `
            <p>The analysis of ${analysisData.length} data records indicates some behavioral patterns that warrant attention and increased monitoring.</p>
            <p><strong>Areas of Concern:</strong></p>
            <ul>
                <li>Some physiological readings show occasional deviations from normal ranges</li>
                <li>Sensory responses demonstrate intermittent atypical patterns</li>
                <li>Movement behaviors show some repetitive or unusual characteristics</li>
            </ul>
            <p>While not critical, these patterns suggest the need for closer observation and potential professional assessment.</p>
        `;
        nextSteps = `
            <ul>
                <li><strong>Increase Monitoring Frequency:</strong> Conduct more frequent assessments to track pattern changes</li>
                <li><strong>Consult Healthcare Provider:</strong> Schedule appointment with pediatrician to discuss findings</li>
                <li><strong>Environmental Assessment:</strong> Review and optimize environmental factors (noise, lighting, routines)</li>
                <li><strong>Track Triggers:</strong> Identify situations or conditions that correlate with concerning behaviors</li>
                <li><strong>Consider Early Intervention:</strong> Discuss potential benefits of early intervention services with specialists</li>
            </ul>
        `;
    } else {
        assessmentTitle = '🔴 Overall Assessment: High Risk';
        assessmentContent = `
            <p>The analysis of ${analysisData.length} data records reveals multiple behavioral indicators that require immediate professional attention.</p>
            <p><strong>Critical Findings:</strong></p>
            <ul>
                <li>Significant deviations in physiological parameters requiring medical evaluation</li>
                <li>Pronounced atypical sensory responses across multiple modalities</li>
                <li>Concerning patterns in movement and behavioral regulation</li>
                <li>Multiple risk indicators present simultaneously</li>
            </ul>
            <p><strong style="color: #ef4444;">IMPORTANT:</strong> These findings indicate the need for comprehensive professional evaluation as soon as possible.</p>
        `;
        nextSteps = `
            <ul>
                <li><strong style="color: #ef4444;">Seek Immediate Medical Consultation:</strong> Contact pediatrician or child development specialist urgently</li>
                <li><strong>Comprehensive Assessment:</strong> Request referral for full developmental and behavioral evaluation</li>
                <li><strong>Share Data:</strong> Provide all monitoring data to healthcare professionals for detailed review</li>
                <li><strong>Emergency Protocol:</strong> Establish clear guidelines for responding to acute behavioral episodes</li>
                <li><strong>Support Services:</strong> Connect with family support resources and counseling services</li>
                <li><strong>Ongoing Documentation:</strong> Maintain detailed daily records until professional assessment is complete</li>
            </ul>
        `;
    }
    
    document.getElementById('overallAssessmentTitle').textContent = assessmentTitle;
    document.getElementById('overallAssessmentContent').innerHTML = assessmentContent;
    document.getElementById('nextStepsContent').innerHTML = nextSteps;
}
