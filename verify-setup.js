#!/usr/bin/env node

/**
 * Script de verificación de configuración
 * Ejecuta esto antes de iniciar la aplicación para verificar que todo está configurado correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configuración del proyecto...\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Verificar Node.js version
console.log('1️⃣ Verificando versión de Node.js...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} - Se requiere Node.js 18 o superior`);
  hasErrors = true;
}

// 2. Verificar package.json
console.log('\n2️⃣ Verificando package.json...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('   ✅ package.json encontrado');
} else {
  console.log('   ❌ package.json NO encontrado');
  hasErrors = true;
}

// 3. Verificar node_modules
console.log('\n3️⃣ Verificando node_modules...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules existe');
} else {
  console.log('   ⚠️ node_modules NO existe - Ejecuta: npm install');
  hasWarnings = true;
}

// 4. Verificar env.example
console.log('\n4️⃣ Verificando env.example...');
const envExamplePath = path.join(__dirname, 'env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('   ✅ env.example encontrado');
} else {
  console.log('   ⚠️ env.example NO encontrado');
  hasWarnings = true;
}

// 5. Verificar .env.local
console.log('\n5️⃣ Verificando .env.local...');
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('   ✅ .env.local encontrado');
  
  // Verificar contenido
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  
  console.log('\n   📋 Verificando variables de entorno...');
  
  const hasCompanyId = envContent.includes('NEXT_PUBLIC_COMPANY_ID');
  const hasApiUrl = envContent.includes('NEXT_PUBLIC_API_BASE_URL');
  
  if (hasCompanyId) {
    console.log('      ✅ NEXT_PUBLIC_COMPANY_ID definida');
  } else {
    console.log('      ⚠️ NEXT_PUBLIC_COMPANY_ID NO encontrada');
    console.log('         Asegúrate de que incluya: NEXT_PUBLIC_COMPANY_ID=13');
    hasWarnings = true;
  }
  
  if (hasApiUrl) {
    console.log('      ✅ NEXT_PUBLIC_API_BASE_URL definida');
  } else {
    console.log('      ⚠️ NEXT_PUBLIC_API_BASE_URL NO encontrada');
    console.log('         Asegúrate de que incluya: NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com');
    hasWarnings = true;
  }
  
  // Verificar prefijo correcto
  if (envContent.includes('COMPANY_ID=') && !envContent.includes('NEXT_PUBLIC_COMPANY_ID=')) {
    console.log('      ⚠️ Encontré COMPANY_ID sin el prefijo NEXT_PUBLIC_');
    console.log('         Cambia COMPANY_ID por NEXT_PUBLIC_COMPANY_ID');
    hasWarnings = true;
  }
  
  if (envContent.includes('API_BASE_URL=') && !envContent.includes('NEXT_PUBLIC_API_BASE_URL=')) {
    console.log('      ⚠️ Encontré API_BASE_URL sin el prefijo NEXT_PUBLIC_');
    console.log('         Cambia API_BASE_URL por NEXT_PUBLIC_API_BASE_URL');
    hasWarnings = true;
  }
  
} else {
  console.log('   ⚠️ .env.local NO encontrado');
  console.log('      La aplicación usará valores por defecto, pero es recomendable crear este archivo');
  console.log('      Ejecuta: cp env.example .env.local (Linux/Mac) o Copy-Item env.example .env.local (Windows)');
  hasWarnings = true;
}

// 6. Verificar archivos importantes
console.log('\n6️⃣ Verificando archivos del proyecto...');
const importantFiles = [
  'src/app/page.tsx',
  'src/config/constants.ts',
  'src/lib/api.ts',
  'src/types/api.ts'
];

let allFilesExist = true;
importantFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} NO encontrado`);
    allFilesExist = false;
    hasErrors = true;
  }
});

// 7. Verificar .gitignore
console.log('\n7️⃣ Verificando .gitignore...');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  if (gitignoreContent.includes('.env')) {
    console.log('   ✅ .gitignore configurado correctamente (ignora archivos .env)');
  } else {
    console.log('   ⚠️ .gitignore no está ignorando archivos .env');
    hasWarnings = true;
  }
} else {
  console.log('   ⚠️ .gitignore NO encontrado');
  hasWarnings = true;
}

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

if (!hasErrors && !hasWarnings) {
  console.log('\n✅ ¡Todo está configurado correctamente!');
  console.log('\nPuedes ejecutar la aplicación con:');
  console.log('   npm run dev');
} else if (hasErrors) {
  console.log('\n❌ Se encontraron ERRORES críticos que deben corregirse');
  console.log('\nPor favor, revisa los mensajes de error arriba y corrígelos antes de continuar.');
} else if (hasWarnings) {
  console.log('\n⚠️ Se encontraron ADVERTENCIAS');
  console.log('\nLa aplicación puede funcionar, pero es recomendable corregir las advertencias.');
  console.log('\nPara una mejor experiencia, revisa los mensajes arriba.');
  console.log('\nSi quieres continuar de todos modos, ejecuta:');
  console.log('   npm run dev');
}

console.log('\n' + '='.repeat(60));
console.log('\n📚 Más ayuda:');
console.log('   - Guía de instalación: SETUP.md');
console.log('   - Configuración de variables: CONFIGURACION.md');
console.log('   - Documentación general: README.md');
console.log('   - Inicio rápido: LEEME_PRIMERO.md\n');

// Código de salida
if (hasErrors) {
  process.exit(1);
} else {
  process.exit(0);
}

