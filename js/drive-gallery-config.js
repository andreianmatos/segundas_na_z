/**
 * Google Drive Gallery Configuration Loader
 * Loads configuration from external JSON file
 */

// Load configuration from JSON file
async function loadGalleryConfig() {
    try {
        const response = await fetch('./gallery-config.json');
        const config = await response.json();
        return config;
    } catch (error) {
        console.error('Error loading gallery config:', error);
        // Fallback configuration
        return {
            images: [],
            imageIds: [], // Legacy support
            settings: {
                imagesPerRow: 'auto',
                imageSpacing: '1rem',
                hoverEffects: true,
                lazyLoading: true,
                showSubtitles: true
            }
        };
    }
}

// Initialize and export configuration
(async function() {
    const config = await loadGalleryConfig();
    
    // Convert to the format expected by the gallery
    window.DriveGalleryConfig = {
        images: config.images || [],
        imageIds: config.imageIds || [], // Legacy support
        settings: config.settings
    };
    
    // Trigger gallery initialization if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.initImageGallery) {
                window.initImageGallery();
            }
        });
    } else {
        // DOM is already loaded
        setTimeout(() => {
            if (window.initImageGallery) {
                window.initImageGallery();
            }
        }, 100);
    }
})();