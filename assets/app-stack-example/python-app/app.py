from flask import Flask
import os

app = Flask(__name__)


@app.get("/")
def home():
    bucket_name = os.getenv("BUCKET_NAME", "not configured")
    bucket_arn = os.getenv("BUCKET_ARN", "not configured")
    return (
        f"Hello world, my bucket name is {bucket_name}. "
        f"My bucket ARN is {bucket_arn}.\n"
    )
