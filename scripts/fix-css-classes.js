#!/usr/bin/env node

/**
 * Script pour corriger automatiquement toutes les classes CSS personnalisées
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const replacements = [
  // Classes CSS personnalisées vers Tailwind
  { from: 'bg-primary-600', to: 'bg-primary-600' },
  { from: 'text-primary-600', to: 'text-primary-600' },
  { from: 'border-primary-600', to: 'border-primary-600' },
  { from: 'hover:bg-primary-600', to: 'hover:bg-primary-600' },
  { from: 'hover:text-primary-600', to: 'hover:text-primary-600' },
  { from: 'hover:border-primary-600', to: 'hover:border-primary-600' },
  
  { from: 'bg-primary-700', to: 'bg-primary-700' },
  { from: 'text-primary-700', to: 'text-primary-700' },
  { from: 'border-primary-700', to: 'border-primary-700' },
  { from: 'hover:bg-primary-700', to: 'hover:bg-primary-700' },
  { from: 'hover:text-primary-700', to: 'hover:text-primary-700' },
  { from: 'hover:border-primary-700', to: 'hover:border-primary-700' },
  
  { from: 'bg-primary-100', to: 'bg-primary-100' },
  { from: 'text-primary-100', to: 'text-primary-100' },
  { from: 'border-primary-100', to: 'border-primary-100' },
  { from: 'hover:bg-primary-100', to: 'hover:bg-primary-100' },
  { from: 'hover:text-primary-100', to: 'hover:text-primary-100' },
  { from: 'hover:border-primary-100', to: 'hover:border-primary-100' },
  
  { from: 'accent-400', to: 'accent-400' },
  
  // Variables CSS
  { from: 'var(--primary-green)', to: '#16a34a' },
  { from: 'var(--primary-dark-green)', to: '#15803d' },
  { from: 'var(--primary-light-green)', to: '#dcfce7' },
  
  // Dans les gradients
  { from: 'from-primary-600', to: 'from-primary-600' },
  { from: 'to-primary-600', to: 'to-primary-600' },
  { from: 'from-primary-700', to: 'from-primary-700' },
  { from: 'to-primary-700', to: 'to-primary-700' },
  { from: 'from-primary-100', to: 'from-primary-100' },
  { from: 'to-primary-100', to: 'to-primary-100' },
  
  // Shadows
  { from: 'shadow-primary-600', to: 'shadow-primary-600' },
  { from: 'hover:shadow-primary-600', to: 'hover:shadow-primary-600' },
  
  // Avec opacité
  { from: 'bg-primary-600/10', to: 'bg-primary-600/10' },
  { from: 'bg-primary-600/20', to: 'bg-primary-600/20' },
];

function findFiles(dir, extensions = ['.vue', '.ts', '.js', '.css']) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files = files.concat(findFiles(fullPath, extensions));
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  for (const { from, to } of replacements) {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from, 'g'), to);
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🎨 CORRECTION AUTOMATIQUE DES CLASSES CSS');
  console.log('==========================================');
  
  const baseDir = process.cwd();
  const files = findFiles(baseDir);
  let totalFixed = 0;
  
  console.log(`📁 Scan de ${files.length} fichiers...`);
  
  for (const file of files) {
    const relativePath = path.relative(baseDir, file);
    
    if (replaceInFile(file, replacements)) {
      console.log(`✅ ${relativePath}`);
      totalFixed++;
    }
  }
  
  console.log('==========================================');
  console.log(`🎉 ${totalFixed} fichiers corrigés !`);
  
  if (totalFixed > 0) {
    console.log('\n🔨 Test du build...');
    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('✅ Build réussi ! Toutes les classes CSS sont corrigées.');
    } catch (error) {
      console.log('❌ Build toujours en échec. Erreurs restantes:');
      console.log(error.stdout?.toString() || error.message);
    }
  }
}

main();
