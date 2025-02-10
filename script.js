const luxValue = document.getElementById('lux-value');
const statusText = document.getElementById('status');
const guideText = document.getElementById('guide');
const levels = {
    dark: document.getElementById('dark'),
    dim: document.getElementById('dim'),
    normal: document.getElementById('normal'),
    bright: document.getElementById('bright'),
    intense: document.getElementById('intense')
};

function resetLevels() {
    for (let key in levels) {
        levels[key].style.opacity = '0.4';
    }
}

if ('AmbientLightSensor' in window) {
    const sensor = new AmbientLightSensor();
    sensor.addEventListener('reading', () => {
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
    });

    sensor.addEventListener('error', (event) => {
        statusText.innerText = "⚠️ Sensor Error: " + event.error.name;
    });

    sensor.start();
} else {
    statusText.innerText = "❌ Light Sensor Not Supported!";
    guideText.innerText = "⚠️ Your device does not support ambient light sensing.";
}