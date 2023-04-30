import requests
import os
from jinja2 import Environment, FileSystemLoader

URL = "https://api.postmarkapp.com/email"
API_TOKEN = os.getenv("POSTMARK_API_KEY")


def send_email(username: str, send_from: str, send_to: str, subject: str, confirm_url: str):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": API_TOKEN,
    }

    env = Environment(loader=FileSystemLoader("./app"))
    html_template = env.get_template("verification_email.html")
    html_body = html_template.render(confirm_url=confirm_url, username=username)

    data = {
        "From": send_from,
        "To": send_to,
        "Subject": subject,
        "HtmlBody": html_body,
        "MessageStream": "outbound",
    }
    resp = requests.post(url=URL, json=data, headers=headers)
    return resp.json()
