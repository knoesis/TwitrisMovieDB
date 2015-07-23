#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import jsonify, make_response
import json
import pycurl
import urllib
from urllib2 import Request, urlopen
from datetime import datetime, timedelta

TMDB_API_ROOT = "http://api.themoviedb.org/3/"
TMDB_API_KEY = "8bd778c68dccc25fb46b1850046f4f00"
RT_API_ROOT = "http://api.rottentomatoes.com/api/public/v1.0/"
RT_API_KEY = "nh7pnpwkmbznkmss2vd4uq69"

HEADERS = {
  'Accept': 'application/json'
}

def serverError(error):
	return make_response(jsonify({'error': error }), 500)

def generateStartEndDates():
	t = datetime.today()
	date_string = str(t.year)+'-'+str(t.month)+'-'+str(t.day)	
	date_format = "%Y-%m-%d"
	date = datetime.strptime(date_string, date_format)
	start_date = str(date).split(" ")[0]
	end_date = str(date+timedelta(days=7)).split(" ")[0]
	return start_date, end_date

def getOptions(includeTime=False):
	sd, ed = generateStartEndDates()
	options = "?language=en&api_key="+TMDB_API_KEY
	options+="&primary_release_date.gte="
	options+=str(sd)
	options+="&primary_release_date.lte="
	options+=str(ed)
	options+="&sort_by=popularity.desc"
	# "&keyword="+ Cannabis
	return options

def new_releases():
	try:		
		url = TMDB_API_ROOT+"discover/movie"+getOptions()
		headers = {
		  'Accept': 'application/json'
		}
		request = Request(url, headers=HEADERS)
		response_body = urlopen(request).read()
		return make_response(jsonify(json.loads(response_body)), 200)
	except:
		return serverError("error")

def get_info(text):
	try:	
		ogText = text
		text = urllib.quote(text).encode('utf-8')
		url = TMDB_API_ROOT+"search/movie?api_key="+TMDB_API_KEY+"&query="+text
		headers = {
		  'Accept': 'application/json'
		}
		request = Request(url, headers=HEADERS)
		response_body = json.loads(urlopen(request).read())
		print response_body
		movie = {}
		for m in response_body["results"]:
			print m["title"]
			if m["title"] == ogText:
				movie = m
				break
		return make_response(jsonify({"info":movie}), 200)
	except:
		return serverError("error")

def get_movie_id(movie_title):	
	try:		
		url = RT_API_ROOT+"movies.json?q="+urllib.quote(movie_title)+"&page_limit=10&page=1&apikey="+RT_API_KEY
		request = Request(url, headers=HEADERS)
		response_body = urlopen(request).read()
		return json.loads(response_body)['movies'][0]['id']
	except:
		print("error")
		return ""

def get_movie_reviews(movie_title):
	movie_id = get_movie_id(movie_title)
	try:		
		options = "movies/"+movie_id+"/reviews.json"
		options+= "?apikey="+RT_API_KEY
		url = RT_API_ROOT+options
		request = Request(url, headers=HEADERS)
		response_body = urlopen(request).read()
		return make_response(jsonify({"reviews":json.loads(response_body)['reviews']}), 200)
	except:
		return serverError("error")

def get_credits(id):
	try:	
		url = TMDB_API_ROOT+"movie/"+id+"/credits?api_key="+TMDB_API_KEY
		headers = {
		  'Accept': 'application/json'
		}
		request = Request(url, headers=HEADERS)
		response_body = json.loads(urlopen(request).read())
		print response_body

		return make_response(jsonify({"credits":response_body}), 200)
	except:
		return serverError("error")

def get_videos(id):
	try:	
		url = TMDB_API_ROOT+"movie/"+id+"/videos?api_key="+TMDB_API_KEY
		headers = {
		  'Accept': 'application/json'
		}
		request = Request(url, headers=HEADERS)
		response_body = json.loads(urlopen(request).read())
		print response_body

		return make_response(jsonify({"videos":response_body}), 200)
	except:
		return serverError("error")

def get_keywords(id):
	try:	
		url = TMDB_API_ROOT+"movie/"+id+"/keywords?api_key="+TMDB_API_KEY
		headers = {
		  'Accept': 'application/json'
		}
		request = Request(url, headers=HEADERS)
		response_body = json.loads(urlopen(request).read())
		print response_body

		return make_response(jsonify({"keywords":response_body}), 200)
	except:
		return serverError("error")

