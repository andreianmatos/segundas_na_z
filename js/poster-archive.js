/**
 * Poster Archive System
 * Loads and displays monthly poster collections with main + weekly posters
 */

document.addEventListener('DOMContentLoaded', function() {
    initPosterArchive();
});

let posterArchiveConfig = null;

async function initPosterArchive() {
    try {
        // Load configuration
        const response = await fetch('./config/poster-archive-config.json');
        posterArchiveConfig = await response.json();
        
        // Display poster archive
        renderPosterArchive();
        
    } catch (error) {
        console.error('Error loading poster archive:', error);
        showFallbackMessage();
    }
}

function renderPosterArchive() {
    const container = document.getElementById('poster-container');
    if (!container || !posterArchiveConfig) return;
    
    // Clear loading message
    container.innerHTML = '';
    container.className = 'poster-archive-container';
    
    const months = posterArchiveConfig.months;
    if (!months || months.length === 0) {
        showFallbackMessage();
        return;
    }
    
    // Get current month (first in array)
    const currentMonth = months[0];
    
    // Create current month section
    const currentSection = createCurrentMonthSection(currentMonth);
    container.appendChild(currentSection);
    
    // Create past months section if there are more months
    if (months.length > 1) {
        const pastSection = createPastMonthsSection(months.slice(1));
        container.appendChild(pastSection);
    }
    
    // Fade in the container
    setTimeout(() => {
        container.style.opacity = '1';
    }, 100);
}

function createCurrentMonthSection(monthData) {
    const section = document.createElement('div');
    section.className = 'current-month-section';
    
    // For mobile: create simple slide carousel
    if (window.innerWidth <= 768) {
        const carousel = document.createElement('div');
        carousel.className = 'mobile-carousel';
        
        // Get all posters
        const allPosters = [];
        if (monthData.mainPoster?.imageId) {
            allPosters.push({ id: monthData.mainPoster.imageId, title: 'Main' });
        }
        if (monthData.weeklyPosters) {
            monthData.weeklyPosters.forEach((weekly, i) => {
                if (weekly?.imageId) {
                    allPosters.push({ id: weekly.imageId, title: `Week ${i+1}` });
                }
            });
        }
        
        let currentSlide = 0;
        
        // Create slides
        allPosters.forEach((poster, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            const img = document.createElement('img');
            img.src = `https://drive.google.com/thumbnail?id=${poster.id}&sz=w800`;
            img.alt = poster.title;
            slide.appendChild(img);
            carousel.appendChild(slide);
        });
        // Add indicator dots
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        allPosters.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            indicators.appendChild(dot);
        });
        // Always show all slides, hide only non-active
        function updateSlide() {
            carousel.querySelectorAll('.carousel-slide').forEach((slide, i) => {
                slide.style.display = (i === currentSlide) ? 'flex' : 'none';
                slide.classList.toggle('active', i === currentSlide);
            });
            indicators.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        let startX = 0;
        carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        carousel.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left
                    if (currentSlide < allPosters.length - 1) {
                        currentSlide++;
                    } else {
                        currentSlide = 0; // wrap to first
                    }
                    updateSlide();
                } else if (diff < 0) {
                    // Swipe right
                    if (currentSlide > 0) {
                        currentSlide--;
                    } else {
                        currentSlide = allPosters.length - 1; // wrap to last
                    }
                    updateSlide();
                }
            }
        });
        updateSlide();
        section.appendChild(carousel);
        section.appendChild(indicators);
        return section;

        section.appendChild(carousel);
        return section;
    }
    
    // For desktop: original layout
    const mainPoster = createMainPoster(monthData.mainPoster);
    const weeklyPosters = document.createElement('div');
    weeklyPosters.className = 'weekly-posters';
    
    monthData.weeklyPosters.forEach((weekly, index) => {
        const weeklyPoster = createWeeklyPoster(weekly, index + 1);
        weeklyPosters.appendChild(weeklyPoster);
    });
    
    section.appendChild(mainPoster);
    section.appendChild(weeklyPosters);
    
    return section;
}

function createWeeklyPoster(posterData, weekNumber) {
    const container = document.createElement('div');
    container.className = 'weekly-poster';
    
    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${posterData.imageId}&sz=w300`;
    img.alt = `Semana ${weekNumber}`;
    img.loading = 'lazy';
    
    // Handle image load error
    img.onerror = () => {
        container.innerHTML = `
            <div style="
                width: 150px;
                height: 200px;
                border: 2px dashed #999;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                margin: 0 auto;
                color: #999;
            ">
                <div style="text-align: center;">
                    <p style="font-size: 1.5rem; margin: 0;">📅</p>
                </div>
            </div>
        `;
    };
    
    // Add click handler
    img.addEventListener('click', () => openPosterModal(posterData));
    
    container.appendChild(img);
    
    return container;
}

function createMainPoster(posterData) {
    const container = document.createElement('div');
    container.className = 'main-poster';
    
    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${posterData.imageId}&sz=w800`;
    img.alt = posterData.title;
    img.loading = 'lazy';
    
    // Handle image load error
    img.onerror = () => {
        container.innerHTML = `
            <div style="
                width: 300px;
                height: 400px;
                border: 2px dashed #ccc;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f9f9f9;
                margin: 0 auto;
                cursor: pointer;
            ">
                <div style="text-align: center; color: #999;">
                    <p style="font-size: 3rem; margin: 0;">📅</p>
                    <p style="font-size: 1rem; margin: 0.5rem 0 0;">Cartaz Principal</p>
                </div>
            </div>
        `;
    };
    
    // Add click handler for enlargement
    img.addEventListener('click', () => openPosterModal(posterData));
    container.style.cursor = 'pointer';
    
    container.appendChild(img);
    
    return container;
}

function createWeeklyPoster(posterData, weekNumber) {
    const container = document.createElement('div');
    container.className = `weekly-poster week-${weekNumber}`;
    
    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${posterData.imageId}&sz=w300`;
    img.alt = posterData.title;
    img.loading = 'lazy';
    
    // Handle image load error
    img.onerror = () => {
        container.innerHTML = `
            <div style="
                width: 150px;
                height: 200px;
                border: 2px dashed black;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                margin: 0 auto;
                cursor: pointer;
            ">
                <div style="text-align: center; font-size: 0.9rem;">
                    <p style="font-size: 1.5rem; margin: 0;">📅</p>
                </div>
            </div>
        `;
    };
    
    // Add click handler for enlargement
    img.addEventListener('click', () => openPosterModal(posterData));
    container.style.cursor = 'pointer';
    
    container.appendChild(img);
    
    return container;
}

function createPastMonthsSection(pastMonths) {
    const section = document.createElement('div');
    section.className = 'past-months-section';
    
    // Create each past month with same layout as current month
    pastMonths.forEach(monthData => {
        const monthItem = createPastMonthItem(monthData);
        section.appendChild(monthItem);
    });
    
    return section;
}

function createPastMonthItem(monthData) {
    const item = document.createElement('div');
    item.className = 'past-month-item';
    
    // For mobile: create same simple slide carousel (no arrows)
    if (window.innerWidth <= 768) {
        const carousel = document.createElement('div');
        carousel.className = 'mobile-carousel';

        // Get all posters
        const allPosters = [];
        if (monthData.mainPoster?.imageId) {
            allPosters.push({ id: monthData.mainPoster.imageId, title: 'Main' });
        }
        if (monthData.weeklyPosters) {
            monthData.weeklyPosters.forEach((weekly, i) => {
                if (weekly?.imageId) {
                    allPosters.push({ id: weekly.imageId, title: `Week ${i+1}` });
                }
            });
        }

        let currentSlide = 0;

        // Create slides
        allPosters.forEach((poster, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            const img = document.createElement('img');
            img.src = `https://drive.google.com/thumbnail?id=${poster.id}&sz=w800`;
            img.alt = poster.title;
            slide.appendChild(img);
            carousel.appendChild(slide);
        });
        // Add indicator dots
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        allPosters.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            indicators.appendChild(dot);
        });
        // Always show all slides, hide only non-active
        function updateSlide() {
            carousel.querySelectorAll('.carousel-slide').forEach((slide, i) => {
                slide.style.display = (i === currentSlide) ? 'flex' : 'none';
                slide.classList.toggle('active', i === currentSlide);
            });
            indicators.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        let startX = 0;
        carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        carousel.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left
                    if (currentSlide < allPosters.length - 1) {
                        currentSlide++;
                    } else {
                        currentSlide = 0; // wrap to first
                    }
                    updateSlide();
                } else if (diff < 0) {
                    // Swipe right
                    if (currentSlide > 0) {
                        currentSlide--;
                    } else {
                        currentSlide = allPosters.length - 1; // wrap to last
                    }
                    updateSlide();
                }
            }
        });
        updateSlide();
        item.appendChild(carousel);
        item.appendChild(indicators);
        return item;

        item.appendChild(carousel);
        return item;
    }
    
    // For desktop: original layout
    const mainPoster = createMainPoster(monthData.mainPoster);
    const weeklyPosters = document.createElement('div');
    weeklyPosters.className = 'weekly-posters';
    
    monthData.weeklyPosters.forEach((weekly, index) => {
        const weeklyPoster = createWeeklyPoster(weekly, index + 1);
        weeklyPosters.appendChild(weeklyPoster);
    });
    
    item.appendChild(mainPoster);
    item.appendChild(weeklyPosters);
    
    return item;
}


function openPosterModal(posterData) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        text-align: center;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 1001;
    `;
    
    const img = document.createElement('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border: 2px solid white;
        border-radius: 8px;
    `;
    img.src = `https://drive.google.com/thumbnail?id=${posterData.imageId}&sz=w800`;
    img.alt = posterData.title;
    
    container.appendChild(img);
    container.appendChild(closeBtn);
    modal.appendChild(container);
    document.body.appendChild(modal);
    
    setTimeout(() => modal.style.opacity = '1', 10);
    
    closeBtn.onclick = () => closeModal(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
    };
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
}

function showFallbackMessage() {
    const container = document.getElementById('poster-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="poster-fallback">
            <h1>Programação em breve</h1>
            <p>O arquivo de cartazes será disponibilizado em breve.</p>
        </div>
    `;
    container.style.opacity = '1';
}

// Make functions available globally for debugging
window.posterArchive = {
    init: initPosterArchive,
    render: renderPosterArchive,
    config: () => posterArchiveConfig
};
