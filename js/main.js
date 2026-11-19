// PORTAFOLIO EDICIÓN ÁUREA — interacciones suaves y accesibles
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Aparición al entrar en pantalla
const reveals = document.querySelectorAll('.reveal, .section-heading');
reveals.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  reveals.forEach(el => observer.observe(el));
  const staggerObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      staggerObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.stagger-group').forEach(el => staggerObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
  document.querySelectorAll('.stagger-group').forEach(el => el.classList.add('in-view'));
}

// Progreso y estado de la barra de navegación
const navbar = document.getElementById('navbar');
const progress = document.querySelector('.page-progress span');
let scrollTicking = false;
function updateScroll() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  if (progress) progress.style.transform = `scaleX(${Math.min(1, window.scrollY / maxScroll)})`;
  navbar?.classList.toggle('is-scrolled', window.scrollY > 30);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) { window.requestAnimationFrame(updateScroll); scrollTicking = true; }
}, { passive: true });
updateScroll();

// Hojas doradas, creadas una sola vez. CSS se encarga de la animación.
if (!reduceMotion) {
  const leafLayer = document.getElementById('leaves-layer');
  const leafCount = coarsePointer ? 7 : 15;
  // Valores deterministas: misma composición sin saltos en cada carga.
  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'gold-leaf';
    const x = (i * 37 + 7) % 100;
    leaf.style.setProperty('--x', `${x}%`);
    leaf.style.setProperty('--size', `${18 + (i * 13) % 32}px`);
    leaf.style.setProperty('--opacity', `${0.17 + (i % 5) * 0.085}`);
    leaf.style.setProperty('--duration', `${19 + (i * 7) % 17}s`);
    leaf.style.setProperty('--delay', `${-((i * 11) % 34)}s`);
    leaf.style.setProperty('--sway', `${-85 + (i * 43) % 175}px`);
    leaf.style.setProperty('--spin', `${3 + (i % 5)}s`);
    const img = document.createElement('img');
    img.src = 'assets/img/hoja-dorada.svg';
    img.alt = '';
    img.decoding = 'async';
    leaf.appendChild(img);
    leafLayer?.appendChild(leaf);
  }
}

// Luz ambiental y seguimiento solo en dispositivos con mouse
if (!reduceMotion && !coarsePointer) {
  let mouseTicking = false, pointerX = 0, pointerY = 0;
  document.addEventListener('pointermove', event => {
    pointerX = event.clientX; pointerY = event.clientY;
    if (!mouseTicking) {
      mouseTicking = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
        mouseTicking = false;
      });
    }
  }, { passive: true });
  document.querySelectorAll('.stack-card, .project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--card-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  });
  // Inclinación sutil solo para la escultura, sin dificultar lectura de tarjetas
  const artFrame = document.querySelector('.art-frame[data-tilt]');
  artFrame?.addEventListener('pointermove', event => {
    const r = artFrame.getBoundingClientRect();
    const rx = ((event.clientY - r.top) / r.height - 0.5) * -5;
    const ry = ((event.clientX - r.left) / r.width - 0.5) * 5;
    artFrame.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, { passive: true });
  artFrame?.addEventListener('pointerleave', () => { artFrame.style.transform = ''; });
}

// Cerrar menú móvil al navegar. Bootstrap ya está enlazado en HTML.
const menu = document.getElementById('menu');
document.querySelectorAll('#menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (menu?.classList.contains('show') && window.bootstrap?.Collapse) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});


/* ============================================
   HABILIDADES BLANDAS — INTERACTIVIDAD
============================================ */

const softSection = document.querySelector(".softskills-section");
const softCards = document.querySelectorAll(".soft-card");

// Animación de entrada
if (softSection && softCards.length > 0 && !reduceMotion) {

    if ("IntersectionObserver" in window) {
        softSection.classList.add("softskills-ready");

        const softObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("softskills-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08
            }
        );

        softObserver.observe(softSection);
    }
}

// Brillo que sigue al cursor
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

    softCards.forEach(card => {

        card.addEventListener("pointermove", event => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--mouse-x", "50%");
            card.style.setProperty("--mouse-y", "50%");
        });

    });
}

/* ============================================
   STACK TECNOLÓGICO — INTERACTIVIDAD
============================================ */

const techSection = document.querySelector(".tech-section");
const techCards = document.querySelectorAll(".tech-card");

const techReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

// Animaciones de entrada
if (techSection && techCards.length > 0 && !techReducedMotion) {

    if ("IntersectionObserver" in window) {

        techSection.classList.add("tech-ready");

        const techObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("tech-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        techObserver.observe(techSection);
    }
}

// Iluminación que sigue al cursor
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

    techCards.forEach(card => {

        card.addEventListener("pointermove", event => {

            const rect = card.getBoundingClientRect();

            card.style.setProperty(
                "--tech-x",
                `${event.clientX - rect.left}px`
            );

            card.style.setProperty(
                "--tech-y",
                `${event.clientY - rect.top}px`
            );
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--tech-x", "50%");
            card.style.setProperty("--tech-y", "50%");
        });
    });
}

/* ============================================
   CONTACTO — EFECTO DE ILUMINACIÓN
============================================ */

const contactGlowPanel = document.querySelector(".contact-panel");

if (
    contactGlowPanel &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
) {
    contactGlowPanel.addEventListener("pointermove", (event) => {
        const bounds = contactGlowPanel.getBoundingClientRect();

        contactGlowPanel.style.setProperty(
            "--contact-x",
            `${event.clientX - bounds.left}px`
        );

        contactGlowPanel.style.setProperty(
            "--contact-y",
            `${event.clientY - bounds.top}px`
        );
    });

    contactGlowPanel.addEventListener("pointerleave", () => {
        contactGlowPanel.style.setProperty("--contact-x", "50%");
        contactGlowPanel.style.setProperty("--contact-y", "50%");
    });
}

const emailButton = document.querySelector(".contact-email");

if (emailButton) {
    let copyTimeout;

    emailButton.addEventListener("click", async () => {
        const email = emailButton.dataset.email;
        const emailText = emailButton.querySelector(".email-text");
        const emailIcon = emailButton.querySelector(".contact-arrow");

        try {
            await navigator.clipboard.writeText(email);

            clearTimeout(copyTimeout);

            emailText.textContent = "¡Correo copiado!";
            emailIcon.className = "bi bi-check-lg contact-arrow";
            emailButton.classList.add("copied");

            copyTimeout = setTimeout(() => {
                emailText.textContent = email;
                emailIcon.className = "bi bi-copy contact-arrow";
                emailButton.classList.remove("copied");
            }, 2200);

        } catch (error) {
            emailText.textContent = "No se pudo copiar el correo";
            console.error("Error al copiar:", error);
        }
    });
}
