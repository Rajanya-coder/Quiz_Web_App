from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

username = 'root'
password = 'Raj23kar01'
hostname = 'localhost'
database = 'quiz_db'

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{username}:{password}@{hostname}/{database}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

DATA_DIR = os.path.dirname(__file__)

# ✅ NEW: define the leaderboard table
class LeaderboardEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    topic = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(50), nullable=False)

@app.route("/questions/<topic>", methods=["GET"])
def get_questions(topic):
    with open(os.path.join(DATA_DIR, "questions.json")) as f:
        data = json.load(f)
    return jsonify(data.get(topic, [])[:5])

# ✅ NEW: get leaderboard from DB instead of JSON
@app.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    entries = LeaderboardEntry.query.order_by(LeaderboardEntry.score.desc()).all()
    results = []
    for entry in entries:
        results.append({
            "name": entry.name,
            "topic": entry.topic,
            "score": entry.score,
            "date": entry.date
        })
    return jsonify(results)

# ✅ NEW: save leaderboard to DB instead of JSON
@app.route("/leaderboard", methods=["POST"])
def post_leaderboard():
    data = request.json
    entry = LeaderboardEntry(
        name=data["name"],
        topic=data["topic"],
        score=data["score"],
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(debug=True)
