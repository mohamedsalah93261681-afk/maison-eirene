/**
 * ==========================================================================
 * MAISON EIRENE — VANILLA JAVASCRIPT
 * Interactions, Navigation, Galerie Masonry, Lightbox & Conversion
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. GESTION DU HEADER AU SCROLL ---
  const header = document.getElementById('site-header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --- 2. MENU MOBILE TIROIR (DRAWER) ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeMobileMenu);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fermer le tiroir avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --- 3. DÉFILEMENT FLUIDE AVEC DÉCALAGE DU HEADER ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 4. NAVIGATION ACTIVE AU DÉFILEMENT (SPY) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  // --- 6. FILTRAGE DE LA GALERIE MASONRY (DÉSACTIVÉ - TOUTES LES PHOTOS VISIBLES) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    const galleryItems = document.querySelectorAll('.masonry-item');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const filterValue = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === itemCategory) {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 7. LIGHTBOX PLEIN ÉCRAN INTERACTIVE ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  const triggers = Array.from(document.querySelectorAll('.gallery-lightbox-trigger'));
  let currentGalleryIndex = 0;

  // Création du jeu de données des images
  const galleryData = triggers.map((trigger, idx) => ({
    src: trigger.getAttribute('href'),
    caption: trigger.getAttribute('data-caption') || '',
    index: idx
  }));

  const updateLightboxContent = (index) => {
    if (!galleryData[index]) return;
    currentGalleryIndex = index;
    const data = galleryData[index];

    lightboxImg.src = data.src;
    lightboxImg.alt = data.caption;
    lightboxCaption.textContent = data.caption;
    lightboxCounter.textContent = `${index + 1} / ${galleryData.length}`;
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    const nextIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent(nextIndex);
  };

  const showPrevImage = () => {
    const prevIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent(prevIndex);
  };

  // Écouteurs de clics sur les images
  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);

  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Support du swipe tactile sur mobile pour la lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNextImage(); // Balayage vers la gauche -> image suivante
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrevImage(); // Balayage vers la droite -> image précédente
    }
  };

  // --- 8. ANIMATIONS AU DÉFILEMENT (REVEAL ON SCROLL) ---
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback si IntersectionObserver n'est pas supporté
    reveals.forEach(el => el.classList.add('is-revealed'));
  }

  // --- 9. ACTUALISATION AUTOMATIQUE DU CALENDRIER (AUTO-REFRESH) ---
  const calIframe = document.querySelector('.calendar-container iframe');
  if (calIframe) {
    let lastRefreshTime = Date.now();

    const refreshCalendar = () => {
      try {
        const url = new URL(calIframe.src);
        url.searchParams.set('_t', Date.now().toString());
        calIframe.src = url.toString();
        lastRefreshTime = Date.now();
      } catch (err) {
        const cleanSrc = calIframe.src.split('&_t=')[0];
        calIframe.src = cleanSrc + '&_t=' + Date.now();
      }
    };

    // 1. Recharge automatiquement dès que vous revenez sur l'onglet du site
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastRefreshTime;
        if (elapsed > 15000) {
          refreshCalendar();
        }
      }
    });

    // 2. Recharge automatique en continu toutes les 60 secondes
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshCalendar();
      }
    }, 60000);
  }
});
