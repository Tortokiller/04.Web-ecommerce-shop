/* 7 DRAGONS — Intranet admin.js
   Almacenamiento 100% local (localStorage). Sin backend.
   AVISO: la contraseña vive en este archivo en texto plano, por lo que
   esto NO es seguridad real, solo una valla simple para uso interno. */
(function () {
  'use strict';

  var ADMIN_PASSWORD = '1234';
  var SESSION_KEY = '7d_admin_session';
  var DATA_KEY = '7d_purchases';

  /* ---- LOGIN ---- */
  function isLoggedIn() {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch (_) { return false; }
  }
  function setLoggedIn() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) {}
  }
  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
    location.reload();
  }

  function initLogin() {
    var screen = document.getElementById('admin-login-screen');
    var app = document.getElementById('admin-app');
    var form = document.getElementById('admin-login-form');
    var pass = document.getElementById('admin-password');
    var error = document.getElementById('admin-login-error');

    function showApp() {
      screen.hidden = true;
      app.hidden = false;
      initDashboard();
    }

    if (isLoggedIn()) { showApp(); return; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (pass.value === ADMIN_PASSWORD) {
        setLoggedIn();
        showApp();
      } else {
        error.hidden = false;
        pass.value = '';
        pass.focus();
      }
    });

    document.getElementById('admin-logout')?.addEventListener('click', logout);

    document.getElementById('admin-pw-toggle')?.addEventListener('click', function () {
      var showing = pass.type === 'text';
      pass.type = showing ? 'password' : 'text';
      this.textContent = showing ? '👁' : '🙈';
    });
  }

  /* ---- DATA ---- */
  function loadPurchases() {
    try {
      var raw = localStorage.getItem(DATA_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }
  function savePurchases(list) {
    try { localStorage.setItem(DATA_KEY, JSON.stringify(list)); } catch (_) {}
  }
  function uid() { return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); }
  function fmtMoney(n) { return '€' + (Math.round(n * 100) / 100).toFixed(2).replace('.', ','); }
  function fmtDate(d) {
    if (!d) return '—';
    var parts = d.split('-');
    if (parts.length !== 3) return d;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  /* ---- DASHBOARD ---- */
  var dashboardInitialized = false;

  function initDashboard() {
    if (dashboardInitialized) { renderAll(); return; }
    dashboardInitialized = true;

    var purchases = loadPurchases();

    var formCard = document.getElementById('admin-form-card');
    var form = document.getElementById('admin-purchase-form');
    var formTitle = document.getElementById('admin-form-title');
    var idField = document.getElementById('purchase-id');
    var searchInput = document.getElementById('filter-search');
    var categoryFilter = document.getElementById('filter-category');

    function getFiltered() {
      var q = (searchInput.value || '').trim().toLowerCase();
      var cat = categoryFilter.value;
      return purchases
        .filter(function (p) {
          if (cat && p.category !== cat) return false;
          if (!q) return true;
          return (p.product + ' ' + p.supplier).toLowerCase().indexOf(q) !== -1;
        })
        .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    }

    function renderStats() {
      var total = 0, units = 0;
      var byCategory = {};
      purchases.forEach(function (p) {
        var sub = p.qty * p.cost;
        total += sub;
        units += p.qty;
        byCategory[p.category] = (byCategory[p.category] || 0) + sub;
      });
      var topCat = '—', topVal = -1;
      Object.keys(byCategory).forEach(function (c) {
        if (byCategory[c] > topVal) { topVal = byCategory[c]; topCat = c; }
      });
      document.getElementById('stat-total').textContent = fmtMoney(total);
      document.getElementById('stat-count').textContent = purchases.length;
      document.getElementById('stat-units').textContent = units;
      document.getElementById('stat-top-cat').textContent = topCat;
    }

    function renderTable() {
      var body = document.getElementById('admin-table-body');
      var emptyMsg = document.getElementById('admin-empty-msg');
      var rows = getFiltered();

      if (!rows.length) {
        body.innerHTML = '';
        emptyMsg.hidden = false;
        return;
      }
      emptyMsg.hidden = true;

      body.innerHTML = rows.map(function (p) {
        var sub = p.qty * p.cost;
        return '<tr>'
          + '<td>' + fmtDate(p.date) + '</td>'
          + '<td>' + escapeHtml(p.product) + (p.notes ? '<span class="admin-row-notes">' + escapeHtml(p.notes) + '</span>' : '') + '</td>'
          + '<td><span class="admin-cat-pill">' + escapeHtml(p.category) + '</span></td>'
          + '<td>' + escapeHtml(p.supplier || '—') + '</td>'
          + '<td>' + p.qty + '</td>'
          + '<td>' + fmtMoney(p.cost) + '</td>'
          + '<td class="admin-cell-strong">' + fmtMoney(sub) + '</td>'
          + '<td class="admin-row-actions">'
          + '<button type="button" class="admin-icon-btn" data-action="edit" data-id="' + p.id + '" aria-label="Editar">✎</button>'
          + '<button type="button" class="admin-icon-btn admin-icon-btn-danger" data-action="delete" data-id="' + p.id + '" aria-label="Eliminar">🗑</button>'
          + '</td>'
          + '</tr>';
      }).join('');

      body.querySelectorAll('[data-action="edit"]').forEach(function (btn) {
        btn.addEventListener('click', function () { openForm(btn.dataset.id); });
      });
      body.querySelectorAll('[data-action="delete"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('¿Eliminar esta compra?')) return;
          purchases = purchases.filter(function (p) { return p.id !== btn.dataset.id; });
          savePurchases(purchases);
          renderAll();
        });
      });
    }

    function escapeHtml(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function openForm(id) {
      var p = id ? purchases.find(function (x) { return x.id === id; }) : null;
      idField.value = p ? p.id : '';
      formTitle.textContent = p ? 'Editar compra' : 'Nueva compra';
      document.getElementById('f-date').value = p ? p.date : new Date().toISOString().slice(0, 10);
      document.getElementById('f-product').value = p ? p.product : '';
      document.getElementById('f-category').value = p ? p.category : 'Pokémon';
      document.getElementById('f-supplier').value = p ? p.supplier : '';
      document.getElementById('f-qty').value = p ? p.qty : 1;
      document.getElementById('f-cost').value = p ? p.cost : 0;
      document.getElementById('f-notes').value = p ? p.notes : '';
      formCard.hidden = false;
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('f-product').focus();
    }
    function closeForm() {
      formCard.hidden = true;
      form.reset();
    }

    function renderAll() {
      renderStats();
      renderTable();
    }

    document.getElementById('admin-new-btn').addEventListener('click', function () { openForm(null); });
    document.getElementById('admin-cancel-btn').addEventListener('click', closeForm);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = idField.value;
      var record = {
        id: id || uid(),
        date: document.getElementById('f-date').value,
        product: document.getElementById('f-product').value.trim(),
        category: document.getElementById('f-category').value,
        supplier: document.getElementById('f-supplier').value.trim(),
        qty: Math.max(1, parseInt(document.getElementById('f-qty').value, 10) || 1),
        cost: Math.max(0, parseFloat(document.getElementById('f-cost').value) || 0),
        notes: document.getElementById('f-notes').value.trim()
      };
      if (id) {
        purchases = purchases.map(function (p) { return p.id === id ? record : p; });
      } else {
        purchases.push(record);
      }
      savePurchases(purchases);
      closeForm();
      renderAll();
    });

    searchInput.addEventListener('input', renderTable);
    categoryFilter.addEventListener('change', renderTable);

    document.getElementById('admin-export-btn').addEventListener('click', function () {
      exportCsv(getFiltered());
    });

    renderAll();
  }

  function exportCsv(rows) {
    var header = ['Fecha', 'Producto', 'Categoria', 'Proveedor', 'Cantidad', 'CosteUnitario', 'Total', 'Notas'];
    var lines = [header.join(';')];
    rows.forEach(function (p) {
      var sub = (p.qty * p.cost).toFixed(2);
      lines.push([
        p.date, csvSafe(p.product), csvSafe(p.category), csvSafe(p.supplier),
        p.qty, p.cost.toFixed(2), sub, csvSafe(p.notes)
      ].join(';'));
    });
    var blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '7dragons-compras-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function csvSafe(s) {
    var v = String(s == null ? '' : s);
    return v.indexOf(';') !== -1 || v.indexOf('"') !== -1 ? '"' + v.replace(/"/g, '""') + '"' : v;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLogin);
  else initLogin();
})();
