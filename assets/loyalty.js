// CANS Sigorta Customer Loyalty System - Points, Referrals, Gamification
class CANSLoyalty {
  constructor() {
    this.userProfile = this.getUserProfile();
    this.points = this.userProfile.points || 0;
    this.level = this.userProfile.level || 'Bronze';
    this.referrals = this.userProfile.referrals || [];
    this.achievements = this.userProfile.achievements || [];
    this.init();
  }

  init() {
    this.setupLoyaltyUI();
    this.setupPointSystem();
    this.setupReferralSystem();
    this.setupGamification();
    this.setupAchievements();
    this.updateUserDisplay();
  }

  // User Profile Management
  getUserProfile() {
    const defaultProfile = {
      points: 0,
      level: 'Bronze',
      referrals: [],
      achievements: [],
      totalSpent: 0,
      policiesCount: 0,
      joinDate: Date.now(),
      lastActivity: Date.now()
    };

    return JSON.parse(localStorage.getItem('cans-loyalty-profile') || JSON.stringify(defaultProfile));
  }

  saveUserProfile() {
    this.userProfile = {
      ...this.userProfile,
      points: this.points,
      level: this.level,
      referrals: this.referrals,
      achievements: this.achievements,
      lastActivity: Date.now()
    };
    localStorage.setItem('cans-loyalty-profile', JSON.stringify(this.userProfile));
  }

  // Loyalty UI Setup
  setupLoyaltyUI() {
    this.createLoyaltyWidget();
    this.createPointsDisplay();
    this.createLevelProgress();
  }

  createLoyaltyWidget() {
    const widget = document.createElement('div');
    widget.id = 'loyalty-widget';
    widget.className = 'loyalty-widget collapsed'; // Start collapsed
    widget.innerHTML = `
      <div class="loyalty-header">
        <div class="loyalty-icon">🏆</div>
        <div class="loyalty-info">
          <div class="loyalty-level">${this.level}</div>
          <div class="loyalty-points">${this.points} Puan</div>
        </div>
        <button class="loyalty-toggle" onclick="cansLoyalty.toggleWidget()">×</button>
      </div>
      <div class="loyalty-content">
        <div class="loyalty-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.getLevelProgress()}%"></div>
          </div>
          <div class="progress-text">${this.getNextLevelPoints()} puan sonra ${this.getNextLevel()}</div>
        </div>
        <div class="loyalty-actions">
          <button class="loyalty-btn" onclick="cansLoyalty.showReferralModal()">👥 Arkadaş Davet Et</button>
          <button class="loyalty-btn" onclick="cansLoyalty.showAchievements()">🏅 Başarılarım</button>
          <button class="loyalty-btn" onclick="cansLoyalty.showRewards()">🎁 Ödüller</button>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  }

  createPointsDisplay() {
    // Points display removed to clean up the header
    // Points are still visible in the loyalty widget
  }

  createLevelProgress() {
    // Level progress removed to clean up the sticky CTA
    // Progress is still visible in the loyalty widget
  }

  // Point System
  setupPointSystem() {
    this.pointRules = {
      'page_view': 1,
      'form_start': 5,
      'form_submit': 10,
      'quote_request': 15,
      'policy_purchase': 50,
      'referral_signup': 25,
      'referral_purchase': 100,
      'review_submit': 10,
      'social_share': 5,
      'newsletter_signup': 5,
      'birthday': 20,
      'anniversary': 30
    };

    this.levelThresholds = {
      'Bronze': 0,
      'Silver': 100,
      'Gold': 500,
      'Platinum': 1000,
      'Diamond': 2500
    };

    this.setupPointTracking();
  }

  setupPointTracking() {
    // Track page views
    this.addPoints('page_view', { page: window.location.pathname });

    // Track form interactions
    document.addEventListener('submit', (e) => {
      this.addPoints('form_submit', { form: e.target.id });
    });

    // Track quote requests
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('Teklif')) {
        this.addPoints('quote_request', { button: e.target.textContent });
      }
    });

    // Track social shares
    document.addEventListener('click', (e) => {
      if (e.target.href && (e.target.href.includes('facebook.com') || e.target.href.includes('twitter.com'))) {
        this.addPoints('social_share', { platform: e.target.href });
      }
    });
  }

  addPoints(action, data = {}) {
    const pointsToAdd = this.pointRules[action] || 0;
    if (pointsToAdd === 0) return;

    this.points += pointsToAdd;
    this.checkLevelUp();
    this.saveUserProfile();
    this.updateUserDisplay();
    this.showPointsNotification(pointsToAdd, action);

    // Track in analytics
    if (window.cansAnalytics) {
      window.cansAnalytics.trackEvent('loyalty_points_earned', {
        action: action,
        points_earned: pointsToAdd,
        total_points: this.points,
        level: this.level,
        ...data
      });
    }
  }

  checkLevelUp() {
    const currentLevelPoints = this.levelThresholds[this.level];
    const nextLevel = this.getNextLevel();
    const nextLevelPoints = this.levelThresholds[nextLevel];

    if (this.points >= nextLevelPoints && this.level !== nextLevel) {
      this.levelUp(nextLevel);
    }
  }

  levelUp(newLevel) {
    const oldLevel = this.level;
    this.level = newLevel;
    this.saveUserProfile();
    this.updateUserDisplay();
    this.showLevelUpNotification(oldLevel, newLevel);
    this.unlockAchievement(`level_${newLevel.toLowerCase()}`);

    // Track level up
    if (window.cansAnalytics) {
      window.cansAnalytics.trackEvent('loyalty_level_up', {
        old_level: oldLevel,
        new_level: newLevel,
        total_points: this.points
      });
    }
  }

  getLevelProgress() {
    const currentLevelPoints = this.levelThresholds[this.level];
    const nextLevel = this.getNextLevel();
    const nextLevelPoints = this.levelThresholds[nextLevel];
    
    if (nextLevelPoints === currentLevelPoints) return 100;
    
    const progress = ((this.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  getNextLevel() {
    const levels = Object.keys(this.levelThresholds);
    const currentIndex = levels.indexOf(this.level);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : this.level;
  }

  getNextLevelPoints() {
    const nextLevel = this.getNextLevel();
    const nextLevelPoints = this.levelThresholds[nextLevel];
    return nextLevelPoints - this.points;
  }

  // Referral System
  setupReferralSystem() {
    this.referralCode = this.generateReferralCode();
    this.setupReferralTracking();
  }

  generateReferralCode() {
    const savedCode = localStorage.getItem('cans-referral-code');
    if (savedCode) return savedCode;

    const code = 'CANS' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('cans-referral-code', code);
    return code;
  }

  setupReferralTracking() {
    // Check for referral in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode && referralCode !== this.referralCode) {
      this.processReferral(referralCode);
    }
  }

  processReferral(referralCode) {
    // Check if this is a new referral
    const referralKey = `referral_${referralCode}`;
    if (localStorage.getItem(referralKey)) return;

    // Mark as processed
    localStorage.setItem(referralKey, Date.now());
    
    // Add referral to list
    this.referrals.push({
      code: referralCode,
      timestamp: Date.now(),
      status: 'pending'
    });

    this.saveUserProfile();
    this.showReferralWelcome(referralCode);
  }

  showReferralModal() {
    const modal = document.createElement('div');
    modal.className = 'referral-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>👥 Arkadaş Davet Et</h3>
          <button class="modal-close" onclick="this.closest('.referral-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="referral-code-section">
            <h4>Davet Kodunuz:</h4>
            <div class="referral-code-display">
              <input type="text" value="${this.referralCode}" readonly id="referral-code-input">
              <button onclick="cansLoyalty.copyReferralCode()">📋 Kopyala</button>
            </div>
          </div>
          
          <div class="referral-benefits">
            <h4>🎁 Davet Avantajları:</h4>
            <ul>
              <li>✅ Arkadaşınız kayıt olduğunda: <strong>25 puan</strong></li>
              <li>✅ Arkadaşınız sigorta aldığında: <strong>100 puan</strong></li>
              <li>✅ Arkadaşınız da <strong>%10 indirim</strong> kazanır</li>
            </ul>
          </div>
          
          <div class="referral-share">
            <h4>📱 Paylaş:</h4>
            <div class="share-buttons">
              <button onclick="cansLoyalty.shareReferral('whatsapp')" class="share-btn whatsapp">WhatsApp</button>
              <button onclick="cansLoyalty.shareReferral('facebook')" class="share-btn facebook">Facebook</button>
              <button onclick="cansLoyalty.shareReferral('twitter')" class="share-btn twitter">Twitter</button>
            </div>
          </div>
          
          <div class="referral-stats">
            <h4>📊 İstatistikleriniz:</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">${this.referrals.length}</span>
                <span class="stat-label">Toplam Davet</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${this.referrals.filter(r => r.status === 'completed').length}</span>
                <span class="stat-label">Tamamlanan</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${this.referrals.filter(r => r.status === 'completed').length * 100}</span>
                <span class="stat-label">Kazanılan Puan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  copyReferralCode() {
    const input = document.getElementById('referral-code-input');
    input.select();
    document.execCommand('copy');
    
    this.showNotification('Davet kodu panoya kopyalandı!', 'success');
  }

  shareReferral(platform) {
    const url = `${window.location.origin}?ref=${this.referralCode}`;
    const text = `CANS Sigorta ile sigortalarımı çok uygun fiyatlara aldım! Sen de bu linkten %10 indirim kazan: ${url}`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      this.addPoints('social_share', { platform: platform });
    }
  }

  // Gamification
  setupGamification() {
    this.setupDailyChallenges();
    this.setupStreaks();
    this.setupBadges();
  }

  setupDailyChallenges() {
    this.dailyChallenges = [
      {
        id: 'visit_3_pages',
        title: 'Keşifçi',
        description: '3 farklı sayfa ziyaret et',
        target: 3,
        reward: 10,
        type: 'page_visits'
      },
      {
        id: 'get_2_quotes',
        title: 'Araştırmacı',
        description: '2 farklı sigorta teklifi al',
        target: 2,
        reward: 20,
        type: 'quote_requests'
      },
      {
        id: 'share_referral',
        title: 'Sosyal',
        description: 'Davet kodunu paylaş',
        target: 1,
        reward: 15,
        type: 'referral_shares'
      }
    ];

    this.trackDailyProgress();
  }

  trackDailyProgress() {
    const today = new Date().toDateString();
    const dailyData = JSON.parse(localStorage.getItem(`cans-daily-${today}`) || '{}');
    
    this.dailyData = {
      page_visits: dailyData.page_visits || 0,
      quote_requests: dailyData.quote_requests || 0,
      referral_shares: dailyData.referral_shares || 0
    };

    this.checkDailyChallenges();
  }

  checkDailyChallenges() {
    this.dailyChallenges.forEach(challenge => {
      const progress = this.dailyData[challenge.type] || 0;
      const isCompleted = progress >= challenge.target;
      
      if (isCompleted && !this.isChallengeCompleted(challenge.id)) {
        this.completeChallenge(challenge);
      }
    });
  }

  completeChallenge(challenge) {
    this.addPoints('challenge_complete', { challenge: challenge.id });
    this.showChallengeNotification(challenge);
    this.unlockAchievement(`challenge_${challenge.id}`);
  }

  isChallengeCompleted(challengeId) {
    const today = new Date().toDateString();
    const completed = JSON.parse(localStorage.getItem(`cans-challenges-${today}`) || '[]');
    return completed.includes(challengeId);
  }

  // Achievements System
  setupAchievements() {
    this.achievementDefinitions = [
      {
        id: 'first_visit',
        title: 'Hoş Geldiniz',
        description: 'İlk ziyaretiniz',
        icon: '👋',
        points: 5,
        condition: () => this.userProfile.policiesCount >= 0
      },
      {
        id: 'bronze_member',
        title: 'Bronz Üye',
        description: 'Bronz seviyeye ulaştınız',
        icon: '🥉',
        points: 10,
        condition: () => this.level === 'Bronze'
      },
      {
        id: 'silver_member',
        title: 'Gümüş Üye',
        description: 'Gümüş seviyeye ulaştınız',
        icon: '🥈',
        points: 25,
        condition: () => this.level === 'Silver'
      },
      {
        id: 'gold_member',
        title: 'Altın Üye',
        description: 'Altın seviyeye ulaştınız',
        icon: '🥇',
        points: 50,
        condition: () => this.level === 'Gold'
      },
      {
        id: 'first_referral',
        title: 'İlk Davet',
        description: 'İlk arkadaşınızı davet ettiniz',
        icon: '👥',
        points: 15,
        condition: () => this.referrals.length >= 1
      },
      {
        id: 'social_butterfly',
        title: 'Sosyal Kelebek',
        description: '5 kez paylaşım yaptınız',
        icon: '🦋',
        points: 20,
        condition: () => this.getSocialShareCount() >= 5
      }
    ];

    this.checkAchievements();
  }

  checkAchievements() {
    this.achievementDefinitions.forEach(achievement => {
      if (!this.hasAchievement(achievement.id) && achievement.condition()) {
        this.unlockAchievement(achievement.id);
      }
    });
  }

  unlockAchievement(achievementId) {
    const achievement = this.achievementDefinitions.find(a => a.id === achievementId);
    if (!achievement) return;

    this.achievements.push({
      id: achievementId,
      unlockedAt: Date.now()
    });

    this.addPoints('achievement_unlock', { achievement: achievementId });
    this.showAchievementNotification(achievement);
    this.saveUserProfile();
  }

  hasAchievement(achievementId) {
    return this.achievements.some(a => a.id === achievementId);
  }

  showAchievements() {
    const modal = document.createElement('div');
    modal.className = 'achievements-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🏅 Başarılarım</h3>
          <button class="modal-close" onclick="this.closest('.achievements-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="achievements-grid">
            ${this.achievementDefinitions.map(achievement => `
              <div class="achievement-card ${this.hasAchievement(achievement.id) ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                  <h4>${achievement.title}</h4>
                  <p>${achievement.description}</p>
                  <div class="achievement-points">+${achievement.points} puan</div>
                </div>
                <div class="achievement-status">
                  ${this.hasAchievement(achievement.id) ? '✅' : '🔒'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // UI Updates
  updateUserDisplay() {
    const levelElement = document.querySelector('.loyalty-level');
    const pointsElement = document.querySelector('.loyalty-points');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (levelElement) levelElement.textContent = this.level;
    if (pointsElement) pointsElement.textContent = `${this.points} Puan`;
    if (progressFill) progressFill.style.width = `${this.getLevelProgress()}%`;
    if (progressText) progressText.textContent = `${this.getNextLevelPoints()} puan sonra ${this.getNextLevel()}`;
  }

  toggleWidget() {
    const widget = document.getElementById('loyalty-widget');
    if (widget) {
      widget.classList.toggle('collapsed');
    }
  }

  // Notifications
  showPointsNotification(points, action) {
    this.showNotification(`+${points} puan kazandınız! (${action})`, 'points');
  }

  showLevelUpNotification(oldLevel, newLevel) {
    this.showNotification(`🎉 Tebrikler! ${oldLevel} → ${newLevel} seviyesine yükseldiniz!`, 'levelup');
  }

  showReferralWelcome(referralCode) {
    this.showNotification(`👥 ${referralCode} kodunu kullandığınız için teşekkürler!`, 'referral');
  }

  showChallengeNotification(challenge) {
    this.showNotification(`🏆 "${challenge.title}" görevini tamamladınız! +${challenge.reward} puan`, 'challenge');
  }

  showAchievementNotification(achievement) {
    this.showNotification(`🏅 "${achievement.title}" başarımını açtınız! +${achievement.points} puan`, 'achievement');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `loyalty-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Utility Functions
  getSocialShareCount() {
    // This would typically be tracked in analytics
    return Math.floor(this.points / 5); // Rough estimate
  }

  showRewards() {
    const modal = document.createElement('div');
    modal.className = 'rewards-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🎁 Ödüller</h3>
          <button class="modal-close" onclick="this.closest('.rewards-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="rewards-grid">
            <div class="reward-card">
              <div class="reward-icon">💰</div>
              <h4>%5 İndirim</h4>
              <p>50 puan karşılığında</p>
              <button class="reward-btn" onclick="cansLoyalty.redeemReward('discount_5')">Kullan</button>
            </div>
            <div class="reward-card">
              <div class="reward-icon">🎁</div>
              <h4>Hediye Paketi</h4>
              <p>100 puan karşılığında</p>
              <button class="reward-btn" onclick="cansLoyalty.redeemReward('gift_package')">Kullan</button>
            </div>
            <div class="reward-card">
              <div class="reward-icon">⭐</div>
              <h4>VIP Destek</h4>
              <p>200 puan karşılığında</p>
              <button class="reward-btn" onclick="cansLoyalty.redeemReward('vip_support')">Kullan</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  redeemReward(rewardId) {
    const rewardCosts = {
      'discount_5': 50,
      'gift_package': 100,
      'vip_support': 200
    };

    const cost = rewardCosts[rewardId];
    if (this.points >= cost) {
      this.points -= cost;
      this.saveUserProfile();
      this.updateUserDisplay();
      this.showNotification('Ödül başarıyla kullanıldı!', 'success');
    } else {
      this.showNotification('Yeterli puanınız yok!', 'error');
    }
  }
}

// Initialize loyalty system when DOM is loaded
let cansLoyalty;
document.addEventListener('DOMContentLoaded', () => {
  cansLoyalty = new CANSLoyalty();
});

// Export for global access
window.cansLoyalty = cansLoyalty;
