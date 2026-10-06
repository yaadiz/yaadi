// Shop settings. Edit this file to change prices, wallpapers, contact details and copy.
// Everything on the page is built from these values, so you never need to touch the HTML.
window.SHOP = {
  name: "Yaadi Studio",
  headline: "Luxe wallpapers voor je MacBook.",
  tagline: "Marmer, zijde, fluweel en goud. Rustige, rijke achtergronden in de exacte resolutie van jouw scherm.",

  currency: "EUR",
  locale: "nl-NL",

  // Orders arrive through Netlify Forms (see README). These are optional links shown in the footer.
  contact: {
    email: "", // e.g. "jij@voorbeeld.nl"
    whatsapp: "", // international format, digits only, e.g. "31612345678"
    instagram: "", // handle without the @
  },

  // Each wallpaper is drawn on the page from its style and colours until you add a real preview image.
  // Styles: "marble", "silk", "deco", "dunes", "aurora", "velvet".
  // To use your own preview, drop it in the images/ folder and set image, e.g. "images/noir-marble.jpg".
  products: [
    {
      id: "noir-marble",
      name: "Noir Marble",
      style: "marble",
      colours: ["#0b0b0d", "#1c1b1f", "#c9a86a"],
      price: 4,
      description: "Zwart marmer met dunne gouden aders.",
      image: "",
    },
    {
      id: "champagne-silk",
      name: "Champagne Silk",
      style: "silk",
      colours: ["#3a2c1d", "#c9a979", "#f6e7c8"],
      price: 4,
      description: "Zachte plooien in warm champagnegoud.",
      image: "",
    },
    {
      id: "midnight-deco",
      name: "Midnight Deco",
      style: "deco",
      colours: ["#070b18", "#15203d", "#d4b36f"],
      price: 4,
      description: "Art-deco zonnewaaier in goud op nachtblauw.",
      image: "",
    },
    {
      id: "rose-dune",
      name: "Rosé Dune",
      style: "dunes",
      colours: ["#f4d9cf", "#c98a7f", "#5e2f33"],
      price: 4,
      description: "Glooiende duinen bij zonsondergang.",
      image: "",
    },
    {
      id: "onyx-aurora",
      name: "Onyx Aurora",
      style: "aurora",
      colours: ["#050507", "#5b3fa8", "#2fa59a"],
      price: 4,
      description: "Diep zwart met een zacht noorderlicht.",
      image: "",
    },
    {
      id: "emerald-velvet",
      name: "Emerald Velvet",
      style: "velvet",
      colours: ["#02140f", "#0d4a37", "#7fc9a4"],
      price: 4,
      description: "Smaragdgroen fluweel met een zachte glans.",
      image: "",
    },
  ],

  // Everything above in one purchase. Set to null to hide it.
  bundle: {
    id: "complete-collectie",
    name: "De complete collectie",
    price: 15,
    description: "Alle zes wallpapers in één keer, voor elke MacBook die je hebt.",
  },

  // Shown as options in the order form so you know which resolution to send.
  models: [
    "MacBook Air 13 inch",
    "MacBook Air 15 inch",
    "MacBook Pro 14 inch",
    "MacBook Pro 16 inch",
    "Weet ik niet, stuur alles",
  ],

  details: [
    "Geleverd als PNG in de resolutie van jouw MacBook, tot 3456 × 2234 pixels",
    "Gemaakt voor MacBook Air 13 en 15 inch en MacBook Pro 14 en 16 inch",
    "Rustig ontwerp: je bureaubladiconen en menubalk blijven goed leesbaar",
    "Voor persoonlijk gebruik op al je eigen apparaten",
  ],

  steps: [
    "Kies je wallpapers en plaats je bestelling. Je betaalt nog niets.",
    "Je krijgt binnen 24 uur een betaalverzoek per e-mail (iDEAL via Tikkie of PayPal).",
    "Na betaling ontvang je een downloadlink met de bestanden voor jouw MacBook.",
  ],

  faq: [
    {
      q: "Hoe stel ik een wallpaper in?",
      a: "Open Systeeminstellingen, kies Achtergrond en klik op Voeg map of album toe. Kies de gedownloade afbeelding en je bent klaar.",
    },
    {
      q: "Hoe snel krijg ik de bestanden?",
      a: "Je ontvangt binnen 24 uur een betaalverzoek. Zodra je betaald hebt, sturen we dezelfde dag de downloadlink.",
    },
    {
      q: "Werkt het ook op een externe monitor?",
      a: "Ja. Laat in je bestelling weten welke monitor je hebt, dan sturen we er een versie in die resolutie bij.",
    },
    {
      q: "Kan ik mijn geld terugkrijgen?",
      a: "Omdat het om digitale bestanden gaat, is retourneren na het downloaden niet mogelijk. Twijfel je? Stuur een bericht en we mailen je eerst een voorbeeld.",
    },
  ],

  disclaimer: "MacBook is een handelsmerk van Apple Inc. Deze winkel is niet verbonden aan Apple.",
};
