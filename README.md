# Code Breaker

## Prerequisites 

Python 3.10
Node JS
pip install django-webpack-loader==0.7.0

## Django Local Development

pip install pipenv  
pipenv shell  
pipenv install django  

python manage.py runserver --settings=code_breaker.local_settings

## React Local Development

npm run dev

### Windows Notes

For Windows, you may need to preface the python commands with "python -m"

### Frontend Local Development

You need to install Node JS.  

cd frontend/  
npm start  

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


