import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default function (eleventyConfig) {
  const isConstruction = process.env.ELEVENTY_MODE === 'construction';

  // Add global data for construction mode
  eleventyConfig.addGlobalData("comingSoon", isConstruction);

  // Define conditional layout logic
  eleventyConfig.addFilter('layoutForIndex', () => {
    return isConstruction ? 'coming-soon.njk' : 'home.njk';
  });

  eleventyConfig.addPassthroughCopy('assets/images');
  eleventyConfig.addPassthroughCopy('assets/main.js');

  // Tailwind CSS processing
  eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./assets/styles/index.css');
    const tailwindOutputPath = './dist/assets/styles/index.css';

    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await postcss([
      tailwindcss(),
      autoprefixer(),
      cssnano({ preset: 'default' }),
    ]).process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  return {
    dir: { input: '.', output: 'dist' },
  };
}
