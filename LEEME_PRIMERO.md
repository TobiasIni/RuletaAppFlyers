# ⚠️ LEE ESTO ANTES DE EJECUTAR LA APLICACIÓN

## 🎯 Pasos Rápidos para Empezar

Si acabas de clonar este repositorio y quieres ejecutarlo, sigue estos 3 pasos:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Windows (PowerShell)
Copy-Item env.example .env.local

# Linux/Mac/Git Bash
cp env.example .env.local
```

### 3. Verificar la configuración (opcional pero recomendado)
```bash
npm run verify
```

### 4. Ejecutar la aplicación
```bash
npm run dev
```

Eso es todo! La aplicación debería estar corriendo en `http://localhost:3000`

---

## 📖 ¿Tienes problemas?

- **No puedes ejecutar la app**: Lee [SETUP.md](./SETUP.md) para una guía completa paso a paso
- **Error de configuración**: Lee [CONFIGURACION.md](./CONFIGURACION.md) para solucionar problemas de variables de entorno
- **Documentación general**: Lee [README.md](./README.md) para información sobre el proyecto

---

## ❓ FAQ Rápido

**P: ¿Por qué necesito crear `.env.local`?**
R: Porque contiene configuración específica de tu entorno y no se sube al repositorio por seguridad.

**P: ¿Qué es `NEXT_PUBLIC_` en las variables?**
R: Es un prefijo obligatorio de Next.js para exponer variables al navegador (cliente).

**P: ¿Puedo cambiar los valores por defecto?**
R: Sí, edita el archivo `.env.local` después de crearlo.

**P: ¿Qué pasa si no creo `.env.local`?**
R: La aplicación usará valores por defecto configurados en el código, pero es recomendable crear el archivo.

---

## 🔧 Configuración Rápida de Variables

Si necesitas cambiar el ID de empresa o la URL de la API, edita `.env.local`:

```env
# Cambia este número por el ID de tu empresa
NEXT_PUBLIC_COMPANY_ID=13

# Cambia esta URL si usas otra API
NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com
```

Después de cambiar las variables, **reinicia el servidor** (Ctrl+C y luego `npm run dev`).

