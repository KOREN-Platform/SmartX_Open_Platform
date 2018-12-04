$('#logoutBtn').click(function(){
    $.ajax({
      url: '/logout',
      type: 'GET',
      success:function(result) {
        alert("success")
        location.href = "/"
      },	
      error:function(error) {
        console.log("error : " + error)	
    }
  })
})