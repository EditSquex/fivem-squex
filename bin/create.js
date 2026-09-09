#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
};

function log(color, symbol, message) {
    console.log(`${color}${symbol}${COLORS.reset} ${message}`);
}

function getTemplates(name) {
    return {
        'fxmanifest.lua': `fx_version 'cerulean'
game 'gta5'

author 'Squex'
description '${name}'
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
`,

        'client/client.lua': '',

        'server/server.lua': '',

        'shared/config.lua': `Config = {}
`,

        'html/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="container" style="display: none;">

    </div>

    <script src="script.js"></script>
</body>
</html>
`,

        'html/style.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    overflow: hidden;
}
`,

        'html/script.js': `window.addEventListener('message', function(event) {
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
        fetch(\`https://\${GetParentResourceName()}/close\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    }
});
`,

        'locales/tr.lua': `Locales = Locales or {}

Locales['tr'] = {

}
`,

        'locales/en.lua': `Locales = Locales or {}

Locales['en'] = {

}
`,
    };
}

function createResource(name, targetDir, initHere) {
    let resourcePath;
    let displayName;

    if (initHere) {
        resourcePath = targetDir;
        displayName = name;

        const existing = fs.readdirSync(resourcePath).filter(f => !f.startsWith('.'));
        if (existing.length > 0) {
            log(COLORS.red, '✖', 'Current directory is not empty.');
            process.exit(1);
        }
    } else {
        resourcePath = path.join(targetDir, name);
        displayName = name;

        if (fs.existsSync(resourcePath)) {
            log(COLORS.red, '✖', `"${name}" already exists in this directory.`);
            process.exit(1);
        }
    }

    console.log('');
    log(COLORS.cyan, '◆', `${COLORS.bold}Creating ${displayName}...${COLORS.reset}`);
    console.log('');

    const templates = getTemplates(displayName);

    for (const [filePath, content] of Object.entries(templates)) {
        const fullPath = path.join(resourcePath, filePath);
        const dir = path.dirname(fullPath);

        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, content, 'utf-8');

        log(COLORS.green, '  +', `${COLORS.dim}${filePath}${COLORS.reset}`);
    }

    console.log('');
    log(COLORS.green, '✔', `${COLORS.bold}${displayName}${COLORS.reset} created successfully.`);
    console.log('');
    if (!initHere) {
        log(COLORS.dim, ' ', `cd ${displayName}`);
    }
    log(COLORS.dim, ' ', `Add "ensure ${displayName}" to your server.cfg`);
    console.log('');
}

function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log('');
        console.log(`  ${COLORS.bold}fivem-squex${COLORS.reset} — FiveM resource scaffolding tool`);
        console.log('');
        console.log(`  ${COLORS.dim}Usage:${COLORS.reset}`);
        console.log(`    fivem-squex <resource-name>    Create in a new folder`);
        console.log(`    fivem-squex .                  Create in current folder`);
        console.log('');
        console.log(`  ${COLORS.dim}Examples:${COLORS.reset}`);
        console.log(`    fivem-squex my-garage`);
        console.log(`    fivem-squex police_job`);
        console.log(`    mkdir my-garage && cd my-garage && npx fivem-squex .`);
        console.log('');
        process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
        const pkg = require('../package.json');
        console.log(pkg.version);
        process.exit(0);
    }

    let name = args[0];

    if (!name) {
        name = await prompt(`${COLORS.cyan}◆${COLORS.reset} Resource name (or "." for current folder): `);
    }

    if (!name) {
        log(COLORS.red, '✖', 'Resource name is required.');
        process.exit(1);
    }

    if (name === '.') {
        const folderName = path.basename(process.cwd());
        createResource(folderName, process.cwd(), true);
    } else {
        if (!/^[a-z0-9][a-z0-9_-]*$/.test(name)) {
            log(COLORS.red, '✖', 'Name must be lowercase, start with a letter or number, and contain only a-z, 0-9, hyphens, or underscores.');
            process.exit(1);
        }
        createResource(name, process.cwd(), false);
    }
}

main();
