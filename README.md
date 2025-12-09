# Tótem de Juegos D3

Sistema de tótem interactivo para selección de juegos desarrollado con Next.js, diseñado específicamente para pantallas de 1080x1920 píxeles.

## 🚀 Inicio Rápido

```bash
# 1. Clonar e instalar
npm install

# 2. Configurar variables de entorno
cp env.example .env.local  # Linux/Mac
Copy-Item env.example .env.local  # Windows

# 3. Verificar configuración (opcional)
npm run verify

# 4. Ejecutar
npm run dev
```

### 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [**LEEME_PRIMERO.md**](./LEEME_PRIMERO.md) | ⚡ Inicio rápido y FAQ |
| [**SETUP.md**](./SETUP.md) | 📖 Guía completa de instalación paso a paso |
| [**CHECKLIST.md**](./CHECKLIST.md) | ✅ Lista de verificación de instalación |
| [**CONFIGURACION.md**](./CONFIGURACION.md) | 🔧 Solución de problemas con variables de entorno |
| [**COLORES.md**](./COLORES.md) | 🎨 Información sobre colores y diseño |

**¿Primera vez configurando el proyecto?** → Lee [LEEME_PRIMERO.md](./LEEME_PRIMERO.md)

**¿Problemas con la configuración?** → Lee [CONFIGURACION.md](./CONFIGURACION.md)

## Características

- 🎮 **Selección de Juegos**: Interfaz intuitiva para seleccionar juegos desde la API
- 📱 **Diseño Responsivo**: Optimizado para tótem con marco de 100px en todos los bordes
- 🔗 **Integración API**: Conexión automática con la API de CMS D3
- ⚡ **Next.js 15**: Framework moderno con TypeScript y Tailwind CSS
- 🎨 **UI Moderna**: Interfaz atractiva con gradientes y animaciones

## Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd juegos-d3-front
```

### 2. Variables de Entorno

**⚠️ IMPORTANTE:** Antes de ejecutar la aplicación, debes configurar las variables de entorno.

#### Opción A: Usar el archivo de ejemplo (Recomendado)

```bash
# En Windows (PowerShell)
Copy-Item env.example .env.local

# En Linux/Mac
cp env.example .env.local
```

Luego edita `.env.local` y ajusta los valores según tu configuración:

```env
NEXT_PUBLIC_COMPANY_ID=13
NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com
```

#### Opción B: Crear manualmente

Crea un archivo `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`) con:

```env
NEXT_PUBLIC_COMPANY_ID=tu_company_id_aqui
NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com
```

**Nota:** El prefijo `NEXT_PUBLIC_` es necesario para que Next.js exponga estas variables al navegador.

### 3. Instalación de Dependencias

```bash
# Instalar todas las dependencias del proyecto
npm install
```

### 4. Ejecutar la Aplicación

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 5. Verificación

Después de iniciar la aplicación:

1. Abre tu navegador en `http://localhost:3000`
2. Abre la consola del navegador (F12)
3. Deberías ver mensajes de configuración:
   ```
   🔧 Configuración cargada: { companyId: "13", apiBaseUrl: "https://api-cmsd3.emanzano.com" }
   ```

Si ves errores, verifica que:
- El archivo `.env.local` existe en la raíz del proyecto
- Las variables tienen el prefijo `NEXT_PUBLIC_`
- Has reiniciado el servidor de desarrollo después de crear/modificar el archivo

### 3. Configuración del Tótem

El proyecto está optimizado para:
- **Resolución**: 1080x1920 píxeles
- **Marco**: 100px de margen en todos los bordes
- **Orientación**: Vertical (portrait)

## Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css      # Estilos globales y layout del tótem
│   ├── layout.tsx       # Layout principal con marco
│   └── page.tsx         # Pantalla de selección de juegos
├── lib/
│   └── api.ts           # Funciones para conectar con la API
└── types/
    └── api.ts           # Tipos TypeScript para la API
```

## API Integration

El proyecto se conecta con la API de CMS D3 para obtener los datos de la empresa y juegos habilitados:

```typescript
// Endpoint utilizado
GET https://api-cmsd3.emanzano.com/companies/{company_id}

// Respuesta esperada
{
  "id": 5,
  "nombre": "Male",
  "logo": "https://api-cmsd3.emanzano.com/uploads/images/...",
  "color_primario": "#000000",
  "color_secundario": "#FFFFFF", 
  "color_terciario": "#CCCCCC",
  "created_at": "2025-09-07T15:59:17",
  "updated_at": "2025-09-07T15:59:43",
  "imagenes": [...],
  "juegos_habilitados": [
    {
      "id": 1,
      "nombre": "Trivia",
      "descripcion": "Juego de preguntas y respuestas",
      "tipo": "trivia",
      "activo": true,
      "created_at": "2025-10-12T23:50:14",
      "updated_at": null
    }
  ]
}
```

## Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Inicio en producción
npm start

# Linting
npm run lint
```

### Personalización

- **Colores**: Modifica los gradientes en `globals.css`
- **Layout**: Ajusta el marco en las clases `.totem-container` y `.totem-frame`
- **API**: Modifica los tipos en `types/api.ts` según la respuesta real de la API

## Próximos Pasos

1. Implementar navegación a juegos individuales
2. Agregar pantallas de configuración
3. Sistema de puntuaciones
4. Modo offline
5. Analytics y métricas

## Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Hooks** - Estado y efectos
- **Fetch API** - Conexión con API externa

## Soporte

Para soporte técnico o consultas sobre la implementación, contacta al equipo de desarrollo.