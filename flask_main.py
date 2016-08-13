from flask import Flask
from flask import render_template, flash, redirect, session, url_for, request, g, send_file

import IPython
import os

app 				= Flask(__name__)
app.debug 			= True