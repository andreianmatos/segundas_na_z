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
    if (!gallery) {
        console.log('No gallery element found');
        return;
    }
    
    const config = window.DriveGalleryConfig;
    console.log('Gallery config:', config);
    gallery.innerHTML = '';
    
    // Support both old 'images' and new 'items' structure
    const items = config?.items || config?.images || [];
    console.log('Gallery items:', items);
    
    if (items.length > 0) {
        items.forEach((itemData, index) => {
            if (itemData.id && itemData.id.trim() !== '') {
                console.log('Creating card for:', itemData);
                const mediaCard = createMediaCard(itemData, index);
                gallery.appendChild(mediaCard);
            }
        });
    } else {
        console.log('No items found, showing setup instructions');
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
    
    // Use thumbnail URL format directly (more reliable)
    img.src = `https://drive.google.com/thumbnail?id=${imageData.id}&sz=w400`;
    
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
    
    // Handle load error - show placeholder
    img.onerror = function() {
        // Show placeholder if image fails to load
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
    
    card.appendChild(img);
    if (imageData.eventName || imageData.date) {
        card.appendChild(overlay);
    }
    
    return card;
}

function createMediaCard(itemData, index) {
    // Check if this is a video or image (default to image)
    const isVideo = itemData.type === 'video';
    
    if (isVideo) {
        return createVideoCard(itemData, index);
    } else {
        // Use existing image card function but update the data structure
        return createImageCard(itemData, index);
    }
}

function createVideoCard(videoData, index) {
    const card = document.createElement('div');
    card.className = 'clean-image-item';
    
    // Create video thumbnail/preview
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.style.cssText = `
        position: relative;
        width: 100%;
        height: 280px;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
    `;
    
    // Create play button overlay
    const playButton = document.createElement('div');
    playButton.innerHTML = '▶';
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.9);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        z-index: 2;
    `;
    
    // Try to use thumbnail if available, otherwise show placeholder
    const thumbnail = document.createElement('img');
    thumbnail.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.7;
    `;
    thumbnail.src = `https://drive.google.com/thumbnail?id=${videoData.id}&sz=w400`;
    thumbnail.onerror = () => {
        thumbnail.style.display = 'none';
        videoContainer.style.background = '#333';
    };
    
    videoContainer.appendChild(thumbnail);
    videoContainer.appendChild(playButton);
    
    // Create overlay for hover
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    
    if (videoData.eventName || videoData.date) {
        overlay.innerHTML = `
            <div class="overlay-content">
                🎥 ${videoData.eventName ? `<h4>${videoData.eventName}</h4>` : ''}
                ${videoData.date ? `<p>${videoData.date}</p>` : ''}
            </div>
        `;
    }
    
    card.appendChild(videoContainer);
    card.appendChild(overlay);
    
    // Click to play video
    card.addEventListener('click', () => openVideoModal(videoData));
    
    card.style.opacity = '1';
    return card;
}

function openVideoModal(videoData) {
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
    
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        width: 800px;
        height: 450px;
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
    `;
    
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 8px;
    `;
    iframe.src = `https://drive.google.com/file/d/${videoData.id}/preview`;
    
    videoContainer.appendChild(iframe);
    videoContainer.appendChild(closeBtn);
    modal.appendChild(videoContainer);
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