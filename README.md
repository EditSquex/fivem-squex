# fivem-squex

FiveM resource scaffolding CLI tool. Create a fully structured FiveM resource in one command.

## Quick Start

```bash
npx fivem-squex my-script
```

Or scaffold inside the current directory:

```bash
mkdir my-script
cd my-script
npx fivem-squex .
```

## Install Globally

```bash
npm install -g fivem-squex
```

Then use it anywhere:

```bash
fivem-squex my-garage
```

## What It Creates

```
my-script/
├── fxmanifest.lua
├── client/
│   └── client.lua
├── server/
│   └── server.lua
├── shared/
│   └── config.lua
├── html/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── locales/
    ├── tr.lua
    └── en.lua
```

| File | Purpose |
|------|---------|
| `fxmanifest.lua` | Resource manifest and configuration |
| `client/client.lua` | Client-side scripts |
| `server/server.lua` | Server-side scripts |
| `shared/config.lua` | Shared configuration |
| `html/` | NUI interface (HTML/CSS/JS) |
| `locales/` | Language files (TR, EN) |

## Usage

Create a new resource in a subfolder:

```bash
fivem-squex police_job
```

Create inside current folder:

```bash
fivem-squex .
```

Interactive mode:

```bash
fivem-squex
```

## Naming Rules

- Lowercase only
- Hyphens and underscores allowed
- Must start with a letter or number

## License

MIT
