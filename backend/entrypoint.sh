#!/bin/bash

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.5
    done

    echo "PostgreSQL started"
fi

# Uncomment below to flush db e.g. after running tests
# Just make sure you really mean it 
# python manage.py flush --no-input

# We have base custom user model so need to makemigrations out of box
python3 manage.py makemigrations core

python3 manage.py migrate
python3 manage.py collectstatic --noinput

## Seed data
python3 manage.py shell -c "from core.models.umbrella import Umbrella; Umbrella.objects.all().delete()"
python3 manage.py loaddata core/seed/seasons.json
python3 manage.py loaddata core/seed/umbrellas_2023.json
python3 manage.py loaddata core/seed/umbrellas_2024.json
##

exec "$@"