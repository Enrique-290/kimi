#!/usr/bin/env node
/**
 * Script de verificación del proyecto TPV Grocery
 * Verifica que todos los archivos necesarios existan
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'index.html',
  'src/App.jsx',
  'src/main.jsx',
  'src/index.css',
  'src/store/useStore.js',
  'src/modules/ventas/Ventas.jsx',
  'src/modules/inventario/Inventario.jsx',
  'src/modules/dashboard/Dashboard.jsx',
  'src/components/ui/Button.jsx',
  'src/components/layout/Layout.jsx'
];

const OPTIONAL_FILES = [
  'README.md',
  'API_DOCS.md',
  'TECH_DOCS.md',
  'DEPLOY.md',
  '.gitignore',
  '.eslintrc.cjs'
];

function checkFiles() {
  console.log('🔍 Verificando proyecto TPV Grocery...\n');

  let missing = [];
  let present = [];

  // Verificar archivos requeridos
  console.log('📋 Archivos requeridos:');
  REQUIRED_FILES.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
      present.push(file);
    } else {
      console.log(`  ❌ ${file} - FALTA`);
      missing.push(file);
    }
  });

  // Verificar archivos opcionales
  console.log('\n📄 Archivos opcionales:');
  OPTIONAL_FILES.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ⚠️  ${file} - No encontrado`);
    }
  });

  // Resumen
  console.log('\n📊 Resumen:');
  console.log(`  Total archivos requeridos: ${REQUIRED_FILES.length}`);
  console.log(`  Presentes: ${present.length}`);
  console.log(`  Faltantes: ${missing.length}`);

  if (missing.length === 0) {
    console.log('\n✅ Proyecto completo y listo para usar');
    process.exit(0);
  } else {
    console.log('\n❌ Faltan archivos requeridos');
    console.log('Archivos faltantes:', missing.join(', '));
    process.exit(1);
  }
}

checkFiles();
