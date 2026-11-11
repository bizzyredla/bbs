# brandonibarra.com

Static site deployed by Netlify from the `main` branch.

- `/insperity/` — Insperity benchmark landing page (`insperity/index.html`)
- `/covalent/` — Covalent partner platform concept: marketing site (`covalent/index.html`), clickable product prototype (`covalent/app.html`) and the product and backend blueprint (`covalent/BLUEPRINT.md`)
- `/` redirects to `/insperity/`

The earlier rabbit and renewal pages are on the `claude/gallant-babbage-m7o1qd` branch.

## Running locally

No build step. Serve the repository root and open a page:

```
python3 -m http.server 8000
# http://localhost:8000/covalent/
```
