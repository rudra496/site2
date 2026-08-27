// Rudra Sarker Portfolio v2 — Clean Professional Light Theme
document.addEventListener("DOMContentLoaded", () => {

  // 1. Mobile Menu Navigation
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

  // 2. Project Category Filter
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

  // 3. One-Click Copy Email
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
