$(document).ready(function(){
    let url = (window.location.href).split("=")
    $("#"+url[url.length -1]).addClass('act')
    $("#"+url[url.length -1]).parent().addClass('show')
  })

  $('.sidebar').click(function(){
    $('.dropdown-menu').removeClass('show')
  })