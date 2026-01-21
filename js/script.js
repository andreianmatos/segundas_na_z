document.addEventListener('DOMContentLoaded', () => {
    
    // wsrv.nl CDN base URL for faster image loading with automatic optimization
    const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/andreianmatos/segundas_na_z/main/';
    
    // Helper function to get wsrv.nl URL
    function getImageUrl(path) {
        return `https://wsrv.nl/?url=${encodeURIComponent(GITHUB_RAW_BASE + path)}`;
    }
    
    const posterFiles = ['monthly_poster.webp'];
    // const posterFiles = ['monthly_poster.webp', 'week1.webp', 'week2.webp', 'week3.webp', 'week4.webp']; // Weekly posters commented out
    const eventFiles = ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp'];
    const youtubeIDs = ['BRGZ-pxAiPw']; 

    const containers = {
        prog: document.getElementById('posters-container'),
        log: document.getElementById('events-container')
    };

    let lastWidth = window.innerWidth;
    let positionsInitialized = false; // Ensures positioning only runs once

    // Scroll indicators
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.scroll-indicators').forEach(ind => ind.classList.remove('active'));
                if (id === 'sobre') document.querySelector('.sobre-indicators').classList.add('active');
                if (id === 'prog') document.querySelector('.prog-indicators').classList.add('active');
                if (id === 'log') document.querySelector('.eventos-indicators').classList.add('active');
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.snap-section').forEach(s => observer.observe(s));

    // Positioning logic
    function initPositions(force = false) {
        // Skip if already positioned and width unchanged
        if (positionsInitialized && !force) return;

        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const isMobile = winW <= 768;

        const safePad = isMobile ? 10 : 40;
        const arrowBox = isMobile ? 80 : 130;

        const forbiddenZones = [
            { l: 0, t: winH - arrowBox, r: arrowBox, b: winH }, 
            { l: winW - arrowBox, t: winH - arrowBox, r: winW, b: winH }
        ];

        [containers.prog, containers.log].forEach(container => {
            const isProg = (container.id === 'posters-container');
            const items = container.querySelectorAll('.poster-item, .event-item, .video-item');
            const placedRects = [];

            items.forEach(item => {
                const w = item.offsetWidth;
                const h = item.offsetHeight;
                let x, y, rect;

                // Center monthly poster instead of random positioning
                if (item.classList.contains('monthly-poster')) {
                    x = (winW - w) / 2;
                    y = (winH - h) / 2;
                    rect = { left: x, top: y, right: x + w, bottom: y + h };
                } else {
                    // Random positioning for other items
                    let attempts = 0;
                    let overlap;
                    let currentBuffer = isMobile ? 8 : 30;

                    do {
                        overlap = false;
                        x = Math.random() * (winW - w - (safePad * 2)) + safePad;
                        y = Math.random() * (winH - h - (safePad * 2)) + safePad;
                        rect = { left: x, top: y, right: x + w, bottom: y + h };

                        // Avoid arrow zones
                        for (let z of forbiddenZones) {
                            if (!(rect.right < z.l || rect.left > z.r || rect.bottom < z.t || rect.top > z.b)) {
                                overlap = true; break;
                            }
                        }

                        // Posters don't overlap each other
                        if (!overlap && isProg) {
                            for (let r of placedRects) {
                                const collision = !(
                                    rect.right + currentBuffer < r.left || 
                                    rect.left > r.right + currentBuffer || 
                                    rect.bottom + currentBuffer < r.top || 
                                    rect.top > r.bottom + currentBuffer
                                );
                                if (collision) { overlap = true; break; }
                            }
                        }
                        attempts++;
                        if (attempts > 400 && currentBuffer > 2) currentBuffer -= 1;
                    } while (overlap && attempts < 800);
                }

                item.style.left = x + 'px';
                item.style.top = y + 'px';
                item.style.opacity = '1';
                placedRects.push(rect);

                // Only setup drag on first positioning (skip for monthly poster)
                if (!positionsInitialized && !item.classList.contains('monthly-poster')) {
                    setupDrag(item);
                }
            });
        });

        positionsInitialized = true;
    }

    // Drag logic - seamless and smooth (optimized for Mac trackpads and mobile)
    function setupDrag(item) {
        let isDragging = false;
        let startX, startY, initialL, initialT;
        let dragThreshold = 5; // Lower threshold for more responsive feel
        let rafId = null;

        const onStart = (e) => {
            // Don't start drag on right-click or middle-click
            if (e.button && e.button !== 0) return;
            
            const evt = e.type.includes('touch') ? e.touches[0] : e;
            startX = evt.clientX; 
            startY = evt.clientY;
            initialL = parseFloat(item.style.left) || 0;
            initialT = parseFloat(item.style.top) || 0;

            document.addEventListener('mousemove', onMove, { passive: false });
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('mouseleave', onEnd);
            document.addEventListener('touchend', onEnd);
            document.addEventListener('touchcancel', onEnd);
        };

        const updatePosition = (x, y) => {
            // Cancel any pending animation frame
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }

            // Use requestAnimationFrame for smooth, seamless updates
            rafId = requestAnimationFrame(() => {
                const mx = window.innerWidth - item.offsetWidth;
                const my = window.innerHeight - item.offsetHeight;
                const nx = Math.max(0, Math.min(x, mx));
                const ny = Math.max(0, Math.min(y, my));

                // Direct style update for maximum performance
                item.style.left = nx + 'px';
                item.style.top = ny + 'px';
                rafId = null;
            });
        };

        const onMove = (e) => {
            const evt = e.type.includes('touch') ? e.touches[0] : e;
            const deltaX = Math.abs(evt.clientX - startX);
            const deltaY = Math.abs(evt.clientY - startY);

            // Start dragging only after threshold exceeded
            if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
                isDragging = true;
                item.classList.add('dragging');
                item.style.userSelect = 'none';
                item.style.transition = 'none'; // Remove transitions during drag
            }

            if (!isDragging) return;

            // Prevent page scroll while dragging
            if (e.cancelable) e.preventDefault();

            const nx = initialL + (evt.clientX - startX);
            const ny = initialT + (evt.clientY - startY);
            updatePosition(nx, ny);
        };

        const onEnd = () => {
            // Cancel any pending animation
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            if (isDragging) {
                item.classList.remove('dragging');
                item.style.userSelect = '';
                item.style.transition = ''; // Restore transitions
            }
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('mouseleave', onEnd);
            document.removeEventListener('touchend', onEnd);
            document.removeEventListener('touchcancel', onEnd);
        };

        item.addEventListener('mousedown', onStart, { passive: false });
        item.addEventListener('touchstart', onStart, { passive: false });
    }

    // Load monthly poster first (priority loading - appears immediately)
    function loadMonthlyPoster() {
        return new Promise((resolve) => {
            const f = 'monthly_poster.webp';
            const div = document.createElement('div');
            div.className = 'poster-item monthly-poster';
            const img = new Image();
            
            // Add to DOM immediately so it appears as soon as it starts loading
            containers.prog.appendChild(div);
            div.appendChild(img);
            
            img.onload = () => {
                setTimeout(() => initPositions(), 50);
                resolve();
            };
            img.onerror = () => {
                // Fallback to PNG if WebP fails
                img.src = getImageUrl(`images/programming/monthly_poster.png`);
            };
            img.src = getImageUrl(`images/programming/${f}`);
        });
    }

    // Load content
    async function loadAll() {
        // Load monthly poster first and wait for it to appear
        await loadMonthlyPoster();

        // Then load events after monthly poster is visible
        eventFiles.forEach(f => {
            const div = document.createElement('div');
            div.className = 'event-item';
            const img = new Image();
            img.onload = () => {
                div.appendChild(img);
                containers.log.appendChild(div);
            };
            img.onerror = () => {
                // Fallback to JPG if WebP fails
                const fallback = f.replace('.webp', '.jpg').replace('.webp', '.JPG');
                img.src = getImageUrl(`images/archive/${fallback}`);
            };
            img.src = getImageUrl(`images/archive/${f}`);
        });

        youtubeIDs.forEach(id => {
            const div = document.createElement('div');
            div.className = 'video-item';
            div.innerHTML = `
                <div class="video-content">
                    <div class="video-overlay"></div>
                    <iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0" allow="autoplay"></iframe>
                </div>`;
            containers.log.appendChild(div);
        });

        // Position events after a short delay
        setTimeout(() => initPositions(), 300);
    }

    loadAll();

    // Prevent repositioning on mobile height changes (only on width changes like rotation)
    window.addEventListener('resize', () => {
        if (Math.abs(window.innerWidth - lastWidth) > 5) {
            lastWidth = window.innerWidth;
            positionsInitialized = false; // Allow repositioning only on rotation
            initPositions(true);
        }
    });
});