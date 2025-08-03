// Animation footer avec détection de scroll
console.log('=== FOOTER ANIMATION START ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Initialisation de l\'animation footer');
    
    // Variables de scroll
    let lastScrollTop = 0;
    let isFooterVisible = false;
    let scrollTimeout;
    const scrollThreshold = 100; // Minimum de pixels à scroller pour déclencher
    
    // Attendre que le footer soit chargé
    setTimeout(() => {
        const footer = document.querySelector('.md-footer');
        console.log('Footer element:', footer);
        
        if (footer) {
            // État initial : s'assurer que le footer est caché
            isFooterVisible = false;
            
            console.log('Footer initialisé');
            console.log('Footer height:', footer.offsetHeight);
            
            // Forcer l'état initial si nécessaire
            const computedTransform = window.getComputedStyle(footer).transform;
            if (!computedTransform.includes('200')) {
                footer.style.setProperty('transform', 'translateY(200px)', 'important');
                console.log('Footer forcé en position cachée (200px)');
            }
            
            // Fonction pour afficher le footer
            function showFooter() {
                if (!isFooterVisible) {
                    footer.style.transform = 'translateY(0)';
                    document.body.classList.add('footer-visible');
                    isFooterVisible = true;
                    console.log('Footer affiché');
                }
            }
            
            // Fonction pour cacher le footer
            function hideFooter() {
                if (isFooterVisible) {
                    footer.style.transform = 'translateY(200px)';
                    document.body.classList.remove('footer-visible');
                    isFooterVisible = false;
                    console.log('Footer caché');
                }
            }
            
            // Gestionnaire d'événement scroll principal
            function handleScroll() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
                
                // Seuil minimum de scroll pour éviter les micro-mouvements
                if (scrollDifference < 5) return;
                
                // Détection de la direction du scroll
                if (currentScrollTop > lastScrollTop) {
                    // Scroll vers le bas - cacher le footer
                    if (currentScrollTop > scrollThreshold) {
                        hideFooter();
                    }
                } else {
                    // Scroll vers le haut - afficher le footer
                    showFooter();
                }
                
                lastScrollTop = currentScrollTop;
                
                // Auto-masquer après 3 secondes d'inactivité
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (isFooterVisible && currentScrollTop > scrollThreshold) {
                        hideFooter();
                    }
                }, 3000);
            }
            
            // Optimisation du scroll avec requestAnimationFrame
            let ticking = false;
            function requestScrollUpdate() {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }
            
            // Écouter les événements de scroll
            window.addEventListener('scroll', requestScrollUpdate, { passive: true });
            
            // Afficher le footer au survol en bas de page
            footer.addEventListener('mouseenter', showFooter);
            
            // Gestion spéciale : afficher quand on arrive en bas de page
            function checkBottomPage() {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Si on est proche du bas de la page (100px de marge)
                if (currentScrollTop + windowHeight >= documentHeight - 100) {
                    showFooter();
                }
            }
            
            // Ajouter la vérification de bas de page au scroll
            const originalHandleScroll = handleScroll;
            handleScroll = function() {
                originalHandleScroll();
                checkBottomPage();
            };
            
            // Test manuel dans la console
            window.testFooter = function() {
                if (isFooterVisible) {
                    hideFooter();
                } else {
                    showFooter();
                }
            };
            
            window.resetFooter = function() {
                footer.style.transform = 'translateY(200px)';
                document.body.classList.remove('footer-visible');
                isFooterVisible = false;
                lastScrollTop = 0;
                console.log('Footer reset');
            };
            
            console.log('=== COMMANDES DISPONIBLES ===');
            console.log('testFooter() - Basculer la visibilité du footer');
            console.log('resetFooter() - Remettre le footer en état initial');
            console.log('=== ANIMATION FOOTER PRÊTE ===');
            
        } else {
            console.error('ERREUR: Footer (.md-footer) non trouvé !');
        }
    }, 500);
});

// Gestion des erreurs
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('debug-footer.js')) {
        console.error('Erreur dans debug-footer.js:', e.message);
    }
});