// Interacciones del portafolio
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

// Luz y seguimiento solo en dispositivos con mouse
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
  // Inclinación solo para la escultura 
  const artFrame = document.querySelector('.art-frame[data-tilt]');
  artFrame?.addEventListener('pointermove', event => {
    const r = artFrame.getBoundingClientRect();
    const rx = ((event.clientY - r.top) / r.height - 0.5) * -5;
    const ry = ((event.clientX - r.left) / r.width - 0.5) * 5;
    artFrame.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, { passive: true });
  artFrame?.addEventListener('pointerleave', () => { artFrame.style.transform = ''; });
}

// Cierre menú móvil al navegar 
const menu = document.getElementById('menu');
document.querySelectorAll('#menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (menu?.classList.contains('show') && window.bootstrap?.Collapse) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});


/*Animaciones de habilidades blandas*/

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

// Brillo que sigue al mouse
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

/*Animaciones de stack tecnologico*/

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

// Iluminación que sigue al mouse
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

/* Efecto de iluminación de contacto */


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
