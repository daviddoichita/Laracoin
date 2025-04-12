[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=daviddoichita_Laracoin&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=daviddoichita_Laracoin)

# Instrucciones despliegue local (actualmente me tienes que pedir las keys de pusher)

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
Copiar .env.example a .env

Crear la key del proyecto
```bash
php artisan key:generate
```
Ejecutar las migraciones:
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
