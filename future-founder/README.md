# Future Founder landing page

CalHacks recruiting campaign page for Savvy's **Technical Staff — Future Founder** role.
Open `index.html` directly in a browser (no build step).

Built on the tokens from the *Builders @ Savvy — Dark* Figma frame (`QJAJaS7qru79fTrIq73NHt`, node `5173:208`):
`#171615` page, green-glow + dot-grid hero, white→ecru 5px primary button, mint `#6AE9B8` tags,
white article cards, light `#FCFBF9` CTA band and the black footer sheet with a 20px top radius.

## Fonts

ABC Diatype and Big Caslon are licensed, so they are **not committed** (`assets/fonts/` is git-ignored).
Drop these files into `future-founder/assets/fonts/` to render with the real type:

- `ABCDiatype-Light.otf`, `ABCDiatype-Regular.otf`, `ABCDiatype-Medium.otf`
- `BigCaslon-Regular.otf`, `BigCaslon-Bold.otf`

Without them the page falls back to Inter + Georgia. JetBrains Mono (terminal accents) and Caveat (whiteboard notes) load from Google Fonts.

## Assets

- `assets/img/hero-glow.jpg`: hero glow exported from Figma, pre-composited at the frame's opacity over `#171615`
- `assets/img/module-*.png`: line-art from the Figma "Read about how we build" grid (1× exports)
- `assets/img/nyc-*.jpg`: Savvy brand photography
- `assets/img/laura.png`: recruiter avatar from the Figma CTA

## To swap before launch

- Team polaroids show monograms. Add a real photo inside each `.portrait`, e.g. `<img src="assets/img/team-ritik.jpg" alt="Ritik Malhotra">`
- Footer links point at savvywealth.com root/about/careers. Replace them with the real paths.
