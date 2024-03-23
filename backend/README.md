# Getting Started 

## Run the back-end

### Install the virtual environment
```bash
pip3 install pipenv --user
pipenv install

# To activate this project's virtualenv, run 
pipenv shell

# To run a command inside the virtualenv with 
pipenv run
```

### Configure the SECRET_KEY
Set SECRET_KEY on the backend/settings.py file if not set:

```bash
openssl rand -hex 32
```

### Create database

```bash
# create database
mkdir database
python3 manage.py migrate 

# seeding
python3 manage.py loaddata myapp/seed/new_umbrellas.json 
# if I want to flush the database
python3 manage.py flush 

systemctl restart gunicorn.socket gunicorn.service nginx
```