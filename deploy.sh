#!/bin/bash
# GIHANGA cPanel deployment script — run once via SSH after files are uploaded
set -euo pipefail

echo "=== 1. Environment setup ==="
if [ ! -f .env ]; then
  cp .env.production .env
  echo "Created .env from .env.production"
else
  echo ".env already exists"
fi

echo "=== 2. Generate app key ==="
php artisan key:generate --force

echo "=== 3. Storage link ==="
php artisan storage:link --force

echo "=== 4. Cache config / routes / view ==="
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== 5. Run migrations ==="
php artisan migrate --force

echo "=== 6. Seed database ==="
php artisan db:seed --force

echo "=== 7. Set permissions ==="
chmod -R 775 storage bootstrap/cache
chown -R "$(whoami)": "$(pwd)"

echo ""
echo "=== Done! ==="
echo "Update .env with your MySQL credentials before running if not done yet."
echo "Document root should point to: $(pwd)/public"
