/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const renderTweets = function (tweets) {
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  let sortedTweets = tweets.sort((a, b) => b["created_at"] - a["created_at"]);
  $("#tweets-container").empty();
  sortedTweets.forEach((tweet) => {
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
    <span class="article-handle">${tweet.user.handle}</span>
  </header>
  <p>${escape(tweet.content.text)}</p>
<footer>
  <span class="article-footer-span">${new Date(
    tweet.created_at
  ).toISOString()}</span>
  <div class="article-icons">
    <i class="fas fa-flag fa-lg"></i>
    <i class="fas fa-sync-alt fa-lg"></i>
    <i class="fas fa-heart fa-lg"></i>
  </div>
</footer>
</article>`;
  return $tweet;
};

// load tweets database from server
const loadTweets = () => {
  $.ajax({
    url: "/tweets",
    method: "GET",
  }).then((result) => {
    renderTweets(result);
  });
};

const findNewTweetUp = () => {
  $(".container").find(".new-tweet").stop().slideUp();
};
const findNewTweetDown = () => {
  $(".container").find(".new-tweet").stop().slideDown();
};

//jQuery must to have document ready
$(document).ready(function () {
  loadTweets();
  $(".alert-message").hide();
  // $(".nav-newTweet").click(function () {
  //   if ($(".container").find(".new-tweet")) {
  //     findNewTweetUp();
  //     $(".nav-newTweet").click(function () {
  //       findNewTweetDown();
  //     });
  //   }
  // });

  $(".form-newTweet").submit(function (event) {
    event.preventDefault();
    const tweetLength = $(this).find("textarea").val().length;
    if (tweetLength === 0) {
      $(".alert-message").slideDown("slow", function () {
        $(".alert-message").html("🤷 Ops, you forgot fill out message! 🤷");
      });
    } else if (tweetLength > 140) {
      $(".alert-message").slideDown("slow", function () {
        $(".alert-message").html("🔥 You type too many words! 🔥");
      });
    } else {
      $(".alert-message").slideUp();
      // we don't need val coz the serialize will get the text only itself
      let newTweet = $(".tweet-text").serialize();
      //the textarea will empty once the submit btn got clicked and sent out the data
      $(this).find("textarea").val("");
      $(this).find(".counter").html(140);
      //post the new tweet to server, atm, the exist ones are in the js file itself not in the server yet
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: newTweet,
      }).then(() => {
        //therefore, the new tweet will be the 1st one in the server side and we get it
        loadTweets();
      });
    }
  });
});
