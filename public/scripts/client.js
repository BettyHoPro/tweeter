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

// helper function for postedTime function
const checkNeedS = (unit) => {
  return unit >= 2 && "s" || "";
};


// count how long it has been post
const postedTime = (time) => {
  let timeDifferent = new Date().getTime() - new Date(time).getTime();
  //transfer to unit
  let minute = 60 * 1000;
  let hour = minute * 60;
  let day = hour * 24;

  //check which one is
  let checkYear = Math.floor(timeDifferent / (day * 365));
  let checkMonth = Math.floor(timeDifferent / (day * 31));
  let checkWeek = Math.floor(timeDifferent / (day * 7));
  let checkDay = Math.floor(timeDifferent / day);
  let checkHour = Math.floor(timeDifferent / hour);
  let checkMin = Math.floor(timeDifferent / minute);

  if (checkWeek > 0) {
    return time;
  } else {
    if (checkDay > 365) {
      return `${ checkYear } year${ checkNeedS(checkYear) } ago`;
    } else if (checkDay < 365 && checkDay > 31) {
      return `${ checkMonth } month${ checkNeedS(checkMonth) } ago`;
    } else if (checkDay < 31 && checkDay > 7) {
      return `${ checkWeek } week${ checkNeedS(checkWeek) } ago`;
    } else if (checkDay < 7 && checkDay > 0) {
      return `${ checkDay } day${ checkNeedS(checkDay) } ago`;
    } else {
      if (checkHour < 24 && checkHour > 0) {
        return `${ checkHour } hour${ checkNeedS(checkHour) } ago`;
      } else {
        return `${ checkMin >= 1 && (`${ checkMin } minute${ checkNeedS(checkMin) } ago`) || "Just now" }`;
      }
    }
  }
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
  <span class="article-footer-span">${postedTime(
    tweet.created_at
  )}</span>
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

//helper function to check the new submit tweet's length for slide down/up the appropriate error message
const tweetLengthCheck = () => {
  const tweetLength = $(".form-newTweet").find("textarea").val().length;
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
};

//jQuery must to have document ready
$(document).ready(function () {
  loadTweets();
  $(".alert-message").hide();
  $(".form-newTweet").submit(function (event) {
    event.preventDefault();
    tweetLengthCheck();
  });
});
