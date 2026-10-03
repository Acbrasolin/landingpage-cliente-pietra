/* =========================================================
   PIETRA BRASOLIN — SCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------
     1. NAVBAR — efeito ao rolar
  --------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  if (navbar) {
    const handleNavbar = () => {
      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleNavbar);
    handleNavbar();
  }


  /* ---------------------------------------------------
     2. MENU MOBILE
  --------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const icon = menuToggle.querySelector("i");
      if (navLinks.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      });
    });
  }


  /* ---------------------------------------------------
     3. FAQ — Accordion (abre/fecha)
  --------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Fecha todos os outros
      faqItems.forEach((other) => {
        other.classList.remove("active");
        const otherQuestion = other.querySelector(".faq-question");
        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
      });

      // Abre o clicado (se não estava aberto)
      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });


  /* ---------------------------------------------------
     4. REVEAL ANIMATIONS (scroll) — com delay customizado
  --------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");

  // Delay automático para cards em grids (escalonado)
  document
    .querySelectorAll(".servicos-grid, .depoimentos-grid, .operadoras-grid, .contato-cards")
    .forEach((grid) => {
      [...grid.children].forEach((child, i) => {
        if (!child.dataset.delay) {
          child.dataset.delay = i * 120;
        }
      });
    });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0, 10);

          setTimeout(() => {
            el.classList.add("active");
          }, delay);

          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  reveals.forEach((el) => revealObserver.observe(el));


  /* ---------------------------------------------------
     5. CONTADOR ANIMADO (hero stats)
  --------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (el) => {
    const target = +el.getAttribute("data-count");
    const duration = 1800;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target).toLocaleString("pt-BR") + "+";

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString("pt-BR") + "+";
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));


  /* ---------------------------------------------------
     6. NAVEGAÇÃO ATIVA
  --------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a:not(.btn-nav)");

  const updateActiveLink = () => {
    let current = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) {
        current = sec.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();


   /* ---------------------------------------------------
     7. BOTÃO VOLTAR AO TOPO — com animação suave
  --------------------------------------------------- */
  const backTop = document.getElementById("backTop");

  if (backTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) backTop.classList.add("visible");
      else backTop.classList.remove("visible");
    });

    backTop.addEventListener("click", () => {
      const startPosition = window.scrollY;
      const duration = 900;        // duração em ms (900 = 0.9s)
      const startTime = performance.now();

      // Easing: easeInOutCubic (suave no começo, acelera e desacelera no fim)
      const easeInOutCubic = (t) => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        window.scrollTo(0, startPosition * (1 - eased));

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }

  /* ---------------------------------------------------
     8. SCROLL SUAVE COM OFFSET
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "#home") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });


  /* ---------------------------------------------------
     9. PARALLAX LEVE NO HERO (desktop)
  --------------------------------------------------- */
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && window.matchMedia("(min-width: 992px)").matches) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    });
  }

});