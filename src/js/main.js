jQuery(document).ready(function($) {

  $(".hamburger button").click(function(){
    $("body").toggleClass("mm_open");
  })

  // Slider on front page
  if ($(".about_slider").length === 1) {

    $('.about_slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      fade: true,
      autoplay: true,
      autoplaySpeed: 4000,
      // speed: 1000,
      pauseOnFocus: false,
      pauseOnHover: false,
    })

  };

});
