import { createCanvas, loadImage } from 'canvas';
const path = require('path');

export default async ({text, subtext}: {text: string, subtext: string}) => {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  const background = await loadImage(
    path.join(__dirname, '../../../../src/server/utilities/getOgImage/background-image.jpg'),
  );
  context.drawImage(background, 0, 0, 1200, 630);

  const name = 'Bald Hill';
  let fontSize: number = 24 / name.length * 70;
  fontSize = fontSize > 90 ? 90 : fontSize;

  context.font = `regular ${fontSize}px Courier`;
  context.textAlign = 'center';
  context.textBaseline = 'bottom';

  // const text = name;

  const top = 265;

  context.fillStyle = '#fff';
  context.fillText(text, 600, top);

  const subtextFontSize = fontSize < 32 ? fontSize - 4 : 32;

  context.font = `regular ${subtextFontSize}px Courier`;
  // const subtext = 'New Hampshire | 6398ft';
  context.fillStyle = '#fff';
  context.fillText(subtext, 600, (top - 10) + subtextFontSize * 1.75);

  const buffer = canvas.toBuffer('image/jpeg');
  return buffer;
};
