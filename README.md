[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin)

# Instrucciones despliegue local

## Base de datos
### Forma comoda
Tener docker instalado, entrar a la carpeta [pgsql](https://github.com/daviddoichita/Laracoin/tree/3d501f5de7827bd7549f614db60ace44a894a4a8/pgsql) y ejectuar los dos sh (primero build luego run) desde una git bash si estas en windows
### Forma incomoda
Instalar postgresql (no se como se hace docker es mejor)

## Backend + Frontend
### Instalar composer, laravel, php, etc
[Solo hace falta ejecutar el primer comando de esta seccion](https://laravel.com/docs/12.x/installation#creating-a-laravel-project)

### Instalar dependencias
En la carpeta del proyecto:
```bash
composer install
```
```bash
npm i
```
```bash
php artisan reverb:install
```
### Configuracion backend
Copiar .env.example a .env y rellenar las siguientes [entradas](https://github.com/daviddoichita/Laracoin/blob/3d501f5de7827bd7549f614db60ace44a894a4a8/.env.example#L26) con laracoin: <br>
DB_DATABASE <br>
DB_USERNAME <br>
DB_PASSWORD <br>
<br>
Crear la key del proyecto
```bash
php artisan key:generate
```
Ejecutar las migraciones (igual en windows docker despliega a 127.0.0.1 en vez de 0.0.0.0 e igual da error, si es asi, cambiar DB_HOST por 127.0.0.1):
```bash
php artisan migrate:fresh
```
Ejecutar seeding
```bash
php artisan db:seed
```

### Iniciar el proyecto
Ejecutar
```bash
composer run dev
```
Entrar a la [web](http://localhost:8000) <br>

Lo ideal es que en el servidor de despliegue haya un cron job que ejecute este comando para guardar los precios cada 5 minutos
```cron
* * * * * cd <carpeta proyecto> && <ruta php> artisan schedule:run >> /dev/null 2>&1
```
En un despliegue de prueba puedes abrir una nueva terminal en el proyecto y ejecutar
```bash
php artisan schedule:run
```
Esto guardara los precios de las cryptos cada 5 minutos (sujeto a cambios) <br>

(Version de pruebas cada 30 segundos los precios reciben una actualizacion random para simular algo de trafico)
