// Rudra Sarker Portfolio v2 — Core Interaction & Filter Engine
document.addEventListener("DOMContentLoaded", () => {
  // 1) Mobile Navigation Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const allNavLinks = document.querySelectorAll(".nav-link");

  if (menuToggle && navLinks) {
    const icon = menuToggle.querySelector("i");

    const openMenu = () => {
      navLinks.classList.add("active");
      if (icon) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      }
      menuToggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      navLinks.classList.remove("active");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) closeMenu();
      else openMenu();
    });

    allNavLinks.forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // 2) Scroll Reveal Observer
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // 3) Interactive Project Category Filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card-v2");

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        projectCards.forEach(card => {
          const category = card.getAttribute("data-category") || "";
          if (filter === "all" || category.includes(filter)) {
            card.style.display = "flex";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(15px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 250);
          }
        });
      });
    });
  }

  // 4) Copy Email Utility
  window.copyEmail = function(email) {
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById("copy-toast");
      if (toast) {
        toast.textContent = "Email copied to clipboard!";
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(10px)";
        }, 2500);
      } else {
        alert("Copied " + email + " to clipboard!");
      }
    });
  };
});
