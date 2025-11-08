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
    
    // Month layout container
    const layout = document.createElement('div');
    layout.className = 'month-layout';
    
    // Left weekly posters (weeks 1 & 2)
    const leftColumn = document.createElement('div');
    leftColumn.className = 'weekly-posters-left';
    
    // Right weekly posters (weeks 3 & 4)
    const rightColumn = document.createElement('div');
    rightColumn.className = 'weekly-posters-right';
    
    // Add weekly posters to appropriate columns
    monthData.weeklyPosters.forEach((weekly, index) => {
        const weeklyPoster = createWeeklyPoster(weekly, index + 1);
        if (index < 2) {
            leftColumn.appendChild(weeklyPoster);
        } else {
            rightColumn.appendChild(weeklyPoster);
        }
    });
    
    // Main poster
    const mainPoster = createMainPoster(monthData.mainPoster);
    
    // Assemble layout: left column, main poster, right column
    layout.appendChild(leftColumn);
    layout.appendChild(mainPoster);
    layout.appendChild(rightColumn);
    
    section.appendChild(layout);
    
    return section;
}

function createMainPoster(posterData) {
    const container = document.createElement('div');
    container.className = 'main-poster';
    
    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${posterData.imageId}&sz=w600`;
    img.alt = posterData.title;
    img.loading = 'lazy';
    
    // Handle image load error
    img.onerror = () => {
        container.innerHTML = `
            <div style="
                width: 300px;
                height: calc(90vh - 120px);
                max-height: 700px;
                border: 2px dashed black;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                margin: 0 auto;
                cursor: pointer;
            ">
                <div style="text-align: center;">
                    <p style="font-size: 3rem; margin: 0;">📅</p>
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
    
    // Use same layout as current month
    const grid = document.createElement('div');
    grid.className = 'past-month-grid';
    
    // Left weekly posters (weeks 1 & 2)
    const leftColumn = document.createElement('div');
    leftColumn.className = 'past-poster-left';
    
    // Right weekly posters (weeks 3 & 4)
    const rightColumn = document.createElement('div');
    rightColumn.className = 'past-poster-right';
    
    // Add weekly posters to appropriate columns
    monthData.weeklyPosters.forEach((weekly, index) => {
        const weeklyPoster = createPastPoster(weekly, false);
        if (index < 2) {
            leftColumn.appendChild(weeklyPoster);
        } else {
            rightColumn.appendChild(weeklyPoster);
        }
    });
    
    // Add main poster
    const mainPoster = createPastPoster(monthData.mainPoster, true);
    
    // Assemble layout: left column, main poster, right column
    grid.appendChild(leftColumn);
    grid.appendChild(mainPoster);
    grid.appendChild(rightColumn);
    
    item.appendChild(grid);
    
    return item;
}

function createPastPoster(posterData, isMain = false) {
    const container = document.createElement('div');
    container.className = `past-poster ${isMain ? 'main' : ''}`;
    
    const img = document.createElement('img');
    img.src = `https://drive.google.com/thumbnail?id=${posterData.imageId}&sz=w300`;
    img.alt = posterData.title;
    img.loading = 'lazy';
    
    // Handle image load error
    img.onerror = () => {
        const size = isMain ? '300px' : '150px';
        const height = isMain ? 'calc(90vh - 120px)' : '200px';
        const maxHeight = isMain ? 'max-height: 700px;' : '';
        container.innerHTML = `
            <div style="
                width: ${size};
                height: ${height};
                ${maxHeight}
                border: 2px dashed black;
                border-radius: ${isMain ? '8px' : '6px'};
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                margin: 0 auto;
                cursor: pointer;
            ">
                <div style="text-align: center;">
                    <p style="font-size: ${isMain ? '3rem' : '1.5rem'}; margin: 0;">📅</p>
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