import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const desktopInput = path.join(ROOT, 'src', 'assets', '13433792_3840_2160_30fps.mp4');
const mobileInput = path.join(ROOT, 'src', 'assets', '13406407_1080_1920_30fps.mp4');
const outputDir = path.join(ROOT, 'public', 'media');
const desktopOutput = path.join(outputDir, 'hero-desktop-optimized.mp4');
const mobileOutput = path.join(outputDir, 'hero-mobile-optimized.mp4');

function log(msg) {
  console.log(`[optimize-hero-video] ${msg}`);
}

function hasFfmpeg() {
  const check = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  return check.status === 0;
}

function isFresh(input, output) {
  if (!fs.existsSync(output)) return false;
  const inputStat = fs.statSync(input);
  const outStat = fs.statSync(output);
  return outStat.mtimeMs >= inputStat.mtimeMs;
}

function transcode(input, output, vf, crf) {
  const args = [
    '-y',
    '-i', input,
    '-an',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', String(crf),
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', vf,
    output,
  ];

  const run = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (run.status !== 0) {
    throw new Error(`ffmpeg failed for ${path.basename(output)}`);
  }
}

function main() {
  if (!fs.existsSync(desktopInput) || !fs.existsSync(mobileInput)) {
    log('Source videos not found. Skipping optimization.');
    return;
  }

  if (!hasFfmpeg()) {
    log('ffmpeg is not installed in this environment. Skipping optimization.');
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  if (isFresh(desktopInput, desktopOutput) && isFresh(mobileInput, mobileOutput)) {
    log('Optimized videos are up-to-date.');
    return;
  }

  log('Optimizing desktop hero video...');
  transcode(desktopInput, desktopOutput, 'scale=1920:-2:flags=lanczos,fps=30', 24);

  log('Optimizing mobile hero video...');
  transcode(mobileInput, mobileOutput, 'scale=-2:1280:flags=lanczos,fps=30', 26);

  log('Optimization complete.');
}

try {
  main();
} catch (err) {
  console.warn(`[optimize-hero-video] ${err.message}`);
  process.exit(0);
}
