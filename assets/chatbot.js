// CANS Sigorta AI Chatbot
class CANSBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.currentStep = 'greeting';
    this.userData = {};
    this.init();
  }

  init() {
    this.createChatInterface();
    this.addEventListeners();
    this.startConversation();
  }

  createChatInterface() {
    const chatHTML = `
      <div id="cans-chatbot" class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-info">
            <h4>CANS Sigorta Asistanı</h4>
            <span class="status">Çevrimiçi</span>
          </div>
          <button class="chatbot-close" onclick="cansBot.toggle()">×</button>
        </div>
        <div class="chatbot-messages" id="chat-messages">
          <!-- Messages will be added here -->
        </div>
        <div class="chatbot-input">
          <input type="text" id="chat-input" placeholder="Mesajınızı yazın..." maxlength="200">
          <button id="chat-send" onclick="cansBot.sendMessage()">📤</button>
        </div>
        <div class="chatbot-quick-actions">
          <button onclick="cansBot.quickAction('bes')">💰 BES</button>
          <button onclick="cansBot.quickAction('trafik')">🚗 Trafik</button>
          <button onclick="cansBot.quickAction('kasko')">🛡️ Kasko</button>
          <button onclick="cansBot.quickAction('iletisim')">📞 İletişim</button>
        </div>
      </div>
      <div class="chatbot-toggle" onclick="cansBot.toggle()">
        <div class="chatbot-icon">💬</div>
        <div class="chatbot-notification" id="chat-notification">1</div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
  }

  addEventListeners() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => {
      this.sendMessage();
    });
  }

  toggle() {
    const chatbot = document.getElementById('cans-chatbot');
    const toggle = document.querySelector('.chatbot-toggle');
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chatbot.classList.add('open');
      toggle.style.display = 'none';
      document.getElementById('chat-input').focus();
    } else {
      chatbot.classList.remove('open');
      toggle.style.display = 'flex';
    }
  }

  startConversation() {
    setTimeout(() => {
      this.addBotMessage('Merhaba! 👋 CANS Sigorta\'ya hoş geldiniz. Size nasıl yardımcı olabilirim?');
      this.showQuickActions();
    }, 1000);
  }

  addBotMessage(text, options = []) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    let messageHTML = `
      <div class="message-content">
        <div class="message-avatar">🤖</div>
        <div class="message-text">${text}</div>
      </div>
    `;

    if (options.length > 0) {
      messageHTML += '<div class="message-options">';
      options.forEach(option => {
        messageHTML += `<button class="option-btn" onclick="cansBot.selectOption('${option.value}')">${option.text}</button>`;
      });
      messageHTML += '</div>';
    }

    messageDiv.innerHTML = messageHTML;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-text">${text}</div>
        <div class="message-avatar">👤</div>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    this.addUserMessage(message);
    input.value = '';
    
    // Simulate typing
    setTimeout(() => {
      this.processMessage(message);
    }, 1000);
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // BES related
    if (lowerMessage.includes('bes') || lowerMessage.includes('emeklilik')) {
      this.addBotMessage('Bireysel Emeklilik (BES) hakkında bilgi almak istiyorsunuz! 💰\n\nBES\'in avantajları:\n• %30 devlet katkısı\n• Güvenli tasarruf\n• Uzman yönetim\n• Esnek planlar\n\nDetaylı bilgi için: <a href="bes.html" target="_blank">BES Sayfası</a>');
      this.addBotMessage('Hangi konuda daha fazla bilgi istiyorsunuz?', [
        { text: 'Devlet Katkısı', value: 'devlet_katkisi' },
        { text: 'Fon Seçimi', value: 'fon_secimi' },
        { text: 'Başvuru Süreci', value: 'basvuru' }
      ]);
    }
    // Trafik related
    else if (lowerMessage.includes('trafik') || lowerMessage.includes('araç')) {
      this.addBotMessage('Trafik sigortası hakkında bilgi almak istiyorsunuz! 🚗\n\n16 farklı şirketten en uygun fiyatı buluyoruz.\n\nHızlı teklif almak ister misiniz?', [
        { text: 'Evet, Teklif Al', value: 'trafik_teklif' },
        { text: 'Bilgi Al', value: 'trafik_bilgi' }
      ]);
    }
    // Kasko related
    else if (lowerMessage.includes('kasko') || lowerMessage.includes('hasar')) {
      this.addBotMessage('Kasko sigortası hakkında bilgi almak istiyorsunuz! 🛡️\n\nAracınızı her türlü hasara karşı koruyoruz.\n\nHangi konuda yardım istiyorsunuz?', [
        { text: 'Fiyat Hesapla', value: 'kasko_fiyat' },
        { text: 'Kapsam Bilgisi', value: 'kasko_kapsam' }
      ]);
    }
    // Contact related
    else if (lowerMessage.includes('iletişim') || lowerMessage.includes('telefon') || lowerMessage.includes('adres')) {
      this.addBotMessage('İletişim bilgilerimiz:\n\n📞 Telefon: +90 532 351 0731\n📧 E-posta: can@canssigorta.com\n📍 Adres: İstanbul Küçükçekmece Halkalı\n\nWhatsApp\'tan hemen ulaşabilirsiniz!', [
        { text: 'WhatsApp', value: 'whatsapp' },
        { text: 'Ara', value: 'call' }
      ]);
    }
    // Price related
    else if (lowerMessage.includes('fiyat') || lowerMessage.includes('ücret') || lowerMessage.includes('maliyet')) {
      this.addBotMessage('Fiyat bilgisi almak istiyorsunuz! 💰\n\nSize en uygun teklifi hazırlayabilmem için birkaç bilgiye ihtiyacım var.\n\nHangi sigorta türü için fiyat almak istiyorsunuz?', [
        { text: 'BES', value: 'bes_fiyat' },
        { text: 'Trafik', value: 'trafik_fiyat' },
        { text: 'Kasko', value: 'kasko_fiyat' },
        { text: 'Diğer', value: 'diger_fiyat' }
      ]);
    }
    // General greeting
    else if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('iyi günler')) {
      this.addBotMessage('Merhaba! 😊 CANS Sigorta\'ya hoş geldiniz!\n\nSize nasıl yardımcı olabilirim?', [
        { text: 'Sigorta Türleri', value: 'sigorta_turleri' },
        { text: 'Fiyat Bilgisi', value: 'fiyat' },
        { text: 'İletişim', value: 'iletisim' }
      ]);
    }
    // Default response
    else {
      this.addBotMessage('Anladım! Size daha iyi yardımcı olabilmem için hangi konuda bilgi almak istiyorsunuz?', [
        { text: 'BES', value: 'bes' },
        { text: 'Trafik Sigortası', value: 'trafik' },
        { text: 'Kasko', value: 'kasko' },
        { text: 'İletişim', value: 'iletisim' }
      ]);
    }
  }

  selectOption(value) {
    this.addUserMessage(value);
    setTimeout(() => {
      this.processOption(value);
    }, 500);
  }

  processOption(value) {
    switch(value) {
      case 'bes':
        this.addBotMessage('BES hakkında detaylı bilgi için: <a href="bes.html" target="_blank">BES Sayfası</a>\n\nWhatsApp\'tan hemen teklif alabilirsiniz!');
        break;
      case 'trafik':
        this.addBotMessage('Trafik sigortası için: <a href="trafik.html" target="_blank">Trafik Sayfası</a>\n\n16 şirketten en uygun fiyatı buluyoruz!');
        break;
      case 'kasko':
        this.addBotMessage('Kasko sigortası için: <a href="kasko.html" target="_blank">Kasko Sayfası</a>\n\nAracınızı her türlü hasara karşı koruyoruz!');
        break;
      case 'iletisim':
        this.addBotMessage('İletişim bilgilerimiz:\n📞 +90 532 351 0731\n📧 can@canssigorta.com\n\nWhatsApp\'tan hemen ulaşabilirsiniz!');
        break;
      case 'whatsapp':
        window.open('https://wa.me/905323510731?text=Merhaba%2C%20chatbot%20aracılığıyla%20ulaştım.', '_blank');
        break;
      case 'call':
        window.location.href = 'tel:+905323510731';
        break;
      default:
        this.addBotMessage('Size nasıl yardımcı olabilirim?');
    }
  }

  quickAction(type) {
    const actions = {
      'bes': 'BES hakkında bilgi almak istiyorum',
      'trafik': 'Trafik sigortası fiyatı almak istiyorum',
      'kasko': 'Kasko sigortası hakkında bilgi almak istiyorum',
      'iletisim': 'İletişim bilgilerinizi öğrenmek istiyorum'
    };
    
    this.addUserMessage(actions[type]);
    setTimeout(() => {
      this.processMessage(actions[type]);
    }, 500);
  }

  showQuickActions() {
    // Quick actions are always visible in the interface
  }
}

// Initialize chatbot when page loads
let cansBot;
document.addEventListener('DOMContentLoaded', () => {
  cansBot = new CANSBot();
});
