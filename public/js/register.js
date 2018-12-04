$('#registerBtn').click(function(){
    inputUser = {
        email : $('#inputEmail').val(),
        password : $('#inputPassword').val(),
        firstName : $('#firstName').val(),
        lastName : $('#lastName').val(),
        role : $('input[name="roleRadio"]:checked').val()
    }
    
    $.ajax({
        url:'/register',
        method :'post',
        dataType:'json',
        data: inputUser,
        success: function(result) {
            alert("success!")
            location.href = "/"
        },
        error : function(error) {
            alert("failed regist")
            location.reload()
        }
    })
})