// Main Three.js application
document.addEventListener('DOMContentLoaded', () => {
    // Create constellations
    createConstellations();
    
    // Create floating particles
    createFloatingParticles();
    
    // Show intro animation
    const introOverlay = document.getElementById('intro-overlay');
    const progressBar = document.getElementById('progress');
    
    // Simulate loading
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                introOverlay.classList.add('hidden');
            }, 500);
        }
    }, 200);
    
    // Panel state
    let panelHidden = false;
    let panelHeight = 300;
    let isResizing = false;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Add fog for depth effect
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.002);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);
    
    // Camera position
    camera.position.set(0, 30, 100);
    
    // Create starfield background
    createStarfield(scene);
    
    // Solar system parameters
    const planetsData = [
        { 
            name: 'Mercury', 
            color: 0xBCBABA, 
            size: 1.5, 
            orbitRadius: 20, 
            speed: 0.04, 
            rotationSpeed: 0.004, 
            info: "Closest planet to the Sun, with extreme temperature variations.",
            scale: "4,879 km",
            distance: "57.9M km",
            time: "88 days",
            facts: [
                "Smallest planet in the Solar System",
                "No atmosphere to retain heat",
                "Surface resembles Earth's moon"
            ]
        },
        { 
            name: 'Venus', 
            color: 0xE6C229, 
            size: 3.8, 
            orbitRadius: 30, 
            speed: 0.015, 
            rotationSpeed: 0.002, 
            info: "Hottest planet with a thick, toxic atmosphere.",
            scale: "12,104 km",
            distance: "108.2M km",
            time: "225 days",
            facts: [
                "Rotates backwards compared to other planets",
                "Hottest planet at 462°C (864°F)",
                "Atmosphere causes extreme greenhouse effect"
            ]
        },
        { 
            name: 'Earth', 
            color: 0x428ED4, 
            size: 4, 
            orbitRadius: 40, 
            speed: 0.01, 
            rotationSpeed: 0.01, 
            info: "Our home planet, the only known place with life.",
            scale: "12,742 km",
            distance: "149.6M km",
            time: "365.25 days",
            facts: [
                "Only planet known to support life",
                "71% of surface covered by water",
                "Has one natural satellite, the Moon"
            ]
        },
        { 
            name: 'Mars', 
            color: 0xE27B58, 
            size: 2.1, 
            orbitRadius: 50, 
            speed: 0.008, 
            rotationSpeed: 0.009, 
            info: "The Red Planet, with the largest volcano in the solar system.",
            scale: "6,779 km",
            distance: "227.9M km",
            time: "687 days",
            facts: [
                "Home to Olympus Mons, the tallest volcano",
                "Has two moons: Phobos and Deimos",
                "Surface contains iron oxide (rust)"
            ]
        },
        { 
            name: 'Jupiter', 
            color: 0xCEB8B8, 
            size: 8, 
            orbitRadius: 70, 
            speed: 0.002, 
            rotationSpeed: 0.025, 
            info: "Largest planet, with a prominent Great Red Spot storm.",
            scale: "139,820 km",
            distance: "778.5M km",
            time: "11.9 years",
            facts: [
                "Largest planet in Solar System",
                "Has at least 79 moons",
                "Great Red Spot is a giant storm"
            ]
        },
        { 
            name: 'Saturn', 
            color: 0xE4E1C1, 
            size: 7, 
            orbitRadius: 90, 
            speed: 0.0009, 
            rotationSpeed: 0.022, 
            info: "Famous for its spectacular ring system.",
            scale: "116,460 km",
            distance: "1.4B km",
            time: "29.5 years",
            facts: [
                "Most extensive ring system",
                "Has 82 confirmed moons",
                "Less dense than water (would float)"
            ]
        },
        { 
            name: 'Uranus', 
            color: 0xC7E3E2, 
            size: 5, 
            orbitRadius: 110, 
            speed: 0.0004, 
            rotationSpeed: 0.015, 
            info: "Ice giant that rotates on its side.",
            scale: "50,724 km",
            distance: "2.9B km",
            time: "84 years",
            facts: [
                "Rotates on its side (98° tilt)",
                "Coldest atmosphere in Solar System",
                "Has 27 known moons"
            ]
        },
        { 
            name: 'Neptune', 
            color: 0x7B91D0, 
            size: 5, 
            orbitRadius: 130, 
            speed: 0.0001, 
            rotationSpeed: 0.016, 
            info: "The windiest planet with the strongest winds in the solar system.",
            scale: "49,244 km",
            distance: "4.5B km",
            time: "165 years",
            facts: [
                "Strongest winds in Solar System (2,100 km/h)",
                "Discovered through mathematical predictions",
                "Has 14 known moons"
            ]
        }
    ];
    
    // Create the Sun
    const sunGeometry = new THREE.SphereGeometry(10, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFDB813,
        emissive: 0xFDB813,
        emissiveIntensity: 2
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunLight.position.set(0, 0, 0);
    sun.userData = {
        name: "Sun",
        info: "The star at the center of our Solar System.",
        scale: "1,391,000 km",
        distance: "Center",
        time: "25-35 days (rotation)",
        facts: [
            "Comprises 99.86% of Solar System mass",
            "Surface temperature: 5,500°C",
            "Age: 4.6 billion years"
        ]
    };
    
    // Create sun glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(11, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFDB813,
        transparent: true,
        opacity: 0.3
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);
    
    // Create corona effect for sun
    const coronaGeometry = new THREE.SphereGeometry(15, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF8C00,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    scene.add(corona);
    
    // Create planets and their orbits
    const planets = [];
    planetsData.forEach(data => {
        const planetGroup = new THREE.Group();
        
        // Create orbit path
        const orbitGeometry = new THREE.RingGeometry(data.orbitRadius - 0.5, data.orbitRadius + 0.5, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4488ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        planetGroup.add(orbit);
        
        // Create planet
        const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
        const planetMaterial = new THREE.MeshPhongMaterial({ 
            color: data.color,
            shininess: 30,
            specular: 0x333333
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.x = data.orbitRadius;
        planet.userData = { 
            name: data.name, 
            info: data.info,
            orbitRadius: data.orbitRadius,
            size: data.size,
            scale: data.scale,
            distance: data.distance,
            time: data.time,
            facts: data.facts
        };
        
        // Add ring to Saturn
        if (data.name === 'Saturn') {
            const ringGeometry = new THREE.RingGeometry(data.size + 1.5, data.size + 4, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xF1E4C3,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 3;
            planet.add(ring);
        }
        
        // Add glow to Earth
        if (data.name === 'Earth') {
            const glowGeometry = new THREE.SphereGeometry(data.size * 1.1, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x428ED4,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            planet.add(glow);
        }
        
        planetGroup.add(planet);
        scene.add(planetGroup);
        
        planets.push({
            group: planetGroup,
            planet: planet,
            orbitRadius: data.orbitRadius,
            speed: data.speed,
            rotationSpeed: data.rotationSpeed,
            angle: Math.random() * Math.PI * 2,
            name: data.name,
            info: data.info
        });
    });
    
    // Create asteroid belt
    createAsteroidBelt(scene, 60, 70, 500);
    
    // Create control panel
    createControlPanel(planets);
    
    // Animation state
    let isPaused = false;
    let globalSpeed = 1.0;
    const clock = new THREE.Clock();
    
    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedPlanet = null;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // Rotate the sun
        sun.rotation.y += 0.001 * globalSpeed;
        sunGlow.rotation.y += 0.001 * globalSpeed;
        corona.rotation.y += 0.0005 * globalSpeed;
        
        if (!isPaused) {
            // Update planet positions
            planets.forEach(planet => {
                planet.angle += planet.speed * delta * globalSpeed;
                planet.group.rotation.y = planet.angle;
                
                // Rotate planet on its axis
                planet.planet.rotation.y += planet.rotationSpeed * globalSpeed;
            });
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // UI event handlers
    document.getElementById('pause-btn').addEventListener('click', () => {
        isPaused = !isPaused;
        const btn = document.getElementById('pause-btn');
        btn.innerHTML = isPaused ? '<i class="fas fa-play"></i> Resume' : '<i class="fas fa-pause"></i> Pause';
        showNotification(isPaused ? "Animation paused" : "Animation resumed");
        
        // Animate button
        gsap.fromTo(btn, 
            { scale: 1.1, boxShadow: '0 0 20px rgba(0, 180, 255, 0.5)' },
            { scale: 1, duration: 0.5 }
        );
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        planets.forEach((planet, index) => {
            planet.speed = planetsData[index].speed;
            document.getElementById(`speed-${planet.name}`).value = planetsData[index].speed * 1000;
            document.getElementById(`speed-value-${planet.name}`).textContent = (planetsData[index].speed * 1000).toFixed(1);
        });
        globalSpeed = 1.0;
        document.getElementById('global-speed-value').textContent = globalSpeed.toFixed(1);
        document.getElementById('global-speed').value = globalSpeed * 10;
        showNotification("Speed reset to default values");
        updateActiveTimeButton('time-normal');
        
        // Animate button
        gsap.fromTo(document.getElementById('reset-btn'), 
            { rotation: 360 },
            { rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
        );
    });
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isLightMode = document.body.classList.toggle('light-mode');
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.innerHTML = isLightMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        scene.background = isLightMode ? 
            new THREE.Color(0xf0f8ff) : new THREE.Color(0x0a0e17);
        
        // Animate toggle
        gsap.fromTo(themeToggle, 
            { scale: 0.8 },
            { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    });
    
    document.getElementById('info-btn').addEventListener('click', () => {
        document.getElementById('info-panel').classList.toggle('visible');
        
        // Animate button
        gsap.fromTo(document.getElementById('info-btn'), 
            { y: -5 },
            { y: 0, duration: 0.3 }
        );
    });
    
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('info-panel').classList.remove('visible');
    });
    
    // Planet click event
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Check for planet/sun clicks
        const objects = [sun, ...planets.map(p => p.planet)];
        const intersects = raycaster.intersectObjects(objects, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.name) {
                showPlanetDetails(object.userData);
                
                // Animate planet
                gsap.to(object.scale, {
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    });
    
    // Hide/show panel functionality
    document.getElementById('hide-btn').addEventListener('click', () => {
        panelHidden = !panelHidden;
        const panel = document.getElementById('speed-controls');
        const hideBtn = document.getElementById('hide-btn');
        
        if (panelHidden) {
            panelHeight = panel.offsetHeight;
            panel.style.height = '50px';
            hideBtn.innerHTML = '<i class="fas fa-plus"></i>';
            showNotification("Control panel hidden. Click + to show.");
        } else {
            panel.style.height = `${panelHeight}px`;
            hideBtn.innerHTML = '<i class="fas fa-minus"></i>';
            showNotification("Control panel visible");
        }
        
        // Animate button
        gsap.fromTo(hideBtn, 
            { scale: 1.2 },
            { scale: 1, duration: 0.3 }
        );
    });
    
    // Resize handle functionality
    const resizeHandle = document.querySelector('.resize-handle');
    resizeHandle.addEventListener('mousedown', startResize);
    
    function startResize(e) {
        isResizing = true;
        const panel = document.getElementById('speed-controls');
        const startY = e.clientY;
        const startHeight = panel.offsetHeight;
        
        function doResize(e) {
            if (!isResizing) return;
            const newHeight = startHeight + (startY - e.clientY);
            if (newHeight > 100 && newHeight < window.innerHeight * 0.7) {
                panel.style.height = `${newHeight}px`;
                document.documentElement.style.setProperty('--panel-height', `${newHeight}px`);
                panelHeight = newHeight;
            }
        }
        
        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
        }
        
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    }
    
    // Time controls
    document.getElementById('time-slow').addEventListener('click', function() {
        updateActiveTimeButton('time-slow');
        globalSpeed = 0.5;
        document.getElementById('time-display').textContent = "Time: 0.5x";
        document.getElementById('global-speed-value').textContent = globalSpeed.toFixed(1);
        document.getElementById('global-speed').value = globalSpeed * 10;
    });
    
    document.getElementById('time-normal').addEventListener('click', function() {
        updateActiveTimeButton('time-normal');
        globalSpeed = 1.0;
        document.getElementById('time-display').textContent = "Time: 1x";
        document.getElementById('global-speed-value').textContent = globalSpeed.toFixed(1);
        document.getElementById('global-speed').value = globalSpeed * 10;
    });
    
    document.getElementById('time-fast').addEventListener('click', function() {
        updateActiveTimeButton('time-fast');
        globalSpeed = 2.0;
        document.getElementById('time-display').textContent = "Time: 2x";
        document.getElementById('global-speed-value').textContent = globalSpeed.toFixed(1);
        document.getElementById('global-speed').value = globalSpeed * 10;
    });
    
    function updateActiveTimeButton(buttonId) {
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(buttonId).classList.add('active');
        
        // Animate button
        gsap.fromTo(document.getElementById(buttonId), 
            { scale: 1.2 },
            { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" }
        );
    }
    
    // Helper functions
    function createStarfield(scene) {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 1.5,
            sizeAttenuation: true,
            transparent: true
        });
        
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
    }
    
    function createAsteroidBelt(scene, innerRadius, outerRadius, count) {
        const belt = new THREE.Group();
        
        for (let i = 0; i < count; i++) {
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const angle = Math.random() * Math.PI * 2;
            
            const asteroidGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.5, 8, 8);
            const asteroidMaterial = new THREE.MeshPhongMaterial({
                color: 0x888888
            });
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            
            asteroid.position.x = Math.cos(angle) * radius;
            asteroid.position.z = Math.sin(angle) * radius;
            asteroid.position.y = (Math.random() - 0.5) * 2;
            
            belt.add(asteroid);
        }
        
        scene.add(belt);
        return belt;
    }
    
    function createConstellations() {
        const container = document.getElementById('constellation');
        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${2 + Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(star);
        }
    }
    
    function createFloatingParticles() {
        const container = document.getElementById('floating-particles');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${1 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${100 + Math.random() * 20}%`;
            particle.style.animationDuration = `${10 + Math.random() * 20}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(particle);
        }
    }
    
    function createControlPanel(planets) {
        const container = document.getElementById('planets-container');
        
        planets.forEach(planet => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'planet-control';
            
            const planetHeader = document.createElement('div');
            planetHeader.className = 'planet-header';
            
            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'planet-color';
            colorIndicator.style.backgroundColor = `#${planet.planet.material.color.getHexString()}`;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'planet-name';
            nameSpan.textContent = planet.name;
            
            planetHeader.appendChild(colorIndicator);
            planetHeader.appendChild(nameSpan);
            
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';
            
            const input = document.createElement('input');
            input.type = 'range';
            input.id = `speed-${planet.name}`;
            input.min = '0';
            input.max = '200';
            input.step = '1';
            input.value = (planet.speed * 1000).toFixed(1);
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'speed-value';
            valueSpan.id = `speed-value-${planet.name}`;
            valueSpan.textContent = (planet.speed * 1000).toFixed(1);
            
            sliderContainer.appendChild(input);
            sliderContainer.appendChild(valueSpan);
            
            controlDiv.appendChild(planetHeader);
            controlDiv.appendChild(sliderContainer);
            
            container.appendChild(controlDiv);
            
            input.addEventListener('input', (e) => {
                const newSpeed = parseFloat(e.target.value) / 1000;
                planet.speed = newSpeed;
                valueSpan.textContent = e.target.value;
                
                // Animate slider
                gsap.to(valueSpan, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            });
        });
        
        // Add global speed control
        const globalControl = document.createElement('div');
        globalControl.className = 'planet-control';
        globalControl.innerHTML = `
            <div class="planet-header">
                <div class="planet-color" style="background: linear-gradient(90deg, #ff8a00, #e52e71, #22c1c3);"></div>
                <span class="planet-name">Global Speed</span>
            </div>
            <div class="slider-container">
                <input type="range" id="global-speed" min="1" max="20" step="1" value="10">
                <span class="speed-value"><span id="global-speed-value">1.0</span>x</span>
            </div>
        `;
        container.insertBefore(globalControl, container.firstChild);
        
        document.getElementById('global-speed').addEventListener('input', (e) => {
            globalSpeed = parseFloat(e.target.value) / 10;
            document.getElementById('global-speed-value').textContent = globalSpeed.toFixed(1);
            
            // Update time display
            if (globalSpeed === 0.5) {
                updateActiveTimeButton('time-slow');
                document.getElementById('time-display').textContent = "Time: 0.5x";
            } else if (globalSpeed === 1.0) {
                updateActiveTimeButton('time-normal');
                document.getElementById('time-display').textContent = "Time: 1x";
            } else if (globalSpeed === 2.0) {
                updateActiveTimeButton('time-fast');
                document.getElementById('time-display').textContent = "Time: 2x";
            } else {
                document.getElementById('time-display').textContent = `Time: ${globalSpeed.toFixed(1)}x`;
            }
        });
    }
    
    function showPlanetDetails(planetData) {
        const detailsPanel = document.getElementById('planet-details');
        detailsPanel.classList.add('visible');
        
        document.getElementById('planet-name').textContent = planetData.name;
        document.getElementById('planet-info').textContent = planetData.info;
        
        // Update stats
        const statsGrid = document.querySelector('.stats-grid');
        statsGrid.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Scale</div>
                <div class="stat-value">${planetData.scale}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Distance from Sun</div>
                <div class="stat-value">${planetData.distance}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Orbital Period</div>
                <div class="stat-value">${planetData.time}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Rotation</div>
                <div class="stat-value">${planetData.rotationSpeed ? (1/planetData.rotationSpeed).toFixed(1) + ' days' : 'N/A'}</div>
            </div>
        `;
        
        // Animate panel appearance
        gsap.from(detailsPanel, {
            y: 50,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.2)"
        });
    }
    
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Camera controls
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    
    document.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            camera.position.x -= deltaX * 0.1;
            camera.position.y += deltaY * 0.1;
            
            camera.lookAt(scene.position);
            
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    document.addEventListener('wheel', (e) => {
        camera.position.z += e.deltaY * 0.05;
    });
});