# Sistema de Colores Centralizado

Este proyecto utiliza un sistema centralizado de colores que facilita la personalización y el mantenimiento de toda la aplicación.

## 📍 Ubicación

Los colores están definidos en `src/app/globals.css` en la sección `:root`.

## 🎨 Variables Disponibles

### Variables de Texto

```css
--text-primary: #171717;        /* Texto principal (títulos, encabezados) */
--text-secondary: #171717;      /* Texto secundario */
--text-muted: #9ca3af;          /* Texto atenuado (descripciones, hints) */
--text-dark: #1f2937;           /* Texto oscuro (para fondos claros) */
--text-error: #ef4444;          /* Texto de error */
--text-success: #10b981;        /* Texto de éxito */
--text-warning: #f59e0b;        /* Texto de advertencia */
```

### Variables de la Ruleta

```css
--wheel-border: #FFD700;           /* Borde principal de la ruleta (dorado) */
--wheel-pointer: #eab308;          /* Color del puntero/flecha (amarillo) */
--wheel-center-primary: #eab308;   /* Color primario del centro (amarillo 500) */
--wheel-center-secondary: #facc15; /* Color secundario del centro (amarillo 400) */
--wheel-center-tertiary: #ca8a04;  /* Color terciario del centro (amarillo 600) */
--wheel-center-border: #fde047;    /* Borde del centro (amarillo 300) */
--wheel-glow: #eab308;             /* Color del brillo/glow (amarillo 500) */
```

### Clases de Utilidad (para uso en componentes)

```css
.text-app-primary      /* Color de texto principal */
.text-app-secondary    /* Color de texto secundario */
.text-app-muted        /* Color de texto atenuado */
.text-app-dark         /* Color de texto oscuro */
.text-app-error        /* Color de texto de error */
.text-app-success      /* Color de texto de éxito */
.text-app-warning      /* Color de texto de advertencia */
```

## 📖 Ejemplos de Uso

### En componentes React con Tailwind

```tsx
// Título principal
<h1 className="text-app-primary text-4xl font-bold">
  Título Principal
</h1>

// Texto secundario
<p className="text-app-secondary text-lg">
  Descripción o subtítulo
</p>

// Texto atenuado
<span className="text-app-muted text-sm">
  Información adicional
</span>

// Mensaje de error
<div className="text-app-error">
  Error: Algo salió mal
</div>

// Mensaje de éxito
<div className="text-app-success">
  ¡Operación exitosa!
</div>
```

### Con estilos inline

```tsx
<div style={{ color: 'var(--text-primary)' }}>
  Texto con color primario
</div>
```

### En archivos CSS

```css
.mi-clase-personalizada {
  color: var(--text-primary);
}
```

## 🔧 Cómo Cambiar los Colores

Para cambiar los colores en toda la aplicación:

1. Abre `src/app/globals.css`
2. Busca la sección `:root`
3. Modifica los valores hexadecimales de las variables:

```css
:root {
  /* ... otras variables ... */
  
  /* Ejemplo: Cambiar el texto principal a blanco */
  --text-primary: #ffffff;
  
  /* Ejemplo: Cambiar el borde de la ruleta a rojo */
  --wheel-border: #ff0000;
  
  /* Ejemplo: Cambiar el puntero a verde */
  --wheel-pointer: #00ff00;
}
```

4. Los cambios se aplicarán automáticamente en toda la aplicación

### Ejemplos de Combinaciones de Colores para la Ruleta

**Tema Dorado (por defecto):**
```css
--wheel-border: #FFD700;
--wheel-pointer: #eab308;
--wheel-center-primary: #eab308;
```

**Tema Plateado:**
```css
--wheel-border: #C0C0C0;
--wheel-pointer: #94a3b8;
--wheel-center-primary: #94a3b8;
```

**Tema Azul:**
```css
--wheel-border: #3b82f6;
--wheel-pointer: #2563eb;
--wheel-center-primary: #2563eb;
```

**Tema Rojo:**
```css
--wheel-border: #ef4444;
--wheel-pointer: #dc2626;
--wheel-center-primary: #dc2626;
```

## 🎯 Recomendaciones de Uso

- **text-app-primary**: Úsalo para títulos principales, encabezados importantes y texto destacado
- **text-app-secondary**: Para subtítulos, texto de navegación y contenido secundario
- **text-app-muted**: Para hints, placeholders, texto de ayuda y contenido menos importante
- **text-app-dark**: Para texto sobre fondos claros (modales, cards blancos, etc.)
- **text-app-error**: Para mensajes de error y validaciones fallidas
- **text-app-success**: Para mensajes de éxito y confirmaciones
- **text-app-warning**: Para advertencias y alertas

## 🔄 Migración de Código Existente

Si quieres migrar código existente para usar este sistema:

### Antes:
```tsx
<h1 className="text-white text-8xl">Título</h1>
<p className="text-gray-600">Descripción</p>
```

### Después:
```tsx
<h1 className="text-app-primary text-8xl">Título</h1>
<p className="text-app-muted">Descripción</p>
```

## 💡 Ventajas

✅ **Centralizado**: Todos los colores en un solo lugar  
✅ **Fácil de cambiar**: Modifica una variable y afecta toda la app  
✅ **Consistente**: Todos usan los mismos colores  
✅ **Mantenible**: Más fácil de mantener y actualizar  
✅ **Flexible**: Compatible con Tailwind, CSS y estilos inline

