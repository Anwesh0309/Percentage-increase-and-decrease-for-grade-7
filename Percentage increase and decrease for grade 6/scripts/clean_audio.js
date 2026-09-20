/**
 * Deletes every .mp3 in public/assets/audio that is no longer referenced by src/utils/audioMap.js
 *   npm run audio:clean
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { audioMap } from '../src/utils/audioMap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio');

const valid = new Set(Object.values(audioMap).map((p) => path.basename(p)));
if (!fs.existsSync(audioDir)) {
  console.log('No audio directory yet.');
  process.exit(0);
}

let removed = 0;
for (const file of fs.readdirSync(audioDir)) {
  if (file.endsWith('.mp3') && !valid.has(file)) {
    fs.unlinkSync(path.join(audioDir, file));
    console.log(`🗑️  Removed orphan: ${file}`);
    removed++;
  }
}
console.log(`✅ Clean complete. Removed ${removed} orphaned file(s).`);
