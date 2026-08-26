// Rudra Sarker Portfolio v2 — Master Interaction Engine
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Dynamic Island Mobile Navigation ---
  const toggleBtn = document.getElementById("nav-toggle-btn");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-item-link");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
      }
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        if (toggleBtn) {
          toggleBtn.setAttribute("aria-expanded", "false");
          const icon = toggleBtn.querySelector("i");
          if (icon) icon.className = "fas fa-bars";
        }
      });
    });
  }

  // --- 2. Active Section Spy for Floating Island ---
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  });

  // --- 3. Scroll Reveal Animation via IntersectionObserver ---
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // --- 4. Neo-Bento Interactive Filter System ---
  const filterBtns = document.querySelectorAll(".b-filter-btn");
  const bentoCards = document.querySelectorAll(".bento-card");

  if (filterBtns.length > 0 && bentoCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const targetCategory = btn.getAttribute("data-category");

        bentoCards.forEach(card => {
          const cardCat = card.getAttribute("data-cat") || "";
          if (targetCategory === "all" || cardCat.includes(targetCategory)) {
            card.style.display = "flex";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(12px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 200);
          }
        });
      });
    });
  }

  // --- 5. Interactive Copy Email Utility ---
  window.copyEmail = function(email) {
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById("action-toast");
      if (toast) {
        toast.innerHTML = `<i class="fas fa-check-circle"></i> &nbsp; Copied ${email} to clipboard!`;
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(15px)";
        }, 2800);
      }
    });
  };

  // --- 6. Live Sylhet, Bangladesh (GMT+6) Time Tracker ---
  function updateLiveClock() {
    const clockEl = document.getElementById("live-time-dhaka");
    if (clockEl) {
      const now = new Date();
      const options = { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
      clockEl.textContent = now.toLocaleTimeString("en-US", options) + " (GMT+6)";
    }
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
});
