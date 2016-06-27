#!/usr/bin/env node
'use strict';

// Require modules
var cmdr = require('commander'),
    url = require("url"),
    path = require("path"),
    fs = require('fs'),
    download = require('download-file'),
    TwitterPosts = require('twitter-screen-scrape');  // make sure to use my fork
                                                      // which supports scraping of movies
                                                      // https://github.com/frdmn/twitter-screen-scrape

// Make sure to properly pars argv
cmdr
  .version('0.0.1')
  .option('-u, --username <username>', 'Twitter handle to scrape')
  .option('--no-images', 'Skip images')
  .option('--no-movies', 'Skip movies')
  .parse(process.argv);

// Make sure to require 'username'
if (!cmdr.username) {
  console.log("Error: No Twitter handle given. Use -u [username] or --username [username].")
  process.exit(1);
}

// Make sure to require 'username'
if (!cmdr.movies && !cmdr.images) {
  console.log("Error: Both --no-images and --no-movies given. Abborting because nothing to do...")
  process.exit(1);
}

// Create scraper instance
var streamOfTweets = new TwitterPosts({
  username: cmdr.username,
  retweets: false
});

console.log('Search for media in \'@' + cmdr.username +'\' tweets...')

streamOfTweets.on('readable', function() {
  var time, tweet;
  tweet = streamOfTweets.read();
  time = new Date(tweet.time * 1000);

  // Check if tweet contains any images
  if (cmdr.images) {
    if (tweet.images.length > 0) {
      console.log('Downloading ' + tweet.images.length + ' images from "https://twitter.com/' + cmdr.username + '/status/' + tweet.id + '"');

      // Download them
      for (var i = 0; i < tweet.images.length; i++) {
        var imgUrl = tweet.images[i];
        imgUrl = tweet.images[i];
        var imgFileName = path.basename(url.parse(imgUrl).pathname);
        var destPath = cmdr.username + '-' + tweet.id + '-' + imgFileName;

        download(imgUrl, {
          filename: destPath
        }, function(err){
          if (err && err != 404) console.log(err)
          // console.log('Downloaded "' + imgUrl + '" from https://twitter.com/' + cmdr.username + '/status/' + tweet.id + '!');
        })
      }
    }
  }

  // Check if tweet contains any movies
  if (cmdr.movies) {
    if (tweet.movies.length > 0) {
      console.log('Downloading ' + tweet.movies.length + ' movies from "https://twitter.com/' + cmdr.username + '/status/' + tweet.id + '"');

      // Download them
      for (var i = 0; i < tweet.movies.length; i++) {
        var imgUrl = tweet.movies[i];
        imgUrl = tweet.movies[i];
        var imgFileName = path.basename(url.parse(imgUrl).pathname);
        var destPath = cmdr.username + '-' + tweet.id + '-' + imgFileName;

        download(imgUrl, {
          filename: destPath
        }, function(err){
          if (err) console.log(err)
          // console.log('Downloaded "' + imgUrl + '" from https://twitter.com/' + cmdr.username + '/status/' + tweet.id + '!');
        })
      }
    }
  }
});
