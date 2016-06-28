#!/usr/bin/env node
'use strict';

var imageArray = [],
    username = process.argv.slice(2).join(' ');

var argv = require('optimist').argv,
    url = require("url"),
    path = require("path"),
    fs = require('fs'),
    download = require('download-file'),
    TwitterPosts = require('twitter-screen-scrape');

if (!username) {
  console.log("No Twitter handle given (as argument).")
  process.exit();
}

var streamOfTweets = new TwitterPosts({
  username: username,
  retweets: false
});

console.log('Trying to search media for \'' + username +'\'...')

streamOfTweets.on('readable', function() {
  var time, tweet;
  tweet = streamOfTweets.read();
  time = new Date(tweet.time * 1000);

  if (tweet.images.length > 0) {
    console.log('Downloading ' + tweet.images.length + ' images from "https://twitter.com/' + username + '/status/' + tweet.id + '"');

    for (var i = 0; i < tweet.images.length; i++) {
      var imgUrl = tweet.images[i];
      imgUrl = tweet.images[i];
      var imgFileName = path.basename(url.parse(imgUrl).pathname);
      var destPath = username + '-' + tweet.id + '-' + imgFileName;

      download(imgUrl, {
        filename: destPath
      }, function(err){
        if (err && err != 404) console.log(err)
        // console.log('Downloaded "' + imgUrl + '" from https://twitter.com/' + username + '/status/' + tweet.id + '!');
      })
    }
  }

  if (tweet.movies.length > 0) {
    console.log('Downloading ' + tweet.movies.length + ' movies from "https://twitter.com/' + username + '/status/' + tweet.id + '"');

    for (var i = 0; i < tweet.movies.length; i++) {
      var imgUrl = tweet.movies[i];
      imgUrl = tweet.movies[i];
      var imgFileName = path.basename(url.parse(imgUrl).pathname);
      var destPath = username + '-' + tweet.id + '-' + imgFileName;

      download(imgUrl, {
        filename: destPath
      }, function(err){
        if (err && err != 404) console.log(err)
        // console.log('Downloaded "' + imgUrl + '" from https://twitter.com/' + username + '/status/' + tweet.id + '!');
      })
    }
  }
});
