FROM python:3.12-alpine

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENV PORT=8000

CMD ["sh", "-c", "flask --app app run --host 0.0.0.0 --port ${PORT}"]
