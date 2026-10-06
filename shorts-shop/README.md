# Shorts shop

A one-page shop for selling Essentials Fear of God shorts (size M, Black and Dark Oatmeal). It's plain HTML, CSS and JavaScript with no build step, hosted on Netlify.

## How ordering works

Buyers add pairs to their bag, choose tracked delivery or local collection, fill in their details and press **Place order**. The order is saved by [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) and emailed to you. You reply with payment details. No payment is taken on the site.

Ordering only works on the live Netlify site. Opened locally, the form shows an error when submitted.

## Put it online (one-time setup)

1. In Netlify, choose **Add new project → Import an existing project → GitHub** and pick this repository. The settings come from `netlify.toml`, so just press **Deploy**.
2. Under **Project configuration → Forms**, turn on **form detection**. Then go to **Deploys** and trigger a new deploy so Netlify finds the order form.
3. Under **Project configuration → Notifications → Emails and webhooks**, add a **form submission notification** by email for the `order` form, sent to your email address.
4. Optional: under **Project configuration → General**, change the project name to get a nicer address such as `yaadi-shorts.netlify.app`.

After that, every change merged to `main` goes live automatically.

## Make it yours

Everything is set in [`js/config.js`](js/config.js):

| Setting | What it does |
| --- | --- |
| `currency`, `locale` | Currency and number format, e.g. `"EUR"`/`"nl-NL"` or `"GBP"`/`"en-GB"`. |
| `products[].price` | Price of each pair. |
| `products[].stock` | Set to `0` when a pair sells and it shows as **Sold**. |
| `products[].condition` | e.g. "Brand new with tags" or "Worn twice". |
| `products[].image` | Path to a real photo; see [`images/`](images/README.md). |
| `delivery` | Shipping price, whether local collection is offered, and the notes shown. |
| `details`, `faq` | The bullet points and questions on the page. |
| `contact` | Optional email, WhatsApp and Instagram links in the footer. |

## Preview locally

Open `index.html` in a browser, or serve the folder:

```sh
cd shorts-shop && python3 -m http.server 8000
```
