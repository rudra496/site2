// Rudra Sarker Portfolio v2 — Clean Executive Engine with Theme Switcher
document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Management (OLED Black, Space Navy, Clean Light)
  const themes = ["oled", "navy", "light"];
  const themeLabels = { oled: "OLED", navy: "Navy", light: "Light" };
  const themeIcons = { oled: "fa-moon", navy: "fa-compass", light: "fa-sun" };

  let currentTheme = localStorage.getItem("rudra_portfolio_theme") || "oled";
  applyTheme(currentTheme);

  window.cycleTheme = function() {
    let nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    currentTheme = themes[nextIdx];
    localStorage.setItem("rudra_portfolio_theme", currentTheme);
    applyTheme(currentTheme);
  };

  function applyTheme(theme) {
    if (theme === "oled") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    const label = document.getElementById("theme-name-label");
    const icon = document.getElementById("theme-icon");
    if (label) label.textContent = themeLabels[theme];
    if (icon) icon.className = "fas " + themeIcons[theme];

    // Dispatch event so 3D engine can sync if needed
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  // 2. Mobile Menu Navigation
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

  // 3. Project Category Filter
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

  // 4. One-Click Copy Email
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
