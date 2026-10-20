# PokeDesk

A platform for **Pokémon tabletop RPGs**: character sheets, categorized
inventory, Pokémon management and a Game Master dashboard.

Built with plain **HTML, CSS and ES modules**, plus **Firebase** for
authentication, realtime data and hosting. No frameworks, no build step.

## Running

Pages reference assets from the project root (`/css/...`, `/js/...`), so serve
the folder instead of opening the files directly:

```bash
http-server -p 3000 -c-1
```

Open <http://127.0.0.1:3000>. Firebase is configured in
`js/database/firebase-config.js`.

## Structure

```plaintext
assets/   icons and the Departure Mono font
css/      design tokens, layout, components, page styles
js/       database, services, player, Pokémon and page scripts
pages/    login, home, session, game master
```

## Conventions

- A single local typeface: `assets/fonts/DepartureMonoNerdFont-Regular.otf`.
- Colors, spacing, borders and typography are tokens in
  `css/global-styles.css`; the rest of the CSS only consumes them.
- Dashed borders mark content blocks; filled controls mark inputs, selects
  and buttons.
- Shared Pokémon UI (HP/XP bars, tiles, attacks) lives in
  `js/pokemon/pokemon-render.js` and `css/components/modals.css`.

## License

GPLv3 — see [LICENSE](LICENSE).