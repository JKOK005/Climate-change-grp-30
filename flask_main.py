from flask import Flask
from flask import flash
from flask import g
from flask import jsonify
from flask import redirect
from flask import render_template
from flask import request
from flask import send_file
from flask import session
from flask import url_for
from pgService import pg_driver

import os

app = Flask(__name__)
app.debug = True

pg = pg_driver()
pg.connect_to_database(dbname='grow',
                       user='sohamghosh',
                       password='',
                       host='localhost',
                       port='5432')


@app.route('/<department>/<timestamp>', methods=['GET', 'POST'])
def show_garden(department, timestamp):
    return render_template('index.html')


@app.route('/<department>', methods=['GET', 'POST'])
def garden_info(department):
    resp = pg.get_plant_growth(department)
    return jsonify({'trees': resp})


@app.route('/garden', methods=['GET'])
def show_tmp():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0')
