// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 1;
    
    // Torna a função global para os botões onclick funcionarem
    window.mudarSlide = function(n) {
        mostrarSlides(slideIndex += n);
    };
    
    function mostrarSlides(n) {
        let i;
        let slides = document.getElementsByClassName("slide");
        
        if (slides.length === 0) return; // Segurança

        // Se chegar no fim, volta para o primeiro (carrossel infinito)
        if (n > slides.length) {slideIndex = 1}    
        
        // Se voltar do primeiro, vai para o último (carrossel infinito)
        if (n < 1) {slideIndex = slides.length}
        
        // Esconde todos os slides
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
            slides[i].classList.remove("active");
        }
        
        // Mostra o slide atual
        slides[slideIndex-1].style.display = "block";  
        slides[slideIndex-1].classList.add("active");
    }
    
    // Inicializa mostrando o primeiro slide
    mostrarSlides(slideIndex);
});


const botao = document.getElementById('btn-leia-mais');
const conteudo = document.getElementById('conteudo-extra');

botao.addEventListener('click', function(e) {
    e.preventDefault(); // Evita pular a tela

    if (conteudo.classList.contains('escondido')) {
        // MOSTRAR
        conteudo.classList.remove('escondido');
        // Pequeno delay para garantir que o layout renderize se tiver slider dentro
        setTimeout(() => {
             window.dispatchEvent(new Event('resize')); 
        }, 100);
        
        botao.innerHTML = 'Ocultar';
        botao.classList.remove('fa-file');
        botao.classList.add('fa-chevron-up');
    } else {
        // ESCONDER
        conteudo.classList.add('escondido');
        
        botao.innerHTML = 'Mostrar mais';
        botao.classList.remove('fa-chevron-up');
        botao.classList.add('fa-file');
    }
});