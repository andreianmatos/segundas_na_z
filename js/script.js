document.addEventListener('DOMContentLoaded', () => {
    
    const posterFiles = ['monthly_poster.png', 'week1.png', 'week2.png', 'week3.png', 'week4.png'];
    const eventFiles = ['1.jpg', '2.JPG', '3.JPG', '4.jpg', '5.JPG', '6.JPG', '7.JPG', '8.JPG'];
    const youtubeIDs = ['BRGZ-pxAiPw']; 

    const containers = {
        prog: document.getElementById('posters-container'),
        log: document.getElementById('events-container')
    };

    // 1. SCROLL ARROWS
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

    // 2. POSITIONING LOGIC
    function initPositions() {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const isMobile = winW <= 768;

        // Margem mínima absoluta para não colar ao vidro, mas usar o ecrã todo
        const safePad = isMobile ? 8 : 40;
        // Tamanho exato da zona das setas (apenas nos cantos inferiores)
        const arrowBoxW = isMobile ? 70 : 120;
        const arrowBoxH = isMobile ? 70 : 120;

        const forbiddenZones = [
            { l: 0, t: winH - arrowBoxH, r: arrowBoxW, b: winH }, // Canto inferior esquerdo
            { l: winW - arrowBoxW, t: winH - arrowBoxH, r: winW, b: winH } // Canto inferior direito
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

                // Buffer de espaço entre posters (reduz se não houver espaço no mobile)
                let currentBuffer = isMobile ? 10 : 30;

                do {
                    overlap = false;
                    // X e Y aleatórios respeitando o safePad
                    x = Math.random() * (winW - w - (safePad * 2)) + safePad;
                    y = Math.random() * (winH - h - (safePad * 2)) + safePad;
                    rect = { left: x, top: y, right: x + w, bottom: y + h };

                    // 1. Verificar colisão apenas com os CANTOS das setas
                    for (let z of forbiddenZones) {
                        if (!(rect.right < z.l || rect.left > z.r || rect.bottom < z.t || rect.top > z.b)) {
                            overlap = true; break;
                        }
                    }

                    // 2. Programação: Impedir sobreposição entre si
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
                    // Se estiver difícil de posicionar, reduz o espaço entre posters gradualmente
                    if (attempts > 300 && currentBuffer > 2) currentBuffer -= 1;

                } while (overlap && attempts < 1000);

                item.style.left = x + 'px';
                item.style.top = y + 'px';
                item.style.opacity = '1';
                placedRects.push(rect);
                setupDrag(item);
            });
        });
    }

    // 3. DRAG LOGIC
    function setupDrag(item) {
        let isDragging = false;
        let startX, startY, initialL, initialT;

        const onStart = (e) => {
            isDragging = true;
            item.classList.add('dragging');
            const evt = e.type.includes('touch') ? e.touches[0] : e;
            startX = evt.clientX; startY = evt.clientY;
            initialL = parseFloat(item.style.left); initialT = parseFloat(item.style.top);
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault();
            const evt = e.type.includes('touch') ? e.touches[0] : e;

            let nx = initialL + (evt.clientX - startX);
            let ny = initialT + (evt.clientY - startY);

            // Bounds: Apenas para não sair do ecrã visível
            const mx = window.innerWidth - item.offsetWidth;
            const my = window.innerHeight - item.offsetHeight;
            nx = Math.max(0, Math.min(nx, mx));
            ny = Math.max(0, Math.min(ny, my));

            item.style.left = nx + 'px';
            item.style.top = ny + 'px';
        };

        const onEnd = () => {
            isDragging = false;
            item.classList.remove('dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
        };

        item.addEventListener('mousedown', onStart);
        item.addEventListener('touchstart', onStart, { passive: false });
    }

    // 4. LOAD CONTENT
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
        setTimeout(initPositions, 500);
    }

    loadAll();
    window.addEventListener('resize', () => {
        clearTimeout(window.resT);
        window.resT = setTimeout(initPositions, 200);
    });
});