# ✅ Checklist de Instalación

Usa esta lista para verificar que completaste todos los pasos necesarios.

## 📋 Lista de Verificación

### Requisitos Previos
- [ ] Node.js 18 o superior instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Git instalado (si vas a clonar el repo)

### Configuración Inicial
- [ ] Repositorio clonado o descargado
- [ ] Terminal abierta en la carpeta del proyecto
- [ ] Comando `npm install` ejecutado sin errores

### Variables de Entorno
- [ ] Archivo `.env.local` creado en la raíz del proyecto
- [ ] Variable `NEXT_PUBLIC_COMPANY_ID` configurada
- [ ] Variable `NEXT_PUBLIC_API_BASE_URL` configurada
- [ ] Verificado que las variables tienen el prefijo `NEXT_PUBLIC_`

### Verificación
- [ ] Comando `npm run verify` ejecutado (opcional)
- [ ] Todas las verificaciones pasaron ✅
- [ ] Si hubo advertencias, las revisé y corregí

### Ejecución
- [ ] Comando `npm run dev` ejecutado
- [ ] Servidor iniciado sin errores
- [ ] Navegador abierto en `http://localhost:3000`
- [ ] Aplicación carga correctamente
- [ ] No hay errores en la consola del navegador (F12)

### Verificación de Funcionamiento
- [ ] Logo visible en la página
- [ ] Botones de juegos visibles
- [ ] Consola del navegador muestra configuración cargada
- [ ] No hay errores de red en la pestaña Network

## 🐛 Si algo no funciona

### Error al instalar dependencias
```bash
# Solución: Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error "Cannot load data from config"
```bash
# Solución: Verifica el archivo .env.local
# 1. Asegúrate de que existe
ls .env.local  # Linux/Mac
dir .env.local  # Windows

# 2. Verifica su contenido
cat .env.local  # Linux/Mac
type .env.local  # Windows

# 3. Debería contener algo como:
# NEXT_PUBLIC_COMPANY_ID=13
# NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com
```

### Puerto 3000 ya en uso
```bash
# Solución: Usa otro puerto
npm run dev -- -p 3001
```

### Variables de entorno no se cargan
```bash
# Solución: Reinicia completamente el servidor
# 1. Presiona Ctrl+C para detener
# 2. Cierra la terminal
# 3. Abre una nueva terminal
# 4. cd al directorio del proyecto
# 5. npm run dev
```

## 📞 Obtener Ayuda

Si después de seguir esta checklist aún tienes problemas:

1. **Revisa los logs de error completos** - Copia el mensaje de error exacto
2. **Verifica que completaste todos los pasos** - Revisa esta checklist
3. **Lee la documentación relevante:**
   - `LEEME_PRIMERO.md` - Inicio rápido
   - `SETUP.md` - Guía completa
   - `CONFIGURACION.md` - Problemas de configuración
4. **Busca el error específico** - Google o la documentación de Next.js
5. **Contacta al equipo** - Con los logs y los pasos que ya intentaste

## ✨ ¡Listo para Producción!

Si completaste toda la checklist:

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

---

**Última actualización:** Diciembre 2025

