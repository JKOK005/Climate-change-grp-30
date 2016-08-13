import psycopg2 as psy
import ipdb
import os
import logging
import logger
import time
import datetime

class pg_driver:
	def __init__(self):
		self.connection 	= None
		self.log_driver		= logger.log_driver()

	def __enter__(self):
		return self

	def __exit__(self, type, value, traceback):
		self.shut_down()		# Ensures closure of the connection to database
		return

	def connect_to_database(self, dbname, user, password, host, port):
		"""
		Attempts to establish connection with the Postgres database
		Input:
			dbname 	= Database name
			user 	= User name
			pass 	= Password
			host 	= Host ip address or 'Localhost'
			port 	= Port 
		
		Output:
			If successful = Returns successful connection
			If not successful = Throws connection error
		"""
		try:
			self.connection = psy.connect(dbname=dbname)
			st = self.get_date_time()
			connection_msg 	= "Established connection with database at time: " + st
			self.log_driver.log_information(connection_msg, 20)	# Logs success message with DEBUG level
			return True

		except Exception as E:
			err_msg = "DB connection error: " + str(E)
			self.log_driver.log_information(err_msg, 40)	# Logs unsuccessful connection with ERROR level
			return False


	def get_plant_growth(self, department, timestamp):
		"""
		Gets the plant's userid / userName / growthRate from the database

		If successful, returns the queried result from the database. Else, returns False.
		"""
		resp = False

		try:
			cur = self.connection.cursor()

			query_statement = """
				SELECT id FROM users
					WHERE department={0}
			""".format(department)
			# ipdb.set_trace()
			cur.execute(query_statement)
			resp 	= cur.fetchall()
			assert resp is not None
			user_id =','.join([str(i[0]) for i in resp])

			query_statement = """
				SELECT lvl_growth, x, y FROM trees
					WHERE id IN ({0}) AND DATE(plant_date)='{1}'
			""".format(user_id, timestamp)

			cur.execute(query_statement)
			resp 	= cur.fetchall()
			assert resp is not None

			st = self.get_date_time()
			success_msg 	= "Query successful at: " + st
			self.log_driver.log_information(success_msg, 20)	# Logs success message

		except Exception as E:
			err_msg = "DB connection error: " + str(E)
			self.log_driver.log_information(err_msg, 40)	# Logs unsuccessful connection 
			self.connection.rollback()	# Rolls back to previous database state

		finally: 
			cur.close()
			return resp


	def get_date_time(self):
		"""
		Returns the date and time
		"""
		ts = time.time()
		return datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')


	def shut_down(self):
		self.connection.close()


if __name__ == "__main__":
	with pg_driver() as pg:
		pg.connect_to_database(dbname='grow', user='Johan', password='None', host='localhost', port='0')
		resp = pg.get_plant_growth(1, '2016-08-13')
		print(resp)