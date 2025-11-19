// Mobile hamburger toggle
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    // flip a11y state on the container for CSS
    nav.setAttribute('aria-expanded', String(!expanded));
  });
}

// FAQ accordion (accessible)
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const panel = item.querySelector('.faq-a');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    // close others (optional; comment out if you want multiple open)
    document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(b => {
      if (b !== btn) {
        b.setAttribute('aria-expanded', 'false');
        const p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      }
    });

    btn.setAttribute('aria-expanded', String(!open));
    panel.hidden = open; // toggle
  });
});

// Respect prefers-reduced-motion for hero video (no hard pause, just avoid play calls)
const heroVideo = document.getElementById('heroVideo');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.removeAttribute('autoplay');
}

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal--visible');
        obs.unobserve(entry.target); // animate only once
      });
    },
    {
      threshold: 0.15 // how much of element must be visible
    }
  );

  revealEls.forEach(el => observer.observe(el));
} else {
  // Fallback: if no IntersectionObserver, just show everything
  revealEls.forEach(el => el.classList.add('reveal--visible'));
}

// Slow down hero video playback
const hv = document.getElementById('heroVideo');
if (hv) {
  hv.playbackRate = 0.35;   // 20% speed
}

// Prefill "Motivo de contacto" based on clicked button
const motivoSelect = document.getElementById('motivo');

if (motivoSelect) {
  const motivoButtons = document.querySelectorAll('[data-motivo]');

  motivoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-motivo');
      if (!value) return;

      // Set the dropdown value
      motivoSelect.value = value;

      // Optional: scroll focus to the form field after the jump
      // small timeout so anchor scroll happens first
      setTimeout(() => {
        motivoSelect.focus();
      }, 400);
    });
  });
}

// ===== AJAX Contact Form =====
const contactForm = document.getElementById("contactForm");
const formAlert = document.getElementById("form-alert");

if (contactForm && formAlert) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const btnLabel = submitBtn ? submitBtn.querySelector('span') : null;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("sendmail.php", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        showFormAlert("¡Correo enviado! Gracias por tu interés, pronto estaremos en contacto.", "success");
        contactForm.reset();
      } else {
        showFormAlert("Hubo un error al enviar el mensaje. Intenta más tarde.", "error");
      }
    } catch (err) {
      showFormAlert("Error de conexión. Intenta nuevamente.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      }
    }
  });

  function showFormAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = "form-alert " + type;
    formAlert.style.opacity = 1;

    setTimeout(() => {
      formAlert.style.opacity = 0;
    }, 4000);
  }
}


