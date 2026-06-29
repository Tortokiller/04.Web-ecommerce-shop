/* 7 DRAGONS — chat-widget.js
   Bot simple basado en palabras clave (sin IA real) + botón de WhatsApp.
   Ambos flotantes se elevan automáticamente para no solaparse con el footer. */
(function () {
  'use strict';

  var RESPONSES = [
    { topic: 'envios', keywords: ['envio', 'envío', 'envios', 'entrega', 'plazo', 'transporte', 'recogida'],
      text: 'Envío gratis en pedidos +€50. El resto de pedidos se entregan en 24/48h si se hacen antes de las 15h. También puedes recoger en tienda en Flassaders 9, Barcelona.' },
    { topic: 'horario', keywords: ['horario', 'hora', 'abierto', 'cerrado', 'abre', 'cierra'],
      text: 'Abrimos de lunes a sábado de 09:00 a 21:00h, y los domingos de 09:00 a 13:00h.' },
    { topic: 'devoluciones', keywords: ['devolu', 'cambio', 'reembolso', 'garantia', 'garantía'],
      text: 'Tienes 14 días desde la recepción del pedido para devoluciones, sin preguntas. Escríbenos por WhatsApp y te lo gestionamos.' },
    { topic: 'contacto', keywords: ['contacto', 'telefono', 'teléfono', 'email', 'correo', 'whatsapp', 'rafa'],
      text: 'Puedes hablar con Rafa Duarte por WhatsApp (botón verde abajo a la derecha) o visitarnos en Flassaders 9, 08003 Barcelona.' },
    { topic: 'pago', keywords: ['pago', 'pagar', 'tarjeta', 'bizum', 'paypal', 'precio', 'stripe'],
      text: 'Aceptamos Visa, Mastercard, Stripe, PayPal y Bizum. Todos los pagos son 100% seguros.' }
  ];
  var FALLBACK = 'No estoy seguro de poder ayudarte con eso. Prueba con una de las opciones rápidas, o escríbenos por WhatsApp y te respondemos enseguida 🐉';

  function findResponse(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < RESPONSES.length; i++) {
      var r = RESPONSES[i];
      for (var j = 0; j < r.keywords.length; j++) {
        if (lower.indexOf(r.keywords[j]) !== -1) return r.text;
      }
    }
    return FALLBACK;
  }
  function responseForTopic(topic) {
    var r = RESPONSES.find(function (x) { return x.topic === topic; });
    return r ? r.text : FALLBACK;
  }

  function addMessage(body, text, who) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + (who === 'user' ? 'chat-msg-user' : 'chat-msg-bot');
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function initChat() {
    var toggleBtn = document.getElementById('chat-toggle-btn');
    var panel = document.getElementById('chat-panel');
    var closeBtn = document.getElementById('chat-close-btn');
    var body = document.getElementById('chat-panel-body');
    var form = document.getElementById('chat-form');
    var input = document.getElementById('chat-input');
    var quickReplies = document.getElementById('chat-quick-replies');
    if (!toggleBtn || !panel) return;

    function open() {
      panel.hidden = false;
      panel.classList.remove('closing');
      requestAnimationFrame(function () { panel.classList.add('open'); });
      toggleBtn.setAttribute('aria-expanded', 'true');
      input?.focus();
    }
    function close() {
      panel.classList.remove('open');
      panel.classList.add('closing');
      toggleBtn.setAttribute('aria-expanded', 'false');
      setTimeout(function () {
        panel.hidden = true;
        panel.classList.remove('closing');
      }, 160);
    }

    toggleBtn.addEventListener('click', function () {
      panel.hidden ? open() : close();
    });
    closeBtn?.addEventListener('click', close);

    quickReplies?.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-topic]');
      if (!btn) return;
      addMessage(body, btn.textContent.trim(), 'user');
      addMessage(body, responseForTopic(btn.dataset.topic), 'bot');
    });

    form?.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      addMessage(body, text, 'user');
      addMessage(body, findResponse(text), 'bot');
      input.value = '';
    });
  }

  /* Mantiene los flotantes y el panel de chat siempre por encima del footer */
  function initFooterAvoidance() {
    var footer = document.querySelector('.site-footer');
    var floatWrap = document.getElementById('floating-actions');
    var chatPanel = document.getElementById('chat-panel');
    if (!footer || !floatWrap) return;

    var ticking = false;
    function update() {
      ticking = false;
      var rect = footer.getBoundingClientRect();
      var viewportH = window.innerHeight;
      var overlap = Math.max(0, viewportH - rect.top);
      var baseGap = window.innerWidth <= 600 ? 16 : 24;
      var bottom = baseGap + overlap;
      floatWrap.style.bottom = bottom + 'px';
      if (chatPanel) chatPanel.style.bottom = (bottom + 72) + 'px';
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function init() { initChat(); initFooterAvoidance(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
