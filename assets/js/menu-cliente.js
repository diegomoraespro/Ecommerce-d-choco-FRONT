
  // Seleciona os elementos
  const menuToggle = document.getElementById('menuToggle');
  const menuPopup = document.getElementById('menuPopup');

  // Ao clicar no botão "Menu"
  menuToggle.addEventListener('click', function(event) {
    // Evita que o clique feche o menu imediatamente
    event.stopPropagation();
    // Alterna a classe 'active' (mostra ou esconde)
    menuPopup.classList.toggle('active');
  });

  // Fecha o menu se clicar em qualquer outro lugar da tela
  document.addEventListener('click', function(event) {
    const isClickInside = menuToggle.contains(event.target) || menuPopup.contains(event.target);
    
    if (!isClickInside) {
      menuPopup.classList.remove('active');
    }
  });

  // Função exemplo de Logout
  function fazerLogout() {
    alert("Saindo do sistema...");
    // Aqui você colocaria a lógica real, ex: window.location.href = 'login.html';
  }
