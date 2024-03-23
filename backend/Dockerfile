# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

WORKDIR /src

RUN pip3 install --upgrade pip
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt

RUN mkdir -p database

COPY ./entrypoint.sh .

COPY . .

ENTRYPOINT ["/src/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]