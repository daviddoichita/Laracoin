FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    nginx \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    # libpq-dev \
    nodejs \
    npm \
    cron \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip
    # pgsql pdo_pgsql pdo

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"

COPY . .

RUN php composer.phar install --no-interaction --prefer-dist --optimize-autoloader

RUN npm ci && npm run build

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chown www-data:www-data /var/www/database/database.sqlite

COPY nginx.conf /etc/nginx/sites-available/default

COPY cronjob /etc/cron.d/cronjob

RUN chmod 0644 /etc/cron.d/cronjob

RUN crontab /etc/cron.d/cronjob

RUN touch /var/log/cron.log

EXPOSE 80

RUN php artisan key:generate

CMD cron && service nginx start && php-fpm && tail -f /var/log/cron.log
