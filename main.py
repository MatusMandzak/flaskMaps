from flask import Flask, render_template, url_for
from apscheduler.schedulers.background import BackgroundScheduler
import json
import requests

''' --- Global variables --- '''

TIME_TO_UPDATE = 5
URL_API = "https://www.dpmk.sk/api/cp/map"


''' --- API --- '''

def get_dpmk_data():
    buses = requests.get(URL_API).json()
    data = json.dumps(buses)
    with open('static/data.json', 'w') as f:
        f.write(data)

def set_scheduler_to_update():
    sched = BackgroundScheduler(daemon=True)
    sched.add_job(get_dpmk_data,'interval',seconds=TIME_TO_UPDATE)
    sched.start()

set_scheduler_to_update()

''' --- Flask --- '''

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('map.html')

if __name__ == '__main__':
    url_for('static', filename='map.css')
    url_for('static', filename='map.js')
    app.run(use_reloader=True)
