from flask import Flask, render_template, url_for
from apscheduler.schedulers.background import BackgroundScheduler
import json
import requests


app = Flask(__name__)




def get_dpmk_data():
    r = requests.get('https://www.dpmk.sk/api/cp/map')
    buses = r.json()
    data = json.dumps(buses)
    f = open('static/data.json', 'w')
    f.write(data)
    f.close()
    print("Data changed!")

sched = BackgroundScheduler(daemon=True)
sched.add_job(get_dpmk_data,'interval',seconds=5)
sched.start()

@app.route('/')
def index():
    return render_template('map.html')

    
if __name__ == '__main__':
    url_for('static', filename='map.css')
    url_for('static', filename='map.js')
    app.run(use_reloader=True)