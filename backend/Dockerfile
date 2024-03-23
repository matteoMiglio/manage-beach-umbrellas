# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

WORKDIR /src

COPY Pipfile /src/
RUN pip3 install --upgrade pip && pip3 install pipenv && pipenv install

COPY . /src/

RUN mkdir -p database && pipenv run python3 manage.py migrate --noinput

ENTRYPOINT [ "pipenv", "run" ]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]