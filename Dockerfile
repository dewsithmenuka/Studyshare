FROM php:8.4-cli

WORKDIR /var/www

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    git curl zip unzip nodejs npm \
    libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install JS dependencies + build assets
RUN npm install
RUN npm run build

# Permissions (Laravel requirement)
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

# Run migrations + start server
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"]