from flask import make_response, jsonify, request
import json
import urllib2
import re
import pycurl
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
TWITRIS_UN_PWD = "generic"+":"+"knoesisGeneric"
TWITRIS_HEADERS = ['Content-Type : application/json']

def serverError(error):
	return make_response(jsonify({'error': str(error) }), 500)

def generateRequest(url, method="GET", credentials=TWITRIS_UN_PWD, headers=TWITRIS_HEADERS, data=None):
	buffer = BytesIO()
	c = pycurl.Curl()
	c.setopt(c.URL, url)
	if method=="POST":
		c.setopt(c.POSTFIELDS, data)
	elif method=="DELETE":
		c.setopt(c.CUSTOMREQUEST, 'DELETE')
	c.setopt(c.HTTPHEADER, headers)
	c.setopt(c.USERPWD, credentials)
	c.setopt(c.WRITEDATA, buffer)
	return c, buffer


def create(name):

	curl = None
	keywords = [ "see "+name, "saw "+name, "watch " +name, "watched "+name]
	movie_campaign = {
		"campaign_type": "movie",
		"blacklisted_words": ["trailer"],
		"authorized_users":["surag.sheth@gmail.com","jeremy@knoesis.org"],
		"enabled": True,
		"name": name,
		"keywords":{ #keywords for reviews
			"reviews" : keywords,
		}
	}
	
	data = json.dumps(movie_campaign)
	try:
		curl, buffer = generateRequest('http://twitris.knoesis.org/api/v1.1/campaigns', \
					method="POST", data=data)
		curl.perform()
		return make_response(jsonify(json.loads(buffer.getvalue())), curl.getinfo(curl.RESPONSE_CODE))
	except Exception, e:
		return serverError(e)
	finally:
		if curl:
			curl.close()


def remove(c_id):
	return make_response(jsonify({'success': 'Campaign Deleted' }), 200)
	# curl = None
	# try:
	# 	curl, buffer = generateRequest('http://twitris.knoesis.org/api/v1/campaigns/'+c_id, \
	# 				method="DELETE")
	# 	curl.perform()
	# 	return make_response(jsonify({ "status": str(buffer.getvalue()) }), curl.getinfo(curl.RESPONSE_CODE))
	# except:
	# 	return serverError("error")
	# finally:
	# 	if curl:
	# 		curl.close()


def retrieve(c_id):
	curl = None
	try:
		curl, buffer = generateRequest('http://twitris.knoesis.org/api/v1/campaigns/'+c_id)
		curl.perform()
		data = json.loads(buffer.getvalue())
		return make_response(jsonify({ "campaign": data }), curl.getinfo(curl.RESPONSE_CODE))
	except:
		serverError("error")
	finally:
		if curl:
			curl.close()

def list_campaigns():
	curl = None
	try:
		curl, buffer = generateRequest('http://twitris.knoesis.org/api/v1/campaigns')
		curl.perform()
		data = json.loads(buffer.getvalue())
		resp = []
		for c in data:
			if "movie" in c['campaign_type']:
				print c['event']
				resp.append(c)
		return make_response(jsonify({ "campaigns": resp}), curl.getinfo(curl.RESPONSE_CODE))
	except:
		return serverError("error")
	finally:
		if curl:
			curl.close()

def get_movie_reviews(c_id):
	curl = None
	try:
		url = 'http://twitris.knoesis.org/api/v1.1/campaigns/'+c_id+'/movieReviews'
		curl, buffer = generateRequest(url)
		curl.perform()
		print "performed data"
		data = json.loads(buffer.getvalue())['reviews'][0]
		return make_response(jsonify(data), curl.getinfo(curl.RESPONSE_CODE))
	except:
		return serverError("error")
	finally:
		if curl:
			curl.close()