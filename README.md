# PokeDESK
> In development

PokeDESK is a platform for Pokémon tabletop RPGs. Currently, it relies on hardcoded rules, but it continues to expand (evolving alongside our new requirements). Built using only vanilla web technologies.

## File Structure
```plaintext
.
├── 404.html
├── assets
│   └── icons
│       └── pokeball.svg
├── css
│   ├── components
│   │   ├── modals.css
│   │   ├── sidebar.css
│   │   └── user-profile.css
│   ├── global-styles.css
│   ├── layout.css
│   └── pages
│       ├── login.css
│       └── session.css
├── favicon.svg
├── firebase.json
├── index.html
├── js
│   ├── components
│   │   └── user-profile.js
│   ├── database
│   │   ├── auth-state.js
│   │   ├── database.js
│   │   └── firebase-config.js
│   ├── global-scripts.js
│   ├── pages
│   │   ├── home.js
│   │   └── session.js
│   ├── player
│   │   ├── player-inventory.js
│   │   ├── player-management.js
│   │   ├── player-modals.js
│   │   └── player-state.js
│   ├── pokemon
│   │   ├── pokemon-info.js
│   │   ├── pokemon-management.js
│   │   ├── pokemon-modals.js
│   │   ├── pokemon-render.js
│   │   └── pokemon-rules.js
│   └── service
│       ├── auth-service.js
│       ├── character-service.js
│       └── session-service.js
├── LICENSE
├── pages
│   ├── home.html
│   ├── login.html
│   └── session.html
└── README.md

14 directories, 36 files
```