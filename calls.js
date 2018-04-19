var Twitter = require('twitter');
var config = require('./config.js');
var tweet = new Twitter(config);

// search params
var parms = {
    q: '#nodejs',
    count: 100,
    result_type: 'popular',
    lang: 'en'
}

// min number of likes
var rate = 100;

var call = tweet.get('search/tweets', parms, function (err, data, response) {
    if (!err) {
        for (let i = 0; i < data.statuses.length; i++) {
            // sets the ids to be used when making the call
            let favId = { id: data.statuses[i].id_str }
            let folId = { user: data.statuses[i].user.id }
            let retId = { id: data.statuses[i].id_str }
            if (data.statuses[i].favourites > rate) {
                T.post('favorites/create', favId, function (err, response) { // favourite the tweet
                    if (err) {
                        console.log(err[0].message);
                    }
                    else {
                        let username = response.user.screen_name;
                        let tweetId = response.id_str;
                        console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
                    }
                })
                T.post('friendships/create', user, function (err, response) { // friend the friend
                    if (err) {
                        console.log(err[0].message);
                    }
                    else {
                        let userid = response.user.user_id;
                        let friends = response.user.friends;
                        console.log('Friended: ' + userid + ' Count: ' + friends);
                    }
                });
                T.post('statuses/retweet/:id', { // retweet the tweet
                    id: retweetId
                }, function (err, response) {
                    if (response) {
                        console.log('Retweeted: ' + retweetId);
                    }
                    if (err) {
                        console.log('Unable to retweet.');
                    }
                });
            }
        }
    } else {
        console.log(err);
    }
})

module.exports = call;