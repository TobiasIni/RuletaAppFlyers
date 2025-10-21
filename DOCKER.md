# Guía de Despliegue con Docker

## Requisitos Previos

- Docker instalado en tu VPS
- Docker Compose (opcional, pero recomendado)

## Configuración

1. **Crea tu archivo de variables de entorno:**
   ```bash
   cp .env.production .env
   ```

2. **Edita el archivo `.env` con tus valores:**
   ```bash
   COMPANY_ID=tu_company_id
   API_BASE_URL=https://api-cmsd3.emanzano.com
   ```

## Opción 1: Usando Docker Compose (Recomendado)

### Construir y ejecutar

```bash
docker-compose up -d
```

### Ver logs

```bash
docker-compose logs -f
```

### Detener la aplicación

```bash
docker-compose down
```

### Reconstruir después de cambios

```bash
docker-compose up -d --build
```

## Opción 2: Usando Docker directamente

### Construir la imagen

```bash
docker build -t juegos-d3-front .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name juegos-d3-front \
  -p 3010:3010 \
  -e COMPANY_ID=tu_company_id \
  -e API_BASE_URL=https://api-cmsd3.emanzano.com \
  --restart unless-stopped \
  juegos-d3-front
```

### Ver logs

```bash
docker logs -f juegos-d3-front
```

### Detener el contenedor

```bash
docker stop juegos-d3-front
```

### Eliminar el contenedor

```bash
docker rm juegos-d3-front
```

## Acceso a la Aplicación

Una vez que el contenedor esté en ejecución, la aplicación estará disponible en:

- **Local:** http://localhost:3010
- **VPS:** http://tu-ip-vps:3010

## Solución de Problemas

### El contenedor no inicia

Verifica los logs:
```bash
docker-compose logs
```

### La aplicación no es accesible

1. Verifica que el puerto 3010 esté abierto en el firewall de tu VPS
2. Verifica que el contenedor esté en ejecución:
   ```bash
   docker ps
   ```

### Reconstruir desde cero

```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```

## Actualización de la Aplicación

1. Detén el contenedor actual
2. Obtén los últimos cambios del código
3. Reconstruye y ejecuta:

```bash
git pull
docker-compose up -d --build
```

## Configuración con Nginx (Opcional)

Si deseas usar un nombre de dominio y HTTPS, puedes configurar Nginx como proxy inverso:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Luego configura HTTPS con Let's Encrypt:
```bash
sudo certbot --nginx -d tu-dominio.com
```

