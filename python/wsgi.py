# coding: utf-8
from src import app as application
if __name__=="__main__":
	application.run(application, host='127.0.0.1', port=8080, reloader=True)
