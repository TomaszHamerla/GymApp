const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const now = new Date();

// date
let buildDate;
try {
  buildDate = new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Warsaw'
  }).format(now);
} catch (e) {
  buildDate = now.toISOString().replace('T', ' ').substring(0, 19);
}

//commit hash
let gitCommit = process.env.COMMIT_SHA || '';
if (!gitCommit) {
  try {
    gitCommit = execSync('git rev-parse --short HEAD', {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString().trim();
  } catch (e) {
    gitCommit = '';
  }
} else if (gitCommit.length > 7) {
  gitCommit = gitCommit.substring(0, 7);
}

const buildInfo = {
  buildDate,
  buildTimestamp: now.getTime(),
  gitCommit: gitCommit || ''
};

const targetDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetPath = path.join(targetDir, 'build-info.ts');

const content = `// Plik generowany automatycznie przed budowaniem aplikacji
export const buildInfo = ${JSON.stringify(buildInfo, null, 2)};
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log(`[build-info] Wygenerowano informacje o buildzie: ${buildDate}${gitCommit ? ` (${gitCommit})` : ''}`);
