FROM php:8.4-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip nodejs npm \
    libzip-dev libpng-dev libonig-dev \
    libxml2-dev libcurl4-openssl-dev \
    libpq-dev \
    && docker-php-ext-install \
    pdo pdo_mysql mbstring zip exif pcntl bcmath gd curl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm install

# Setup directories
RUN mkdir -p storage/logs storage/framework/cache/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Run migrations
RUN php artisan migrate --force

# Clear cache
RUN php artisan config:clear
RUN php artisan cache:clear

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=$PORT