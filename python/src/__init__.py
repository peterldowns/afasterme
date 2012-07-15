# coding: utf-8
from flask import (Flask)

app = Flask(__name__)

import src.api
import src.index

app.debug = True
