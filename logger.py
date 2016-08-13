"""
Logging class to handle all logging capabilites 
We make a file under root > log > error.log that will store all the logged information

Note:
Logging files have different configuration levels. In descending order:
	Critical > Error > Warning > Info > Debug > Notset

We can only log files of a higher level or equivalent to the log file
"""

import logging
import os
import ipdb

class log_driver():
	def __init__(self):
		self.log_file 	= 'LogFile.log'
		self.pg_path 	= os.getcwd()

	def log_information(self, message, log_lvl):
		# First try to open a file in the right directory
		log_file 	= os.path.join(self.pg_path, 'log', self.log_file)
		if os.path.exists(os.path.join(self.pg_path, 'log')):
			pass
		else: 
			os.mkdir(os.path.join(self.pg_path, 'log'))

		print(message)
		logging.basicConfig(filename=log_file, filemode='w', level=logging.DEBUG)
		logging.log(level=log_lvl, msg=message)
		logging.shutdown()
