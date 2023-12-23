FROM python:3.11.3

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

WORKDIR /home/python

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "1200","--threads", "4", "--limit-request-line", "0", "--limit-request-fields", "1000", "--limit-request-field_size", "0", "wsgi:whisper_app"]
