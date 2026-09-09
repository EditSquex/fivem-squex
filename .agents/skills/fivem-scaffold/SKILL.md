---
name: fivem-scaffold
description: >-
  Use this skill when the user asks to create a new FiveM script/resource.
  It scaffolds the full FiveM resource directory structure including
  fxmanifest.lua, client/, server/, shared/, html/ (NUI), and locales/ folders
  with boilerplate files and a README.md. Activate when the user says things like
  "yeni script oluştur", "resource kur", "FiveM scaffold", or "script iskeleti".
---

# FiveM Script Scaffold Skill

This skill automatically scaffolds a full FiveM resource structure.

## Workflow

1. **Ask for script name**: Get the script/resource name from the user. Name should be lowercase with hyphens or underscores (e.g. `my-garage`, `police_job`).

2. **Create the following structure** under workspace root (`c:\Users\Squex\Downloads\fivem-squex\[script_name]\`):

```
[script_name]/
├── README.md
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

3. **File contents** — Create each file with the templates below. **DO NOT add any comments anywhere in any file. No `--`, no `//`, no `/* */`, no `<!-- -->` comments. Zero comments.**

### README.md
````markdown
# [script_name]

A FiveM resource for [brief description based on script name].

## Features

- Feature 1
- Feature 2

## Installation

1. Download or clone this repository
2. Place the `[script_name]` folder into your server's `resources` directory
3. Add `ensure [script_name]` to your `server.cfg`
4. Restart your server

## Configuration

Edit `shared/config.lua` to customize settings.

## Dependencies

- None

## License

MIT License
````
> Replace `[brief description based on script name]` with an appropriate short description inferred from the script name.

### fxmanifest.lua
```lua
fx_version 'cerulean'
game 'gta5'

author 'Squex'
description '[script_name]'
version '1.0.0'

shared_scripts {
    'shared/*.lua',
}

client_scripts {
    'client/*.lua',
}

server_scripts {
    'server/*.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'locales/*.lua',
}
```

### client/client.lua
```lua

```
> Completely empty file. No comments.

### server/server.lua
```lua

```
> Completely empty file. No comments.

### shared/config.lua
```lua
Config = {}
```

### html/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[script_name]</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="container" style="display: none;">

    </div>

    <script src="script.js"></script>
</body>
</html>
```

### html/style.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    overflow: hidden;
}
```

### html/script.js
```javascript
window.addEventListener('message', function(event) {
    const data = event.data;

    if (data.action === 'open') {
        document.getElementById('container').style.display = 'block';
    }

    if (data.action === 'close') {
        document.getElementById('container').style.display = 'none';
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.getElementById('container').style.display = 'none';
        fetch(`https://${GetParentResourceName()}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
});
```

### locales/tr.lua
```lua
Locales = Locales or {}

Locales['tr'] = {

}
```

### locales/en.lua
```lua
Locales = Locales or {}

Locales['en'] = {

}
```

4. **CRITICAL RULES**:
   - **ZERO comments** in any generated file. No `--`, `//`, `/* */`, or `<!-- -->`. The code must look hand-written.
   - **Everything in English** — all file contents, README, variable names.
   - **README.md is mandatory** — always generate it with proper structure.

5. **After completion**, show the user the created structure as confirmation.
