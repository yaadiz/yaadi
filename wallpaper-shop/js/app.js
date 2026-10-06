(function () {
  "use strict";

  const shop = window.SHOP;
  const bundle = shop.bundle || null;
  const money = new Intl.NumberFormat(shop.locale, { style: "currency", currency: shop.currency });
  const fmt = (n) => money.format(n);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => (bundle && bundle.id === id ? bundle : shop.products.find((p) => p.id === id));
  const singlesTotal = shop.products.reduce((sum, p) => sum + p.price, 0);

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  // ---------- Wallpaper artwork (used until a real preview image is added) ----------

  const W = 1540;
  const H = 1000; // MacBook screens are close to 1.54:1
  let svgCount = 0;

  function rgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function mix(a, b, t) {
    const [x, y] = [rgb(a), rgb(b)];
    return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
  }

  // Small seeded random so every wallpaper looks the same on every visit.
  function seeded(seed) {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  // Blur region covers the whole canvas, so soft edges are never clipped to the shape's own box.
  const blur = (id, sd) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="-300" y="-300" width="${W + 600}" height="${H + 600}"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

  const styles = {
    marble([base, mid, gold], id) {
      const veins = [
        "M-50 900 C 250 760, 420 640, 640 560 S 1050 380, 1250 250 S 1500 90, 1600 40",
        "M640 560 C 760 600, 900 580, 1040 640 S 1300 760, 1600 720",
        "M-50 420 C 160 380, 300 300, 420 180 S 600 -20, 700 -50",
        "M300 1050 C 520 900, 700 860, 900 820 S 1200 700, 1360 760",
      ];
      const fine = [
        "M1040 640 C 1100 720, 1150 820, 1180 1050",
        "M420 180 C 520 210, 600 170, 720 200 S 900 160, 1000 220",
        "M1250 250 C 1330 300, 1420 280, 1600 330",
        "M-50 650 C 120 640, 220 600, 300 660 S 460 700, 560 640",
        "M900 820 C 960 900, 1080 930, 1200 1050",
      ];
      const paths = (list) => list.map((d) => `<path d="${d}"/>`).join("");
      return `
        <defs>
          <radialGradient id="${id}-bg" cx="22%" cy="18%" r="100%">
            <stop offset="0" stop-color="${mix(mid, "#ffffff", 0.05)}"/>
            <stop offset=".55" stop-color="${mid}"/>
            <stop offset="1" stop-color="${base}"/>
          </radialGradient>
          <filter id="${id}-cloud" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.0018 0.0042" numOctaves="5" seed="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.4 0 0 0 -0.62"/>
          </filter>
          <filter id="${id}-warp" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.007" numOctaves="4" seed="8" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="130" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          ${blur(`${id}-glow`, 7)}
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
        <rect width="${W}" height="${H}" opacity=".45" filter="url(#${id}-cloud)"/>
        <g filter="url(#${id}-warp)" fill="none" stroke-linecap="round">
          <g filter="url(#${id}-glow)" stroke="${gold}" stroke-width="9" opacity=".45">${paths(veins)}</g>
          <g stroke="${gold}" stroke-width="3.2">${paths(veins)}</g>
          <g stroke="${mix(gold, "#ffffff", 0.35)}" stroke-width="1.4" opacity=".75">${paths(fine)}</g>
        </g>`;
    },

    silk([dark, mid, light], id) {
      const edge = (y, a, b, c) =>
        `M-200 ${y} C 200 ${y - a}, 560 ${y + b}, 900 ${y - c} S 1500 ${y - a - 60}, 1760 ${y - 40}`;
      const fold = (y, a, b, c) => `${edge(y, a, b, c)} V 1300 H -200 Z`;
      return `
        <defs>
          <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${light}"/>
            <stop offset=".5" stop-color="${mid}"/>
            <stop offset="1" stop-color="${dark}"/>
          </linearGradient>
          <linearGradient id="${id}-lit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${light}" stop-opacity=".95"/>
            <stop offset=".35" stop-color="${mid}" stop-opacity=".55"/>
            <stop offset="1" stop-color="${dark}" stop-opacity=".9"/>
          </linearGradient>
          <linearGradient id="${id}-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${dark}" stop-opacity=".85"/>
            <stop offset=".4" stop-color="${dark}" stop-opacity="0"/>
          </linearGradient>
          ${blur(`${id}-soft`, 26)}
          ${blur(`${id}-sheen`, 9)}
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
        <g filter="url(#${id}-soft)">
          <path d="${fold(190, 140, 260, 60)}" fill="url(#${id}-shade)"/>
          <path d="${fold(240, 140, 260, 60)}" fill="url(#${id}-lit)"/>
          <path d="${fold(470, 120, 300, 110)}" fill="url(#${id}-shade)"/>
          <path d="${fold(525, 120, 300, 110)}" fill="url(#${id}-lit)"/>
          <path d="${fold(760, 160, 220, 40)}" fill="url(#${id}-shade)"/>
          <path d="${fold(815, 160, 220, 40)}" fill="url(#${id}-lit)"/>
        </g>
        <g filter="url(#${id}-sheen)" fill="none" stroke="#ffffff" stroke-linecap="round">
          <path d="${edge(275, 140, 260, 60)}" stroke-width="10" opacity=".35"/>
          <path d="${edge(560, 120, 300, 110)}" stroke-width="8" opacity=".28"/>
          <path d="${edge(850, 160, 220, 40)}" stroke-width="7" opacity=".22"/>
        </g>`;
    },

    deco([deep, navy, gold], id) {
      const cx = W / 2;
      const cy = 690;
      const arcs = Array.from({ length: 11 }, (_, k) => {
        const r = 170 + k * 64;
        return `<path d="M${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" opacity="${(0.8 - k * 0.06).toFixed(2)}"/>`;
      }).join("");
      const rays = Array.from({ length: 23 }, (_, k) => {
        const a = Math.PI + ((k + 1) * Math.PI) / 24;
        const [r1, r2] = [170, 1200];
        return `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}"/>`;
      }).join("");
      const steps = Array.from({ length: 8 }, (_, k) =>
        `<line x1="0" x2="${W}" y1="${cy + 26 + k * 22 + k * k * 3}" y2="${cy + 26 + k * 22 + k * k * 3}" opacity="${(0.5 - k * 0.055).toFixed(2)}"/>`
      ).join("");
      return `
        <defs>
          <radialGradient id="${id}-bg" cx="50%" cy="68%" r="75%">
            <stop offset="0" stop-color="${navy}"/>
            <stop offset="1" stop-color="${deep}"/>
          </radialGradient>
          <radialGradient id="${id}-sun" cx="50%" cy="100%" r="100%">
            <stop offset="0" stop-color="${mix(gold, "#ffffff", 0.35)}"/>
            <stop offset="1" stop-color="${mix(gold, deep, 0.25)}"/>
          </radialGradient>
          <radialGradient id="${id}-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="${gold}" stop-opacity=".16"/>
            <stop offset="1" stop-color="${gold}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
        <ellipse cx="${cx}" cy="${cy}" rx="560" ry="420" fill="url(#${id}-glow)"/>
        <g stroke="${gold}" stroke-width="1.2" opacity=".28">${rays}</g>
        <g fill="none" stroke="${gold}" stroke-width="2">${arcs}</g>
        <path d="M${cx - 130} ${cy} A 130 130 0 0 1 ${cx + 130} ${cy} Z" fill="url(#${id}-sun)"/>
        <rect y="${cy}" width="${W}" height="${H - cy}" fill="${deep}" opacity=".88"/>
        <line x1="0" x2="${W}" y1="${cy}" y2="${cy}" stroke="${gold}" stroke-width="2.5"/>
        <g stroke="${gold}" stroke-width="1.4">${steps}</g>`;
    },

    dunes([light, mid, dark], id) {
      const layers = [
        "M0 560 C 260 470, 560 500, 860 455 S 1360 400, 1540 470 V 1000 H 0 Z",
        "M0 690 C 240 600, 520 620, 820 660 S 1300 560, 1540 610 V 1000 H 0 Z",
        "M0 820 C 300 730, 700 770, 1000 725 S 1400 770, 1540 750 V 1000 H 0 Z",
        "M0 935 C 380 850, 780 905, 1100 870 S 1450 905, 1540 890 V 1000 H 0 Z",
      ];
      const fills = layers.map((_, i) => {
        const base = mix(mid, dark, (i / (layers.length - 1)) * 0.9);
        return `
          <linearGradient id="${id}-d${i}" x1="0" y1="0" x2="1" y2=".35">
            <stop offset="0" stop-color="${mix(base, light, 0.28)}"/>
            <stop offset="1" stop-color="${base}"/>
          </linearGradient>`;
      }).join("");
      return `
        <defs>
          <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${mix(light, mid, 0.35)}"/>
            <stop offset=".6" stop-color="${mix(light, "#ffffff", 0.35)}"/>
          </linearGradient>
          <radialGradient id="${id}-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
            <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          ${fills}
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
        <circle cx="1080" cy="330" r="300" fill="url(#${id}-glow)"/>
        <circle cx="1080" cy="330" r="92" fill="${mix(light, "#ffffff", 0.75)}"/>
        ${layers.map((d, i) => `<path d="${d}" fill="url(#${id}-d${i})"/>`).join("")}`;
    },

    aurora([night, violet, teal], id) {
      const rand = seeded(42);
      const stars = Array.from({ length: 90 }, () =>
        `<circle cx="${(rand() * W).toFixed(0)}" cy="${(rand() * H * 0.8).toFixed(0)}" r="${(0.6 + rand() * 1.4).toFixed(1)}" opacity="${(0.15 + rand() * 0.6).toFixed(2)}"/>`
      ).join("");
      return `
        <defs>
          <linearGradient id="${id}-ribbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="${violet}"/>
            <stop offset=".55" stop-color="${teal}"/>
            <stop offset="1" stop-color="${violet}"/>
          </linearGradient>
          <linearGradient id="${id}-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${night}" stop-opacity="0"/>
            <stop offset="1" stop-color="${night}"/>
          </linearGradient>
          ${blur(`${id}-haze`, 90)}
          ${blur(`${id}-band`, 34)}
          ${blur(`${id}-core`, 7)}
        </defs>
        <rect width="${W}" height="${H}" fill="${night}"/>
        <g fill="#ffffff">${stars}</g>
        <g filter="url(#${id}-haze)">
          <ellipse cx="480" cy="330" rx="540" ry="170" fill="${violet}" opacity=".6" transform="rotate(-12 480 330)"/>
          <ellipse cx="1080" cy="450" rx="500" ry="150" fill="${teal}" opacity=".5" transform="rotate(-16 1080 450)"/>
          <ellipse cx="780" cy="700" rx="640" ry="110" fill="${violet}" opacity=".25"/>
        </g>
        <g fill="none" stroke="url(#${id}-ribbon)" stroke-linecap="round">
          <path filter="url(#${id}-band)" d="M-100 560 C 250 300, 520 520, 820 380 S 1300 160, 1660 300" stroke-width="110" opacity=".45"/>
          <path filter="url(#${id}-core)" d="M-100 560 C 250 300, 520 520, 820 380 S 1300 160, 1660 300" stroke-width="5" opacity=".8"/>
        </g>
        <rect y="${H * 0.55}" width="${W}" height="${H * 0.45}" fill="url(#${id}-floor)"/>`;
    },

    velvet([deep, mid, light], id) {
      return `
        <defs>
          <radialGradient id="${id}-bg" cx="30%" cy="22%" r="105%">
            <stop offset="0" stop-color="${mid}"/>
            <stop offset=".7" stop-color="${mix(mid, deep, 0.7)}"/>
            <stop offset="1" stop-color="${deep}"/>
          </radialGradient>
          ${blur(`${id}-fold`, 48)}
          ${blur(`${id}-sheen`, 16)}
        </defs>
        <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
        <g filter="url(#${id}-fold)" fill="none" stroke-linecap="round">
          <path d="M-100 260 C 300 60, 700 520, 1700 120" stroke="${deep}" stroke-width="170" opacity=".55"/>
          <path d="M-100 380 C 320 180, 720 640, 1700 240" stroke="${light}" stroke-width="120" opacity=".22"/>
          <path d="M-100 640 C 380 420, 820 900, 1700 520" stroke="${deep}" stroke-width="200" opacity=".6"/>
          <path d="M-100 780 C 400 560, 860 1040, 1700 660" stroke="${light}" stroke-width="130" opacity=".16"/>
        </g>
        <g filter="url(#${id}-sheen)" fill="none" stroke="${mix(light, "#ffffff", 0.4)}" stroke-linecap="round">
          <path d="M-100 380 C 320 180, 720 640, 1700 240" stroke-width="16" opacity=".3"/>
          <path d="M-100 780 C 400 560, 860 1040, 1700 660" stroke-width="12" opacity=".2"/>
        </g>`;
    },
  };

  function wallSVG(p, label) {
    const id = `w${++svgCount}`;
    const draw = styles[p.style] || styles.velvet;
    const a11y = label ? `role="img" aria-label="${esc(label)}"` : `aria-hidden="true" focusable="false"`;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" ${a11y}>${draw(p.colours, id)}</svg>`;
  }

  // A wallpaper tile: the real preview image if one is set, otherwise the drawn version.
  function wall(p, label = "") {
    const art = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(label)}" loading="lazy" data-fallback="${esc(p.id)}">`
      : wallSVG(p, label);
    return `<div class="wall">${art}</div>`;
  }

  // Swap in the drawn version for any preview image that fails to load.
  function watchImages(root) {
    $$("img[data-fallback]", root).forEach((img) => {
      img.addEventListener("error", () => {
        img.outerHTML = wallSVG(byId(img.dataset.fallback), img.alt);
      }, { once: true });
    });
  }

  // ---------- Static content ----------

  function renderStatic() {
    document.title = `${shop.name} | Luxe MacBook wallpapers`;
    $$("[data-bind]").forEach((el) => { el.textContent = shop[el.dataset.bind] || ""; });

    const min = Math.min(...shop.products.map((p) => p.price));
    $("[data-hero-price]").textContent = `Vanaf ${fmt(min)}`;
    $("[data-collection-summary]").textContent = `${shop.products.length} wallpapers · vanaf ${fmt(min)}`;

    $("[data-steps]").innerHTML = shop.steps.map((s) => `<li>${esc(s)}</li>`).join("");
    $("[data-details]").innerHTML = shop.details.map((d) => `<li>${esc(d)}</li>`).join("");
    $("[data-faq]").innerHTML = shop.faq
      .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
      .join("");

    $("[data-models]").insertAdjacentHTML("beforeend",
      shop.models.map((m) => `<option>${esc(m)}</option>`).join(""));

    const c = shop.contact;
    $("[data-contact]").innerHTML = [
      c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : "",
      c.whatsapp ? `<a href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>` : "",
      c.instagram ? `<a href="https://instagram.com/${esc(c.instagram)}" target="_blank" rel="noopener">@${esc(c.instagram)}</a>` : "",
    ].join("");
  }

  // ---------- Hero slideshow ----------

  function renderHero() {
    const screen = $("[data-hero-screen]");
    const caption = $("[data-hero-caption]");
    screen.innerHTML = shop.products
      .map((p, i) => `<div class="hero-slide${i === 0 ? " active" : ""}">${wall(p, p.name)}</div>`)
      .join("");
    watchImages(screen);
    caption.innerHTML = `
      <span data-hero-name></span>
      <span class="dots">${shop.products.map((p, i) =>
        `<button type="button" aria-label="Toon ${esc(p.name)}" data-slide="${i}"></button>`).join("")}</span>`;

    let current = 0;
    let timer = null;
    const show = (i) => {
      current = i;
      $$(".hero-slide", screen).forEach((s, k) => s.classList.toggle("active", k === i));
      $$("[data-slide]", caption).forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
      $("[data-hero-name]", caption).textContent = shop.products[i].name;
    };
    const start = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clearInterval(timer);
      timer = setInterval(() => show((current + 1) % shop.products.length), 4500);
    };

    caption.addEventListener("click", (e) => {
      const b = e.target.closest("[data-slide]");
      if (b) { show(Number(b.dataset.slide)); start(); }
    });
    show(0);
    start();
  }

  // ---------- Bag state ----------

  const BAG_KEY = "wallpaper-shop-bag";
  let bag = loadBag(); // list of ids; each wallpaper is bought at most once

  function loadBag() {
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch (e) { /* storage unavailable */ }
    const ids = Array.isArray(saved) ? saved.filter((id, i) => byId(id) && saved.indexOf(id) === i) : [];
    return bundle && ids.includes(bundle.id) ? [bundle.id] : ids;
  }

  function saveBag() {
    try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch (e) { /* storage unavailable */ }
  }

  const hasBundle = () => Boolean(bundle) && bag.includes(bundle.id);

  function add(id) {
    // The collection already contains every single wallpaper, so it replaces them.
    if (bundle && id === bundle.id) bag = [bundle.id];
    else if (!hasBundle() && !bag.includes(id)) bag.push(id);
    saveBag();
    render();
  }

  function remove(id) {
    bag = bag.filter((x) => x !== id);
    saveBag();
    render();
  }

  const total = () => bag.reduce((sum, id) => sum + byId(id).price, 0);

  // ---------- Rendering ----------

  function addButton(p) {
    if (hasBundle() && p !== bundle) {
      return `<button class="btn btn-block" type="button" disabled>Zit in de collectie</button>`;
    }
    if (bag.includes(p.id)) {
      return `<button class="btn btn-secondary btn-block" type="button" data-open-bag>In je winkelmand &middot; Bekijk</button>`;
    }
    return `<button class="btn btn-primary btn-block" type="button" data-add="${esc(p.id)}">Toevoegen</button>`;
  }

  function renderProducts() {
    const grid = $("[data-products]");
    grid.innerHTML = shop.products.map((p) => `
      <article class="product">
        <div class="product-media">${wall(p, `Wallpaper ${p.name}`)}</div>
        <div class="product-info">
          <div class="product-row">
            <h3>${esc(p.name)}</h3>
            <span class="price">${fmt(p.price)}</span>
          </div>
          <p class="muted small">${esc(p.description)}</p>
          ${addButton(p)}
        </div>
      </article>`).join("");
    watchImages(grid);

    const slot = $("[data-bundle]");
    if (!bundle) { slot.innerHTML = ""; return; }
    const saving = singlesTotal - bundle.price;
    slot.innerHTML = `
      <article class="bundle">
        <div class="bundle-mosaic">${shop.products.slice(0, 6).map((p) => wall(p)).join("")}</div>
        <div class="bundle-info">
          <p class="eyebrow">Meest gekozen</p>
          <h3>${esc(bundle.name)}</h3>
          <p class="muted">${esc(bundle.description)}</p>
          <p class="bundle-price">
            <span class="price">${fmt(bundle.price)}</span>
            ${saving > 0 ? `<span class="was">Los ${fmt(singlesTotal)}</span><span class="save">Je bespaart ${fmt(saving)}</span>` : ""}
          </p>
          ${addButton(bundle)}
        </div>
      </article>`;
    watchImages(slot);
  }

  function renderBag() {
    $("[data-bag-count]").textContent = bag.length;
    $("[data-bag-empty]").hidden = bag.length > 0;
    $("[data-checkout]").hidden = bag.length === 0;

    const lines = bag.map((id) => {
      const p = byId(id);
      const thumb = p === bundle
        ? `<div class="bag-thumb bag-thumb-stack">${shop.products.slice(0, 3).map((x) => wall(x)).join("")}</div>`
        : `<div class="bag-thumb">${wall(p)}</div>`;
      return `
        <div class="bag-line">
          ${thumb}
          <div class="bag-line-info">
            <strong>${esc(p.name)}</strong>
            <span class="muted small">${p === bundle ? `${shop.products.length} wallpapers` : "Wallpaper"}</span>
          </div>
          <div class="bag-line-end">
            <span>${fmt(p.price)}</span>
            <button class="link-btn" type="button" data-remove="${esc(p.id)}">Verwijder</button>
          </div>
        </div>`;
    });

    // Point buyers at the collection once their picks cost as much as it does.
    if (bundle && !hasBundle() && total() >= bundle.price) {
      lines.push(`
        <div class="bag-tip">
          <p><strong>Tip:</strong> de complete collectie kost ${fmt(bundle.price)} en bevat alle ${shop.products.length} wallpapers.</p>
          <button class="btn btn-secondary btn-block" type="button" data-add="${esc(bundle.id)}">Wissel naar de collectie</button>
        </div>`);
    }

    const items = $("[data-bag-items]");
    items.innerHTML = lines.join("");
    watchImages(items);
    $("[data-total]").textContent = fmt(total());
  }

  function render() {
    renderProducts();
    renderBag();
  }

  // ---------- Bag drawer ----------

  const drawer = $("#bag");
  const scrim = $(".scrim");
  let lastFocus = null;

  function openBag() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    scrim.hidden = false;
    document.body.classList.add("no-scroll");
    $("[data-open-bag].bag-button").setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      drawer.classList.add("open");
      scrim.classList.add("open");
      $(".icon-btn", drawer).focus();
    });
  }

  function closeBag() {
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    document.body.classList.remove("no-scroll");
    $("[data-open-bag].bag-button").setAttribute("aria-expanded", "false");
    setTimeout(() => { drawer.hidden = true; scrim.hidden = true; }, 250);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function showView(name) {
    $$("[data-bag-view]").forEach((v) => { v.hidden = v.dataset.bagView !== name; });
  }

  document.addEventListener("keydown", (e) => {
    if (drawer.hidden) return;
    if (e.key === "Escape") closeBag();
    if (e.key === "Tab") {
      const focusable = $$("button, a[href], input, select, textarea", drawer).filter((el) => !el.disabled && el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-close-bag]");
    if (!t) return;
    if (t.matches("[data-add]")) { add(t.dataset.add); if (drawer.hidden) openBag(); }
    else if (t.matches("[data-open-bag]")) openBag();
    else if (t.matches("[data-close-bag]")) closeBag();
    else if (t.matches("[data-remove]")) remove(t.dataset.remove);
    else if (t.matches("[data-finish]")) {
      bag = [];
      saveBag();
      $("[data-checkout]").reset();
      showView("items");
      render();
      closeBag();
    }
  });

  // ---------- Checkout ----------

  const form = $("[data-checkout]");

  // Clear the error as soon as the highlighted fields are filled in.
  form.addEventListener("input", () => {
    if (form.classList.contains("show-errors") && form.checkValidity()) {
      form.classList.remove("show-errors");
      $("[data-form-error]").textContent = "";
    }
  });

  // Sent with the form so the order shows up in full in Netlify and in your notification email.
  function orderSummary() {
    return bag.map((id) => {
      const p = byId(id);
      const contents = p === bundle ? ` (${shop.products.map((x) => x.name).join(", ")})` : "";
      return `${p.name}${contents}: ${fmt(p.price)}`;
    }).join("\n");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const error = $("[data-form-error]");
    const invalid = $$("input, select, textarea", form).find((el) => !el.closest("[hidden]") && !el.checkValidity());
    if (invalid) {
      error.textContent = invalid.type === "email" && invalid.value
        ? "Vul een geldig e-mailadres in."
        : "Vul de gemarkeerde velden in.";
      form.classList.add("show-errors");
      invalid.focus();
      return;
    }
    error.textContent = "";
    form.classList.remove("show-errors");

    form.elements.order.value = orderSummary();
    form.elements.total.value = fmt(total());

    const button = $("[data-submit]");
    button.disabled = true;
    button.textContent = "Versturen…";
    try {
      // Netlify Forms picks up the submission; see README for setup.
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showView("done");
      $("[data-finish]").focus();
    } catch (err) {
      error.textContent = "Je bestelling kon niet worden verstuurd. Controleer je verbinding en probeer het opnieuw.";
    } finally {
      button.disabled = false;
      button.textContent = "Bestelling plaatsen";
    }
  });

  renderStatic();
  renderHero();
  render();
})();
