# 🔧 Configuración de Variables de Entorno

## Problema: Variables de entorno no reconocidas

Si las variables de entorno no se están cargando correctamente, sigue estos pasos:

### 1. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
COMPANY_ID=5
API_BASE_URL=https://api-cmsd3.emanzano.com
```

### 2. Verificar que el archivo esté en la ubicación correcta

El archivo debe estar en la raíz del proyecto, al mismo nivel que `package.json`:

```
juegos-d3-front/
├── .env.local          ← Aquí debe estar
├── package.json
├── src/
└── ...
```

### 3. Reiniciar el servidor de desarrollo

Después de crear el archivo `.env.local`:

```bash
# Detener el servidor (Ctrl+C)
# Luego ejecutar:
npm run dev
```

### 4. Verificar en la consola del navegador

Abre las herramientas de desarrollador (F12) y ve a la pestaña "Console". Deberías ver logs como:

```
🔧 Variables de entorno:
COMPANY_ID: 5
API_BASE_URL: https://api-cmsd3.emanzano.com
📋 Configuración final: {companyId: "5", apiBaseUrl: "https://api-cmsd3.emanzano.com"}
🌐 URL de la API: https://api-cmsd3.emanzano.com/companies/5
```

### 5. Si sigue sin funcionar

El proyecto tiene valores por defecto configurados, por lo que debería funcionar incluso sin variables de entorno:

- **COMPANY_ID por defecto**: `5`
- **API_BASE_URL por defecto**: `https://api-cmsd3.emanzano.com`

### 6. Alternativa: Modificar directamente el código

Si las variables de entorno siguen sin funcionar, puedes modificar directamente el archivo `src/config/constants.ts`:

```typescript
export const DEFAULT_CONFIG = {
  COMPANY_ID: 'TU_COMPANY_ID_AQUI',
  API_BASE_URL: 'https://api-cmsd3.emanzano.com'
} as const;
```

## Verificación

Para verificar que todo funciona:

1. Ejecuta `npm run dev`
2. Abre http://localhost:3000
3. Abre la consola del navegador (F12)
4. Deberías ver los logs de configuración y la carga de datos de la API
