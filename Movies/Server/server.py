#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify, make_response, request, current_app
from flask.ext.cors import CORS
from functools import update_wrapper
import json
import urllib
import urllib2
import re
import pycurl

from campaigns import (create, remove, list_campaigns, retrieve)

from analysis import (tweets, topics, sentiment, emotions)

from movies import (get_movies, get_info, get_movie_reviews, \
	get_credits, get_videos, get_upcoming)



app = Flask(__name__)
cors = CORS(app, resources=r'/twitris-movie-ext/api/*', allow_headers='Content-Type')

"""
CAMPAIGN MANAGEMENT APIS
"""
@app.route('/twitris-movie-ext/api/v1.0/create', methods=['POST'])
def add():
	name = request.form['name'];
	return create(name) 

@app.route('/twitris-movie-ext/api/v1.0/remove/<path:c_id>', methods=['DELETE'])
def delete(c_id):
	return remove(c_id)

@app.route('/twitris-movie-ext/api/v1.0/retrieve/<path:c_id>', methods=['GET'])
def get(c_id):
	return retrieve(c_id)

@app.route('/twitris-movie-ext/api/v1.0/list', methods=['GET'])
def list():
	return list_campaigns()


"""
TWITRIS ANALYSIS APIS
"""
@app.route('/twitris-movie-ext/api/v1.0/tweets/<path:c_id>', methods=['GET'])
def get_tweets(c_id):
	return tweets(c_id)

@app.route('/twitris-movie-ext/api/v1.0/topics/<path:c_id>', methods=['GET'])
def get_topics(c_id):
	return topics(c_id)

@app.route('/twitris-movie-ext/api/v1.0/sentiment/<path:c_id>', methods=['GET'])
def get_sentiment(c_id):
	try:
		print("trying date")
		start = request.args.get('start_date', '')
		end = request.args.get('end_date', '')
		return sentiment(c_id, start=start, end=end)
	except:
		print("no date")
		return sentiment(c_id)

@app.route('/twitris-movie-ext/api/v1.0/emotions/<path:c_id>', methods=['GET'])
def get_emotions(c_id):
	try:
		print("trying date")
		start = request.args.get('start_date', '')
		end = request.args.get('end_date', '')
		return emotions(c_id, start=start, end=end)
	except:
		print("no date")
	return emotions(c_id)

"""
MOVIE APIS
"""
@app.route('/twitris-movie-ext/api/v1.0/movies/<path:t>', methods=['GET'])
def releases(t):
	return get_movies(t)

@app.route('/twitris-movie-ext/api/v1.0/upcoming', methods=['GET'])
def upcoming():
	return get_upcoming()

@app.route('/twitris-movie-ext/api/v1.0/get_info/<path:name>', methods=['GET'])
def info(name):
	return get_info(name)

@app.route('/twitris-movie-ext/api/v1.0/get_credits/<path:m_id>', methods=['GET'])
def credits(m_id):
	return get_credits(m_id)

@app.route('/twitris-movie-ext/api/v1.0/get_videos/<path:m_id>', methods=['GET'])
def videos(m_id):
	return get_videos(m_id)

@app.route('/twitris-movie-ext/api/v1.0/get_reviews/<path:title>', methods=['GET'])
def reviews(title):
	return get_movie_reviews(title)

	

@app.errorhandler(500)
def serverError(error):

	return make_response(jsonify({'error': error }), 500)

if __name__ == '__main__':
    app.run(debug=True, port=5200)