// ==========================================================================
// RUDRA SARKER PORTFOLIO (v2) — KILLER GRADE LIGHT THEME JAVASCRIPT
// Architecture: Native ES6 · Zero External Framework Bloat · 60fps Micro-Interactions
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------------------
  // 1. Mobile Menu Navigation
  // ------------------------------------------------------------------------
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileDropdown = document.getElementById("mobile-dropdown");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (menuBtn && mobileDropdown) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileDropdown.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileDropdown.classList.remove("open");
        if (menuBtn) {
          menuBtn.setAttribute("aria-expanded", "false");
          const icon = menuBtn.querySelector("i");
          if (icon) icon.className = "fas fa-bars";
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Hero Interactive Tab Switcher (Portrait vs 3D Quantum Lab)
  // ------------------------------------------------------------------------
  window.switchHeroTab = function(mode) {
    const tabPortrait = document.getElementById("hero-tab-portrait");
    const tab3D = document.getElementById("hero-tab-3d");
    const viewPortrait = document.getElementById("hero-view-portrait");
    const view3D = document.getElementById("hero-view-3d");

    if (!tabPortrait || !tab3D || !viewPortrait || !view3D) return;

    if (mode === "portrait") {
      tabPortrait.classList.add("active");
      tab3D.classList.remove("active");
      viewPortrait.classList.add("active");
      view3D.classList.remove("active");
    } else {
      tab3D.classList.add("active");
      tabPortrait.classList.remove("active");
      view3D.classList.add("active");
      viewPortrait.classList.remove("active");
      // Trigger Three.js canvas resize
      window.dispatchEvent(new Event("resize"));
    }
  };

  // ------------------------------------------------------------------------
  // 3. Project Category Filter
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll(".c-filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  if (filterBtns.length > 0 && workCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const targetCat = btn.getAttribute("data-category");

        workCards.forEach(card => {
          const cardCat = card.getAttribute("data-cat") || "";
          if (targetCat === "all" || cardCat.includes(targetCat)) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Institutional Lightbox Modal for All Figures, Photos & Certificates
  // ------------------------------------------------------------------------
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, altText) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = altText || "";
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal || e.target.classList.contains("lightbox-backdrop")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("active")) {
      closeLightbox();
    }
  });

  // Attach click-to-zoom to all figure cards, achievement cards, and certificates
  const zoomableImages = document.querySelectorAll(
    ".research-figure-card img, .achievement-card img, .certificate-card img, .project-card-media img"
  );

  zoomableImages.forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      openLightbox(img.src, img.alt);
    });
  });

  // ------------------------------------------------------------------------
  // 5. One-Click Copy BibTeX Citation
  // ------------------------------------------------------------------------
  window.copyBibtex = function() {
    const bibtexEl = document.getElementById("bibtex-content");
    if (!bibtexEl) return;
    navigator.clipboard.writeText(bibtexEl.innerText.trim()).then(() => {
      const btn = document.getElementById("copy-bibtex-btn");
      if (btn) {
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied Citation!';
        setTimeout(() => {
          btn.innerHTML = origText;
        }, 2500);
      }
    });
  };

  // ------------------------------------------------------------------------
  // 6. One-Click Copy Email Toast
  // ------------------------------------------------------------------------
  window.copyEmail = function(email) {
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById("copy-toast");
      if (toast) {
        toast.textContent = "Email copied to clipboard";
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(10px)";
        }, 2500);
      }
    });
  };
});
