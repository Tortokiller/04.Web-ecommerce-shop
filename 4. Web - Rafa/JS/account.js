/* 7 DRAGONS — account.js
   Cuentas de cliente 100% locales (localStorage). Sin backend real:
   pensado como demo funcional, no como sistema de autenticación seguro. */
(function () {
  'use strict';

  var USERS_KEY = '7d_customers';
  var SESSION_KEY = '7d_customer_session';

  function loadUsers() {
    try { var raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : []; }
    catch (_) { return []; }
  }
  function saveUsers(list) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (_) {}
  }
  function encode(pw) { return btoa(unescape(encodeURIComponent(pw))); }

  function setSession(email) { try { sessionStorage.setItem(SESSION_KEY, email); } catch (_) {} }
  function getSession() { try { return sessionStorage.getItem(SESSION_KEY); } catch (_) { return null; } }
  function clearSession() { try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {} }

  function showError(el, msg) { el.textContent = msg; el.hidden = false; }
  function hideError(el) { el.hidden = true; }

  function initTabs() {
    var tabLogin = document.getElementById('tab-login');
    var tabRegister = document.getElementById('tab-register');
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');

    tabLogin.addEventListener('click', function () {
      tabLogin.classList.add('active'); tabRegister.classList.remove('active');
      loginForm.hidden = false; registerForm.hidden = true;
    });
    tabRegister.addEventListener('click', function () {
      tabRegister.classList.add('active'); tabLogin.classList.remove('active');
      registerForm.hidden = false; loginForm.hidden = true;
    });
  }

  function showDashboard(user) {
    document.getElementById('account-auth').hidden = true;
    var dash = document.getElementById('account-dashboard');
    dash.hidden = false;
    document.getElementById('account-name').textContent = user.name;
    document.getElementById('account-email-display').textContent = user.email;
  }

  function initAuth() {
    var users = loadUsers();
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');
    var loginError = document.getElementById('login-error');
    var registerError = document.getElementById('register-error');

    var sessionEmail = getSession();
    if (sessionEmail) {
      var existing = users.find(function (u) { return u.email === sessionEmail; });
      if (existing) { showDashboard(existing); return; }
      clearSession();
    }

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError(loginError);
      var email = document.getElementById('login-email').value.trim().toLowerCase();
      var pw = document.getElementById('login-password').value;
      var user = users.find(function (u) { return u.email === email; });
      if (!user || user.password !== encode(pw)) {
        showError(loginError, 'Email o contraseña incorrectos.');
        return;
      }
      setSession(user.email);
      showDashboard(user);
    });

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError(registerError);
      var name = document.getElementById('register-name').value.trim();
      var email = document.getElementById('register-email').value.trim().toLowerCase();
      var pw = document.getElementById('register-password').value;
      var pw2 = document.getElementById('register-password2').value;

      if (!name || !email) { showError(registerError, 'Rellena todos los campos.'); return; }
      if (pw.length < 4) { showError(registerError, 'La contraseña debe tener al menos 4 caracteres.'); return; }
      if (pw !== pw2) { showError(registerError, 'Las contraseñas no coinciden.'); return; }
      if (users.some(function (u) { return u.email === email; })) {
        showError(registerError, 'Ya existe una cuenta con ese email.');
        return;
      }

      var user = { name: name, email: email, password: encode(pw) };
      users.push(user);
      saveUsers(users);
      setSession(user.email);
      showDashboard(user);
    });

    document.getElementById('account-logout')?.addEventListener('click', function () {
      clearSession();
      location.reload();
    });
  }

  function init() { initTabs(); initAuth(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
