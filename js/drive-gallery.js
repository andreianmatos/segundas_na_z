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
        // Calculate gallery height with generous spacing
        const rows = Math.ceil(items.length / 2);
        const estimatedHeight = Math.max(2000, rows * 480 + 600);
        gallery.style.minHeight = estimatedHeight + 'px';
        
        items.forEach((itemData, index) => {
            if (itemData.id && itemData.id.trim() !== '') {
                console.log('Creating card for:', itemData);
                const mediaCard = createMediaCard(itemData, index);
                gallery.appendChild(mediaCard);
                
                // Add staggered animation delay
                setTimeout(() => {
                    mediaCard.style.opacity = '1';
                    mediaCard.style.transform = 'translateY(0)';
                }, index * 150);
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
    
    // Create info section for image details
    const imageInfo = document.createElement('div');
    imageInfo.className = 'image-info';
    
    if (imageData.eventName || imageData.date) {
        imageInfo.innerHTML = `
            ${imageData.eventName ? `<h4>${imageData.eventName}</h4>` : ''}
            ${imageData.date ? `<p>${imageData.date}</p>` : ''}
        `;
    }
    
    // Show image when loaded - no need to classify aspect ratios
    img.onload = function() {
        // Images will naturally size themselves based on their actual dimensions
        // No classification needed since we're using natural ratios
    };
    
    // Handle load error - show placeholder
    img.onerror = function() {
        card.innerHTML = `
            <div class="image-placeholder">
                <p>📷</p>
                <p><strong>${imageData.eventName || 'Photo'}</strong></p>
                <small>${imageData.date || ''}</small>
                <p style="margin-top: 1rem; font-size: 0.8rem; color: #666;">
                    Image could not be loaded
                </p>
            </div>
        `;
        // Error cards also get animated
    };
    
    card.appendChild(img);
    if (imageData.eventName || imageData.date) {
        card.appendChild(imageInfo);
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
    card.className = 'clean-image-item video-item';
    
    // Create video container with responsive aspect ratio
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    
    // Determine aspect ratio from video data if available, default to 16:9
    const aspectRatio = videoData.aspectRatio || '16:9';
    if (aspectRatio === '1:1' || aspectRatio === 'square') {
        videoContainer.classList.add('square');
    } else if (aspectRatio === '9:16' || aspectRatio === 'vertical') {
        videoContainer.classList.add('vertical');
    }
    // Default is 16:9 landscape
    
    // Create embedded video directly
    const iframe = document.createElement('iframe');
    iframe.src = `https://drive.google.com/file/d/${videoData.id}/preview`;
    iframe.allow = "autoplay";
    iframe.loading = "lazy";
    
    // Create info section for video details
    const videoInfo = document.createElement('div');
    videoInfo.className = 'image-info';
    
    if (videoData.eventName || videoData.date) {
        videoInfo.innerHTML = `
            ${videoData.eventName ? `<h4>${videoData.eventName}</h4>` : ''}
            ${videoData.date ? `<p>${videoData.date}</p>` : ''}
        `;
    }
    
    videoContainer.appendChild(iframe);
    card.appendChild(videoContainer);
    
    if (videoData.eventName || videoData.date) {
        card.appendChild(videoInfo);
    }
    
    // Add click handler for fullscreen option on the info area
    if (videoInfo) {
        videoInfo.style.cursor = 'pointer';
        videoInfo.addEventListener('click', (e) => {
            e.preventDefault();
            openVideoModal(videoData);
        });
    }
    
    // Show card with animation (handled by loadGallery function)
    // Don't set opacity here anymore since we use staggered animation
    
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