# Code Breaker

## Local Development

pip install pipenv  
pipenv shell  
pipenv install django  

python manage.py runserver --settings=code_breaker.local_settings  

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


