'use strict';

$(document).ready(function() {
  $(document).on('error','img', function(){
    $(this).attr('src', '/modules/pictures/client/img/placeholder.png');
  });


  $('.grid').masonry({
    columnWidth: 320,
    itemSelector: '.grid-item'
  });
//  .imagesLoaded(function() {
//    $('.cards').masonry('reload');
  //});
});
/*$(document).ready(function() {
  console.log('Initializing masonry');
  var $container = $('.grid');
  $container.imagesLoaded(function() {
    $container.masonry({
      columnWidth: 320,
      isFitWidth: true,
      itemSelector: '.grid-item'
    });
  });
});*/
