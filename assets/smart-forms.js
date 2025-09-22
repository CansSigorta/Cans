// CANS Sigorta Smart Forms - AI-Powered Form Intelligence
class CANSSmartForms {
  constructor() {
    this.formData = {};
    this.userProfile = {};
    this.recommendations = [];
    this.init();
  }

  init() {
    this.setupSmartFormValidation();
    this.setupAutoComplete();
    this.setupFormAnalytics();
    this.setupPersonalizedRecommendations();
  }

  // Smart Form Validation
  setupSmartFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      this.enhanceForm(form);
    });
  }

  enhanceForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('input', (e) => {
        this.validateField(e.target);
        this.updateFormProgress(form);
      });
      
      // Smart suggestions
      input.addEventListener('focus', (e) => {
        this.showSmartSuggestions(e.target);
      });
      
      // Auto-save
      input.addEventListener('blur', (e) => {
        this.autoSaveField(e.target);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type || field.tagName.toLowerCase();
    const fieldName = field.name || field.id;
    
    let isValid = true;
    let message = '';
    
    // Required field validation
    if (field.required && !value) {
      isValid = false;
      message = 'Bu alan zorunludur';
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Geçerli bir e-posta adresi girin';
      }
    }
    
    // Phone validation
    if (fieldType === 'tel' && value) {
      const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        message = 'Geçerli bir telefon numarası girin (05XX XXX XX XX)';
      }
    }
    
    // TC Kimlik validation
    if (fieldName.includes('tc') && value) {
      if (!this.validateTCKimlik(value)) {
        isValid = false;
        message = 'Geçerli bir TC Kimlik No girin';
      }
    }
    
    // Age validation for insurance
    if (fieldName.includes('age') && value) {
      const age = parseInt(value);
      if (age < 18 || age > 80) {
        isValid = false;
        message = 'Yaş 18-80 arasında olmalıdır';
      }
    }
    
    this.showFieldValidation(field, isValid, message);
    return isValid;
  }

  validateTCKimlik(tc) {
    if (tc.length !== 11) return false;
    
    const digits = tc.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    
    const check1 = (sum1 * 7 - sum2) % 10;
    const check2 = (sum1 + sum2 + digits[9]) % 10;
    
    return check1 === digits[9] && check2 === digits[10];
  }

  showFieldValidation(field, isValid, message) {
    // Remove existing validation
    const existingValidation = field.parentNode.querySelector('.field-validation');
    if (existingValidation) {
      existingValidation.remove();
    }
    
    // Add validation message
    if (!isValid && message) {
      const validationDiv = document.createElement('div');
      validationDiv.className = 'field-validation error';
      validationDiv.textContent = message;
      field.parentNode.appendChild(validationDiv);
    }
    
    // Update field styling
    field.classList.remove('valid', 'invalid');
    field.classList.add(isValid ? 'valid' : 'invalid');
  }

  // Auto-complete functionality
  setupAutoComplete() {
    const autoCompleteFields = document.querySelectorAll('[data-autocomplete]');
    
    autoCompleteFields.forEach(field => {
      this.setupFieldAutoComplete(field);
    });
  }

  setupFieldAutoComplete(field) {
    const dataType = field.dataset.autocomplete;
    let suggestions = [];
    
    switch(dataType) {
      case 'city':
        suggestions = this.getCitySuggestions();
        break;
      case 'district':
        suggestions = this.getDistrictSuggestions();
        break;
      case 'car-brand':
        suggestions = this.getCarBrandSuggestions();
        break;
      case 'car-model':
        suggestions = this.getCarModelSuggestions();
        break;
    }
    
    field.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const matches = suggestions.filter(item => 
        item.toLowerCase().includes(query)
      );
      
      this.showAutoCompleteSuggestions(field, matches);
    });
  }

  getCitySuggestions() {
    return [
      'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
      'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay',
      'Manisa', 'Kayseri', 'Samsun', 'Balıkesir', 'Kahramanmaraş', 'Van',
      'Aydın', 'Tekirdağ', 'Sakarya', 'Denizli', 'Muğla', 'Eskişehir'
    ];
  }

  getDistrictSuggestions() {
    return [
      'Küçükçekmece', 'Halkalı', 'Bakırköy', 'Beşiktaş', 'Şişli', 'Kadıköy',
      'Üsküdar', 'Fatih', 'Beyoğlu', 'Zeytinburnu', 'Bayrampaşa', 'Esenler',
      'Güngören', 'Bahçelievler', 'Bağcılar', 'Kartal', 'Maltepe', 'Pendik'
    ];
  }

  getCarBrandSuggestions() {
    return [
      'Toyota', 'Volkswagen', 'Ford', 'Renault', 'Hyundai', 'Fiat', 'Opel',
      'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Honda', 'Peugeot', 'Citroën',
      'Skoda', 'Seat', 'Kia', 'Mazda', 'Suzuki', 'Dacia'
    ];
  }

  getCarModelSuggestions() {
    return [
      'Corolla', 'Golf', 'Focus', 'Clio', 'i20', 'Punto', 'Astra',
      '3 Series', 'C-Class', 'A3', 'Micra', 'Civic', '308', 'C3',
      'Octavia', 'Leon', 'Ceed', '3', 'Swift', 'Duster'
    ];
  }

  showAutoCompleteSuggestions(field, suggestions) {
    // Remove existing suggestions
    const existingSuggestions = field.parentNode.querySelector('.autocomplete-suggestions');
    if (existingSuggestions) {
      existingSuggestions.remove();
    }
    
    if (suggestions.length === 0) return;
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'autocomplete-suggestions';
    
    suggestions.slice(0, 5).forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      suggestionItem.textContent = suggestion;
      suggestionItem.addEventListener('click', () => {
        field.value = suggestion;
        suggestionsDiv.remove();
      });
      suggestionsDiv.appendChild(suggestionItem);
    });
    
    field.parentNode.appendChild(suggestionsDiv);
  }

  // Form Analytics
  setupFormAnalytics() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      this.trackFormInteractions(form);
    });
  }

  trackFormInteractions(form) {
    const formId = form.id || 'unknown-form';
    let startTime = Date.now();
    let fieldInteractions = [];
    
    form.addEventListener('submit', (e) => {
      const completionTime = Date.now() - startTime;
      
      // Track form completion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'Form',
          event_label: formId,
          value: completionTime
        });
      }
      
      // Track field interactions
      fieldInteractions.forEach(interaction => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_field_interaction', {
            event_category: 'Form',
            event_label: `${formId}_${interaction.field}`,
            value: interaction.timeSpent
          });
        }
      });
    });
    
    // Track field focus/blur
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      let focusTime = 0;
      
      field.addEventListener('focus', () => {
        focusTime = Date.now();
      });
      
      field.addEventListener('blur', () => {
        if (focusTime > 0) {
          const timeSpent = Date.now() - focusTime;
          fieldInteractions.push({
            field: field.name || field.id,
            timeSpent: timeSpent
          });
        }
      });
    });
  }

  // Personalized Recommendations
  setupPersonalizedRecommendations() {
    this.analyzeUserBehavior();
    this.generateRecommendations();
  }

  analyzeUserBehavior() {
    // Analyze page visits, time spent, form interactions
    const behaviorData = {
      pagesVisited: this.getPagesVisited(),
      timeSpent: this.getTimeSpent(),
      formInteractions: this.getFormInteractions(),
      deviceType: this.getDeviceType(),
      location: this.getLocation()
    };
    
    this.userProfile = this.buildUserProfile(behaviorData);
  }

  getPagesVisited() {
    return JSON.parse(localStorage.getItem('cans-pages-visited') || '[]');
  }

  getTimeSpent() {
    return JSON.parse(localStorage.getItem('cans-time-spent') || '{}');
  }

  getFormInteractions() {
    return JSON.parse(localStorage.getItem('cans-form-interactions') || '[]');
  }

  getDeviceType() {
    return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  }

  getLocation() {
    // This would typically use a geolocation API
    return 'Istanbul'; // Default for now
  }

  buildUserProfile(behaviorData) {
    const profile = {
      interests: [],
      riskProfile: 'moderate',
      preferredContact: 'whatsapp',
      budget: 'medium',
      urgency: 'low'
    };
    
    // Analyze interests based on pages visited
    if (behaviorData.pagesVisited.includes('bes.html')) {
      profile.interests.push('retirement');
    }
    if (behaviorData.pagesVisited.includes('trafik.html')) {
      profile.interests.push('auto');
    }
    if (behaviorData.pagesVisited.includes('kasko.html')) {
      profile.interests.push('comprehensive');
    }
    
    // Analyze urgency based on time spent
    const totalTime = Object.values(behaviorData.timeSpent).reduce((a, b) => a + b, 0);
    if (totalTime > 300000) { // 5 minutes
      profile.urgency = 'high';
    }
    
    return profile;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // BES recommendation
    if (this.userProfile.interests.includes('retirement')) {
      recommendations.push({
        type: 'bes',
        title: 'Bireysel Emeklilik (BES)',
        description: 'Yaşınıza ve gelir durumunuza uygun BES planı',
        priority: 'high',
        estimatedSavings: '₺50,000+'
      });
    }
    
    // Auto insurance recommendation
    if (this.userProfile.interests.includes('auto')) {
      recommendations.push({
        type: 'auto',
        title: 'Kapsamlı Araç Sigortası',
        description: 'Trafik + Kasko kombine paketi',
        priority: 'medium',
        estimatedSavings: '₺2,000+'
      });
    }
    
    // Health insurance recommendation
    if (this.userProfile.age > 40) {
      recommendations.push({
        type: 'health',
        title: 'Sağlık Sigortası',
        description: 'Yaşınıza uygun sağlık sigortası',
        priority: 'high',
        estimatedSavings: '₺15,000+'
      });
    }
    
    this.recommendations = recommendations;
    this.displayRecommendations();
  }

  displayRecommendations() {
    const recommendationContainer = document.getElementById('smart-recommendations');
    if (!recommendationContainer) return;
    
    recommendationContainer.innerHTML = '';
    
    this.recommendations.forEach(rec => {
      const recElement = document.createElement('div');
      recElement.className = `recommendation-card priority-${rec.priority}`;
      recElement.innerHTML = `
        <div class="recommendation-header">
          <h4>${rec.title}</h4>
          <span class="priority-badge">${rec.priority}</span>
        </div>
        <p>${rec.description}</p>
        <div class="recommendation-footer">
          <span class="savings">Tahmini Tasarruf: ${rec.estimatedSavings}</span>
          <button class="btn btn-primary" onclick="smartForms.applyRecommendation('${rec.type}')">
            Teklif Al
          </button>
        </div>
      `;
      recommendationContainer.appendChild(recElement);
    });
  }

  applyRecommendation(type) {
    // Redirect to appropriate page or open calculator
    switch(type) {
      case 'bes':
        window.location.href = 'bes.html';
        break;
      case 'auto':
        window.location.href = 'trafik.html';
        break;
      case 'health':
        window.location.href = 'saglik.html';
        break;
    }
  }

  // Auto-save functionality
  autoSaveField(field) {
    const fieldData = {
      name: field.name || field.id,
      value: field.value,
      timestamp: Date.now()
    };
    
    const savedData = JSON.parse(localStorage.getItem('cans-form-data') || '{}');
    savedData[fieldData.name] = fieldData;
    localStorage.setItem('cans-form-data', JSON.stringify(savedData));
  }

  // Form progress tracking
  updateFormProgress(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    const filledFields = Array.from(fields).filter(field => field.value.trim() !== '');
    const progress = (filledFields.length / fields.length) * 100;
    
    const progressBar = form.querySelector('.form-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    const progressText = form.querySelector('.form-progress-text');
    if (progressText) {
      progressText.textContent = `Form Tamamlanma: %${Math.round(progress)}`;
    }
  }

  // Smart form submission
  async submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate all fields
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showFormError('Lütfen tüm alanları doğru şekilde doldurun');
      return false;
    }
    
    // Show loading state
    this.showFormLoading(form);
    
    try {
      // Simulate API call
      await this.sendFormData(data);
      
      // Show success message
      this.showFormSuccess('Form başarıyla gönderildi!');
      
      // Clear form
      form.reset();
      
      // Track successful submission
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit_success', {
          event_category: 'Form',
          event_label: form.id || 'unknown'
        });
      }
      
      return true;
    } catch (error) {
      this.showFormError('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      return false;
    }
  }

  async sendFormData(data) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate
          resolve(data);
        } else {
          reject(new Error('API Error'));
        }
      }, 2000);
    });
  }

  showFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Gönderiliyor...';
    }
  }

  showFormSuccess(message) {
    this.showFormMessage(message, 'success');
  }

  showFormError(message) {
    this.showFormMessage(message, 'error');
  }

  showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Initialize smart forms when DOM is loaded
let smartForms;
document.addEventListener('DOMContentLoaded', () => {
  smartForms = new CANSSmartForms();
});

// Export for global access
window.smartForms = smartForms;
