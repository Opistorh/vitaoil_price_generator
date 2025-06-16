const fs = require('fs-extra');
const path = require('path');

const ffmpegCoreResolvedPath = require.resolve('@ffmpeg/core');
// Go up from node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js to node_modules/@ffmpeg/core/
const ffmpegCorePath = path.join(path.dirname(ffmpegCoreResolvedPath), '..', '..');
const sourcePath = path.join(ffmpegCorePath, 'dist');
const destPath = path.join(__dirname, '..', 'public', 'ffmpeg');

async function copyFFmpeg() {
  try {
    console.log('Copying FFmpeg assets...');
    await fs.ensureDir(destPath);
    await fs.copy(sourcePath, destPath);
    console.log('FFmpeg assets copied successfully.');
  } catch (err) {
    console.error('Error copying FFmpeg assets:', err);
  }
}

copyFFmpeg(); 