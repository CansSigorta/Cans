// SEO Optimization - Meta tags, structured data, performance
class SEOOptimization {
  constructor() {
    this.init();
  }

  init() {
    this.addStructuredData();
    this.optimizeMetaTags();
    this.addBreadcrumbs();
    this.optimizeImages();
    this.addSchemaMarkup();
    this.improvePageSpeed();
    this.addSocialMetaTags();
  }

  addStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "InsuranceAgency",
      "name": "CANS Sigorta Acentelik Hizmetleri Limited Şirketi",
      "alternateName": "CANS Sigorta",
      "description": "Türkiye'nin en güvenilir sigorta acentesi. Bireysel Emeklilik, Hayat, Trafik, Kasko, DASK, Sağlık ve Konut sigortaları. AgeSa resmi acentesi.",
      "url": "https://www.canssigorta.com",
      "logo": "https://www.canssigorta.com/assets/logo.svg",
      "image": "https://www.canssigorta.com/assets/og-image.jpg",
      "telephone": "+905323510731",
      "email": "info@canssigorta.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Halkalı Merkez Mahallesi, Gazi Sokak, No 41/A",
        "addressLocality": "Küçükçekmece",
        "addressRegion": "İstanbul",
        "postalCode": "34303",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 41.0295678,
        "longitude": 28.8901234
      },
      "openingHours": "Mo-Fr 09:00-18:00, Sa 09:00-14:00",
      "priceRange": "$$",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "currenciesAccepted": "TRY",
      "founder": {
        "@type": "Person",
        "name": "Ahmet Can Sangür"
      },
      "foundingDate": "2020",
      "areaServed": {
        "@type": "Country",
        "name": "Turkey"
      },
      "serviceType": [
        "Bireysel Emeklilik Sigortası",
        "Hayat Sigortası", 
        "Trafik Sigortası",
        "Kasko Sigortası",
        "DASK Sigortası",
        "Sağlık Sigortası",
        "Konut Sigortası"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sigorta Hizmetleri",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Bireysel Emeklilik Sigortası",
              "description": "AgeSa ile %30 devlet katkılı bireysel emeklilik"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Hayat Sigortası",
              "description": "Kapsamlı hayat sigortası çözümleri"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Mehmet Yılmaz"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          },
          "reviewBody": "Çok profesyonel hizmet, kesinlikle tavsiye ederim."
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  optimizeMetaTags() {
    // Dynamic meta description based on page
    const currentPage = window.location.pathname;
    let metaDescription = '';
    
    switch(currentPage) {
      case '/':
        metaDescription = 'CANS Sigorta - Türkiye\'nin en güvenilir sigorta acentesi. Bireysel Emeklilik, Hayat, Trafik, Kasko, DASK, Sağlık sigortaları. AgeSa resmi acentesi. İstanbul Küçükçekmece Halkalı.';
        break;
      case '/bes.html':
        metaDescription = 'Bireysel Emeklilik Sigortası - AgeSa ile %30 devlet katkılı BES. CANS Sigorta acentesi olarak en uygun fiyatlarla bireysel emeklilik planı.';
        break;
      case '/hayat.html':
        metaDescription = 'Hayat Sigortası - Kapsamlı hayat sigortası çözümleri. CANS Sigorta ile ailenizi güvence altına alın. En uygun hayat sigortası teklifleri.';
        break;
      case '/trafik.html':
        metaDescription = 'Trafik Sigortası - Zorunlu trafik sigortası en uygun fiyatlarla. CANS Sigorta ile 16 farklı şirketten teklif alın. Hızlı ve güvenli.';
        break;
      case '/kasko.html':
        metaDescription = 'Kasko Sigortası - Aracınızı güvence altına alın. CANS Sigorta ile en uygun kasko sigortası teklifleri. Hızlı hasar ödemeleri.';
        break;
      case '/dask.html':
        metaDescription = 'DASK Sigortası - Zorunlu deprem sigortası. CANS Sigorta ile evinizi depreme karşı koruyun. En uygun DASK fiyatları.';
        break;
      case '/saglik.html':
        metaDescription = 'Sağlık Sigortası - Özel sağlık sigortası çözümleri. CANS Sigorta ile sağlığınızı güvence altına alın. Kapsamlı sağlık sigortası.';
        break;
      case '/konut.html':
        metaDescription = 'Konut Sigortası - Ev sigortası çözümleri. CANS Sigorta ile evinizi her türlü riske karşı koruyun. En uygun konut sigortası.';
        break;
      case '/about.html':
        metaDescription = 'Hakkımızda - CANS Sigorta hikayesi. Ahmet Can Sangür liderliğinde güvenilir sigorta hizmetleri. AgeSa resmi acentesi.';
        break;
      case '/iletisim.html':
        metaDescription = 'İletişim - CANS Sigorta iletişim bilgileri. İstanbul Küçükçekmece Halkalı adresimiz. WhatsApp, telefon ve e-posta ile ulaşın.';
        break;
    }

    if (metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = metaDescription;
    }

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://www.canssigorta.com${currentPage}`;
  }

  addBreadcrumbs() {
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Ana Sayfa",
          "item": "https://www.canssigorta.com"
        }
      ]
    };

    const currentPage = window.location.pathname;
    if (currentPage !== '/') {
      const pageName = this.getPageName(currentPage);
      breadcrumbs.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": `https://www.canssigorta.com${currentPage}`
      });
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbs);
    document.head.appendChild(script);
  }

  getPageName(path) {
    const pageNames = {
      '/bes.html': 'Bireysel Emeklilik',
      '/hayat.html': 'Hayat Sigortası',
      '/trafik.html': 'Trafik Sigortası',
      '/kasko.html': 'Kasko Sigortası',
      '/dask.html': 'DASK Sigortası',
      '/saglik.html': 'Sağlık Sigortası',
      '/konut.html': 'Konut Sigortası',
      '/about.html': 'Hakkımızda',
      '/iletisim.html': 'İletişim'
    };
    return pageNames[path] || 'Sayfa';
  }

  optimizeImages() {
    // Add lazy loading to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.alt) {
        img.alt = 'CANS Sigorta - Sigorta Hizmetleri';
      }
    });

    // Add WebP support detection
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    if (supportsWebP()) {
      document.body.classList.add('webp-supported');
    }
  }

  addSchemaMarkup() {
    // FAQ Schema for pages with accordions
    const faqItems = document.querySelectorAll('.acc-item');
    if (faqItems.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
      };

      faqItems.forEach(item => {
        const question = item.querySelector('.acc-btn')?.textContent?.trim();
        const answer = item.querySelector('.acc-panel')?.textContent?.trim();
        
        if (question && answer) {
          faqSchema.mainEntity.push({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          });
        }
      });

      if (faqSchema.mainEntity.length > 0) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(script);
      }
    }
  }

  improvePageSpeed() {
    // Preload critical resources
    const criticalResources = [
      '/assets/style.css',
      '/assets/script.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });

    // Add resource hints
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = '//fonts.googleapis.com';
    document.head.appendChild(dnsPrefetch);

    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://www.google-analytics.com';
    document.head.appendChild(preconnect);
  }

  addSocialMetaTags() {
    // Enhanced Open Graph tags
    const ogTags = {
      'og:site_name': 'CANS Sigorta',
      'og:locale': 'tr_TR',
      'og:type': 'website',
      'article:author': 'Ahmet Can Sangür',
      'article:publisher': 'https://www.canssigorta.com'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@canssigorta',
      'twitter:creator': '@ahmetcansangur'
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }
}

// Initialize SEO optimization
document.addEventListener('DOMContentLoaded', () => {
  new SEOOptimization();
});
