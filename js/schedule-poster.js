// Schedule Poster Loader
document.addEventListener('DOMContentLoaded', function() {
    showSchedulePoster();
});

async function showSchedulePoster() {
    console.log('Loading schedule poster...');
    try {
        const config = await getPosterConfig();
        console.log('Config loaded:', config);
        
        if (config.poster && config.poster.imageId) {
            createPosterDisplay(config.poster);
        } else {
            showErrorMessage("Configuração do poster não encontrada");
        }
    } catch (error) {
        console.log('Error:', error);
        showErrorMessage("Programação em breve");
    }
}

async function getPosterConfig() {
    const response = await fetch('config/schedule-config.json');
    return await response.json();
}

function createPosterDisplay(posterData) {
    const container = document.getElementById('poster-container');
    const imageId = posterData.imageId;
    
    const img = document.createElement('img');
    img.className = 'poster-image';
    img.alt = 'Programação';
    img.src = `https://drive.google.com/thumbnail?id=${imageId}&sz=w800`;
    
    img.onload = function() {
        console.log('Image loaded successfully');
        container.style.opacity = '1';
    };
    
    img.onerror = function() {
        showErrorMessage("Poster não encontrado");
    };
    
    container.innerHTML = '';
    container.appendChild(img);
}

function showErrorMessage(message) {
    const container = document.getElementById('poster-container');
    container.innerHTML = `<div class="poster-fallback"><h1>Programação</h1><p>${message}</p></div>`;
    container.style.opacity = '1';
}
