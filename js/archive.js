// Load archive posters only when user scrolls near the archive section
// This ensures other sections load first without being affected
document.addEventListener('DOMContentLoaded', () => {
    const archiveGrid = document.getElementById('archiveGrid');
    const archiveSection = document.querySelector('.archive-moment');
    
    if (!archiveGrid || !archiveSection) return;
    
    let archiveLoaded = false;
    
    // Intersection Observer to load archive when user approaches it
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Load archive when it's about to come into view (50% visible)
            if (entry.isIntersecting && !archiveLoaded) {
                archiveLoaded = true;
                loadArchive();
                observer.disconnect(); // Stop observing after loading
            }
        });
    }, {
        rootMargin: '200px' // Start loading 200px before it's visible
    });
    
    observer.observe(archiveSection);
    
    // Function to load archive posters
    function loadArchive() {
        // Wait a bit to ensure other content is fully loaded
        setTimeout(() => {
            // For now, use same poster repeated
            const posterUrl = 'https://wsrv.nl/?url=https://raw.githubusercontent.com/andreianmatos/segundas_na_z/main/images/programming/monthly_poster.png';
            
            // Create 24 posters in normal grid (same poster repeated)
            for (let i = 0; i < 24; i++) {
                const img = document.createElement('img');
                img.loading = 'lazy'; // Native lazy loading
                img.src = posterUrl;
                img.alt = `Archive poster ${i + 1}`;
                archiveGrid.appendChild(img);
            }
        }, 100);
    }
});
