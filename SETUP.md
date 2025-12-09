# 🚀 Guía de Instalación y Configuración

Esta guía te ayudará a configurar y ejecutar el proyecto en una computadora nueva.

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm (viene con Node.js)
- Git

## 🔧 Paso a Paso

### 1️⃣ Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd juegos-d3-front
```

### 2️⃣ Configurar Variables de Entorno

**Este paso es CRUCIAL. Sin él, la aplicación no funcionará correctamente.**

#### Opción 1: Usar el archivo de ejemplo (MÁS FÁCIL)

```bash
# En Windows (PowerShell)
Copy-Item env.example .env.local

# En Windows (CMD)
copy env.example .env.local

# En Linux/Mac/Git Bash
cp env.example .env.local
```

#### Opción 2: Crear el archivo manualmente

Crea un archivo llamado `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`):

**Contenido del archivo `.env.local`:**
```env
NEXT_PUBLIC_COMPANY_ID=13
NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com
```

**⚠️ IMPORTANTE:** 
- El archivo DEBE llamarse `.env.local` (con el punto al inicio)
- Las variables DEBEN tener el prefijo `NEXT_PUBLIC_`
- NO debe haber espacios antes o después de los valores
- El archivo debe estar en la raíz del proyecto, NO en una subcarpeta

### 3️⃣ Instalar Dependencias

```bash
npm install
```

Este comando descargará e instalará todas las librerías necesarias del proyecto.

### 4️⃣ Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación se iniciará en modo desarrollo y estará disponible en:
```
http://localhost:3000
```

### 5️⃣ Verificar la Configuración (Opcional pero Recomendado)

Antes de ejecutar la aplicación, puedes verificar que todo está configurado correctamente:

```bash
npm run verify
```

Este comando revisará:
- ✅ Versión de Node.js
- ✅ Dependencias instaladas
- ✅ Archivo .env.local y sus variables
- ✅ Archivos del proyecto
- ✅ Configuración correcta

### 6️⃣ Verificar que Funciona

1. Abre tu navegador en `http://localhost:3000`
2. Presiona `F12` para abrir las herramientas de desarrollo
3. Ve a la pestaña "Console"
4. Deberías ver mensajes como:
   ```
   🔧 Configuración cargada: { companyId: "13", apiBaseUrl: "https://api-cmsd3.emanzano.com" }
   🔧 Modo sin API - Devolviendo datos mock de empresa
   ✅ Datos mock devueltos: {...}
   ```

## 🐛 Solución de Problemas

### Problema: "Cannot load data from config file"

**Causa:** El archivo `.env.local` no existe o no está configurado correctamente.

**Solución:**
1. Verifica que el archivo `.env.local` existe en la raíz del proyecto
2. Verifica que tiene el contenido correcto (ver paso 2️⃣)
3. Verifica que las variables tienen el prefijo `NEXT_PUBLIC_`
4. Reinicia el servidor (Ctrl+C y luego `npm run dev`)

### Problema: Las variables de entorno no se cargan

**Solución:**
1. Asegúrate de que el archivo se llama exactamente `.env.local` (no `env.local` ni `.env`)
2. En Windows, el archivo puede estar oculto. Activa "Mostrar archivos ocultos" en el explorador
3. Verifica que el archivo no tiene extensión extra (como `.txt`)
4. Cierra y abre de nuevo la terminal
5. Reinicia completamente el servidor

### Problema: Error "Module not found" o "Cannot find module"

**Solución:**
```bash
# Borra node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstala las dependencias
npm install
```

### Problema: Puerto 3000 ya está en uso

**Solución:**
```bash
# Usa otro puerto
npm run dev -- -p 3001

# O mata el proceso que está usando el puerto 3000
# En Windows (PowerShell como administrador):
netstat -ano | findstr :3000
taskkill /PID <número-del-proceso> /F

# En Linux/Mac:
lsof -ti:3000 | xargs kill
```

## 📁 Estructura de Archivos Esperada

Después de completar la instalación, tu estructura debería verse así:

```
juegos-d3-front/
├── .env.local              ← Este archivo debe existir (NO se sube al repositorio)
├── env.example             ← Archivo de ejemplo
├── package.json
├── package-lock.json
├── node_modules/           ← Carpeta creada por npm install
├── src/
│   ├── app/
│   ├── config/
│   ├── lib/
│   └── types/
├── public/
├── README.md
├── CONFIGURACION.md
└── SETUP.md               ← Este archivo
```

## 🔐 Seguridad

El archivo `.env.local` está incluido en `.gitignore` y **NO debe subirse al repositorio** porque puede contener información sensible.

Por eso:
- ✅ `env.example` SÍ se sube al repositorio (sin datos reales)
- ❌ `.env.local` NO se sube al repositorio (contiene tus datos)

## 🏗️ Compilar para Producción

```bash
# Construir la aplicación
npm run build

# Ejecutar la versión de producción
npm start
```

## 📚 Más Información

- Para problemas específicos de variables de entorno: Ver `CONFIGURACION.md`
- Para información sobre colores y diseño: Ver `COLORES.md`
- Para documentación general: Ver `README.md`

## 🆘 Ayuda Adicional

Si después de seguir estos pasos aún tienes problemas:

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm esté instalado: `npm --version`
3. Revisa los logs de error completos en la consola
4. Busca el error específico en la documentación de Next.js
5. Contacta al equipo de desarrollo con los logs de error completos

