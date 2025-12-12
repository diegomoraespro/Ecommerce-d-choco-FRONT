#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cssnano = require('cssnano');
const postcss = require('postcss');

// Arquivos CSS a minificar
const cssDir = 'assets/css';
const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

console.log(`🔧 Minificando ${files.length} arquivos CSS...\n`);

let processed = 0;
let errors = 0;

files.forEach(file => {
  const filePath = path.join(cssDir, file);
  const css = fs.readFileSync(filePath, 'utf8');
  
  postcss([cssnano])
    .process(css, { from: filePath, to: filePath })
    .then(result => {
      fs.writeFileSync(filePath, result.css);
      processed++;
      const original = Math.round(css.length / 1024);
      const minified = Math.round(result.css.length / 1024);
      const saved = Math.round(((original - minified) / original) * 100);
      console.log(`✅ ${file.padEnd(30)} ${original}kb → ${minified}kb (${saved}% menor)`);
    })
    .catch(err => {
      errors++;
      console.error(`❌ Erro ao minificar ${file}: ${err.message}`);
    });
});

setTimeout(() => {
  console.log(`\n📊 Resumo: ${processed} processados, ${errors} erros`);
  process.exit(errors > 0 ? 1 : 0);
}, 2000);
