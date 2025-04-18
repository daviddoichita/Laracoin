![quality gate](.badges/alert_status.svg)
![bugs](.badges/bugs.svg)
![code smells](.badges/code_smells.svg)
![coverage](.badges/coverage.svg)
![duplicated lines](.badges/duplicated_lines_density.svg)
![lines of code](.badges/ncloc.svg)
![reliability](.badges/reliability_rating.svg)
![security hotspots](.badges/security_hotspots.svg)
![security](.badges/security_rating.svg)
![technical debt](.badges/sqale_index.svg)
![maintainability](.badges/sqale_rating.svg)
![vulnerabilities](.badges/vulnerabilities.svg)

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
