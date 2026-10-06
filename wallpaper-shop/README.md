# Wallpaper shop

Een one-page shop voor luxe MacBook-wallpapers. Het is gewone HTML, CSS en JavaScript zonder build-stap, gehost op Netlify, net als de [shorts shop](../shorts-shop/README.md).

## Hoe bestellen werkt

Kopers zetten wallpapers (of de complete collectie) in hun winkelmand, vullen naam, e-mailadres en hun MacBook-model in en klikken op **Bestelling plaatsen**. De bestelling wordt opgeslagen door [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) en naar jou gemaild. Jij stuurt een betaalverzoek (bijvoorbeeld Tikkie of PayPal) en na betaling een downloadlink. Op de site zelf wordt niet betaald.

Bestellen werkt alleen op de live Netlify-site. Lokaal geopend geeft het formulier een foutmelding bij versturen.

## Online zetten (eenmalig)

Dit is hetzelfde stappenplan als bij de shorts shop, met één extra veld in stap 1, omdat er nu twee sites in deze repository staan.

1. Kies in Netlify **Add new project → Import an existing project → GitHub** en kies deze repository. Vul bij de build settings bij **Base directory** `wallpaper-shop` in. De rest komt uit [`netlify.toml`](netlify.toml), dus klik daarna op **Deploy**.
2. Zet onder **Project configuration → Forms** de **form detection** aan. Ga daarna naar **Deploys** en start een nieuwe deploy, zodat Netlify het bestelformulier vindt.
3. Voeg onder **Project configuration → Notifications → Emails and webhooks** een **form submission notification** per e-mail toe voor het formulier `order`, naar je eigen e-mailadres.
4. Optioneel: verander onder **Project configuration → General** de projectnaam voor een mooier adres, zoals `yaadi-wallpapers.netlify.app`.

Daarna gaat elke wijziging die in `main` wordt gemerged automatisch live.

Vergeet je de **Base directory** in stap 1, dan zet Netlify de shorts shop online in plaats van deze shop. Je kunt het achteraf aanpassen onder **Project configuration → Build & deploy → Build settings**, en daarna opnieuw deployen.

## Aanpassen

Alles staat in [`js/config.js`](js/config.js):

| Instelling | Wat het doet |
| --- | --- |
| `name`, `headline`, `tagline` | Naam van de winkel en de tekst bovenaan. |
| `currency`, `locale` | Valuta en getalnotatie, bijvoorbeeld `"EUR"`/`"nl-NL"` of `"GBP"`/`"en-GB"`. |
| `products[].price` | Prijs per wallpaper. |
| `products[].style`, `products[].colours` | Hoe de voorbeeldafbeelding getekend wordt zolang er geen eigen afbeelding is. |
| `products[].image` | Pad naar je eigen voorbeeldafbeelding; zie [`images/`](images/README.md). |
| `bundle` | Naam, prijs en tekst van de complete collectie. Zet op `null` om hem te verbergen. |
| `models` | De MacBook-modellen waaruit kopers kiezen in het bestelformulier. |
| `details`, `steps`, `faq` | De opsommingen en vragen op de pagina. |
| `contact` | Optionele links naar e-mail, WhatsApp en Instagram in de footer. |

## Lokaal bekijken

Open `index.html` in een browser, of start een kleine server:

```sh
cd wallpaper-shop && python3 -m http.server 8000
```
