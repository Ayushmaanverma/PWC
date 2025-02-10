const luxValue = document.getElementById('lux-value');
const statusText = document.getElementById('status');
const guideText = document.getElementById('guide');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const captureBtn = document.getElementById('capture-btn');
const popup = document.getElementById('popup');
const capturedLux = document.getElementById('captured-lux');

const levels = {
    dark: document.getElementById('dark'),
    dim: document.getElementById('dim'),
    normal: document.getElementById('normal'),
    bright: document.getElementById('bright'),
    intense: document.getElementById('intense')
};

let sensor;
let isRunning = false;

function resetLevels() {
    for (let key in levels) {
        levels[key].style.opacity = '0.4';
    }
}

function showPopup(value) {
    capturedLux.innerText = value.toFixed(1) + " Lux";
    popup.style.display = 'block';
    setTimeout(() => { popup.style.display = 'none'; }, 2000);
}

if ('AmbientLightSensor' in window) {
    sensor = new AmbientLightSensor();
    sensor.addEventListener('reading', () => {
        if (isRunning) {
            let lux = sensor.illuminance;
            luxValue.innerText = lux.toFixed(1);
            statusText.innerText = "📡 Sensor Active";

            resetLevels();

            if (lux < 10) {
                levels.dark.style.opacity = '1';
                guideText.innerText = "🌑 Too dark. Increase lighting.";
            } else if (lux < 100) {
                levels.dim.style.opacity = '1';
                guideText.innerText = "🕯️ Dim light. Suitable for relaxing.";
            } else if (lux < 500) {
                levels.normal.style.opacity = '1';
                guideText.innerText = "💡 Normal lighting. Good for indoor use.";
            } else if (lux < 2000) {
                levels.bright.style.opacity = '1';
                guideText.innerText = "🌞 Bright environment. May cause glare.";
            } else {
                levels.intense.style.opacity = '1';
                guideText.innerText = "🔥 Too bright! Protect your eyes.";
            }
        }
    });

    sensor.addEventListener('error', (event) => {
        statusText.innerText = "⚠️ Sensor Error: " + event.error.name;
    });

} else {
    statusText.innerText = "❌ Light Sensor Not Supported!";
    guideText.innerText = "⚠️ Your device does not support ambient light sensing.";
}

startBtn.addEventListener('click', () => {
    isRunning = true;
    sensor.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    captureBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    isRunning = false;
    sensor.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    captureBtn.disabled = true;
});

captureBtn.addEventListener('click', () => {
    if (isRunning) {
        showPopup(parseFloat(luxValue.innerText));
    }
});