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

<<<<<<< HEAD
from movies import (new_releases, get_info, get_credits, get_videos, get_keywords)
=======
from movies import (new_releases, get_info, get_movie_reviews)
>>>>>>> 4861a15f93aa00101311a8dd990f938e0cd7ab27


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
	return sentiment(c_id)

@app.route('/twitris-movie-ext/api/v1.0/emotions/<path:c_id>', methods=['GET'])
def get_emotions(c_id):
	return emotions(c_id)

"""
MOVIE APIS
"""
@app.route('/twitris-movie-ext/api/v1.0/new_releases', methods=['GET'])
def releases():
	return new_releases()

@app.route('/twitris-movie-ext/api/v1.0/get_info/<path:name>', methods=['GET'])
def info(name):
	return get_info(name)

<<<<<<< HEAD
@app.route('/twitris-movie-ext/api/v1.0/get_credits/<path:name>', methods=['GET'])
def info(name):
	return get_credits()

@app.route('/twitris-movie-ext/api/v1.0/get_videos/<path:name>', methods=['GET'])
def info(name):
	return get_videos()

@app.route('/twitris-movie-ext/api/v1.0/get_keywords/<path:name>', methods=['GET'])
def info(name):
	return get_keywords()


=======
@app.route('/twitris-movie-ext/api/v1.0/get_reviews/<path:title>', methods=['GET'])
def reviews(title):
	return get_movie_reviews(title)
>>>>>>> 4861a15f93aa00101311a8dd990f938e0cd7ab27

	

@app.errorhandler(500)
def serverError(error):

	return make_response(jsonify({'error': error }), 500)

if __name__ == '__main__':
    app.run(debug=True, port=5200)