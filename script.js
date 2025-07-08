document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('animation-container');
    if (!container) {
        console.error('Animation container not found!');
        return;
    }

    const numbersConfig = {
        density: 0.0001, // Numbers per pixel area (lower for fewer numbers)
        minFontSize: 12,
        maxFontSize: 24,
        minOpacity: 0.1,
        maxOpacity: 0.5,
        minDuration: 5000, // ms
        maxDuration: 15000, // ms
        spawnInterval: 100, // ms, how often to try spawning a new number
        driftDistance: 100 // max pixels a number can drift
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createNumber() {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = getRandomInt(0, 9);

        const fontSize = getRandomInt(numbersConfig.minFontSize, numbersConfig.maxFontSize);
        numberElement.style.fontSize = `${fontSize}px`;

        // Initial position (anywhere on screen)
        const x = getRandomFloat(0, container.offsetWidth - fontSize); // Subtract fontSize to keep it roughly within bounds
        const y = getRandomFloat(0, container.offsetHeight - fontSize);
        numberElement.style.left = `${x}px`;
        numberElement.style.top = `${y}px`;

        // Initial opacity (will be faded in by CSS transition)
        numberElement.style.opacity = 0;

        container.appendChild(numberElement);

        // Trigger fade-in and set movement/fade-out
        setTimeout(() => {
            const opacity = getRandomFloat(numbersConfig.minOpacity, numbersConfig.maxOpacity);
            numberElement.style.opacity = opacity;

            // Random drift
            const driftX = getRandomFloat(-numbersConfig.driftDistance, numbersConfig.driftDistance);
            const driftY = getRandomFloat(-numbersConfig.driftDistance, numbersConfig.driftDistance);
            numberElement.style.transform = `translate(${driftX}px, ${driftY}px)`;

        }, 50); // Short delay to allow CSS transition to pick up opacity change

        const duration = getRandomInt(numbersConfig.minDuration, numbersConfig.maxDuration);
        setTimeout(() => {
            numberElement.style.opacity = 0; // Fade out
            // Remove element after fade out transition completes
            setTimeout(() => {
                if (container.contains(numberElement)) {
                    container.removeChild(numberElement);
                }
            }, 1000); // Matches CSS opacity transition duration
        }, duration);
    }

    // Determine how many numbers to create based on screen size and density
    function startAnimation() {
        const area = container.offsetWidth * container.offsetHeight;
        const numbersToSpawnInitially = Math.floor(area * numbersConfig.density * 10); // Initial burst

        for (let i = 0; i < numbersToSpawnInitially; i++) {
            // Stagger initial spawn slightly for a more natural appearance
            setTimeout(createNumber, i * (numbersConfig.spawnInterval / 5));
        }

        // Continuously spawn new numbers
        setInterval(createNumber, numbersConfig.spawnInterval);
    }

    // Ensure container dimensions are available
    if (container.offsetWidth > 0 && container.offsetHeight > 0) {
        startAnimation();
    } else {
        // If dimensions are not yet available (e.g. display:none initially), wait for window load
        window.addEventListener('load', () => {
            if (container.offsetWidth > 0 && container.offsetHeight > 0) {
                startAnimation();
            } else {
                console.error("Container has no dimensions even after window load.");
            }
        });
    }
});
