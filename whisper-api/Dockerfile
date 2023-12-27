FROM python:3.11.3

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

WORKDIR /home/python

# RUN export OMP_NUM_THREADS=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


EXPOSE 5000

#docker run -v /Users/adavila/Documents/andres/github/whisper/whisper-api/models/:/home/python/models -e OMP_NUM_THREADS=1 -p 5000:5000 whisper:test

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "1200","--threads", "4", "--limit-request-line", "0", "--limit-request-fields", "1000", "--limit-request-field_size", "0", "wsgi:whisper_app"]
