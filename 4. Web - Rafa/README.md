# 7 Dragons — Tienda de coleccionismo

Sitio estático (HTML + CSS + JS vanilla, sin build ni frameworks) para "7 Dragons", tienda de coleccionismo (TCG, figuras, manga, videojuegos). Incluye tienda pública, cuenta de cliente e intranet de administración, todo funcionando sin backend (persistencia en `localStorage`/`sessionStorage`).

## Estructura del proyecto

```
.
├── index.html              Tienda: home, hero, categorías, productos, carrito, footer
├── account.html             Cuenta de cliente: login / registro / "mis pedidos"
├── admin.html               Intranet: login + gestión de compras a proveedores
├── logo.png                 Logo de la marca
├── favicon.ico / apple-touch-icon.png
│
├── CSS/
│   ├── style.css             Estilos base del sitio público (paleta, header, hero,
│   │                         grid de productos, footer, carrito, chat/whatsapp flotantes)
│   ├── admin.css             Estilos de la intranet (login, dashboard, tablas, formularios)
│   └── account.css           Estilos de la página "Mi cuenta"
│
├── JS/
│   ├── main.js                Carrito de compra, slideshow, tabs de categorías, menú móvil,
│   │                          buscador, newsletter, header sticky
│   ├── chat-widget.js         Bot de ayuda (FAQ por palabras clave) + botón de WhatsApp
│   │                          flotantes; evita que se solapen con el footer
│   ├── admin.js               Login de la intranet + CRUD de compras (localStorage) + CSV
│   └── account.js             Login / registro de clientes (localStorage)
│
└── img/
    ├── logosmarcas/           Logos de marcas/franquicias (Pokémon, Dragon Ball, Magic...)
    └── Imagenfigurasportada/  Fotos de producto usadas en el mosaico del hero y en las
                                tarjetas de la categoría "Figuras"
```

## Páginas

### `index.html` — Tienda pública
- Hero con slideshow (Pokémon / Dragon Ball / Figuras) y mosaico de imágenes.
- Barra de confianza (stock, valoración, comunidad, torneos).
- Carrusel de marcas/categorías.
- Grid de productos con pestañas por categoría (Pokémon, Dragon Ball, Magic, Figuras).
- Carrito de compra en panel lateral (persistido en `localStorage`).
- Bot de ayuda y botón de WhatsApp flotantes (no se solapan con el footer).
- Footer con dirección, horario, contacto y enlace discreto a la intranet (`admin.html`).

### `account.html` — Cuenta de cliente
- Pestañas de inicio de sesión / registro.
- Datos de clientes guardados en `localStorage` (clave `7d_customers`); sesión en `sessionStorage`.
- Vista de "Mis pedidos" tras iniciar sesión (placeholder, sin pedidos reales todavía).

### `admin.html` — Intranet (gestión interna)
- Acceso protegido por contraseña simple (ver `JS/admin.js`, variable `ADMIN_PASSWORD`).
- Alta/edición/borrado de compras a proveedores: fecha, producto, categoría, proveedor,
  cantidad, coste unitario, notas.
- Estadísticas en vivo: gasto total, nº de compras, unidades compradas, categoría con más gasto.
- Filtro por texto/categoría y exportación a CSV.
- Datos guardados en `localStorage` (clave `7d_purchases`).

## Notas técnicas

- **Sin backend ni build step**: se puede abrir `index.html` directamente o servir la carpeta
  con cualquier servidor estático (`python -m http.server`, `npx serve`, etc.).
- **Persistencia**: todo el estado (carrito, cuentas de cliente, compras de la intranet) vive en
  el `localStorage` del navegador. No hay base de datos ni sincronización entre dispositivos.
- **Seguridad**: la contraseña de la intranet y el sistema de cuentas de cliente son demos
  funcionales pensadas para una intranet/tienda simple, **no** para producción con datos sensibles.
- **WhatsApp**: el número en los botones flotantes es un placeholder (`+34 600 00 00 00`) —
  sustituir por el número real en `index.html` y `account.html` (atributo `href` de
  `#whatsapp-btn`).
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
