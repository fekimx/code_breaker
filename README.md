# Code Breaker
 
## Prerequisites 

Python 3.10
Node JS 16
On Mac OS X: brew install postgresql

Install pipenv  

Docker and Docker Compose Installed (if you want to use Docker)

Create an .env file in the root directory with the following contents

```
SECRET_KEY = <any secret key, used to hash>
DATABASE_NAME = <database name>
DATABASE_USER = <database user>
DATABASE_PASSWORD = <database password>
DATABASE_HOST = <database host>
DATABASE_PORT = <database port>
JUDGE_ZERO_ENDPOINT = <Judge 0 server path, e.g. http://xxx.xx.xx.xx:xxxx/submissions/>
```

## 2 Ways To Run The Application Locally

### w/ Docker

docker-compose up
http://localhost:8000/login

### w/out Docker

#### Django Local Development

pipenv shell
python manage.py runserver --settings=code_breaker.local_settings

#### React Local Development

npm run dev

## Production: How to Deploy to Heroku (while automatic deployments are not working)

Heroku had a security issue with GitHub and has turned off GitHub integrations.

Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli

heroku git:remote -a code-breaker-proj
git push heroku main

If you want to run on Heroku, you need to set all environment variables documented in the Environment Variables section using "heroku config:set ENVIRONMENT_VARIABLE_NAME=value"

## Judge 0 Deployment

The Judge 0 server executes the student's code and unit tests.

The Judge 0 deployment procedure is documented here: https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure

We host our production Judge 0 server in Digital Ocean. The URL to the server is in the viewsets.py under the RunViewSet create method.

In settings.py set JUDGE_ZERO_ENDPOINT to your server's IP address and endpoint, like:

JUDGE_ZERO_ENDPOINT = 'http://159.89.85.94:2358/submissions/'

## Windows Notes

For Windows, you may need to preface the python commands with "python -m"

## Help Git Commands

git status (Shows local modifications)

git diff (Shows what you've changed)

git branch (Shows local branches)

git checkout <branch-name> (Checks out the branch)

git log

## Process for making a pull request

git checkout main (Switch to the main branch)

git pull (Make sure you have the most up to date code)

git checkout -b <branch-name> (Creates a new branch - typically you want to be in the main branch when you do this)

git add . (Adds all unstaged files to commit)

git commit -m "A helpful descriptive message" (LOCALLY commits your changes)
 
git push origin <new-branch-name> (This pushes your local branch)
 
Then, Ctrl+Click on the link to make a merge request. 

## Process for seeding data/removing seeded data 

You may need to edit the shell scripts to change the executable from python3 to python, depending on your environment

### Prod

run migrations and seed data

./migrate_and_seed.sh 

remove seeded data

python manage.py shell < revert_seed.py

Seeding data 1 file at a time

python manage.py loaddata seed/0001_User.json

### Local

run migrations and seed data

./migrate_and_seed_local.sh 

remove seeded data

python manage.py --settings=code_breaker.local_settings shell < revert_seed.py

Seeding data 1 file at a time

python manage.py --settings=code_breaker.local_settings loaddata seed/0001_User.json

## Running Linters locally

pylint coding/

npx eslint . --ext .js,.jsx,.ts,.tsx

## Heroku Deployment

You need access to Heroku in order to deploy our application: https://dashboard.heroku.com/apps/code-breaker-proj

Dyno formation is set in the Procfile

This app requires the Heroku Postgres add-on.

This app requires the heroku/nodejs and heroku/python buildpacks. 

## Additional Notes

Note: Roman needed to make sure pg_config was on his PATH. This site contains instructions on how to work with this dependency if problems are encountered: https://www.psycopg.org/docs/install.html

Note: on Brian's machine (Windows), we had to run pip install python-dotenv in git bash to setup the local environment. He can only run the local dev env in incognito.
   Commands that can solve build errors in pip: 
                pip install python-dotenv
                npm install -g webpack-dev-server
                npm install webpack 
                npm install url-loader
                npm install -g webpack
                pipenv shell
                ./migrate_and_seed_local.sh
                pip install django
                pip install --upgrade setuptools
                pip install ez_setup
                pip install python-dotenv
                pip install -r requirements.txt
                remove python(3) from migrate_and_seed_local

## EndToEnd Testing

Make sure chromedriver is install on your machine

In one terminal:

pipenv shell
python manage.py runserver --settings=code_breaker.local_settings

another terminal:
npm run dev

third terminal:
python manage.py test --settings=code_breaker.local_settings