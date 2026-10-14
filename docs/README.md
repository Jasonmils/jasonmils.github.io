# Jason Ding — Interview Portfolio

Live website: https://jasonmils.github.io/

A bilingual interview portfolio with three experience overviews, four featured projects and four research deep dives.

The perspective switch offers the existing experience view and an AI technology view with eight areas, each connecting a problem, contribution and evidence to the shared project deep dives. The selected perspective is remembered; direct experience and technology links reveal the appropriate view.

## Language links

- English: https://jasonmils.github.io/EN (also `/EN/`)
- Chinese: https://jasonmils.github.io/CN (also `/CN/`)

An explicit language path overrides the browser's saved preference. The root URL uses the saved preference, defaulting to Chinese. Language buttons update the path while preserving the query and section anchor; browser back/forward restores the language.

`EN/index.html` and `CN/index.html` are static entry shells that share all content, scripts and assets with the root page. When changing the root HTML shell, keep these two shells in sync (their base is `../`). `language.js` selects the initial language and keeps shared assets and section links working across paths.

## Publication

GitHub Pages publishes only the `/docs` directory of the `master` branch. `.nojekyll` serves this site as static files. The complete previous academic website is archived separately in `../legacy/` and is not part of the Pages output. The public URL remains https://jasonmils.github.io/.

## Editing

- `content.js`: Chinese and English content
- `styles.css`: layout and appearance
- `app.js`: navigation, language switching and project panels
- `assets/`: bundled fonts, licenses and institution logos

No installation, API, external asset service or runtime build is required. The portfolio includes a professional email address and Google Scholar link, with no phone number or CV download.
