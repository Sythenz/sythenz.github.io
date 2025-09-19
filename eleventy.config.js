import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

function setGlobalData(eleventyConfig) {
  // Get the current mode from the environment variable
  const currentMode = process.env.ELEVENTY_MODE || 'release'; // default to 'release' if no mode is set

  // Add global data for the current mode
  eleventyConfig.addGlobalData("currentMode", currentMode);

  eleventyConfig.addGlobalData("tagline_full", "Website of Alessa \"Codekitten\" Baker - Shader Witch, Technical Artist and cutesie goth who loves kittens <i class=\"fa-regular fa-heart\"></i>");
  eleventyConfig.addGlobalData("tagline_short", "Shader Witch, Technical Artist & cutesie Goth that loves Kittens.");
  eleventyConfig.addGlobalData("tagline_short-heart","Shader Witch, Technical Artist & cutesie Goth that loves Kittens. <i class=\"fa-regular fa-heart\"></i>");

  eleventyConfig.addGlobalData("privacypolicy", "");
  eleventyConfig.addGlobalData("cookiepolicy", "");

  // Add debug data directly for troubleshooting
  eleventyConfig.addGlobalData("debug", { message: "Hello from eleventy.config.js!" });
}

export default function (eleventyConfig) {
  setGlobalData(eleventyConfig);

  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/main.js');

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  eleventyConfig.addNunjucksFilter("filterByTag", function(posts, tag) {
    return posts.filter(post => post.data.tags && post.data.tags.includes(tag));
  });

  // Tailwind CSS processing
  eleventyConfig.on('eleventy.before', async () => {
  const tailwindInputPath = path.resolve('./src/styles/index.css');
  const tailwindOutputPath = './site/assets/styles/index.css';

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
  dir: { input: 'src', output: 'site' },
  };
}