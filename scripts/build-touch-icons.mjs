// Generate opaque 180px home-screen icons; iOS fills transparency with black and has no dark variant for web clips.
import sharp from 'sharp';
import { join } from 'node:path';

const SIZE = 180;
const output = (name) => join('dist', 'icons', `touch-${name}.png`);

// Memoji on a mid-tone blue that reads on both light and dark home screens.
const gradient = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9CC9F2"/><stop offset="1" stop-color="#5A93DA"/>
  </linearGradient></defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>
</svg>`);
const face = await sharp('public/icons/me-web.png').trim().resize(148, 148, { fit: 'inside' }).toBuffer();
const { width, height } = await sharp(face).metadata();
await sharp(gradient)
  .composite([{ input: face, left: Math.round((SIZE - width) / 2), top: Math.round((SIZE - height) / 2) + 4 }])
  .png()
  .toFile(output('me'));

// App icons ship with rounded corners and a glass rim; zoom past the rim and fill the corners with the
// icon's own edge colour so iOS can apply its mask.
const ZOOMED = Math.round(SIZE * 1.08);
const inset = Math.round((ZOOMED - SIZE) / 2);
for (const app of ['renfo', 'homestead', 'iwatch']) {
  const icon = await sharp(`public/icons/${app}-web.png`).trim().resize(ZOOMED, ZOOMED, { fit: 'fill' })
    .extract({ left: inset, top: inset, width: SIZE, height: SIZE }).ensureAlpha().raw().toBuffer();
  const edge = (Math.round(SIZE / 2) * SIZE + Math.round(SIZE * 0.06)) * 4;
  const background = { r: icon[edge], g: icon[edge + 1], b: icon[edge + 2] };
  await sharp(icon, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .flatten({ background })
    .png()
    .toFile(output(app));
}
console.log('Home-screen icons: touch-me, touch-renfo, touch-homestead, touch-iwatch.');
