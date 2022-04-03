# Code Breaker
 
## Prerequisites 

Python 3.10.2
Node JS
pip install django-webpack-loader==0.7.0
pip install pipenv  
pipenv install django  
    python -m pip install django
    python install -r requirements.txt
    
## Django Local Development

pipenv shell
python manage.py runserver --settings=code_breaker.local_settings

## React Local Development
npm install styled-components (styles and formatting for the homepage)
npm run dev

### Windows Notes

For Windows, you may need to preface the python commands with "python -m"

### Help Git Commands

git status (Shows local modifications)

git diff (Shows what you've changed)

git branch (Shows local branches)

git checkout <branch-name> (Checks out the branch)

git log

#### Process for making a pull request

git checkout main (Switch to the main branch)

git pull (Make sure you have the most up to date code)

git checkout -b <branch-name> (Creates a new branch - typically you want to be in the main branch when you do this)

git add . (Adds all unstaged files to commit)

git commit -m "A helpful descriptive message" (LOCALLY commits your changes)
 
git push origin <new-branch-name> (This pushes your local branch)
 
Then, Ctrl+Click on the link to make a merge request. 


#### Process for seeding data/removing seeded data 

(non windows only so far) - migrate and seed all data

./migrate_and_seed.sh 

remove seeded data

python manage.py shell < revert_seed.py

Seeding data 1 file at a time

python manage.py loaddata seed/0001_User.json

#### Running Linters locally

pylint coding/

npx eslint . --ext .js,.jsx,.ts,.tsx


Note: on Brian's machine (Windows), we had to run pip install python-dotenv in git bash to setup the local environment
   Commands that can solve build errors in pip: 
                pip install python-dotenv
                npm install -g webpack-dev-server
                npm install webpack 
                npm install -g webpack
                pipenv shell
                ./migrate_and_seed_local.sh
                pip install django
                pip install --upgrade setuptools
                pip install ez_setup
                pip install python-dotenv
                pip install -r requirements.txt
