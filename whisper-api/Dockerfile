FROM python:3.11.3

WORKDIR /home/python

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "1200","--threads", "4", "wsgi:whisper_app"]
