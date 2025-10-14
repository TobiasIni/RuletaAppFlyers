# Tótem de Juegos D3

Sistema de tótem interactivo para selección de juegos desarrollado con Next.js, diseñado específicamente para pantallas de 1080x1920 píxeles.

## Características

- 🎮 **Selección de Juegos**: Interfaz intuitiva para seleccionar juegos desde la API
- 📱 **Diseño Responsivo**: Optimizado para tótem con marco de 100px en todos los bordes
- 🔗 **Integración API**: Conexión automática con la API de CMS D3
- ⚡ **Next.js 15**: Framework moderno con TypeScript y Tailwind CSS
- 🎨 **UI Moderna**: Interfaz atractiva con gradientes y animaciones

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
COMPANY_ID=tu_company_id_aqui
API_BASE_URL=https://api-cmsd3.emanzano.com
```

### 2. Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

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