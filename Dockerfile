# syntax=docker/dockerfile:1
FROM nikolaik/python-nodejs:latest
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
COPY package.json /code/
RUN pip3 install -r requirements.txt
RUN npm install --legacy-peer-deps
COPY . /code/
