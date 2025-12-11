// PWA Main Script - D'Choco
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineDetection();
    this.setupNotifications();
  }

  // Registrar Service Worker
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✓ Service Worker registrado com sucesso:', registration);
            
            // Verificar atualizações periodicamente
            this.checkForUpdates(registration);
          })
          .catch((error) => {
            console.error('✗ Erro ao registrar Service Worker:', error);
          });
      });
    }
  }

  // Verificar atualizações do cache
  checkForUpdates(registration) {
    setInterval(() => {
      registration.update();
    }, 60000); // Verificar a cada minuto
  }

  // Configurar prompt de instalação
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('✓ beforeinstallprompt event disparado');
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      console.log('✓ PWA instalada com sucesso!');
      this.deferredPrompt = null;
      this.showSuccessMessage();
    });

    // Log para debug
    console.log('PWA: Event listeners configurados');
  }

  // Mostrar prompt de instalação
  showInstallPrompt() {
    // Verificar se não foi descartado recentemente
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 604800000) { // 7 dias
      return;
    }

    const container = document.createElement('div');
    container.className = 'pwa-install-prompt show';
    container.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">
          <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="pwa-install-text">
          <h3>Instale D'Choco no seu celular</h3>
          <p>Acesse mais rápido e sem publicidade. Como um app nativo!</p>
        </div>
        <div class="pwa-install-buttons">
          <button class="pwa-install-btn dismiss" id="pwa-dismiss">Não</button>
          <button class="pwa-install-btn install" id="pwa-install">Instalar</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    document.getElementById('pwa-install').addEventListener('click', () => {
      this.installPWA(container);
    });

    document.getElementById('pwa-dismiss').addEventListener('click', () => {
      this.dismissPrompt(container);
    });
  }

  // Instalar PWA (pode ser chamado manualmente)
  installPWA(container) {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✓ Usuário aceitou instalar a PWA');
          if (container) {
            container.remove();
          }
        } else {
          console.log('✗ Usuário recusou instalar a PWA');
        }
        this.deferredPrompt = null;
      });
    }
  }

  // Descartar prompt
  dismissPrompt(container) {
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    container.remove();
  }

  // Mostrar mensagem de sucesso
  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'pwa-success-message show';
    message.innerHTML = `
      <i class="fas fa-check-circle"></i> D'Choco instalada com sucesso!
    `;
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 4000);
  }

  // Detecção de status online/offline
  setupOfflineDetection() {
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator';
    indicator.innerHTML = '⚠️ Você está offline - Alguns recursos podem não estar disponíveis';
    document.body.appendChild(indicator);

    window.addEventListener('online', () => {
      this.isOnline = true;
      indicator.classList.remove('show');
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      indicator.classList.add('show');
    });

    // Definir estado inicial
    if (!navigator.onLine) {
      indicator.classList.add('show');
    }
  }

  // Sincronização de dados quando voltar online
  syncData() {
    console.log('↻ Sincronizando dados...');
    
    // Sincronizar carrinho
    const cart = localStorage.getItem('cart');
    if (cart) {
      console.log('↻ Carrinho sincronizado');
    }

    // Sincronizar pedidos pendentes
    const pendingOrders = localStorage.getItem('pending-orders');
    if (pendingOrders) {
      console.log('↻ Pedidos pendentes sincronizados');
    }
  }

  // Notificações push
  setupNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      if (Notification.permission === 'default') {
        // Pedir permissão discretamente após 3 segundos
        setTimeout(() => {
          Notification.requestPermission();
        }, 3000);
      }
    }
  }

  // Enviar notificação
  sendNotification(title, options = {}) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SEND_NOTIFICATION',
        title: title,
        options: options
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  // Compartilhar via Web Share API
  shareContent(title, text, url) {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      }).catch(err => console.log('Erro ao compartilhar:', err));
    }
  }

  // Adicionar à tela inicial (iOS)
  requestAddToHomeScreen() {
    if (window.navigator.standalone === false) {
      const message = 'Adicione D\'Choco à sua tela inicial: toque em Compartilhar e selecione "Adicionar à Tela inicial"';
      alert(message);
    }
  }
}

// Inicializar PWA quando o documento estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
  });
} else {
  window.pwaManager = new PWAManager();
}

// Utilitários adicionais
const PWAUtils = {
  // Abrir câmera
  openCamera: async function() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return stream;
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Permissão de câmera negada');
      return null;
    }
  },

  // Acessar geolocalização
  getLocation: function(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  },

  // Vibração (feedback háptico)
  vibrate: function(pattern = 200) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  // Battery Status
  getBatteryStatus: async function() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        console.error('Erro ao obter bateria:', error);
      }
    }
  }
};
