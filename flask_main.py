from flask import Flask
from flask import render_template, flash, redirect, session, url_for, request, g, send_file

import IPython
import os

app 				= Flask(__name__)
app.debug 			= True

@app.route('/<department>/<timestamp>', methods=['GET','POST'])
def show_garden(department, timestamp):
	return render_template('index.html')

@app.route('/', methods=['GET'])
def show_tmp():
	return render_template('index.html')

if __name__ == "__main__":
	app.run()
