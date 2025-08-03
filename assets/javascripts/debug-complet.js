// Script de debug ultra-complet pour identifier les problèmes
console.log('🚨 DEBUG COMPLET - PROBLÈME FOOTER');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('=== ANALYSE COMPLÈTE ===');
        
        // 1. Vérifier le footer
        const footer = document.querySelector('.md-footer');
        console.log('1. Footer:', {
            existe: !!footer,
            hauteur: footer ? footer.offsetHeight : 'N/A',
            largeur: footer ? footer.offsetWidth : 'N/A',
            position: footer ? footer.getBoundingClientRect() : 'N/A',
            styles: footer ? {
                position: window.getComputedStyle(footer).position,
                bottom: window.getComputedStyle(footer).bottom,
                transform: window.getComputedStyle(footer).transform,
                zIndex: window.getComputedStyle(footer).zIndex,
                display: window.getComputedStyle(footer).display,
                visibility: window.getComputedStyle(footer).visibility
            } : 'N/A'
        });
        
        // 2. Vérifier le body
        const body = document.body;
        console.log('2. Body:', {
            hauteur: body.offsetHeight,
            hauteurScroll: body.scrollHeight,
            paddingBottom: window.getComputedStyle(body).paddingBottom,
            overflow: window.getComputedStyle(body).overflow,
            backgroundColor: window.getComputedStyle(body).backgroundColor
        });
        
        // 3. Vérifier le container principal
        const main = document.querySelector('.md-main');
        const container = document.querySelector('.md-container');
        console.log('3. Containers:', {
            main: main ? {
                hauteur: main.offsetHeight,
                paddingBottom: window.getComputedStyle(main).paddingBottom,
                backgroundColor: window.getComputedStyle(main).backgroundColor
            } : 'N/A',
            container: container ? {
                hauteur: container.offsetHeight,
                marginBottom: window.getComputedStyle(container).marginBottom,
                backgroundColor: window.getComputedStyle(container).backgroundColor
            } : 'N/A'
        });
        
        // 4. Vérifier les dimensions de la fenêtre
        console.log('4. Fenêtre:', {
            largeur: window.innerWidth,
            hauteur: window.innerHeight,
            scrollY: window.scrollY,
            documentHauteur: document.documentElement.scrollHeight
        });
        
        // 5. Chercher des éléments qui pourraient causer le "bloc gris"
        const elements = document.querySelectorAll('*');
        const elementsGris = [];
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const bgColor = style.backgroundColor;
            if (bgColor.includes('rgb(128, 128, 128)') || bgColor.includes('rgb(169, 169, 169)') || bgColor.includes('gray') || bgColor.includes('grey')) {
                elementsGris.push({
                    element: el.tagName,
                    classes: el.className,
                    backgroundColor: bgColor,
                    hauteur: el.offsetHeight,
                    largeur: el.offsetWidth
                });
            }
        });
        console.log('5. Éléments gris trouvés:', elementsGris);
        
        // 6. Forcer le footer à être complètement caché
        if (footer) {
            console.log('6. Forçage du footer...');
            footer.style.setProperty('transform', 'translateY(200px)', 'important');
            footer.style.setProperty('transition', 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
            
            setTimeout(() => {
                console.log('Footer après forçage:', {
                    transform: window.getComputedStyle(footer).transform,
                    position: footer.getBoundingClientRect()
                });
            }, 100);
        }
        
        // 7. Commandes de réparation
        window.fixFooter = function() {
            if (footer) {
                footer.style.setProperty('transform', 'translateY(200px)', 'important');
                body.classList.remove('footer-visible');
                body.style.setProperty('padding-bottom', '0', 'important');
                if (main) main.style.setProperty('padding-bottom', '0', 'important');
                console.log('🔧 Footer forcé en position cachée (200px)');
            }
        };
        
        window.showPageInfo = function() {
            console.log('📄 Info page:', {
                url: window.location.href,
                titre: document.title,
                hauteurPage: document.documentElement.scrollHeight,
                hauteurFenetre: window.innerHeight,
                scrollActuel: window.scrollY
            });
        };
        
        console.log('=== FIN ANALYSE ===');
        console.log('🛠️ Commandes disponibles:');
        console.log('  fixFooter() - Forcer la réparation');
        console.log('  showPageInfo() - Info sur la page');
        
    }, 1000);
});