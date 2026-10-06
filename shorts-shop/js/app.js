(function () {
  "use strict";

  const shop = window.SHOP;
  const money = new Intl.NumberFormat(shop.locale, { style: "currency", currency: shop.currency });
  const fmt = (n) => money.format(n);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => shop.products.find((p) => p.id === id);

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  // ---------- Product illustration (used until a real photo is added) ----------

  let svgCount = 0;

  function isDark(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.4;
  }

  function shortsSVG(colour, label) {
    const id = `shade-${++svgCount}`;
    const stitch = isDark(colour) ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.18)";
    const fold = isDark(colour) ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
    return `
      <svg class="shorts" viewBox="0 0 400 400" role="img" aria-label="${esc(label)}">
        <defs>
          <linearGradient id="${id}" x1="0" x2="1">
            <stop offset="0" stop-color="#000" stop-opacity=".22"/>
            <stop offset=".22" stop-color="#000" stop-opacity="0"/>
            <stop offset=".78" stop-color="#000" stop-opacity="0"/>
            <stop offset="1" stop-color="#000" stop-opacity=".22"/>
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="350" rx="140" ry="12" fill="#000" opacity=".08"/>
        <g>
          <path fill="${colour}" d="M100 98 H300 L326 318 Q327 326 319 327 L216 334 Q209 334 208 327 L200 205 L192 327 Q191 334 184 334 L81 327 Q73 326 74 318 Z"/>
          <path fill="url(#${id})" d="M100 98 H300 L326 318 Q327 326 319 327 L216 334 Q209 334 208 327 L200 205 L192 327 Q191 334 184 334 L81 327 Q73 326 74 318 Z"/>
          <path fill="${colour}" d="M100 66 Q100 60 106 60 H294 Q300 60 300 66 V98 H100 Z"/>
          <path fill="url(#${id})" d="M100 66 Q100 60 106 60 H294 Q300 60 300 66 V98 H100 Z"/>
        </g>
        <g fill="none" stroke="${stitch}" stroke-width="2" stroke-linecap="round">
          <path d="M100 98 H300"/>
          <path d="M104 92 H296" stroke-dasharray="3 5"/>
          <path d="M108 112 Q124 152 112 198"/>
          <path d="M292 112 Q276 152 288 198"/>
          <path d="M77 311 L190 319"/>
          <path d="M210 319 L323 311"/>
          <path d="M200 98 V205" stroke-dasharray="3 5"/>
        </g>
        <g fill="none" stroke="${fold}" stroke-width="6" stroke-linecap="round">
          <path d="M140 220 Q152 262 146 298"/>
          <path d="M262 226 Q250 262 256 296"/>
        </g>
        <g fill="none" stroke="${isDark(colour) ? "#d8d4cc" : "#f3efe7"}" stroke-width="3.5" stroke-linecap="round">
          <path d="M190 90 C188 122 178 140 183 174"/>
          <path d="M210 90 C212 122 222 140 217 174"/>
        </g>
        <g fill="${isDark(colour) ? "#bdb8ae" : "#e6e0d4"}">
          <rect x="179" y="172" width="8" height="16" rx="3"/>
          <rect x="213" y="172" width="8" height="16" rx="3"/>
          <circle cx="190" cy="86" r="3.5" fill="${stitch}"/>
          <circle cx="210" cy="86" r="3.5" fill="${stitch}"/>
        </g>
        <rect x="96" y="282" width="44" height="9" rx="3" fill="${stitch}"/>
      </svg>`;
  }

  function productMedia(p) {
    const label = `${p.name} in ${p.colour}`;
    if (!p.image) return shortsSVG(p.swatch, label);
    return `<img src="${esc(p.image)}" alt="${esc(label)}" loading="lazy" data-fallback="${esc(p.id)}">`;
  }

  // ---------- Static content ----------

  function renderStatic() {
    document.title = `${shop.name} | Essentials Fear of God Shorts`;
    $$("[data-bind]").forEach((el) => { el.textContent = shop[el.dataset.bind] || ""; });

    const prices = shop.products.map((p) => p.price);
    const min = Math.min(...prices);
    $("[data-hero-price]").textContent = min === Math.max(...prices) ? fmt(min) : `From ${fmt(min)}`;

    $("[data-hero-art]").innerHTML = shop.products
      .slice(0, 2)
      .map((p, i) => `<div class="hero-piece hero-piece-${i + 1}">${shortsSVG(p.swatch, "")}</div>`)
      .join("");

    $("[data-details]").innerHTML = shop.details.map((d) => `<li>${esc(d)}</li>`).join("");

    const d = shop.delivery;
    $("[data-delivery]").innerHTML = [
      `<li><strong>${fmt(d.shippingPrice)}</strong> &middot; ${esc(d.shippingNote)}</li>`,
      d.collection ? `<li><strong>Free</strong> &middot; ${esc(d.collectionNote)}</li>` : "",
    ].join("");

    $("[data-faq]").innerHTML = shop.faq
      .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
      .join("");

    const c = shop.contact;
    $("[data-contact]").innerHTML = [
      `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`,
      c.whatsapp ? `<a href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>` : "",
      c.instagram ? `<a href="https://instagram.com/${esc(c.instagram)}" target="_blank" rel="noopener">@${esc(c.instagram)}</a>` : "",
    ].join("");

    const emailLink = $("[data-contact-email]");
    emailLink.href = `mailto:${c.email}`;
    emailLink.textContent = c.email;

    $("[data-shipping-price]").textContent = fmt(d.shippingPrice);
    $("[data-collection-option]").hidden = !d.collection;
    $("[data-whatsapp-submit]").hidden = !c.whatsapp;
  }

  // ---------- Bag state ----------

  const BAG_KEY = "shorts-shop-bag";
  let bag = loadBag(); // { productId: quantity }

  function loadBag() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(BAG_KEY)) || {}; } catch (e) { /* storage unavailable */ }
    const clean = {};
    Object.entries(saved).forEach(([id, qty]) => {
      const p = byId(id);
      if (p && p.stock > 0) clean[id] = Math.min(qty, p.stock);
    });
    return clean;
  }

  function saveBag() {
    try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch (e) { /* storage unavailable */ }
  }

  function setQty(id, qty) {
    const p = byId(id);
    if (qty <= 0) delete bag[id];
    else bag[id] = Math.min(qty, p.stock);
    saveBag();
    render();
  }

  const bagLines = () => Object.entries(bag).map(([id, qty]) => ({ p: byId(id), qty }));
  const subtotal = () => bagLines().reduce((sum, l) => sum + l.p.price * l.qty, 0);
  const deliveryMethod = () => $("[data-checkout]").delivery.value;
  const deliveryCost = () => (deliveryMethod() === "shipping" && subtotal() > 0 ? shop.delivery.shippingPrice : 0);

  // ---------- Rendering ----------

  function renderProducts() {
    const grid = $("[data-products]");
    grid.innerHTML = shop.products.map((p) => {
      const inBag = bag[p.id] || 0;
      const sold = p.stock <= 0;
      const full = !sold && inBag >= p.stock;
      const badge = sold ? "Sold" : p.stock === 1 ? "Last one" : `${p.stock} left`;
      const button = sold
        ? `<button class="btn btn-block" type="button" disabled>Sold</button>`
        : full
          ? `<button class="btn btn-secondary btn-block" type="button" data-open-bag>In your bag &middot; View</button>`
          : `<button class="btn btn-primary btn-block" type="button" data-add="${esc(p.id)}">Add to bag</button>`;
      return `
        <article class="product${sold ? " is-sold" : ""}">
          <div class="product-media">
            ${productMedia(p)}
            <span class="badge${sold ? " badge-sold" : ""}">${badge}</span>
          </div>
          <div class="product-info">
            <div class="product-row">
              <h3>${esc(p.name)}</h3>
              <span class="price">${fmt(p.price)}</span>
            </div>
            <p class="product-meta">
              <span class="swatch" style="background:${esc(p.swatch)}"></span>${esc(p.colour)} &middot; Size ${esc(p.size)}
            </p>
            <p class="muted small">${esc(p.condition)}</p>
            ${button}
          </div>
        </article>`;
    }).join("");

    $$("img[data-fallback]", grid).forEach((img) => {
      img.addEventListener("error", () => {
        const p = byId(img.dataset.fallback);
        img.outerHTML = shortsSVG(p.swatch, `${p.name} in ${p.colour}`);
      }, { once: true });
    });

    const available = shop.products.filter((p) => p.stock > 0).length;
    $("[data-stock-summary]").textContent = available
      ? `${available} of ${shop.products.length} available`
      : "All sold. Thanks for looking!";
  }

  function renderBag() {
    const lines = bagLines();
    const count = lines.reduce((n, l) => n + l.qty, 0);
    $("[data-bag-count]").textContent = count;
    $("[data-bag-empty]").hidden = count > 0;
    $("[data-checkout]").hidden = count === 0;

    $("[data-bag-items]").innerHTML = lines.map(({ p, qty }) => `
      <div class="bag-line">
        <div class="bag-thumb">${shortsSVG(p.swatch, "")}</div>
        <div class="bag-line-info">
          <strong>${esc(p.name)}</strong>
          <span class="muted small">${esc(p.colour)} &middot; Size ${esc(p.size)}</span>
          ${p.stock > 1 ? `
            <span class="qty">
              <button type="button" aria-label="Decrease quantity" data-qty="${esc(p.id)}" data-step="-1">&minus;</button>
              <span>${qty}</span>
              <button type="button" aria-label="Increase quantity" data-qty="${esc(p.id)}" data-step="1" ${qty >= p.stock ? "disabled" : ""}>+</button>
            </span>` : ""}
        </div>
        <div class="bag-line-end">
          <span>${fmt(p.price * qty)}</span>
          <button class="link-btn" type="button" data-remove="${esc(p.id)}">Remove</button>
        </div>
      </div>`).join("");

    const shipping = deliveryMethod() === "shipping";
    $("[data-subtotal]").textContent = fmt(subtotal());
    $("[data-delivery-cost]").textContent = shipping ? fmt(deliveryCost()) : "Free";
    $("[data-total]").textContent = fmt(subtotal() + deliveryCost());

    const address = $("[data-address-field]");
    address.hidden = !shipping;
    address.querySelector("textarea").required = shipping;
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
      const focusable = $$("button, a[href], input, textarea", drawer).filter((el) => !el.disabled && el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-close-bag]");
    if (!t) return;
    if (t.matches("[data-add]")) { setQty(t.dataset.add, (bag[t.dataset.add] || 0) + 1); openBag(); }
    else if (t.matches("[data-open-bag]")) openBag();
    else if (t.matches("[data-close-bag]")) closeBag();
    else if (t.matches("[data-remove]")) setQty(t.dataset.remove, 0);
    else if (t.matches("[data-qty]")) setQty(t.dataset.qty, (bag[t.dataset.qty] || 0) + Number(t.dataset.step));
    else if (t.matches("[data-finish]")) {
      bag = {};
      saveBag();
      $("[data-checkout]").reset();
      showView("items");
      render();
      closeBag();
    }
  });

  // ---------- Checkout ----------

  const form = $("[data-checkout]");
  form.addEventListener("change", (e) => { if (e.target.name === "delivery") renderBag(); });

  function orderMessage(data) {
    const shipping = data.delivery === "shipping";
    const lines = bagLines().map(({ p, qty }) =>
      `- ${p.name}, ${p.colour}, size ${p.size} x${qty}: ${fmt(p.price * qty)}`);
    return [
      `New order from the ${shop.name} shop`,
      "",
      ...lines,
      "",
      `Subtotal: ${fmt(subtotal())}`,
      `Delivery (${shipping ? "tracked delivery" : "local collection"}): ${shipping ? fmt(deliveryCost()) : "Free"}`,
      `Total: ${fmt(subtotal() + deliveryCost())}`,
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      shipping ? `Address:\n${data.address}` : null,
      data.note ? `Note: ${data.note}` : null,
    ].filter((line) => line !== null).join("\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const error = $("[data-form-error]");
    const invalid = $$("input, textarea", form).find((el) => !el.closest("[hidden]") && !el.checkValidity());
    if (invalid) {
      error.textContent = invalid.type === "email" && invalid.value
        ? "Please enter a valid email address."
        : "Please fill in the highlighted fields.";
      form.classList.add("show-errors");
      invalid.focus();
      return;
    }
    error.textContent = "";
    form.classList.remove("show-errors");

    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach((k) => { data[k] = String(data[k]).trim(); });
    const message = orderMessage(data);
    const via = e.submitter && e.submitter.value === "whatsapp" ? "whatsapp" : "email";

    if (via === "whatsapp") {
      window.open(`https://wa.me/${shop.contact.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    } else {
      const subject = `Order: ${bagLines().map(({ p }) => `${p.name} (${p.colour}, ${p.size})`).join(", ")}`;
      window.location.href = `mailto:${shop.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.replace(/\n/g, "\r\n"))}`;
    }
    showView("done");
    $("[data-finish]").focus();
  });

  renderStatic();
  render();
})();
