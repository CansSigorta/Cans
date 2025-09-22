// CANS Sigorta Hızlı Hesaplayıcılar
class CANSCalculators {
  constructor() {
    this.init();
  }

  init() {
    this.createCalculatorModals();
    this.addEventListeners();
  }

  createCalculatorModals() {
    const calculatorHTML = `
      <!-- BES Calculator Modal -->
      <div id="bes-calculator-modal" class="calculator-modal">
        <div class="calculator-content">
          <div class="calculator-header">
            <h3>💰 BES Hesaplayıcı</h3>
            <button class="calculator-close" onclick="this.closest('.calculator-modal').style.display='none'">×</button>
          </div>
          <div class="calculator-body">
            <div class="input-group">
              <label>Aylık Katkı Payı (TL)</label>
              <input type="number" id="bes-monthly" placeholder="1000" min="100" max="50000">
            </div>
            <div class="input-group">
              <label>Yatırım Süresi (Yıl)</label>
              <input type="number" id="bes-years" placeholder="20" min="1" max="50">
            </div>
            <div class="input-group">
              <label>Beklenen Yıllık Getiri (%)</label>
              <select id="bes-return">
                <option value="8">Konservatif (%8)</option>
                <option value="12" selected>Dengeli (%12)</option>
                <option value="15">Agresif (%15)</option>
              </select>
            </div>
            <button class="btn btn-primary" onclick="cansCalculators.calculateBES()">Hesapla</button>
            <div id="bes-result" class="calculator-result"></div>
          </div>
        </div>
      </div>

      <!-- Trafik Calculator Modal -->
      <div id="trafik-calculator-modal" class="calculator-modal">
        <div class="calculator-content">
          <div class="calculator-header">
            <h3>🚗 Trafik Sigortası Hesaplayıcı</h3>
            <button class="calculator-close" onclick="this.closest('.calculator-modal').style.display='none'">×</button>
          </div>
          <div class="calculator-body">
            <div class="input-group">
              <label>Araç Markası</label>
              <select id="trafik-brand">
                <option value="toyota">Toyota</option>
                <option value="volkswagen">Volkswagen</option>
                <option value="ford">Ford</option>
                <option value="renault">Renault</option>
                <option value="hyundai">Hyundai</option>
                <option value="fiat">Fiat</option>
                <option value="opel">Opel</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            <div class="input-group">
              <label>Model Yılı</label>
              <select id="trafik-year">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="older">2015 ve öncesi</option>
              </select>
            </div>
            <div class="input-group">
              <label>Motor Hacmi (cc)</label>
              <select id="trafik-engine">
                <option value="1000">1000cc ve altı</option>
                <option value="1600" selected>1001-1600cc</option>
                <option value="2000">1601-2000cc</option>
                <option value="3000">2001-3000cc</option>
                <option value="over">3000cc üzeri</option>
              </select>
            </div>
            <div class="input-group">
              <label>Kullanım Amacı</label>
              <select id="trafik-usage">
                <option value="private" selected>Özel Kullanım</option>
                <option value="commercial">Ticari Kullanım</option>
                <option value="taxi">Taksi</option>
                <option value="rental">Kiralama</option>
              </select>
            </div>
            <button class="btn btn-primary" onclick="cansCalculators.calculateTrafik()">Hesapla</button>
            <div id="trafik-result" class="calculator-result"></div>
          </div>
        </div>
      </div>

      <!-- Kasko Calculator Modal -->
      <div id="kasko-calculator-modal" class="calculator-modal">
        <div class="calculator-content">
          <div class="calculator-header">
            <h3>🛡️ Kasko Sigortası Hesaplayıcı</h3>
            <button class="calculator-close" onclick="this.closest('.calculator-modal').style.display='none'">×</button>
          </div>
          <div class="calculator-body">
            <div class="input-group">
              <label>Araç Değeri (TL)</label>
              <input type="number" id="kasko-value" placeholder="500000" min="50000" max="5000000">
            </div>
            <div class="input-group">
              <label>Araç Yaşı</label>
              <select id="kasko-age">
                <option value="0">0-1 yaş</option>
                <option value="2">2-3 yaş</option>
                <option value="4">4-5 yaş</option>
                <option value="6">6-8 yaş</option>
                <option value="9">9+ yaş</option>
              </select>
            </div>
            <div class="input-group">
              <label>Kapsam</label>
              <select id="kasko-coverage">
                <option value="full">Tam Kasko</option>
                <option value="partial" selected>Kısmi Kasko</option>
                <option value="basic">Temel Kasko</option>
              </select>
            </div>
            <div class="input-group">
              <label>Muafiyet (TL)</label>
              <select id="kasko-deductible">
                <option value="0">Muafiyet Yok</option>
                <option value="500" selected>500 TL</option>
                <option value="1000">1.000 TL</option>
                <option value="2000">2.000 TL</option>
                <option value="5000">5.000 TL</option>
              </select>
            </div>
            <button class="btn btn-primary" onclick="cansCalculators.calculateKasko()">Hesapla</button>
            <div id="kasko-result" class="calculator-result"></div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', calculatorHTML);
  }

  addEventListeners() {
    // Add calculator buttons to existing pages
    this.addCalculatorButtons();
  }

  addCalculatorButtons() {
    // Add to BES page
    const besPage = document.querySelector('a[href="bes.html"]');
    if (besPage) {
      const calculatorBtn = document.createElement('button');
      calculatorBtn.className = 'btn btn-secondary calculator-btn';
      calculatorBtn.innerHTML = '💰 BES Hesapla';
      calculatorBtn.onclick = () => this.openCalculator('bes');
      besPage.parentNode.insertBefore(calculatorBtn, besPage.nextSibling);
    }

    // Add to Trafik page
    const trafikPage = document.querySelector('a[href="trafik.html"]');
    if (trafikPage) {
      const calculatorBtn = document.createElement('button');
      calculatorBtn.className = 'btn btn-secondary calculator-btn';
      calculatorBtn.innerHTML = '🚗 Trafik Hesapla';
      calculatorBtn.onclick = () => this.openCalculator('trafik');
      trafikPage.parentNode.insertBefore(calculatorBtn, trafikPage.nextSibling);
    }

    // Add to Kasko page
    const kaskoPage = document.querySelector('a[href="kasko.html"]');
    if (kaskoPage) {
      const calculatorBtn = document.createElement('button');
      calculatorBtn.className = 'btn btn-secondary calculator-btn';
      calculatorBtn.innerHTML = '🛡️ Kasko Hesapla';
      calculatorBtn.onclick = () => this.openCalculator('kasko');
      kaskoPage.parentNode.insertBefore(calculatorBtn, kaskoPage.nextSibling);
    }
  }

  openCalculator(type) {
    const modal = document.getElementById(`${type}-calculator-modal`);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  calculateBES() {
    const monthly = parseFloat(document.getElementById('bes-monthly').value) || 1000;
    const years = parseInt(document.getElementById('bes-years').value) || 20;
    const returnRate = parseFloat(document.getElementById('bes-return').value) || 12;

    const monthlyReturn = returnRate / 100 / 12;
    const totalMonths = years * 12;
    
    // Calculate future value with compound interest
    let totalContribution = 0;
    let totalGovtContribution = 0;
    let totalValue = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      const monthlyContribution = monthly;
      const govtContribution = monthly * 0.30; // 30% government contribution
      
      totalContribution += monthlyContribution;
      totalGovtContribution += govtContribution;
      
      const monthlyTotal = monthlyContribution + govtContribution;
      totalValue += monthlyTotal * Math.pow(1 + monthlyReturn, totalMonths - month + 1);
    }

    const result = document.getElementById('bes-result');
    result.innerHTML = `
      <div class="result-card">
        <h4>💰 BES Hesaplama Sonucu</h4>
        <div class="result-item">
          <span>Toplam Katkınız:</span>
          <strong>${totalContribution.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div class="result-item">
          <span>Devlet Katkısı:</span>
          <strong>${totalGovtContribution.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div class="result-item highlight">
          <span>Tahmini Birikim:</span>
          <strong>${totalValue.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div class="result-note">
          *Getiri oranı tahminidir. Gerçek getiri piyasa koşullarına bağlıdır.
        </div>
        <button class="btn btn-primary" onclick="window.open('https://wa.me/905323510731?text=BES%20hesaplama%20sonucu:%20${totalValue.toLocaleString('tr-TR')}%20TL', '_blank')">
          📱 WhatsApp'tan Başla
        </button>
      </div>
    `;
  }

  calculateTrafik() {
    const brand = document.getElementById('trafik-brand').value;
    const year = document.getElementById('trafik-year').value;
    const engine = parseInt(document.getElementById('trafik-engine').value);
    const usage = document.getElementById('trafik-usage').value;

    // Base price calculation (simplified)
    let basePrice = 800;
    
    // Engine size factor
    if (engine <= 1000) basePrice += 0;
    else if (engine <= 1600) basePrice += 200;
    else if (engine <= 2000) basePrice += 400;
    else if (engine <= 3000) basePrice += 600;
    else basePrice += 800;

    // Usage factor
    const usageFactors = {
      'private': 1.0,
      'commercial': 1.5,
      'taxi': 2.0,
      'rental': 1.8
    };
    basePrice *= usageFactors[usage];

    // Year factor
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - parseInt(year);
    if (carAge > 10) basePrice += 200;
    else if (carAge > 5) basePrice += 100;

    // Brand factor
    const brandFactors = {
      'bmw': 1.2,
      'mercedes': 1.2,
      'audi': 1.1,
      'toyota': 1.0,
      'volkswagen': 1.0,
      'ford': 0.9,
      'renault': 0.9,
      'hyundai': 0.9,
      'fiat': 0.8,
      'opel': 0.8,
      'other': 1.0
    };
    basePrice *= brandFactors[brand];

    const minPrice = Math.round(basePrice * 0.8);
    const maxPrice = Math.round(basePrice * 1.2);

    const result = document.getElementById('trafik-result');
    result.innerHTML = `
      <div class="result-card">
        <h4>🚗 Trafik Sigortası Tahmini Fiyat</h4>
        <div class="result-item">
          <span>Fiyat Aralığı:</span>
          <strong>${minPrice.toLocaleString('tr-TR')} - ${maxPrice.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div class="result-item">
          <span>16 Şirketten:</span>
          <strong>En Uygun Fiyat</strong>
        </div>
        <div class="result-note">
          *Kesin fiyat için araç bilgileri ve geçmiş sigorta kayıtları gereklidir.
        </div>
        <button class="btn btn-primary" onclick="window.open('https://wa.me/905323510731?text=Trafik%20sigortası%20teklifi%20almak%20istiyorum.%20Araç:%20${brand}', '_blank')">
          📱 Detaylı Teklif Al
        </button>
      </div>
    `;
  }

  calculateKasko() {
    const value = parseFloat(document.getElementById('kasko-value').value) || 500000;
    const age = parseInt(document.getElementById('kasko-age').value);
    const coverage = document.getElementById('kasko-coverage').value;
    const deductible = parseInt(document.getElementById('kasko-deductible').value);

    // Base calculation (simplified)
    let basePrice = value * 0.03; // 3% of car value as base

    // Age factor
    const ageFactors = [1.0, 1.1, 1.2, 1.3, 1.4];
    basePrice *= ageFactors[age] || 1.4;

    // Coverage factor
    const coverageFactors = {
      'full': 1.0,
      'partial': 0.7,
      'basic': 0.5
    };
    basePrice *= coverageFactors[coverage];

    // Deductible factor
    const deductibleFactors = {
      0: 1.0,
      500: 0.9,
      1000: 0.8,
      2000: 0.7,
      5000: 0.6
    };
    basePrice *= deductibleFactors[deductible];

    const minPrice = Math.round(basePrice * 0.8);
    const maxPrice = Math.round(basePrice * 1.2);

    const result = document.getElementById('kasko-result');
    result.innerHTML = `
      <div class="result-card">
        <h4>🛡️ Kasko Sigortası Tahmini Fiyat</h4>
        <div class="result-item">
          <span>Fiyat Aralığı:</span>
          <strong>${minPrice.toLocaleString('tr-TR')} - ${maxPrice.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div class="result-item">
          <span>Araç Değeri:</span>
          <strong>${value.toLocaleString('tr-TR')} TL</strong>
        </div>
        <div class="result-item">
          <span>Kapsam:</span>
          <strong>${coverage === 'full' ? 'Tam Kasko' : coverage === 'partial' ? 'Kısmi Kasko' : 'Temel Kasko'}</strong>
        </div>
        <div class="result-note">
          *Kesin fiyat için detaylı araç bilgileri ve geçmiş hasar kayıtları gereklidir.
        </div>
        <button class="btn btn-primary" onclick="window.open('https://wa.me/905323510731?text=Kasko%20sigortası%20teklifi%20almak%20istiyorum.%20Araç%20değeri:%20${value.toLocaleString('tr-TR')}%20TL', '_blank')">
          📱 Detaylı Teklif Al
        </button>
      </div>
    `;
  }
}

// Initialize calculators when page loads
let cansCalculators;
document.addEventListener('DOMContentLoaded', () => {
  cansCalculators = new CANSCalculators();
});
