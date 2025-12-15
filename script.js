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

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});

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

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File selected
fileInput.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

// Drag and drop functionality
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

// Reset button
resetBtn.addEventListener('click', resetAnalysis);

/**
 * Handle file selection and validation
 * @param {File} file - Selected file object
 */
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
    // Hide results
    analysisEmpty.style.display = 'block';
    analysisResults.style.display = 'none';
    recommendationEmpty.style.display = 'block';
    recommendationResults.style.display = 'none';

    // Hide file info
    fileInfo.style.display = 'none';

    // Reset file input
    fileInput.value = '';

    // Navigate back to dashboard
    navigateToSection('dashboard');
}

/**
 * Generate sample JSON data for testing purposes
 */
function generateSampleData(riskLevel = 'low') {
    let sampleData;

    if (riskLevel === 'low') {
        sampleData = {
            heartRate: 85,
            bodyTemperature: 37.0,
            touchIntensity: "normal",
            movementPattern: "normal",
            soundActivity: "normal"
        };
    } else if (riskLevel === 'medium') {
        sampleData = {
            heartRate: 125,
            bodyTemperature: 37.8,
            touchIntensity: "low",
            movementPattern: "repetitive",
            soundActivity: "frequent"
        };
    } else {
        sampleData = {
            heartRate: 140,
            bodyTemperature: 38.2,
            touchIntensity: "high",
            movementPattern: "extreme",
            soundActivity: "intense"
        };
    }

    console.log('Sample data for ' + riskLevel + ' risk:');
    console.log(JSON.stringify(sampleData, null, 2));
    return sampleData;
}

console.log('%c=== Child Behavior Monitoring System ===', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cTo test the system, create a JSON file with the following structure:', 'color: #6b7280;');
console.log('%c' + JSON.stringify({
    heartRate: 85,
    bodyTemperature: 37.0,
    touchIntensity: "normal",
    movementPattern: "normal",
    soundActivity: "normal"
}, null, 2), 'color: #059669;');
console.log('%cOr use: generateSampleData("low"), generateSampleData("medium"), or generateSampleData("high")', 'color: #6b7280;');
