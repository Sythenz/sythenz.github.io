import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default function (eleventyConfig) {
  // Get the current mode from the environment variable
  const currentMode = process.env.ELEVENTY_MODE || 'release'; // default to 'release' if no mode is set
  
  // Add global data for the current mode
  eleventyConfig.addGlobalData("currentMode", currentMode);

  // Passthrough copies (if needed)
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