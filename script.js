/* =========================================================
   PIETRA BRASOLIN — SCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------
     1. NAVBAR — efeito ao rolar
  --------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  const handleNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleNavbar);
  handleNavbar();


  /* ---------------------------------------------------
     2. MENU MOBILE
  --------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

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


  /* ---------------------------------------------------
     3. REVEAL ANIMATIONS (scroll) — com delay customizado
  --------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");

  // Delay automático para cards em grids (escalonado)
  document.querySelectorAll(".servicos-grid, .planos-grid, .depoimentos-grid").forEach((grid) => {
    [...grid.children].forEach((child, i) => {
      // Aplica apenas se não tiver delay manual definido
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
     4. CONTADOR ANIMADO (hero stats)
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
     5. NAVEGAÇÃO ATIVA
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
     6. BOTÃO VOLTAR AO TOPO
  --------------------------------------------------- */
  const backTop = document.getElementById("backTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) backTop.classList.add("visible");
    else backTop.classList.remove("visible");
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ---------------------------------------------------
     7. FORMULÁRIO DE CONTATO
  --------------------------------------------------- */
  const form = document.getElementById("formContato");
  const formMsg = document.getElementById("formMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const tipo = form.tipo.value;

    if (!nome || !email || !telefone || !tipo) {
      formMsg.style.color = "#e74c3c";
      formMsg.textContent = "Por favor, preencha todos os campos obrigatórios.";
      return;
    }

    const btn = form.querySelector("button[type='submit']");
    const originalHTML = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      formMsg.style.color = "#0e7c86";
      formMsg.textContent = `Obrigada, ${nome.split(" ")[0]}! Recebemos sua solicitação. Entraremos em contato em breve. 🩺`;
      form.reset();

      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }, 1400);
  });


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


  /* ---------------------------------------------------
     10. EFEITO DE DIGITAÇÃO SUAVE NO TÍTULO (opcional)
  --------------------------------------------------- */
  // Caso queira um efeito de máquina de escrever no badge,
  // basta descomentar o bloco abaixo.

  /*
  const badge = document.querySelector(".badge");
  if (badge) {
    const text = badge.textContent.trim();
    badge.textContent = "";
    let i = 0;
    const typing = () => {
      if (i < text.length) {
        badge.textContent += text[i];
        i++;
        setTimeout(typing, 40);
      }
    };
    setTimeout(typing, 600);
  }
  */

});