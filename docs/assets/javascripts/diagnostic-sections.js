// Diagnostic des sections manquantes
console.log('🔍 DIAGNOSTIC - Sections manquantes sous Build/Sign/Verify');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('=== ANALYSE DES SECTIONS ===');
        
        // 1. Vérifier la structure de navigation
        const nav = document.querySelector('.md-nav');
        const navItems = document.querySelectorAll('.md-nav__item');
        console.log('1. Navigation:', {
            navPrincipal: !!nav,
            nombreItems: navItems.length,
            items: Array.from(navItems).map(item => {
                const link = item.querySelector('.md-nav__link');
                return link ? link.textContent.trim() : 'Sans lien';
            })
        });
        
        // 2. Chercher spécifiquement Build/Sign/Verify
        const buildSection = Array.from(navItems).find(item => {
            const link = item.querySelector('.md-nav__link');
            return link && link.textContent.toLowerCase().includes('build');
        });
        
        const signSection = Array.from(navItems).find(item => {
            const link = item.querySelector('.md-nav__link');
            return link && link.textContent.toLowerCase().includes('sign');
        });
        
        const verifySection = Array.from(navItems).find(item => {
            const link = item.querySelector('.md-nav__link');
            return link && link.textContent.toLowerCase().includes('verify');
        });
        
        console.log('2. Sections spécifiques:', {
            build: !!buildSection,
            sign: !!signSection,
            verify: !!verifySection
        });
        
        // 3. Vérifier le contenu principal
        const content = document.querySelector('.md-content');
        const main = document.querySelector('.md-main');
        const articles = document.querySelectorAll('article');
        
        console.log('3. Contenu principal:', {
            content: !!content,
            main: !!main,
            articles: articles.length,
            hauteurContent: content ? content.offsetHeight : 'N/A',
            hauteurMain: main ? main.offsetHeight : 'N/A'
        });
        
        // 4. Chercher des éléments cachés ou problématiques
        const elementsInvisibles = [];
        const tousElements = document.querySelectorAll('*');
        
        tousElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            if (style.display === 'none' || 
                style.visibility === 'hidden' || 
                style.opacity === '0' ||
                rect.height === 0) {
                
                if (el.textContent && el.textContent.toLowerCase().includes('build') ||
                    el.textContent && el.textContent.toLowerCase().includes('sign') ||
                    el.textContent && el.textContent.toLowerCase().includes('verify')) {
                    
                    elementsInvisibles.push({
                        element: el.tagName,
                        classes: el.className,
                        id: el.id,
                        display: style.display,
                        visibility: style.visibility,
                        opacity: style.opacity,
                        hauteur: rect.height,
                        contenu: el.textContent.substring(0, 100)
                    });
                }
            }
        });
        
        console.log('4. Éléments cachés suspects:', elementsInvisibles);
        
        // 5. Vérifier les couleurs d'arrière-plan blanc
        const elementsBlancs = [];
        tousElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const bgColor = style.backgroundColor;
            const rect = el.getBoundingClientRect();
            
            if ((bgColor.includes('rgb(255, 255, 255)') || bgColor.includes('white')) && 
                rect.width > 100 && rect.height > 50) {
                elementsBlancs.push({
                    element: el.tagName,
                    classes: el.className,
                    backgroundColor: bgColor,
                    position: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    }
                });
            }
        });
        
        console.log('5. Blocs blancs suspects:', elementsBlancs.slice(0, 10)); // Limiter à 10 pour éviter le spam
        
        // 6. Vérifier l'URL et le contenu de la page
        console.log('6. Page actuelle:', {
            url: window.location.href,
            titre: document.title,
            hauteurPage: document.documentElement.scrollHeight,
            hauteurFenetre: window.innerHeight
        });
        
        // 7. Commandes de réparation
        window.showAllHidden = function() {
            const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
            hiddenElements.forEach(el => {
                el.style.display = '';
                el.style.visibility = '';
            });
            console.log(`🔧 ${hiddenElements.length} éléments cachés rendus visibles`);
        };
        
        window.highlightWhiteBlocks = function() {
            elementsBlancs.forEach(info => {
                const elements = document.querySelectorAll(info.element);
                elements.forEach(el => {
                    if (el.className === info.classes) {
                        el.style.border = '2px solid red';
                        el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                    }
                });
            });
            console.log('🎯 Blocs blancs surlignés en rouge');
        };
        
        console.log('=== FIN DIAGNOSTIC ===');
        console.log('🛠️ Commandes disponibles:');
        console.log('  showAllHidden() - Afficher tous les éléments cachés');
        console.log('  highlightWhiteBlocks() - Surligner les blocs blancs');
        
    }, 1000);
});