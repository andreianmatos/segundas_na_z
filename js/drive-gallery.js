// Archive Gallery Loader
// Load and display Google Drive images

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    // Wait for config to load
    if (window.DriveGalleryConfig) {
        loadGallery();
    } else {
        setTimeout(initGallery, 100);
    }
}

function loadGallery() {
    const gallery = document.querySelector('.clean-image-grid');
    if (!gallery) return;
    
    const config = window.DriveGalleryConfig;
    gallery.innerHTML = '';
    
    if (config && config.images && config.images.length > 0) {
        config.images.forEach((imageData, index) => {
            if (imageData.id && imageData.id.trim() !== '') {
                const imageCard = createImageCard(imageData, index);
                gallery.appendChild(imageCard);
            }
        });
    } else {
        showSetupInstructions();
    }
}

function createImageCard(imageData, index) {
    const card = document.createElement('div');
    card.className = 'clean-image-item';
    
    const img = document.createElement('img');
    img.className = 'clean-image';
    img.alt = imageData.eventName || `Photo ${index + 1}`;
    img.loading = 'lazy';
    
    // Use the standard Google Drive image URL
    img.src = `https://drive.google.com/uc?export=view&id=${imageData.id}`;
    
    // Create overlay for hover
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    
    if (imageData.eventName || imageData.date) {
        overlay.innerHTML = `
            <div class="overlay-content">
                ${imageData.eventName ? `<h4>${imageData.eventName}</h4>` : ''}
                ${imageData.date ? `<p>${imageData.date}</p>` : ''}
            </div>
        `;
    }
    
    // Show image when loaded
    img.onload = function() {
        card.style.opacity = '1';
    };
    
    // Handle load error with fallback
    img.onerror = function() {
        // Try alternative URL format
        const fallbackUrl = `https://drive.google.com/thumbnail?id=${imageData.id}&sz=w400`;
        const fallbackImg = new Image();
        
        fallbackImg.onload = function() {
            img.src = fallbackUrl;
        };
        
        fallbackImg.onerror = function() {
            // Show placeholder
            card.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 280px;
                    background: white;
                    border: 2px solid black;
                    text-align: center;
                ">
                    <p style="font-size: 2rem;">📷</p>
                    <p>${imageData.eventName || 'Photo'}</p>
                    <small>${imageData.date || ''}</small>
                </div>
            `;
            card.style.opacity = '1';
        };
        
        fallbackImg.src = fallbackUrl;
    };
    
    card.appendChild(img);
    if (imageData.eventName || imageData.date) {
        card.appendChild(overlay);
    }
    
    return card;
}

function showSetupInstructions() {
    const gallery = document.querySelector('.clean-image-grid');
    
    const instructions = document.createElement('div');
    instructions.className = 'setup-card-simple';
    instructions.innerHTML = `
        <h3>Configure as imagens</h3>
        <p>1. Faça upload das fotos para o Google Drive</p>
        <p>2. Para cada foto: clique direito → "Obter link"</p>
        <p>3. Copie o ID da imagem (entre /d/ e /view)</p>
        <p>4. Cole no arquivo <code>gallery-config.json</code></p>
        
        <div style="background: white; padding: 1rem; margin: 1rem 0; border: 2px solid black;">
            <strong>Exemplo:</strong><br>
            <code>{"id": "1ABC123DEF456", "eventName": "Evento"}</code>
        </div>
        
        <a href="https://drive.google.com" target="_blank" style="color: black; text-decoration: underline;">
            Abrir Google Drive
        </a>
    `;
    
    gallery.appendChild(instructions);
}

// Make available for config loader
window.initImageGallery = loadGallery;