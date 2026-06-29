/* 7 DRAGONS — contact-form.js
   Modal de contacto + envío de email con EmailJS (https://www.emailjs.com/).
   TODO: sustituye estos 3 valores por los de tu cuenta de EmailJS antes de publicar. */
(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY';
  var EMAILJS_SERVICE_ID = 'TU_SERVICE_ID';
  var EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';
  var IS_CONFIGURED = EMAILJS_PUBLIC_KEY !== 'TU_PUBLIC_KEY'
    && EMAILJS_SERVICE_ID !== 'TU_SERVICE_ID'
    && EMAILJS_TEMPLATE_ID !== 'TU_TEMPLATE_ID';

  function initModal() {
    var openBtn = document.getElementById('contact-open-btn');
    var overlay = document.getElementById('contact-modal-overlay');
    var closeBtn = document.getElementById('contact-modal-close');
    var form = document.getElementById('contact-form');
    var status = document.getElementById('contact-status');
    if (!openBtn || !overlay) return;

    function open() { overlay.hidden = false; document.body.style.overflow = 'hidden'; }
    function close() { overlay.hidden = true; document.body.style.overflow = ''; }

    openBtn.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    form?.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'contact-status';

      if (!IS_CONFIGURED) {
        status.textContent = 'El envío por email todavía no está configurado (falta conectar EmailJS). Mientras tanto, escríbenos por WhatsApp 🐉';
        status.classList.add('error');
        return;
      }

      var submitBtn = form.querySelector('button[type=submit]');
      submitBtn.disabled = true;
      status.textContent = 'Enviando...';

      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: document.getElementById('contact-name').value,
        from_email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
      }, EMAILJS_PUBLIC_KEY).then(function () {
        status.textContent = '¡Mensaje enviado! Te responderemos lo antes posible.';
        status.classList.add('success');
        form.reset();
      }).catch(function () {
        status.textContent = 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.';
        status.classList.add('error');
      }).finally(function () {
        submitBtn.disabled = false;
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initModal);
  else initModal();
})();
