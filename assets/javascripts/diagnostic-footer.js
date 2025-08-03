// Script de diagnostic rapide pour le footer
console.log('🔍 DIAGNOSTIC FOOTER');

setTimeout(() => {
    const footer = document.querySelector('.md-footer');
    const body = document.body;
    
    console.log('--- État initial ---');
    console.log('Footer trouvé:', !!footer);
    console.log('Body padding-bottom:', window.getComputedStyle(body).paddingBottom);
    console.log('Body classe footer-visible:', body.classList.contains('footer-visible'));
    console.log('Footer transform:', window.getComputedStyle(footer).transform);
    
    console.log('--- Test d\'affichage ---');
    debugFooter.show();
    
    setTimeout(() => {
        console.log('Après show:');
        console.log('Body padding-bottom:', window.getComputedStyle(body).paddingBottom);
        console.log('Body classe footer-visible:', body.classList.contains('footer-visible'));
        console.log('Footer transform:', window.getComputedStyle(footer).transform);
        
        setTimeout(() => {
            console.log('--- Test de masquage ---');
            debugFooter.hide();
            
            setTimeout(() => {
                console.log('Après hide:');
                console.log('Body padding-bottom:', window.getComputedStyle(body).paddingBottom);
                console.log('Body classe footer-visible:', body.classList.contains('footer-visible'));
                console.log('Footer transform:', window.getComputedStyle(footer).transform);
                console.log('✅ Diagnostic terminé');
            }, 500);
        }, 1000);
    }, 500);
}, 1000);