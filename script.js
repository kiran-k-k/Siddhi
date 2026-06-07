/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - SIDDHI MANE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Global State
    let certificationsData = [];
    let achievementsData = [];
    let currentCarouselIndex = 0;
    let currentCarouselImages = [];

    // --- 1. PRELOADER SCREEN ---
    const preloader = document.getElementById('preloader');
    const loadProgress = document.getElementById('load-progress');
    let loadPercentage = 0;

    const updatePreloader = (percent) => {
        loadPercentage = percent;
        loadProgress.style.width = `${loadPercentage}%`;
        if (loadPercentage >= 100) {
            setTimeout(() => {
                preloader.style.opacity = 0;
                preloader.style.pointerEvents = 'none';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Trigger initial reveal animations
                    document.querySelectorAll('.hero-section').forEach(el => el.classList.add('revealed'));
                    // Initialize count up
                    initScrollObservers();
                    // Display background music invitation toast
                    showMusicInvite();
                }, 500);
            }, 400);
        }
    };

    // Simulate progress bar initially, then bind to actual assets loaded
    let preloaderInterval = setInterval(() => {
        if (loadPercentage < 80) {
            updatePreloader(loadPercentage + Math.floor(Math.random() * 10) + 2);
        } else {
            clearInterval(preloaderInterval);
        }
    }, 100);


    // --- 2. CUSTOM FURUTISTIC CURSOR GLOW ---
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('custom-cursor-glow');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Linear interpolation for smooth trailing effect
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        cursor.style.transform = `translate(-50%, -50%)`;

        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        cursorGlow.style.transform = `translate(-50%, -50%)`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effect class updates
    const addHoverClass = () => {
        cursor.classList.add('hovered');
        cursorGlow.classList.add('hovered');
    };
    const removeHoverClass = () => {
        cursor.classList.remove('hovered');
        cursorGlow.classList.remove('hovered');
    };

    const attachCursorHoverListeners = () => {
        const hoverables = 'a, button, input, textarea, .cert-card, .timeline-card, .filter-tab, .logo, .social-btn';
        document.querySelectorAll(hoverables).forEach(el => {
            el.removeEventListener('mouseenter', addHoverClass);
            el.removeEventListener('mouseleave', removeHoverClass);
            el.addEventListener('mouseenter', addHoverClass);
            el.addEventListener('mouseleave', removeHoverClass);
        });
    };
    
    // Initial attach
    attachCursorHoverListeners();


    // --- 3. ANIMATED CANVAS PARTICLES BACKGROUND ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.15 - 0.075;
            this.speedY = Math.random() * 0.15 - 0.075;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.6 ? 'rgba(192, 132, 252, ' : 'rgba(226, 232, 240, '; // Purple vs Silver
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary wrapping
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Mouse interaction (repel effect)
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (120 - distance) / 120;
                this.x -= forceDirectionX * force * 1.5;
                this.y -= forceDirectionY * force * 1.5;
            }
        }
        draw() {
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    const initParticles = () => {
        particlesArray = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 150);
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Particle());
        }
    };
    initParticles();

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    };
    animateParticles();


    // --- 4. ANIMATED TYPING EFFECT ---
    const typedTextSpan = document.getElementById('typed-text');
    const phrases = [
        "Cybersecurity Enthusiast",
        "AI Learner",
        "Future Engineer",
        "Tech Explorer",
        "Academic Topper"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up backspacing
        } else {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 1800; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before starting new word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    setTimeout(typeEffect, 1000);


    // --- 5. AUDIO PLAYBACK & VINYL CONTROLLER ---
    const musicBtn = document.getElementById('music-btn');
    const bgAudio = document.getElementById('bg-audio');
    const musicController = document.getElementById('music-controller');
    const musicTooltip = document.querySelector('.music-tooltip');
    const musicInvite = document.getElementById('music-invite');
    const closeInviteBtn = document.getElementById('close-invite');
    
    const maxVolume = 0.25; // Soft background level (25%)
    let fadeInterval = null;

    bgAudio.volume = 0; // Start at 0 volume for fade-in

    // Fade-in Audio function
    const fadeInAudio = () => {
        clearInterval(fadeInterval);
        bgAudio.play().then(() => {
            musicController.classList.add('playing');
            musicTooltip.textContent = "Mute Background Music 🤫";
            
            const duration = 1500; // 1.5 seconds fade-in
            const stepTime = 50;
            const steps = duration / stepTime;
            const volumeStep = maxVolume / steps;

            fadeInterval = setInterval(() => {
                if (bgAudio.volume + volumeStep < maxVolume) {
                    bgAudio.volume += volumeStep;
                } else {
                    bgAudio.volume = maxVolume;
                    clearInterval(fadeInterval);
                }
            }, stepTime);
        }).catch(err => {
            console.log("Audio playback was blocked by browser interaction rules:", err);
            musicController.classList.remove('playing');
        });
    };

    // Fade-out Audio function
    const fadeOutAudio = () => {
        clearInterval(fadeInterval);
        
        const duration = 800; // 0.8 seconds fade-out
        const stepTime = 50;
        const steps = duration / stepTime;
        const volumeStep = bgAudio.volume / steps;

        fadeInterval = setInterval(() => {
            if (bgAudio.volume - volumeStep > 0) {
                bgAudio.volume -= volumeStep;
            } else {
                bgAudio.volume = 0;
                bgAudio.pause();
                musicController.classList.remove('playing');
                musicTooltip.textContent = "Play Background Music ✨";
                clearInterval(fadeInterval);
            }
        }, stepTime);
    };

    // Toggle Play/Mute
    musicBtn.addEventListener('click', () => {
        // If invite is visible, close it
        if (musicInvite.classList.contains('active')) {
            musicInvite.classList.remove('active');
        }

        if (bgAudio.paused || bgAudio.volume === 0) {
            fadeInAudio();
        } else {
            fadeOutAudio();
        }
    });

    // Close invite button click
    closeInviteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering music play
        musicInvite.classList.remove('active');
    });

    // Show music invitation popup after page load
    const showMusicInvite = () => {
        setTimeout(() => {
            // Show invite only if music is not already playing
            if (bgAudio.paused) {
                musicInvite.classList.add('active');
                
                // Automatically auto-hide after 8 seconds if not clicked
                setTimeout(() => {
                    if (musicInvite) {
                        musicInvite.classList.remove('active');
                    }
                }, 8000);
            }
        }, 1500); // Wait 1.5s after loader completes
    };


    // --- 6. SCROLL & PROGRESS EFFECTS ---
    // Update scroll progress bar
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        document.getElementById('scroll-progress').style.transform = `scaleX(${scrollPercent / 100})`;

        // Shrink navigation bar on scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link switching
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Achievements timeline scroll progress bar fill
        updateTimelineProgress();
    });

    const updateTimelineProgress = () => {
        const timelineSection = document.getElementById('achievements');
        const timelineLine = document.querySelector('.timeline-line');
        const timelineProgressBar = document.getElementById('timeline-progress');
        if (!timelineSection || !timelineLine || !timelineProgressBar) return;

        const timelineRect = timelineLine.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if timeline is visible
        if (timelineRect.top < viewportHeight && timelineRect.bottom > 0) {
            const timelineTotalHeight = timelineRect.height;
            const timelineStart = timelineRect.top;
            
            // Calculate how much timeline has scrolled past the trigger line (middle of screen)
            const triggerOffset = viewportHeight * 0.45;
            let scrolled = triggerOffset - timelineStart;
            
            // Constrain
            scrolled = Math.max(0, Math.min(scrolled, timelineTotalHeight));
            const percent = (scrolled / timelineTotalHeight) * 100;
            timelineProgressBar.style.height = `${percent}%`;

            // Active dots based on vertical scroll
            const timelineItemsList = document.querySelectorAll('.timeline-item');
            timelineItemsList.forEach(item => {
                const dot = item.querySelector('.timeline-dot');
                const dotRect = dot.getBoundingClientRect();
                if (dotRect.top < triggerOffset) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    };


    // --- 7. MOBILE NAVBAR TOGGLE ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // --- 8. DYNAMIC DATA LOADING AND GRID GENERATION ---
    const fetchPortfolioData = async () => {
        try {
            // Load both files in parallel
            const [certsRes, achsRes] = await Promise.all([
                fetch('data/certifications.json'),
                fetch('data/achievements.json')
            ]);

            certificationsData = await certsRes.json();
            achievementsData = await achsRes.json();

            // Finish preloader loading progress
            updatePreloader(100);

            // Render Grids
            renderCertifications(certificationsData);
            renderAchievements(achievementsData);

            // Re-attach hover cursor triggers to dynamic content
            attachCursorHoverListeners();

        } catch (error) {
            console.error("Failed to load portfolio database JSON files:", error);
            // Dynamic error handling fallback
            document.getElementById('certs-loader').innerHTML = `
                <i class="fa-solid fa-circle-exclamation" style="font-size: 2.2rem; color: var(--accent-purple);"></i>
                <p>Failed to load certifications. Please refresh the page.</p>
            `;
            document.getElementById('achievements-loader').innerHTML = `
                <i class="fa-solid fa-circle-exclamation" style="font-size: 2.2rem; color: var(--accent-purple);"></i>
                <p>Failed to build timeline. Please refresh the page.</p>
            `;
        }
    };

    // Helper to generate SVG placeholders dynamically
    const generateSVGPlaceholder = (title, issuer) => {
        return `<svg class="missing-asset-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="svg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#181822" />
                    <stop offset="100%" stop-color="#08080a" />
                </linearGradient>
                <linearGradient id="neon-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#c084fc" />
                    <stop offset="100%" stop-color="#6366f1" />
                </linearGradient>
            </defs>
            <rect width="400" height="300" rx="16" fill="url(#svg-grad)" stroke="rgba(168, 85, 247, 0.12)" stroke-width="1.5"/>
            <circle cx="340" cy="60" r="70" fill="#a855f7" opacity="0.04" />
            <circle cx="60" cy="240" r="50" fill="#6366f1" opacity="0.04" />
            
            <g transform="translate(200, 95) scale(0.95)">
                <circle cx="0" cy="0" r="42" fill="none" stroke="url(#neon-glow)" stroke-width="1.5" stroke-dasharray="4, 4" />
                <polygon points="0,-32 26,-9 18,22 -18,22 -26,-9" fill="rgba(168, 85, 247, 0.12)" stroke="url(#neon-glow)" stroke-width="2" />
                <!-- Star shape -->
                <path d="M0,-10 L2.5,-3 L9,-3 L4,1 L6,8 L0,4.5 L-6,8 L-4,1 L-9,-3 L-2.5,-3 Z" fill="#ffffff" />
            </g>
            
            <text x="200" y="180" font-family="'Syne', sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">HONORARY CREDENTIAL</text>
            <text x="200" y="210" font-family="'Poppins', sans-serif" font-size="12" font-weight="600" fill="#c084fc" text-anchor="middle">${title.length > 38 ? title.substring(0, 35) + '...' : title}</text>
            <text x="200" y="232" font-family="'Poppins', sans-serif" font-size="10" font-weight="500" fill="#94a3b8" text-anchor="middle">Issuer: ${issuer}</text>
            <text x="200" y="268" font-family="'Poppins', sans-serif" font-size="8" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="2.5">SIDDHI MANE PORTFOLIO</text>
        </svg>`;
    };

    // Render Certifications Grid
    const renderCertifications = (certs) => {
        const grid = document.getElementById('certifications-grid');
        const loader = document.getElementById('certs-loader');
        
        loader.style.display = 'none';
        grid.style.display = 'grid';
        grid.innerHTML = '';

        certs.forEach(cert => {
            const card = document.createElement('article');
            card.className = `cert-card filter-item`;
            card.setAttribute('data-category', cert.category);
            card.setAttribute('data-id', cert.id);
            
            // Build Skills Tags
            const tagsHTML = cert.skills.map(skill => `<span class="tag">${skill}</span>`).join('');
            
            // Check file type / format
            let fileTypeHTML = '';
            if (cert.image) {
                if (cert.image.endsWith('.pdf')) {
                    fileTypeHTML = `<span class="media-type-badge"><i class="fa-solid fa-file-pdf"></i> PDF</span>`;
                } else {
                    fileTypeHTML = `<span class="media-type-badge"><i class="fa-solid fa-image"></i> Image</span>`;
                }
            } else {
                fileTypeHTML = `<span class="media-type-badge"><i class="fa-solid fa-certificate"></i> Verified</span>`;
            }

            // Simple styled issuer icons map
            let issuerLogo = `<i class="fa-solid fa-award"></i>`;
            const lowIssuer = cert.issuer.toLowerCase();
            if (lowIssuer.includes('infosys')) {
                issuerLogo = `<i class="fa-solid fa-server" style="color: #007cc3;"></i>`;
            } else if (lowIssuer.includes('forage')) {
                issuerLogo = `<i class="fa-solid fa-circle-nodes" style="color: #6366f1;"></i>`;
            } else if (lowIssuer.includes('deloitte')) {
                issuerLogo = `<i class="fa-solid fa-cubes" style="color: #86efac;"></i>`;
            } else if (lowIssuer.includes('internshala')) {
                issuerLogo = `<i class="fa-solid fa-graduation-cap" style="color: #38bdf8;"></i>`;
            } else if (lowIssuer.includes('great learning') || lowIssuer.includes('simplilearn') || lowIssuer.includes('nxtwave')) {
                issuerLogo = `<i class="fa-solid fa-book-open" style="color: #f472b6;"></i>`;
            } else if (lowIssuer.includes('wscube')) {
                issuerLogo = `<i class="fa-solid fa-shield-halved" style="color: #c084fc;"></i>`;
            }

            card.innerHTML = `
                <div class="cert-header">
                    <div class="issuer-logo-container">
                        ${issuerLogo}
                    </div>
                    <span class="cert-date">${cert.issued || 'Verified'}</span>
                </div>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-issuer">${cert.issuer}</p>
                <div class="cert-tags">
                    ${tagsHTML}
                </div>
                <div class="cert-footer">
                    ${fileTypeHTML}
                    <button class="cert-card-btn">
                        <span>View Details</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;

            // Mouse hover card 3D lighting effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });

            // Dialog Event Trigger
            card.querySelector('.cert-card-btn').addEventListener('click', () => {
                openModal('cert', cert.id);
            });

            grid.appendChild(card);
        });
    };

    // Render Achievements Timeline Grid
    const renderAchievements = (achievements) => {
        const timeline = document.getElementById('timeline-items');
        const loader = document.getElementById('achievements-loader');
        
        loader.style.display = 'none';
        timeline.style.display = 'block';
        timeline.innerHTML = '';

        achievements.forEach((ach, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            // Check images (single/multiple/null)
            let imageBadge = '';
            if (Array.isArray(ach.image)) {
                imageBadge = `<span class="img-badge"><i class="fa-solid fa-images"></i> Slider (${ach.image.length})</span>`;
            } else if (ach.image) {
                if (ach.image.endsWith('.pdf')) {
                    imageBadge = `<span class="img-badge"><i class="fa-solid fa-file-pdf"></i> PDF View</span>`;
                } else {
                    imageBadge = `<span class="img-badge"><i class="fa-solid fa-image"></i> View Image</span>`;
                }
            } else {
                imageBadge = `<span class="img-badge"><i class="fa-solid fa-sparkles"></i> Spotlight</span>`;
            }

            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-card" data-id="${ach.id}">
                    <div class="timeline-card-header">
                        <span class="timeline-date">${ach.date}</span>
                        <span class="timeline-category">${ach.category}</span>
                    </div>
                    <h3 class="timeline-title">${ach.title}</h3>
                    <p class="timeline-desc">${ach.description}</p>
                    <div class="timeline-card-footer">
                        ${imageBadge}
                        <span>See Details <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
            `;

            // Modal Trigger
            item.querySelector('.timeline-card').addEventListener('click', () => {
                openModal('ach', ach.id);
            });

            timeline.appendChild(item);
        });
    };

    // --- 9. CERTIFICATION FILTER SYSTEM ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const filterValue = tab.getAttribute('data-filter');
            const certCards = document.querySelectorAll('.cert-card');

            // Add smooth fade-out and fade-in
            certCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });


    // --- 10. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
    const initScrollObservers = () => {
        const sections = document.querySelectorAll('.section-reveal');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger skill cards loading animation if in skills section
                    if (entry.target.id === 'skills') {
                        animateSkillProgressBars();
                    }

                    // Trigger stats counts animation if in about section
                    if (entry.target.id === 'about') {
                        animateStatsCounter();
                    }
                }
            });
        }, {
            threshold: 0.02,
            rootMargin: '0px 0px -30px 0px' // Safe for small screens/tall sections
        });

        sections.forEach(section => {
            revealObserver.observe(section);
        });
    };

    // Skill Bar filling
    const animateSkillProgressBars = () => {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress;
        });
    };

    // Stats Counters
    const animateStatsCounter = () => {
        document.querySelectorAll('.stat-number').forEach(counter => {
            if (counter.classList.contains('counted')) return;
            
            const target = parseFloat(counter.getAttribute('data-target'));
            const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
            const exactVal = counter.getAttribute('data-exact');
            const duration = 2000; // 2 seconds
            let start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Quadratic ease-out for counters
                const easeProgress = progress * (2 - progress);
                let currentVal = start + easeProgress * (target - start);

                if (exactVal && progress === 1) {
                    counter.textContent = exactVal;
                } else {
                    counter.textContent = decimals > 0 
                        ? currentVal.toFixed(decimals) 
                        : Math.floor(currentVal);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.classList.add('counted');
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };


    // --- 11. INTERACTIVE LIGHTBOX DIALOG MODAL CONTROLLER ---
    const modal = document.getElementById('lightbox-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const mediaContainer = document.getElementById('modal-media-container');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalMeta = document.getElementById('modal-meta');
    const modalDesc = document.getElementById('modal-desc');
    const modalExtra = document.getElementById('modal-extra-section');

    const openModal = (type, id) => {
        let dataItem = null;
        
        if (type === 'cert') {
            dataItem = certificationsData.find(c => c.id === id);
            if (!dataItem) return;
            
            modalTag.textContent = dataItem.category.replace('-', ' ');
            modalTitle.textContent = dataItem.title;
            modalMeta.innerHTML = `<i class="fa-solid fa-award"></i> Issued ${dataItem.issued} by ${dataItem.issuer}`;
            modalDesc.textContent = `A professional certification representing skills gained in ${dataItem.skills.join(', ')}. Issued by ${dataItem.issuer} during ${dataItem.issued}.`;
            
            // Skills tags list
            const tagsHTML = dataItem.skills.map(t => `<span class="tag">${t}</span>`).join('');
            modalExtra.innerHTML = `
                <h4 class="modal-extra-title">Skills Endorsed</h4>
                <div class="modal-extra-tags">${tagsHTML}</div>
            `;
            
            // Load visual content (PDF / Image / SVG)
            renderModalMedia(dataItem.image, dataItem.title, dataItem.issuer);

        } else if (type === 'ach') {
            dataItem = achievementsData.find(a => a.id === id);
            if (!dataItem) return;

            modalTag.textContent = "Milestone";
            modalTitle.textContent = dataItem.title;
            modalMeta.innerHTML = `<i class="fa-solid fa-calendar"></i> Achieved ${dataItem.date} | Category: ${dataItem.category}`;
            modalDesc.textContent = dataItem.description;
            
            // Show action links if applicable
            modalExtra.innerHTML = `
                <a href="#contact" class="modal-extra-btn">
                    <i class="fa-solid fa-circle-question"></i>
                    <span>Inquire About This</span>
                </a>
            `;

            // Visual Media
            renderModalMedia(dataItem.image, dataItem.title, "Siddhi Mane Achievements");
        }

        // Append custom cursor to modal to keep it visible in top-layer
        modal.appendChild(cursor);
        modal.appendChild(cursorGlow);

        // Open Dialog natively
        modal.showModal();
        removeHoverClass(); // Reset cursor hover states
    };

    const renderModalMedia = (mediaSrc, title, issuer) => {
        mediaContainer.innerHTML = '';
        currentCarouselImages = [];
        currentCarouselIndex = 0;

        if (!mediaSrc) {
            // Render SVG Placeholder badge
            mediaContainer.innerHTML = generateSVGPlaceholder(title, issuer);
        } else if (Array.isArray(mediaSrc)) {
            // Render Image Carousel/Slider
            currentCarouselImages = mediaSrc;
            
            // Slide templates
            const slidesHTML = mediaSrc.map((img, idx) => `
                <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <img src="${img}" alt="${title} image ${idx + 1}" loading="lazy">
                </div>
            `).join('');

            // Indicators
            const dotsHTML = mediaSrc.map((_, idx) => `
                <span class="carousel-dot ${idx === 0 ? 'active' : ''}" data-slide-to="${idx}"></span>
            `).join('');

            mediaContainer.innerHTML = `
                <div class="carousel-wrapper">
                    <button class="carousel-btn carousel-prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
                    <div class="carousel-slides">
                        ${slidesHTML}
                    </div>
                    <button class="carousel-btn carousel-next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
                    <div class="carousel-indicators">
                        ${dotsHTML}
                    </div>
                </div>
            `;
            
            // Add listeners to slider controls
            initCarouselControls();

        } else if (mediaSrc.endsWith('.pdf')) {
            // Render PDF Viewer (Iframe fallback to viewer or direct download)
            mediaContainer.innerHTML = `
                <div class="pdf-viewer-container">
                    <iframe class="pdf-viewer" src="${mediaSrc}#toolbar=0" type="application/pdf"></iframe>
                </div>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem; text-align:center;">
                    <a href="${mediaSrc}" target="_blank" style="color:var(--accent-purple); text-decoration:underline;"><i class="fa-solid fa-download"></i> Download full PDF Certificate</a>
                </p>
            `;
        } else {
            // Render single image
            mediaContainer.innerHTML = `<img src="${mediaSrc}" alt="${title}" loading="lazy">`;
        }

        // Re-attach custom cursor listener to modal controls
        setTimeout(attachCursorHoverListeners, 100);
    };

    // Carousel Slider Logic
    const initCarouselControls = () => {
        const prevBtn = mediaContainer.querySelector('.carousel-prev');
        const nextBtn = mediaContainer.querySelector('.carousel-next');
        const dots = mediaContainer.querySelectorAll('.carousel-dot');
        const slides = mediaContainer.querySelectorAll('.carousel-slide');

        const showSlide = (idx) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Wrap index
            if (idx < 0) currentCarouselIndex = currentCarouselImages.length - 1;
            else if (idx >= currentCarouselImages.length) currentCarouselIndex = 0;
            else currentCarouselIndex = idx;

            slides[currentCarouselIndex].classList.add('active');
            dots[currentCarouselIndex].classList.add('active');
        };

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentCarouselIndex - 1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentCarouselIndex + 1);
        });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(idx);
            });
        });

        // Swipe support for touch screens
        let touchStartX = 0;
        let touchEndX = 0;
        const sliderWrapper = mediaContainer.querySelector('.carousel-slides');

        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) showSlide(currentCarouselIndex - 1); // Swipe Right
                else showSlide(currentCarouselIndex + 1); // Swipe Left
            }
        };
    };

    // Close Dialog Modal
    modalCloseBtn.addEventListener('click', () => {
        modal.close();
    });

    // Return custom cursor back to body when modal closes
    modal.addEventListener('close', () => {
        document.body.appendChild(cursor);
        document.body.appendChild(cursorGlow);
        removeHoverClass();
    });

    // Fallback for click outside standard modal backdrop (Light dismiss)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
        modal.addEventListener('click', (event) => {
            if (event.target !== modal) return;

            const rect = modal.getBoundingClientRect();
            const isInside = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );

            if (!isInside) {
                modal.close();
            }
        });
    }

    // --- 12. RUN INITIALISERS ---
    fetchPortfolioData();

});
