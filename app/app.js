$(document).ready(function(){
    console.log('I work');

    var _id;

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
      _id = $(this).attr('data-id');

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
      _id = $(this).attr('data-id');

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
      _id = $(this).attr('data-id');
      console.log(_id);

      $.get("/notes/" + _id, function(){
        console.log('notes');
      })
      .done(function(data){
        console.log(data);
        $("#title").text(data.title);
        $("#resultsModal").modal("toggle");

        for(var i = 0; i < data.notes.length; i++){
          var newDiv = $("<div>").text(data.notes[i].body);
          $("#modal-insert").append(newDiv);
        }

      })
      .fail(function(err){
        console.log(err);
      });

    });

    $(".container").on('click', '#submitNote', function(event){
      event.preventDefault();

      var note = {
        text: $("#inputNote").val()
      }

      $.post("/notes/" + _id, note)
      .then(function(){
        location.reload();
      })
      .fail(function(err){
        alert(JSON.stringify(err));
      });

    });

});
