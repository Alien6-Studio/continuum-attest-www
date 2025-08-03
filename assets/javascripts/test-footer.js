// Test de l'animation footer - Version avancée
console.log('=== FOOTER ANIMATION TEST ===');

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        runFooterTests();
    }, 1000);
});

function runFooterTests() {
    const footer = document.querySelector('.md-footer');
    
    if (!footer) {
        console.error('❌ Footer non trouvé !');
        return;
    }
    
    console.log('✅ Footer trouvé');
    console.log('📏 Hauteur footer:', footer.offsetHeight + 'px');
    
    // Test 1: Footer caché par défaut
    const initialTransform = window.getComputedStyle(footer).transform;
    console.log('🔄 Transform initial:', initialTransform);
    
    // Test 2: Simulation d'un scroll down
    console.log('🧪 Test scroll down...');
    setTimeout(() => {
        window.scrollTo(0, 200);
        setTimeout(() => {
            const transformAfterScrollDown = window.getComputedStyle(footer).transform;
            console.log('⬇️ Transform après scroll down:', transformAfterScrollDown);
        }, 500);
    }, 1000);
    
    // Test 3: Simulation d'un scroll up
    setTimeout(() => {
        console.log('🧪 Test scroll up...');
        window.scrollTo(0, 100);
        setTimeout(() => {
            const transformAfterScrollUp = window.getComputedStyle(footer).transform;
            console.log('⬆️ Transform après scroll up:', transformAfterScrollUp);
        }, 500);
    }, 3000);
    
    // Test 4: Reset
    setTimeout(() => {
        console.log('🔄 Reset position...');
        window.scrollTo(0, 0);
    }, 5000);
    
    console.log('✅ Tests lancés - Vérifiez les résultats ci-dessus');
}

// Fonction de monitoring continu
function monitorFooter() {
    const footer = document.querySelector('.md-footer');
    if (!footer) return;
    
    let lastTransform = '';
    
    setInterval(() => {
        const currentTransform = window.getComputedStyle(footer).transform;
        if (currentTransform !== lastTransform) {
            console.log('🔄 Footer transform changed:', currentTransform);
            lastTransform = currentTransform;
        }
    }, 100);
}

// Démarrer le monitoring après 2 secondes
setTimeout(monitorFooter, 2000);

// Commandes utiles pour le debug
window.debugFooter = {
    show: () => {
        const footer = document.querySelector('.md-footer');
        if (footer) {
            footer.style.transform = 'translateY(0)';
            document.body.classList.add('footer-visible');
            console.log('🔼 Footer forcé visible');
        }
    },
    hide: () => {
        const footer = document.querySelector('.md-footer');
        if (footer) {
            footer.style.transform = 'translateY(100%)';
            document.body.classList.remove('footer-visible');
            console.log('🔽 Footer forcé caché');
        }
    },
    reset: () => {
        const footer = document.querySelector('.md-footer');
        if (footer) {
            footer.style.transform = 'translateY(100%)';
            document.body.classList.remove('footer-visible');
            window.scrollTo(0, 0);
            console.log('🔄 Footer et scroll reset');
        }
    },
    getState: () => {
        const footer = document.querySelector('.md-footer');
        if (footer) {
            const transform = window.getComputedStyle(footer).transform;
            const scrollY = window.pageYOffset;
            const hasClass = document.body.classList.contains('footer-visible');
            console.log('📊 État footer:', {
                transform,
                scrollY,
                isVisible: !transform.includes('100%'),
                bodyClass: hasClass
            });
        }
    }
};

console.log('🛠️ Debug commands disponibles:');
console.log('   debugFooter.show() - Afficher le footer');
console.log('   debugFooter.hide() - Cacher le footer');
console.log('   debugFooter.reset() - Reset tout');
console.log('   debugFooter.getState() - État actuel');