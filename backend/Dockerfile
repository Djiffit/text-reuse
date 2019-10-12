FROM python:3

EXPOSE 5000
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN pip install -r requirements.txt

CMD python app.py