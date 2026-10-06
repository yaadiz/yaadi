# Shorts shop

A one-page shop for selling Essentials Fear of God shorts (size M, Black and Dark Oatmeal). It's plain HTML, CSS and JavaScript with no build step and no backend.

## How ordering works

Buyers add pairs to their bag, choose tracked delivery or local collection, and fill in their details. When they press **Send order**, their email app (or WhatsApp) opens with the full order written out and addressed to you. You reply with payment details. No payment is taken on the site.

## Make it yours

Everything is set in [`js/config.js`](js/config.js):

| Setting | What it does |
| --- | --- |
| `contact.email` | **Required.** Where orders are sent. |
| `contact.whatsapp` | Optional. Adds a "Send order on WhatsApp" button (digits only, with country code). |
| `contact.instagram` | Optional. Shows your handle in the footer. |
| `currency`, `locale` | Currency and number format, e.g. `"GBP"`/`"en-GB"` or `"USD"`/`"en-US"`. |
| `products[].price` | Price of each pair. |
| `products[].stock` | Set to `0` when a pair sells and it shows as **Sold**. |
| `products[].condition` | e.g. "Brand new with tags" or "Worn twice". |
| `products[].image` | Path to a real photo; see [`images/`](images/README.md). |
| `delivery` | Shipping price, whether local collection is offered, and the notes shown. |
| `details`, `faq` | The bullet points and questions on the page. |

## Preview locally

Open `index.html` in a browser, or serve the folder:

```sh
cd shorts-shop && python3 -m http.server 8000
```

## Put it online

The repo includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that publishes this folder to GitHub Pages whenever `main` changes.

1. In the repo on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Merge to `main` (or run the workflow from the **Actions** tab).
3. The site goes live at `https://<your-username>.github.io/<repo-name>/`.

Any static host works too. For example, drag the `shorts-shop` folder onto [Netlify Drop](https://app.netlify.com/drop).
