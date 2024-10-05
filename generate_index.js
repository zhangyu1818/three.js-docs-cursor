const fs = require('fs');
const path = require('path');

function generateHtmlIndex(projectPath) {
  const htmlContent = generateHtmlContent(projectPath);
  fs.writeFileSync(path.join(projectPath, 'index.html'), htmlContent);
}

function generateHtmlContent(dir, level = 0) {
  let content = '';
  if (level === 0) {
    content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Docs</title>
</head>
<body>
    <div>
        <h1>Three.js Docs</h1>
`;
  }

  const files = fs.readdirSync(dir);
  content += '<ul>\n';

  files.forEach(file => {
    if (file === '.git' || file === 'README.md' || file === path.basename(__filename)) {
      return;
    }

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.relative('.', filePath).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      content += `<li><h${level + 2}>${file}</h${level + 2}>\n`;
      content += generateHtmlContent(filePath, level + 1);
      content += '</li>\n';
    } else if (path.extname(file) === '.html' && !file.startsWith('index')) {
      const fileName = path.parse(file).name;
      content += `<li><a href="${relativePath}">${fileName}</a></li>\n`;
    }
  });

  content += '</ul>\n';

  if (level === 0) {
    content += `
    </div>
</body>
</html>
`;
  }

  return content;
}

generateHtmlIndex('./');