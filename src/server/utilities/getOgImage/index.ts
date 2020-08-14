import { createCanvas, loadImage } from 'canvas';
const path = require('path');

export const getDefaultOgImage = async () => {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const background = await loadImage(
    path.join(__dirname, '../../../../src/server/utilities/getOgImage/og_image.jpg'),
  );
  context.drawImage(background, 0, 0, 1200, 630);

  const buffer = canvas.toBuffer('image/jpeg');
  return buffer;
};

export default async ({text, subtext}: {text: string, subtext: string}) => {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const background = await loadImage(
    path.join(__dirname, '../../../../src/server/utilities/getOgImage/background-image.jpg'),
  );
  context.drawImage(background, 0, 0, 1200, 630);

  let fontSize: number = 24 / text.length * 70;
  fontSize = fontSize > 90 ? 90 : fontSize;

  context.font = `regular ${fontSize}px Courier`;
  context.textAlign = 'center';
  context.textBaseline = 'bottom';

  const top = 265;

  context.fillStyle = '#fff';
  context.fillText(text, 600, top);

  const subtextFontSize = fontSize < 32 ? fontSize - 4 : 32;

  context.font = `regular ${subtextFontSize}px Courier`;
  context.fillStyle = '#fff';
  context.fillText(subtext, 600, (top - 10) + subtextFontSize * 1.75);

  const buffer = canvas.toBuffer('image/jpeg');
  return buffer;
};
