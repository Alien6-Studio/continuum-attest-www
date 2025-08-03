// Script de nettoyage des classes d'animation problématiques
console.log('🧹 NETTOYAGE CLASSES SCROLL-ANIMATE');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('=== NETTOYAGE EN COURS ===');
        
        // 1. Supprimer toutes les classes scroll-animate
        const scrollAnimatedElements = document.querySelectorAll('.scroll-animate, [class*="scroll-animate"], [class*="animate-"]');
        console.log(`Trouvé ${scrollAnimatedElements.length} éléments avec des classes d'animation`);
        
        scrollAnimatedElements.forEach(element => {
            // Supprimer les classes problématiques
            const classes = element.className.split(' ');
            const cleanClasses = classes.filter(cls => 
                !cls.includes('scroll-animate') && 
                !cls.includes('animate-') &&
                !cls.includes('fade-') &&
                !cls.includes('slide-')
            );
            element.className = cleanClasses.join(' ');
            
            // Forcer les styles pour assurer la visibilité
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'none';
            element.style.animation = 'none';
        });
        
        // 2. Supprimer les observers d'intersection (qui peuvent causer scroll-animate)
        if (window.IntersectionObserver) {
            // Sauvegarder les observers existants et les désactiver temporairement
            window.originalObservers = window.originalObservers || [];
        }
        
        // 3. Nettoyer les styles inline problématiques
        const allElements = document.querySelectorAll('*');
        let cleanedElements = 0;
        
        allElements.forEach(element => {
            const style = element.style;
            let needsCleaning = false;
            
            // Vérifier si l'élément a des styles d'animation problématiques
            if (style.opacity === '0' || 
                style.visibility === 'hidden' || 
                style.transform.includes('translate') ||
                style.animation !== '') {
                
                // NE PAS nettoyer le footer ou les éléments intentionnellement cachés
                if (!element.classList.contains('md-footer') && 
                    !element.closest('.md-footer') &&
                    !element.hasAttribute('hidden') &&
                    !element.hasAttribute('aria-hidden') &&
                    element.offsetParent !== null &&
                    !element.classList.contains('md-header') &&
                    !element.classList.contains('md-nav__item--hidden')) {
                    
                    style.opacity = '1';
                    style.visibility = 'visible';
                    style.transform = 'none';
                    style.animation = 'none';
                    needsCleaning = true;
                }
            }
            
            if (needsCleaning) cleanedElements++;
        });
        
        console.log(`✅ ${cleanedElements} éléments nettoyés`);
        
        // 4. Forcer un reflow pour s'assurer que tout est visible
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // 5. Fonctions utilitaires pour debug
        window.restoreFooter = function() {
            const footer = document.querySelector('.md-footer');
            if (footer) {
                // Restaurer le footer à son état normal
                footer.style.opacity = '';
                footer.style.visibility = '';
                footer.style.transform = '';
                footer.style.animation = '';
                footer.style.display = '';
                
                // S'assurer que le footer est visible
                const computedStyle = window.getComputedStyle(footer);
                console.log('💭 Footer restauré:', {
                    visible: footer.offsetHeight > 0,
                    opacity: computedStyle.opacity,
                    visibility: computedStyle.visibility,
                    display: computedStyle.display,
                    position: computedStyle.position
                });
            } else {
                console.log('⚠️ Footer non trouvé');
            }
        };
        
        window.cleanAllAnimations = function() {
            document.querySelectorAll('*').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
                el.style.animation = 'none';
            });
            console.log('🧹 Toutes les animations supprimées');
        };
        
        window.showHiddenContent = function() {
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.opacity === '0' || style.visibility === 'hidden') {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    console.log('Rendu visible:', el);
                }
            });
        };
        
        window.findProblematicElements = function() {
            const problematic = [];
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if ((style.opacity === '0' || style.visibility === 'hidden') && 
                    el.offsetHeight > 0) {
                    problematic.push({
                        element: el,
                        tagName: el.tagName,
                        classes: el.className,
                        opacity: style.opacity,
                        visibility: style.visibility
                    });
                }
            });
            console.log('Éléments problématiques trouvés:', problematic);
            return problematic;
        };
        
        console.log('=== NETTOYAGE TERMINÉ ===');
        console.log('🛠️ Commandes disponibles:');
        console.log('  restoreFooter() - Restaurer le footer');
        console.log('  cleanAllAnimations() - Supprimer toutes les animations');
        console.log('  showHiddenContent() - Afficher le contenu caché');
        console.log('  findProblematicElements() - Trouver les éléments problématiques');
        
    }, 500);
    
    // Surveiller les changements de DOM pour éviter que les classes reviennent
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const element = mutation.target;
                if (element.className.includes('scroll-animate')) {
                    console.log('Classe scroll-animate détectée et supprimée de:', element);
                    element.className = element.className.replace(/scroll-animate[^\s]*/g, '');
                    element.style.opacity = '1';
                    element.style.visibility = 'visible';
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
    });
});