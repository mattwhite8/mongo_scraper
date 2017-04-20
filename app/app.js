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

    
});
