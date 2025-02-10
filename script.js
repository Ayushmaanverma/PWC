const startButton = document.getElementById('start');
const recordButton = document.getElementById('record');
const resetButton = document.getElementById('reset');
const tareButton = document.getElementById('tare');
const output = document.getElementById('output');

let tareValue = { x: 0, y: 0, z: 0 };
let isRunning = false;
let recordedData = [];

function handleMotion(event) {
    const acceleration = event.accelerationIncludingGravity;
    const x = acceleration.x - tareValue.x;
    const y = acceleration.y - tareValue.y;
    const z = acceleration.z - tareValue.z;

    const netForce = Math.sqrt(x * x + y * y + z * z);
    output.innerHTML = `Net Force: ${netForce.toFixed(2)} m/s²`;

    return netForce;
}

startButton.addEventListener('click', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                    isRunning = true;
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleMotion);
        isRunning = true;
    }
});

recordButton.addEventListener('click', () => {
    if (isRunning) {
        const netForce = handleMotion({ accelerationIncludingGravity: { x: 0, y: 0, z: 0 } });
        recordedData.push(netForce);
        alert('Data Recorded: ' + netForce.toFixed(2) + ' m/s²');
    }
});

resetButton.addEventListener('click', () => {
    if (isRunning) {
        recordedData = [];
        output.innerHTML = 'Net Force: 0.00 m/s²';
        alert('Data Reset');
    }
});

tareButton.addEventListener('click', () => {
    if (isRunning) {
        window.removeEventListener('devicemotion', handleMotion);
        window.addEventListener('devicemotion', (event) => {
            tareValue = event.accelerationIncludingGravity;
            alert('Tare Set');
        }, { once: true });
    }
});
