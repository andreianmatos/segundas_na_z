// Schedule Poster Loader
// Simple script to show the schedule poster from Google Drive

document.addEventListener('DOMContentLoaded', function() {
    showSchedulePoster();
});

async function showSchedulePoster() {
    try {
        // Get poster config from JSON file
        const config = await getPosterConfig();
        
        if (config.poster && config.poster.imageId) {
            createPosterDisplay(config.poster);
        } else {
            showErrorMessage("Configuração do poster não encontrada");
        }
    } catch (error) {
        console.log('Erro ao carregar configuração:', error);
        showErrorMessage("Programação em breve");
    }
}

async function getPosterConfig() {
    const response = await fetch('schedule-config.json');
    return await response.json();
}

function createPosterDisplay(posterData) {
    const container = document.getElementById('poster-container');
    const imageId = posterData.imageId;
    const title = posterData.title || "Programação";
    const date = posterData.date || "";
    
    // Create image element
    const img = document.createElement('img');
    img.className = 'poster-image';
    img.alt = title;
    img.src = `https://drive.google.com/uc?export=view&id=${imageId}`;
    
    // Create text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'poster-info';
    textOverlay.innerHTML = `
        <h1>${title}</h1>
        ${date ? `<p class="poster-date">${date}</p>` : ''}
    `;
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'poster-display';
    wrapper.appendChild(img);
    wrapper.appendChild(textOverlay);
    
    // Handle image loading errors
    img.onerror = function() {
        showErrorMessage("Poster não encontrado - ID: " + imageId);
    };
    
    // Show poster when loaded
    img.onload = function() {
        wrapper.style.opacity = '1';
    };
    
    // Add to page
    container.innerHTML = '';
    container.appendChild(wrapper);
}

function showErrorMessage(message) {
    const container = document.getElementById('poster-container');
    
    container.innerHTML = `
        <div class="poster-fallback">
            <h1>Programação</h1>
            <p>${message}</p>
            <small>Configure o poster em schedule-config.json</small>
        </div>
    `;
    
    container.style.opacity = '1';
}