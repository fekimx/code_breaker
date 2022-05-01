# !/bin/bash

# copied from https://medium.com/@ardho/migration-and-seeding-in-django-3ae322952111

python manage.py migrate
fixtures=$(ls seed/)
while IFS= read -r fixture; do
    echo -n "Seeding "
    echo $fixture
    python manage.py loaddata seed/$fixture
done <<< "$fixtures"