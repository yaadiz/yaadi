// Shop settings. Edit this file to change prices, stock, contact details and copy.
// Everything on the page is built from these values, so you never need to touch the HTML.
window.SHOP = {
  name: "Yaadi",
  headline: "Essentials Fear of God shorts.",
  tagline: "Size M, in Black and Dark Oatmeal. Order here and I'll get back to you with payment details.",

  currency: "GBP",
  locale: "en-GB",

  // Orders are sent to you as a pre-filled email (and WhatsApp message, if you add a number).
  contact: {
    email: "you@example.com",
    whatsapp: "", // international format, digits only, e.g. "447700900123"
    instagram: "", // handle without the @
  },

  delivery: {
    shippingPrice: 4,
    shippingNote: "Tracked delivery, posted within 2 working days of payment.",
    collection: true,
    collectionNote: "Free local collection. We'll arrange a time after you order.",
  },

  // Set stock to 0 once a pair has sold and it will show as "Sold".
  // To use a real photo, drop it in the images/ folder and set image, e.g. "images/black.jpg".
  products: [
    {
      id: "black",
      name: "Essentials Shorts",
      colour: "Black",
      swatch: "#1e1e1e",
      size: "M",
      price: 50,
      stock: 1,
      condition: "Excellent condition",
      image: "",
    },
    {
      id: "dark-oatmeal",
      name: "Essentials Shorts",
      colour: "Dark Oatmeal",
      swatch: "#a0937f",
      size: "M",
      price: 50,
      stock: 1,
      condition: "Excellent condition",
      image: "",
    },
  ],

  details: [
    "Essentials by Fear of God",
    "Size M (men's)",
    "Relaxed fit with elastic drawstring waist",
    "Side pockets",
    "Measurements available on request",
  ],

  faq: [
    {
      q: "How do I pay?",
      a: "Add the shorts to your bag and send the order. I'll reply to confirm and send payment details (bank transfer or PayPal). Your pair is reserved once payment is in.",
    },
    {
      q: "How long does delivery take?",
      a: "Orders are posted within 2 working days of payment with tracking. Local collection is also available.",
    },
    {
      q: "Can I return them?",
      a: "As a private sale, returns aren't accepted, so please ask for measurements or extra photos before ordering.",
    },
    {
      q: "Can I see more photos?",
      a: "Yes. Get in touch and I'll send close-ups of the fabric, tags and logo.",
    },
  ],

  disclaimer: "Private resale. Not affiliated with or endorsed by Fear of God or Essentials.",
};
