# 7 Dragons — Tienda de coleccionismo

Sitio estático (HTML + CSS + JS vanilla, sin build ni frameworks) para "7 Dragons", tienda de coleccionismo (TCG, figuras, manga, videojuegos). Incluye tienda pública, páginas de contenido, cuenta de cliente e intranet de administración, todo funcionando sin backend (persistencia en `localStorage`/`sessionStorage`).

## Estructura del proyecto

```
├── index.html                Tienda: home, hero, categorías, productos, carrito, footer
├── logo.png                  Logo de la marca
├── favicon.ico / apple-touch-icon.png
│
├── admin/
│   └── admin.html             Intranet: login + gestión de compras a proveedores
│                               (usa CSS/admin.css y JS/admin.js de la raíz)
│
├── pages/                      Resto de páginas, separadas de la tienda principal
│   ├── account.html            Cuenta de cliente: login / registro / "mis pedidos"
│   ├── contacto.html           Contacto, con modal de email (EmailJS)
│   ├── como-comprar.html       Guía de compra paso a paso
│   ├── ayuda-y-devoluciones.html  Envíos, horario y proceso de devolución
│   ├── preguntas-frecuentes.html  FAQ con acordeón
│   ├── aviso-legal.html        Aviso legal
│   ├── privacidad.html         Política de privacidad
│   ├── cookies.html            Política de cookies
│   └── terminos-y-condiciones.html  Términos y condiciones de venta
│
├── CSS/
│   ├── style.css              Estilos base del sitio público (paleta, header, hero,
│   │                          grid de productos, footer, carrito, chat/whatsapp flotantes)
│   ├── admin.css              Estilos de la intranet (login, dashboard, tablas, formularios)
│   ├── account.css            Estilos de la página "Mi cuenta"
│   └── pages.css              Estilos compartidos por las páginas de `pages/` (artículo,
│                              FAQ, modal de contacto)
│
├── JS/
│   ├── main.js                Carrito de compra, slideshow, tabs de categorías, menú móvil,
│   │                          buscador, newsletter; mueve los botones flotantes al abrir el
│   │                          carrito o el menú móvil para que no queden tapados
│   ├── chat-widget.js         Bot de ayuda (FAQ por palabras clave) + botón de WhatsApp
│   │                          flotantes, con animación al abrir/cerrar el chat; evita que
│   │                          ambos se solapen con el footer al hacer scroll
│   ├── admin.js               Login de la intranet + CRUD de compras (localStorage) + CSV
│   ├── account.js             Login / registro de clientes (localStorage)
│   ├── faq.js                 Acordeón de preguntas frecuentes
│   └── contact-form.js        Modal de contacto + envío con EmailJS
│
└── img/
    ├── logosmarcas/            Logos de marcas/franquicias (Pokémon, Dragon Ball, Magic...)
    └── Imagenfigurasportada/   Fotos de producto usadas en el mosaico del hero y en las
                                 tarjetas de la categoría "Figuras"
```

`index.html` es el único punto de entrada en la raíz; `admin/` aísla la intranet del resto del
sitio y `pages/` agrupa todas las páginas secundarias (cuenta, legales, ayuda). Los recursos
compartidos (`CSS/`, `JS/`, `img/`, logo, favicon) se mantienen en la raíz y se referencian con
rutas relativas (`../`) desde `admin/` y `pages/`.

## Páginas

### `index.html` — Tienda pública
- Hero con slideshow (Pokémon / Dragon Ball / Figuras) y mosaico de imágenes.
- Barra de confianza (stock, valoración, comunidad, torneos).
- Carrusel de marcas/categorías.
- Grid de productos con pestañas por categoría (Pokémon, Dragon Ball, Magic, Figuras).
- Carrito de compra en panel lateral (persistido en `localStorage`).
- Header siempre visible al hacer scroll (no se oculta).
- Bot de ayuda y botón de WhatsApp flotantes: no se solapan con el footer, ni con el carrito
  o el menú móvil cuando están abiertos.
- Footer con dirección, horario, contacto y enlace discreto a la intranet (`admin/`).

### `admin/admin.html` — Intranet (gestión interna)
- Acceso protegido por contraseña simple (ver `JS/admin.js`, variable `ADMIN_PASSWORD`).
- Alta/edición/borrado de compras a proveedores: fecha, producto, categoría, proveedor,
  cantidad, coste unitario, notas.
- Estadísticas en vivo: gasto total, nº de compras, unidades compradas, categoría con más gasto.
- Filtro por texto/categoría y exportación a CSV.
- Datos guardados en `localStorage` (clave `7d_purchases`).

### `pages/account.html` — Cuenta de cliente
- Pestañas de inicio de sesión / registro.
- Datos de clientes guardados en `localStorage` (clave `7d_customers`); sesión en `sessionStorage`.
- Vista de "Mis pedidos" tras iniciar sesión (placeholder, sin pedidos reales todavía).

### `pages/contacto.html` — Contacto
- Botón que abre un modal con un formulario (nombre, email, asunto, mensaje).
- El envío usa el SDK de [EmailJS](https://www.emailjs.com/) — **pendiente de configurar**:
  sustituye `TU_PUBLIC_KEY`, `TU_SERVICE_ID` y `TU_TEMPLATE_ID` en `JS/contact-form.js` por los
  valores de tu cuenta. Hasta entonces, el formulario muestra un aviso amistoso en vez de
  intentar enviar el email.

### `pages/preguntas-frecuentes.html` — FAQ
- Acordeón simple (`JS/faq.js`), una pregunta abierta a la vez.

### `pages/aviso-legal.html`, `privacidad.html`, `cookies.html`, `terminos-y-condiciones.html`
- Plantillas orientativas con los datos de la tienda (Rafa Duarte, Flassaders 9, Barcelona).
  **Revísalas con un/a profesional del derecho antes de publicarlas.**

## Notas técnicas

- **Sin backend ni build step**: se puede abrir `index.html` directamente o servir la carpeta
  con cualquier servidor estático (`python -m http.server`, `npx serve`, etc.).
- **Persistencia**: todo el estado (carrito, cuentas de cliente, compras de la intranet) vive en
  el `localStorage` del navegador. No hay base de datos ni sincronización entre dispositivos.
- **Seguridad**: la contraseña de la intranet y el sistema de cuentas de cliente son demos
  funcionales pensadas para una intranet/tienda simple, **no** para producción con datos sensibles.
- **WhatsApp**: el número en los botones flotantes es un placeholder (`+34 600 00 00 00`) —
  sustituir por el número real en todos los archivos que incluyen el widget flotante
  (atributo `href` de `#whatsapp-btn`).
- **EmailJS**: el formulario de contacto necesita las claves de tu cuenta de EmailJS — ver
  `JS/contact-form.js`.
- **Imágenes de producto**: las fotos de Pokémon/Dragon Ball/Magic son los logos oficiales de
  cada franquicia sobre una tarjeta de marca; las fotos de "Figuras" son fotografías reales
  ubicadas en `img/Imagenfigurasportada/`. Sustituir por fotografía propia de producto antes de
  vender de verdad.

## Paleta de colores

Definida en `CSS/style.css` (`:root`):

| Variable        | Uso                                  |
|-----------------|---------------------------------------|
| `--crimson`     | Rojo suave de acento (botones, precios, links activos) |
| `--slate-deep` / `--slate-dark` / `--slate` | Fondos oscuros (de más a menos oscuro) |
| `--white` / `--text` | Texto claro principal |
| `--muted`       | Texto secundario |
