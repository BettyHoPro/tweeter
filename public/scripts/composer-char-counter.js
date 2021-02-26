$(document).ready(function() {
  // counting how many texts to fill out in the new tweet textarea
  $(".tweet-text").on("keyup", keyupEvent);
});


const keyupEvent = function(event) {
  let countNum =  $(this).val();
  if (countNum.length > 140) {
    // when the number is greater than 140, count number go red
    $(".counter").addClass("count-red");
    // $(".alert-message").html("You type too many words!");
  } else if (countNum.length < 140) {
    //when the number is less than 140, count number goes black
    $(".counter").removeClass("count-red");
  }
  // syn remain text number which allows to fill to front-end
  $(".counter").html(140 - countNum.length);
};


