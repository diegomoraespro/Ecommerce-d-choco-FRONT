// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA PRINCIPAL DO SLIDER (CARROSSEL) ---
    let slideIndex = 1;
    
    // Torna a função global para os botões onclick funcionarem
    window.mudarSlide = function(n) {
        mostrarSlides(slideIndex += n);
    };
    
    function mostrarSlides(n) {
        let i;
        let slides = document.getElementsByClassName("slide");
        
        if (slides.length === 0) return;

        // Se chegar no fim, volta para o primeiro (carrossel infinito)
        if (n > slides.length) {slideIndex = 1}    
        
        // Se voltar do primeiro, vai para o último (carrossel infinito)
        if (n < 1) {slideIndex = slides.length}
        
        // Esconde todos os slides E PAUSA VÍDEOS
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
            slides[i].classList.remove("active");
            
            // Pausa o vídeo e o reinicia (currentTime = 0), se houver, no slide escondido
            let video = slides[i].querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0; 
            }
        }
        
        // Mostra o slide atual
        let currentSlide = slides[slideIndex-1];
        currentSlide.style.display = "block";  
        currentSlide.classList.add("active");
        
        // ⭐ NOVO: Inicia o vídeo, se houver, no slide ativo
        let video = currentSlide.querySelector('video');
        if (video) {
            // Usa .play() e trata a exceção
            video.play().catch(error => {
                console.warn("A reprodução automática pode ter sido bloqueada pelo navegador.", error);
            }); 
        }

        // Chama o controlador de vídeo para aplicar as regras de tela
        controlarVideo();
    }
    
    // Inicializa mostrando o primeiro slide
    mostrarSlides(slideIndex);


    // --- LÓGICA DE CONTROLE DE VÍDEO POR TELA (MODIFICADA) ---
    function controlarVideo() {
        // Procura o vídeo DENTRO do slide ATIVO
        var video = document.querySelector('.slide.active video'); 
        
        // Nota: Removido o selector genérico '.video-area video' e substituído
        // por '.slide.active video' para garantir que afete apenas o vídeo do carrossel ativo.
        
        if (video) {
            if (window.innerWidth <= 736) {
                // Se a tela for pequena, pausa e muta
                video.pause();
                video.muted = true;
            } else {
                // Se a tela for grande, apenas desmuta e DEIXA o mostrarSlides()
                // ou a interação do usuário controlar o play().
                video.muted = false;
                // REMOVIDO: video.play(); 
            }
        }
    }
    
    // Executa ao carregar para aplicar as regras de tela iniciais
    controlarVideo(); 
    
    // Executa ao redimensionar
    window.addEventListener('resize', controlarVideo);

    
    // --- LÓGICA DO BOTÃO LEIA MAIS ---
    const botao = document.getElementById('btn-leia-mais');
    const conteudo = document.getElementById('conteudo-extra');

    // Verifica se os elementos do botão "Mostrar Mais" existem antes de adicionar o listener
    if (botao && conteudo) {
        botao.addEventListener('click', function(e) {
            e.preventDefault();

            if (conteudo.classList.contains('escondido')) {
                conteudo.classList.remove('escondido');
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize')); 
                }, 100);
                
                botao.innerHTML = 'Ocultar';
                botao.classList.remove('fa-file');
                botao.classList.add('fa-chevron-up');
            } else {
                conteudo.classList.add('escondido');
                
                botao.innerHTML = 'Mostrar mais';
                botao.classList.remove('fa-chevron-up');
                botao.classList.add('fa-file');
            }
        });
    }
});