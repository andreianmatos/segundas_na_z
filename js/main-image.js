// Homepage Main Image Loader
// Simple script to show the main image from Google Drive

document.addEventListener('DOMContentLoaded', function() {
    showMainImage();
});

async function showMainImage() {
    try {
        // Get image config from JSON file
        const config = await getImageConfig();
        
        if (config.mainImage && config.mainImage.imageId) {
            createImageDisplay(config.mainImage);
        } else {
            showErrorMessage("Configuração da imagem não encontrada");
        }
    } catch (error) {
        console.log('Erro ao carregar configuração:', error);
        showErrorMessage("Erro ao carregar imagem");
    }
}

async function getImageConfig() {
    const response = await fetch('config/main-image-config.json');
    return await response.json();
}

function createImageDisplay(imageData) {
    const container = document.getElementById('main-image-container');
    
    // Since background is now global, just clear the container and show it
    container.innerHTML = '';
    container.style.opacity = '1';
    
    console.log('Index page content ready - background is global');
}

function showErrorMessage(message) {
    const container = document.getElementById('main-image-container');
    
    container.innerHTML = `
        <div class="main-image-fallback">
            <h1>Segundas na Z</h1>
            <p>${message}</p>
            <small>Configure a imagem em main-image-config.json</small>
        </div>
    `;
    
    container.style.opacity = '1';
}