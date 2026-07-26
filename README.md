# PokeDESK
> In development

PokeDESK is a platform for Pokémon tabletop RPGs. Currently, it relies on hardcoded rules, but it continues to expand (evolving alongside our new requirements). Built using only vanilla web technologies.

## File Structure
```plaintext
.
├── assets
│   └── icons
│       └── pokeball.svg
├── css
│   ├── components
│   │   ├── modals.css
│   │   └── sidebar.css
│   ├── global-styles.css
│   ├── layout.css
│   └── pages
│       ├── login.css
│       └── session.css
├── favicon.svg
├── index.html
├── js
│   ├── database
│   │   ├── auth-service.js
│   │   ├── auth-state.js
│   │   ├── character-service.js
│   │   ├── database.js
│   │   ├── firebase-config.js
│   │   └── session-service.js
│   ├── global-scripts.js
│   ├── pages
│   │   └── session.js
│   ├── player
│   │   ├── player-inventory.js
│   │   ├── player-management.js
│   │   ├── player-modals.js
│   │   └── player-state.js
│   └── pokemon
│       ├── pokemon-info.js
│       ├── pokemon-management.js
│       ├── pokemon-modals.js
│       ├── pokemon-render.js
│       └── pokemon-rules.js
├── LICENSE
├── pages
│   ├── home.html
│   ├── login.html
│   └── session.html
└── README.md

12 directories, 31 files
```