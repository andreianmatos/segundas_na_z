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
    const response = await fetch('main-image-config.json');
    return await response.json();
}

function createImageDisplay(imageData) {
    const container = document.getElementById('main-image-container');
    const imageId = imageData.imageId;
    const title = imageData.title || "Segundas na Z";
    const description = imageData.description || "";
    
    // Create image element
    const img = document.createElement('img');
    img.className = 'main-image';
    img.alt = title;
    img.src = `https://drive.google.com/uc?export=view&id=${imageId}`;
    
    // Create text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'main-image-info';
    textOverlay.innerHTML = `
        <h1>${title}</h1>
        ${description ? `<p class="main-description">${description}</p>` : ''}
    `;
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'main-image-display';
    wrapper.appendChild(img);
    wrapper.appendChild(textOverlay);
    
    // Handle image loading errors
    img.onerror = function() {
        showErrorMessage("Imagem não encontrada - ID: " + imageId);
    };
    
    // Show image when loaded
    img.onload = function() {
        wrapper.style.opacity = '1';
    };
    
    // Add to page
    container.innerHTML = '';
    container.appendChild(wrapper);
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