const luxValue = document.getElementById('lux-value');
const statusText = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const captureBtn = document.getElementById('capture-btn');
const popup = document.getElementById('popup');
const capturedLux = document.getElementById('captured-lux');

const video = document.getElementById('camera-stream');
const canvas = document.getElementById('brightnessCanvas');
const ctx = canvas.getContext('2d');

let isRunning = false;
let stream;

// Start Camera and Measure Light
async function startLightMeter() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.play();
        statusText.innerText = "📡 Detecting Light...";

        startBtn.disabled = true;
        stopBtn.disabled = false;
        captureBtn.disabled = false;
        isRunning = true;

        measureLight();
    } catch (err) {
        statusText.innerText = "❌ Camera Access Denied!";
    }
}

// Stop the Camera and Light Sensor
function stopLightMeter() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    statusText.innerText = "🔴 Light Sensor Stopped";
    startBtn.disabled = false;
    stopBtn.disabled = true;
    captureBtn.disabled = true;
    isRunning = false;
}

// Capture and Show Reading
function captureReading() {
    showPopup(parseFloat(luxValue.innerText));
}

// Show Popup Notification
function showPopup(value) {
    capturedLux.innerText = value.toFixed(1) + " Lux";
    popup.style.display = 'block';
    setTimeout(() => { popup.style.display = 'none'; }, 2000);
}

// Measure Light Using Camera
function measureLight() {
    if (!isRunning) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let brightness = 0;

    for (let i = 0; i < imageData.length; i += 4) {
        brightness += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
    }

    brightness = brightness / (imageData.length / 4);
    let lux = (brightness / 255) * 1000; // Convert to Lux scale

    luxValue.innerText = lux.toFixed(1);
    setTimeout(measureLight, 500);
}

// Event Listeners
startBtn.addEventListener('click', startLightMeter);
stopBtn.addEventListener('click', stopLightMeter);
captureBtn.addEventListener('click', captureReading);