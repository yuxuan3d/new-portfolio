import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(currentFile);
const defaultFrontendDir = path.resolve(scriptsDir, '..');

export function syncParticleEarth(frontendDir = defaultFrontendDir) {
  const rootDir = path.resolve(frontendDir, '..');
  const sourceDir = path.join(rootDir, 'ParticleEarth', 'dist');
  const targetDir = path.join(frontendDir, 'public', 'particle-earth');

  if (!fs.existsSync(sourceDir)) {
    console.error(`ParticleEarth dist folder was not found at ${sourceDir}`);
    process.exit(1);
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  console.log(`Synced ParticleEarth build into ${targetDir}`);
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFile === currentFile) {
  syncParticleEarth();
}
