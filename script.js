document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear > 2026 ? `2026 - ${currentYear}` : '2026';
    }

    // Mobile menu toggle
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

    // Lock Animation Logic
    const openSourceCard = document.getElementById('open-source-card');
    const lockClosed = document.querySelector('.lock-closed');
    const lockOpen = document.querySelector('.lock-open');

    if (openSourceCard && lockClosed && lockOpen) {
        openSourceCard.addEventListener('mouseenter', () => {
            // Animates to open state via JS
            lockClosed.style.opacity = '0';
            lockClosed.style.transform = 'scale(0.8) translateY(0)';
            lockClosed.style.filter = 'drop-shadow(0 0 0 rgba(25,113,255,0))';
            
            lockOpen.style.opacity = '1';
            lockOpen.style.transform = 'scale(1.15) translateY(-5px)';
            lockOpen.style.filter = 'drop-shadow(0 4px 12px rgba(25, 113, 255, 0.6))';
        });

        openSourceCard.addEventListener('mouseleave', () => {
            // Animates back to closed state via JS
            lockClosed.style.opacity = '1';
            lockClosed.style.transform = 'scale(1) translateY(0)';
            lockClosed.style.filter = 'drop-shadow(0 0 0 rgba(25,113,255,0))';
            
            lockOpen.style.opacity = '0';
            lockOpen.style.transform = 'scale(0.8) translateY(0)';
            lockOpen.style.filter = 'drop-shadow(0 0 0 rgba(25,113,255,0))';
        });
    }
