/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
  {
    user: {
      name: "Alex",
      avatars: "/images/user1.png",
      handle: "@alex123",
    },
    content: {
      text:
        "I ma go to leave Van and get into the jet in 3 hours.✈️ Don't miss me too much, my friends. See you soon. Can't wait to see my babe, love you! ❤️‍🔥",
    },
    created_at: 1501113959088,
  },
  {
    user: {
      name: "Ice Cream Man",
      avatars: "/images/user2.png",
      handle: "@Icecreamshop",
    },
    content: {
      text:
        "We have 100 favors ice cream. We are on sale. Whoever got 100 ca ice cream, we wll give you 5% discount. Come here to get whatever favors of ice cream you want.",
    },
    created_at: 1493413959088,
  },
  {
    user: {
      name: "Newton",
      avatars: "https://i.imgur.com/73hZDYK.png",
      handle: "@SirIsaac",
    },
    content: {
      text:
        "If I have seen further it is by standing on the shoulders of giants",
    },
    created_at: 1461116232227,
  },
  {
    user: {
      name: "Descartes",
      avatars: "https://i.imgur.com/nlhLi3I.png",
      handle: "@rd",
    },
    content: {
      text: "Je pense , donc je suis",
    },
    created_at: 1461113959088,
  },
];

const renderTweets = function (tweets) {
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  tweets.forEach((tweet) => {
    const $tweet = createTweetElement(tweet);
    $("#tweets-container").append($tweet);
  });
};

const createTweetElement = function (tweet) {
  let $tweet = `<article>
  <header>
    <div class="article-left">
      <img src="${tweet.user.avatars}"> 
      <span class="article-header-text">${tweet.user.name}</span>
    </div>
    <span class="article-right">${tweet.user.handle}</span>
  </header>
  <p>${tweet.content.text}</p>
<footer>
  <span class="article-footer-span">${new Date(
    tweet.created_at
  ).toISOString()}</span>
  <div>
    <i class="fas fa-flag"></i>
    <i class="fas fa-sync-alt"></i>
    <i class="fas fa-heart"></i>
  </div>
</footer>
</article>`;
  return $tweet;
};

//jQuery must to have document ready
$(document).ready(function () {
  renderTweets(data);
  const $button = $(".btn-submit");
  $('.form-newTweet').submit(function(event) {
    event.preventDefault();

    // we don't need val coz the serialize will get the text only itself
    let newTweet = $('.tweet-text').serialize();

    //post the new tweet to server, atm, the exist ones are in the js file itself not in the server yet
    $.ajax({ 
      url: '/tweets',
      method: "POST",
      data: newTweet
    }).then((result) => {
      //therefore, the new tweet will be the 1st one in the server side and we get it
      $.ajax({
        url: '/tweets',
        method: "GET",
      }).then((result) => {
        renderTweets(result);
      });
    });

  });
});
