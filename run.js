/**
 *  $ node run.js 2013/12/01
 */
var FeedParser = require('feedparser')
  , fs = require('fs')
  , request = require('request');

var lastUpdated = new Date(process.argv[2]);
var feeds = fs.readFileSync('feeds.txt').toString().split("\n");

var githubHost = 'https://github.com';

for (var i in feeds) {
  if (feeds[i].length === 0) {
    continue;
  }
  var feed = githubHost + '/' + feeds[i] + '/tags.atom';
  request(feed)
    .pipe(new FeedParser())
    .on('error', function(error){
      console.error(feed);
      console.error(error);
    })
    .on('readable', function(){
      var stream = this, item;
      while (item = stream.read()) {
        var updated = new Date(item.date);
        if (updated > lastUpdated) {
          console.log("%s", updated);
          console.log("%s", item.title);
          console.log("%s%s", githubHost, item.link);
          console.log("\n")
        }
      }
    });
}
