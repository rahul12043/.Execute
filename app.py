from flask import Flask, render_template, Response
import mysql.connector
import os

app = Flask(__name__)

# MySQL Connection Configuration
mysql_host = 'localhost'
mysql_user = 'rahulsinha12043@gmail.com'
mysql_password = 'Rahulsinha@21'
mysql_database = 'your_database'

# Connect to MySQL Database
try:
    connection = mysql.connector.connect(
        host=mysql_host,
        user=mysql_user,
        password=mysql_password,
        database=mysql_database
    )
    print("Connected to MySQL database successfully!")
except Exception as e:
    print("Error connecting to MySQL database:", e)

@app.route('/')
def index():
    return render_template('index.html')

def generate_video():
    video_path = 'path/to/your/video.mp4'  # Update with your video file path
    with open(video_path, 'rb') as f:
        while True:
            data = f.read(1024)
            if not data:
                break
            yield data
