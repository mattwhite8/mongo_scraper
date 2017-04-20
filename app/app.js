$(document).ready(function(){
    console.log('I work');

    $("#scrape").on('click', function(){

      $.get("/scraper", function(){
        alert('success');
      })
      .done(function(){
        window.location = "/";
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $(".container").on('click', '.favorite', function(){
      var _id = $(this).attr('data-id');

      $.post("/favorite/" + _id, function(){
        console.log('favorited');
      })
      .done(function(){
        window.location = "/";
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $(".container").on('click', '.unfavorite', function(){
      var _id = $(this).attr('data-id');

      $.post("/unfavorite/" + _id, function(){
        console.log('unfavorited');
      })
      .done(function(){
        window.location = "/favorites";
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

    $(".container").on('click', 'p', function(){
      console.log('clicked p');
      var _id = $(this).attr('data-id');
      console.log(_id);

      $.get("/notes/" + _id, function(){
        console.log('notes');
      })
      .done(function(data){
        console.log(data);
        $("#title").text(data.title);
        $("#resultsModal").modal("toggle");

      })
      .fail(function(err){
        console.log(err);
      });



    });
});
