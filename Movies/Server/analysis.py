from flask import make_response, jsonify
import json
import urllib2
import re
import pycurl
from datetime import datetime, timedelta
try:
    from io import BytesIO
except ImportError:
    from StringIO import StringIO as BytesIO

CLIENT_ID = "bnTnsANzdDVI9U1CYCrt8ErCz6pu2FSMXcyZONEz"
CLIENT_SECRET = """
Xv4j2ptY2Pvukc1H9Wtiqu8yCuMkeekMi
oesT5LqYoWN61iLhqPzxR1XxgDqDESrGX
pBGmHmANkjJDVTQoINkUxslGPMTqiAtM0
CC0xj6F8J0PMhhScTkHN5vCowJCF3
"""
TWITRIS_ANALYSIS_ROOT = 'http://twitris.knoesis.org/api/v1.1/campaigns/'
TWITRIS_UN_PWD = "generic"+":"+"knoesisGeneric"
TWITRIS_HEADERS = ['Content-Type : application/x-www-form-urlencoded']


def serverError(error):
	return make_response(jsonify({'error': error }), 500)

def generateRequest(url, method="GET", credentials=TWITRIS_UN_PWD, headers=TWITRIS_HEADERS, data=None):
	buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.URL, url)
	if method=="POST":
		c.setopt(c.CUSTOMREQUEST, 'DELETE')
		c.setopt(c.POSTFIELDS, data)
	elif method=="DELETE":
		c.setopt(c.CUSTOMREQUEST, 'DELETE')
	c.setopt(c.HTTPHEADER, headers)
	c.setopt(c.USERPWD, credentials)
	c.setopt(c.WRITEDATA, buffer)
	return c, buffer

def generateStartEndDates(includeTime=False):
	if includeTime:
		date_string = str(datetime.utcnow()).split(" ")[0]
		date_format = "%Y-%m-%d"
		date = datetime.strptime(date_string, date_format)
		start_date = "T".join(str(date-timedelta(days=7)).split(" "))
		end_date = "T".join(str(date+timedelta(days=1)).split(" "))
	else:
		t = datetime.today()
		date_string = str(t.year)+'-'+str(t.month)+'-'+str(t.day)	
		date_format = "%Y-%m-%d"
		date = datetime.strptime(date_string, date_format)
		start_date = str(date-timedelta(days=7)).split(" ")[0]
		end_date = str(date+timedelta(days=1)).split(" ")[0]
	return start_date, end_date

def getOptions(includeTime=False):
	sd, ed = generateStartEndDates(includeTime=includeTime)
	print sd
	options = "?format=json&limit=100"
	options+="&start-date="
	options+=str(sd)
	options+="&end-date="
	options+=str(ed)
	print options
	# "&keyword="+ Cannabis
	return options

def tweets(c_id):
	curl = None
	try:
		url = TWITRIS_ANALYSIS_ROOT+c_id+'/tweets'+getOptions(includeTime=True)
		curl, buffer = generateRequest(url)
		curl.perform()
		data = json.loads(buffer.getvalue())
		return make_response(jsonify({ "data": data }), curl.getinfo(curl.RESPONSE_CODE))
	except:
		return serverError("error")
	finally:
		if curl:
			curl.close()

def topics(c_id):
	curl = None
	try:
		url = TWITRIS_ANALYSIS_ROOT+c_id+'/topics'+getOptions()
		curl, buffer = generateRequest(url)
		curl.perform()
		data = json.loads(buffer.getvalue())
		return make_response(jsonify({ "data": data }), curl.getinfo(curl.RESPONSE_CODE))
	except:
		return serverError("error")
	finally:
		if curl:
			curl.close()

def sentiment(c_id, start=False, end=False, internal=False):
	curl = None
	try:
		if not start or not end:
			options = getOptions()
		else:
			start = "-".join(start.split("/"))
			end = "-".join(end.split("/"))
			options = "?format=json"
			options+="&start-date="
			options+=str(start)
			options+="&end-date="
			options+=str(end)
		print("options %s " % options)

		url = TWITRIS_ANALYSIS_ROOT+c_id+'/sentiment'+options
		curl, buffer = generateRequest(url)
		curl.perform()
		data = json.loads(buffer.getvalue())
		if internal:
			return	data
		else:
			return make_response(jsonify({ "data": data }), curl.getinfo(curl.RESPONSE_CODE))
	except Exception, e:
		return serverError("error %s" % e)
	finally:
		if curl:
			curl.close()

def emotions(c_id, start=False, end=False, internal=False):
	curl = None
	try:
		if not start or not end:
			options = getOptions()
		else:
			start = "-".join(start.split("/"))
			end = "-".join(end.split("/"))
			options = "?format=json"
			options+="&start-date="
			options+=str(start)
			options+="&end-date="
			options+=str(end)
		print("options %s " % options)

		url = TWITRIS_ANALYSIS_ROOT+c_id+'/emotions'+options
		curl, buffer = generateRequest(url)
		curl.perform()
		data = json.loads(buffer.getvalue())
		if internal:
			return	data
		else:
			return make_response(jsonify({ "data": data }), curl.getinfo(curl.RESPONSE_CODE))
	except:
		return serverError("error")
	finally:
		if curl:
			curl.close()