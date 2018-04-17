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

var call = tweet.get('search/tweets', parms, function (err, data, response) { // search for the tweets with the stored #hashtag
    if (!err) {
        for (let i = 0; i < data.statuses.length; i++) { // we want to check all returned tweets
            let id = { id: data.statuses[i].id_str }
            let user = { user: data.statuses[i].user.id }
            if (data.statuses.favorite_count[i] > rate) { // only get tweets with the stored rate
                T.post('favorites/create', id, function (err, response) {
                    if (err) { // log any errors
                        console.log(err[0].message);
                    }
                    else { // follow user, log and store the tweet
                        T.post('friendships/create', user, function (err, response) {
                            if (err) {
                                console.log(err[0].message);
                            }
                            else {
                                let userid = response.user.user_id;
                                let friends = response.user.friends;
                                console.log('Friended: ' + userid + ' Count: ' + friends);
                            }
                            // grab ID of tweet to retweet
                            var retweetId = data.statuses[i].id_str;
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
                        });
                        let username = response.user.screen_name;
                        let tweetId = response.id_str;
                        let fav = response.favorite_count;
                        // TODO: Add data to database so 'best tweets' can be reused
                        console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`, 'FavCount: ', fav);
                        console.log('user: ', 'has been followed');
                    }
                })
            }
        }
    } else {
        console.log(err);
    }
})

module.exports.call = call;  