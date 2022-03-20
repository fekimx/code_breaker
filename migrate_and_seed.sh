# copied from https://medium.com/@ardho/migration-and-seeding-in-django-3ae322952111

# !/bin/bash
python3 manage.py migrate
fixtures=$(ls seed/)
while IFS= read -r fixture; do
    echo -n "Seeding "
    echo $fixture
    python3 manage.py loaddata seed/$fixture
done <<< "$fixtures"