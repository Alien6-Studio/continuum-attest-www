// Animations pour la homepage
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur la homepage
    const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || document.querySelector('.hero-section-permanent-dark');
    
    if (!isHomepage) {
        console.log('Not on homepage, skipping homepage animations');
        return;
    }
    
    console.log('Homepage detected, initializing animations');
    
    const footer = document.querySelector('.md-footer');
    const footerDirection = document.querySelector('.md-footer__direction');
    const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
    
    console.log('Footer element:', footer);
    console.log('Footer direction element:', footerDirection);
    
    if (footer) {
        // S'assurer que le footer commence bien caché
        footer.style.transform = 'translateY(100%)';
        console.log('Footer height:', footer.offsetHeight);
    }
    
    let lastScrollY = 0;
    let footerVisible = false;
    let isNearBottom = false;
    
    // Intersection Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments à animer
    scrollAnimateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Fonction pour gérer les animations au scroll
    function handleScrollAnimations() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollDirection = scrollPosition > lastScrollY ? 'down' : 'up';
        
        // FOOTER PRINCIPAL : apparait au scroll down, disparait au scroll up
        if (scrollDirection === 'down' && scrollPosition > 100 && !footerVisible) {
            footerVisible = true;
            console.log('Showing footer');
            if (footer) {
                footer.classList.add('show');
                footer.classList.remove('hide');
                footer.style.transform = 'translateY(0)';
            }
        } else if (scrollDirection === 'up' && scrollPosition < 200 && footerVisible) {
            footerVisible = false;
            console.log('Hiding footer');
            if (footer) {
                footer.classList.add('hide');
                footer.classList.remove('show');
                footer.style.transform = 'translateY(100%)';
            }
        }
        
        // NAVIGATION "NEXT" : uniquement en bas de page
        const distanceFromBottom = documentHeight - scrollPosition - windowHeight;
        if (distanceFromBottom < 800 && !isNearBottom) {
            isNearBottom = true;
            console.log('Showing Next navigation');
            if (footerDirection) {
                footerDirection.classList.add('show');
            }
        } else if (distanceFromBottom > 800 && isNearBottom) {
            isNearBottom = false;
            console.log('Hiding Next navigation');
            if (footerDirection) {
                footerDirection.classList.remove('show');
            }
        }
        
        lastScrollY = scrollPosition;
    }
    
    // Throttle pour optimiser les performances
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScrollAnimations);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    // Écouteur de scroll
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Animation d'entrée pour le hero avec délai
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title-container');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(30px)';
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 200);
        }
    }, 100);
});