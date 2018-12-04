$('#loginBtn').click(function(){
    inputUser = {
        email : $('#inputEmail_l').val(),
        password : $('#inputPassword_l').val()
    }
    $.ajax({
      url:'/login',
      method: 'post',
      dataType: 'json',
      data : inputUser,
      success : function (result) {
        if (result.message == "admin") {
          alert('welcome admin!')
        }
        else {alert('welcome!')}
        location.href = '/pages?name=Client_main'
        },
      error : function (error) {
        alert("not exists")
        location.reload()
    }
  })
})