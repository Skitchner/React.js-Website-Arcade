// scripts/generateGameList.js
const fs = require('fs');
const path = require('path');

// Function to capitalize the first letter of a string
const capitalize = (s) => s.toUpperCase();

const srcPath = path.join(__dirname, '../src');
const gameFolders = fs.readdirSync(srcPath)
  .filter(file => {
    const fullPath = path.join(srcPath, file);
    return fs.statSync(fullPath).isDirectory() && !['components', 'utils', 'Home'].includes(file);
  })
  .map(capitalize); // Auto capitalize the folder names

const gameListContent = `// This file is generated automatically. Do not edit.\nexport default ${JSON.stringify(gameFolders)};`;

fs.writeFileSync(path.join(srcPath, 'gameList.js'), gameListContent);
