document.addEventListener('DOMContentLoaded', () => {
    
    const posterFiles = ['monthly_poster.png', 'week1.png', 'week2.png', 'week3.png', 'week4.png'];
    const eventFiles = ['1.jpg', '2.JPG', '3.JPG', '4.jpg', '5.JPG', '6.JPG', '7.JPG', '8.JPG'];
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
                let attempts = 0;
                let x, y, rect, overlap;
                const w = item.offsetWidth;
                const h = item.offsetHeight;

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

                item.style.left = x + 'px';
                item.style.top = y + 'px';
                item.style.opacity = '1';
                placedRects.push(rect);

                // Only setup drag on first positioning
                if (!positionsInitialized) setupDrag(item);
            });
        });

        positionsInitialized = true;
    }

    // Drag logic with threshold
    function setupDrag(item) {
        let isDragging = false;
        let startX, startY, initialL, initialT;
        let dragThreshold = 5; // Threshold to distinguish scroll from drag

        const onStart = (e) => {
            const evt = e.type.includes('touch') ? e.touches[0] : e;
            startX = evt.clientX; startY = evt.clientY;
            initialL = parseFloat(item.style.left);
            initialT = parseFloat(item.style.top);

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        };

        const onMove = (e) => {
            const evt = e.type.includes('touch') ? e.touches[0] : e;
            const deltaX = Math.abs(evt.clientX - startX);
            const deltaY = Math.abs(evt.clientY - startY);

            // Start dragging only after threshold exceeded
            if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
                isDragging = true;
                item.classList.add('dragging');
            }

            if (!isDragging) return;

            // Prevent page scroll while dragging
            if (e.cancelable) e.preventDefault();

            let nx = initialL + (evt.clientX - startX);
            let ny = initialT + (evt.clientY - startY);

            const mx = window.innerWidth - item.offsetWidth;
            const my = window.innerHeight - item.offsetHeight;
            nx = Math.max(0, Math.min(nx, mx));
            ny = Math.max(0, Math.min(ny, my));

            item.style.left = nx + 'px';
            item.style.top = ny + 'px';
        };

        const onEnd = () => {
            if (isDragging) item.classList.remove('dragging');
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
        };

        item.addEventListener('mousedown', onStart);
        item.addEventListener('touchstart', onStart, { passive: false });
    }

    // Load content
    async function loadAll() {
        const promises = [];
        posterFiles.forEach(f => {
            promises.push(new Promise(res => {
                const div = document.createElement('div');
                div.className = 'poster-item' + (f.includes('monthly') ? ' monthly-poster' : '');
                const img = new Image();
                img.onload = () => res();
                img.src = `images/programming/${f}`;
                div.appendChild(img);
                containers.prog.appendChild(div);
            }));
        });
        eventFiles.forEach(f => {
            promises.push(new Promise(res => {
                const div = document.createElement('div');
                div.className = 'event-item';
                const img = new Image();
                img.onload = () => res();
                img.src = `images/archive/${f}`;
                div.appendChild(img);
                containers.log.appendChild(div);
            }));
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

        await Promise.all(promises);
        setTimeout(() => initPositions(), 200);
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