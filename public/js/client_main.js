//ready to run button event
function readyToRun(){
  $.ajax({
    url: '/apiDoc',
    type: 'GET',
    data: {"appName": $('input:checkbox[id=APP_check]:checked').val()},
    success:function(result) {
    $('.apiDoc').empty()
    if(result.status){
      $('.apiDoc').append(result.result)
      $('.apiDoc').children('pre').remove() //example code remove
      $('.apiDoc').children('h3').remove() // h3 tag remove
      $('.apiDoc').children('ul').remove() //ul tag remove
      $('.apiDoc').children('p').not($('.apiDoc').children('p').first()).remove()
      $('.apiDoc').children('blockquote').remove()
      $('.apiDoc').children('h1').remove()  //all h1 tag remove
      $('.apiDoc').children('table').children('tbody').children('tr').children('td').children('a').contents().unwrap()
      $('.apiDoc').children('table').addClass('table')
      $('.apiDoc').children('h2').html("Base Parameters")
      $('.apiDoc > p').css('font-weight','bold') //p tag style change
      $('.apiDoc').children('table').eq(1).children('thead').children('tr').children('th').eq(0).html("Top element")
      let appTitle = $("<h2>App's Parameters</h2>") // app's parameter title
      $('.apiDoc').append(appTitle)
      let appTable = $("<table class='table'>") // create app's parameters table
      appTable.append("<thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Notes</th></tr></thead><tbody></tbody>")
      $('.apiDoc').append(appTable)
      while($('.apiDoc').children('table').eq(2).children('tbody').children('tr').length > 5 ){
        let appParam = $('.apiDoc').children('table').eq(2).children('tbody').children('tr').last().html()
        $('.apiDoc').children('table').eq(2).children('tbody').children('tr').last().remove()
        $('.apiDoc').children('table').last().children('tbody').append("<tr>"+appParam+"</tr>")
        }
      }
    },	
    error:function(error) {
        console.log("error : " + error)	
    }
  })
    if ($('input:checkbox[id=APP_check]').is(':checked') == false){
      alert('please select Application')
    } else if($('input:checkbox[id=APP_check]:checked').length > 1){
      alert('please check only one Application')
    } else{//show
      document.all.readyToSpark.style.display=""
      makeParaBlank()
    }
  }    
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
  $('.API_description').click(function(){
  if($('.collapse').hasClass('show')){
    $('.collapse').removeClass('show')
  }else{
    $('.collapse').addClass('show')
  }
  })
  function makeParaBlank(){
  $.ajax({
    url: '/client/makeParameterBlank',
    method: 'post',
    data: {'appname' : $('input:checkbox[id=APP_check]:checked').val()},
    dataType: 'json',
    success: function(result) {
      if(result){
        //파라미터 입력 공간 초기화
        $('#parameter_blank').empty();
        parameterKey = []
        //모든 파라미터 체크
        for(let i=0 ; i<result.nameList.length ; i++){
          //파라미터 키 리스트 작성
          parameterKey[i] = result.nameList[i]
          //파라미터 입력 타입 체크
          if(result.typeList[i] == 'text'){
            //text 방식 입력 공간 생성
              $('#parameter_blank').append(result.nameList[i]+' '+'<input id='+result.nameList[i]+' type="text" placeholder=" ex) '+result.metadata.parameters[0].default+'" maxlength="'+result.typeMaxList[i]+'"> ['+result.descriptionList[i]+']'+'<br>')
          }else if(result.typeList[i] == 'radio' || result.typeList[i] == 'checkbox'){		//make radio or checkbox blank
            $('#parameter_blank').append(result.nameList[i]+' ['+result.descriptionList[i]+']'+'<br>')
            for(let j = 0 ; j < result.typeDataList[i].length ; j++){
            $('#parameter_blank').append('<input id='+result.nameList[i]+' type="'+result.typeList[i]+'" value='+result.typeDataList[i][j]+' name='+result.nameList[i]+'/>'+result.typeDataList[i][j]+'<br>')
            }
          }
        }
      }
    }
  })
  }

  function listRef() {
  $.ajax({
    url: '/client/makeList',
    method: 'post',
    success: function(result) {
    if(result){
      $('#select_APP').empty();
      $('#select_data').empty();
        for(let i=0 ; i<result.applist.length ; i++){
        $('#select_APP').append('<tr id="'+result.applist[i].appName+'"><th scope="row"><div class="checkbox"><label style="font-size: 1em"><input type="checkbox" name="APP_check" id="APP_check" value="'+result.applist[i].appName+'"><span class="cr"><i class="cr-icon fa fa-check"></i></span></label></div></th><td>'+result.applist[i].appName+'</td><td>'+result.applist[i].version+'</td><td>'+result.applist[i].description+'</td><td>'+result.applist[i].author.name+'</td><td>'+result.applist[i].author.email+'</td><td><button type="button" class="btn btn-dark"><a href="download/'+result.applist[i].appName.split('.')[0]+".zip"+'">download</a></button></td></tr><tr>');
        }
        for(let i=0 ; i<result.datalist.length ; i++){
        $('#select_data').append('<tr id="'+result.datalist[i].dataName+'"><th scope="row"><div class="checkbox"><label style="font-size: 1em"><input type="checkbox" value="'+result.datalist[i].dataName+'" id="data_check"><span class="cr"><i class="cr-icon fa fa-check"></i></span></label></div></th><td>'+result.datalist[i].dataName+'</td><td>'+result.datalist[i].size+'</td><td>'+result.datalist[i].description+'</td><td>'+result.datalist[i].Uploader+'</td></tr></tr>');
        }
      }
    }
  })
  }
  function buttonDisable(){
  if($('input:checkbox[id=APP_check]:checked').length == 1){
    document.getElementById('ready_button').disabled = false
    if ($('#role').html() == 2)  {
      document.getElementById('delApp').disabled = false
      document.getElementById('addApp').disabled = true
    }
  } else if ($('input:checkbox[id=APP_check]:checked').length |= 1){
    document.getElementById('ready_button').disabled = true
    document.all.readyToSpark.style.display="none"
    if ($('#role').html() == 2)  {
      document.getElementById('addApp').disabled = true
    }
  }

  if ($('input:checkbox[id=APP_check]:checked').length == 0){
    if ($('#role').html() == 2)  {
      document.getElementById('addApp').disabled = false
      document.getElementById('delApp').disabled = true
    }
  }
}

  let parameterKey = new Array()
  $('#selector button').click(function() {
  $(this).addClass('active').siblings().removeClass('active');

  let emailBtnClass = document.getElementById("emailBtn").classList
  let slackBtnClass = document.getElementById("slackBtn").classList

  if(emailBtnClass[emailBtnClass.length-1] == 'active'){
    $('#user').attr('placeholder', 'Input your Email')
  } else if(slackBtnClass[slackBtnClass.length-1] == 'active'){
    $('#user').attr('placeholder', 'Input your Slack channel')
  }

  });
  $('.sparkRun').click( function() {

    //파라미터값 초기화
    let parameterValue = ''

  for(let i=0 ; i < parameterKey.length ; i++){
    if($('#'+parameterKey[i]).attr('type') == 'text'){
        parameterValue += parameterKey[i] + '=' + $('#'+parameterKey[i]).val()+' '
    }else if ($('#'+parameterKey[i]).attr('type') == 'radio' || $('#'+parameterKey[i]).attr('type') == 'checkbox'){
      let checkLists = []
      parameterValue += parameterKey[i] + '='
      $('input[name="'+parameterKey[i]+'/"]:checked').each(function(j){
          checkLists.push($(this).val())
      })
      for(let j = 0 ; j < checkLists.length ; j++){
          parameterValue += checkLists[j] + ' '
      }
    }
  }

  //예외처리
  if ($('input:checkbox[id=data_check]').is(':checked') == false){
    alert('please select data file')
  } else if($('input:checkbox[id=data_check]:checked').length > 1){
    alert('please check only one data')
  } else if($('input:checkbox[id=APP_check]:checked').length > 1){
    alert('please check only one Application')
  }else if ($('input:checkbox[id=APP_check]').is(':checked') == false){
    alert('please select Application')
  } else{
    let check = confirm("Do you want running selected app?")
    if(check){
      $.ajax({
      url: 'api/v2/'+$('input:checkbox[id=APP_check]:checked').val().split('.')[0],
      method: 'post',
      data: {
        'app_name' : $('input:checkbox[id=APP_check]:checked').val(),
        'file' : $('input:checkbox[id=data_check]:checked').val(),
        'parameter' : parameterValue,
        'callback_method': $(".btn-group > button.active").val(),
        'callback_addr' : $('#user').val()
      },
      dataType: 'json',
      success: function(result) {
        if(result){
          $('.result').html(result.result);
        }
      }
      })
      location.replace("pages?name=App_status")
    }
    }
  })

  $(document).ready(function(){
  listRef();
  })

  $('#select_APP').click(function(){
  buttonDisable()
  })

  $('#delApp').click(function(){
    let check = confirm("Do you want delete checked app?")
    if(check) {
      for(let i = 0 ; i < $('input:checkbox[id=APP_check]:checked').length ; i++){
        let selectedApp = $('input:checkbox[id=APP_check]:checked')[i].value
        $.ajax({
          url: "/admin/delApp",
          dataType: "json",
          method: "get",
          data : {"id" : selectedApp},
          success: function(result) {
              if(!result.result) {
                  alert("failed metadata delete ")
              } else {
                listRef()
                buttonDisable()
              }
          }, 
          error : function(error) {
              console.log(error)
          }
        })
      }            
    }
  })

  $('#addAppBtn').click(function() {
    info = JSON.parse($('#metaText').html())
    let appValue = $('#appFile').val().split("\\");
    info.appName = appValue[appValue.length-1];
    let jsonValue = $('#metaFile').val().split("\\")
    if (appValue[appValue.length-1].split(".")[0] == jsonValue[jsonValue.length-1].split(".")[0]) {
      //app data
      let form = $('#fileForm')[0];
      let formData = new FormData(form);
      formData.append("metaFile",$('#metaFile'))
      //save : app(.py..) + parameterFile(.json..) in mongodb 
      $.ajax({
          url: '/admin/saveApp',
          data: formData,
          method: 'POST',
          processData: false,
          contentType: false,
          success: function (result) {
              if(result.status) {
                  alert("App 업로드에 성공하였습니다.")
              } else {
                  alert(result.result)
              }
              listRef()
          },
          error: function (err) {
              console.log(err);
          }
        });       
      } else {
      alert("please same file name")
    }
  })
  let info ={
      "appName": "",
      "description": "",
      "author": {
          "name" : "",
          "email" : ""
      },
      "parameters": [],
      "version" :  "",
      "type" : ""
  }

  function readTextFile(file, callback) {
      let rawFile = new XMLHttpRequest();
              rawFile.overrideMimeType("application/json;charset=euc-kr");
              rawFile.open("GET", file, true);
              rawFile.onreadystatechange = function() {
              if (rawFile.readyState === 4 && rawFile.status == "200") {
                  callback(rawFile.responseText);
          }
      }
      rawFile.send(null);
  }

$('#appFile').change(function() {
      document.getElementById("appFileName").innerHTML = appFile.files[0].name
})

$('#metaFile').change(function(e) {
  document.getElementById("metaFileName").innerHTML = metaFile.files[0].name

  const files = e.target.files;
  // console.log(files)
  if(files && files.length > 0) {
    const targetFile = files[0]
    try {
      const path = window.URL.createObjectURL(targetFile)
      readTextFile(path, function(text){
          $('#metaText').html(text)
      })
      $.getJSON(path, function(data) {
        info.appName = data.appName
        info.description = data.description
        info.author.name = data.author.name
        info.author.email = data.author.email
        info.version = data.version
        info.type = data.type
        
        let inputParameters = []

        try {
        if (data.parameters.length > 0) {
            for (let i in data.parameters) {
                inputParameters.push(data.parameters[i])
            }
          }
        } catch (e) {console.log(e)}
        info.parameters = inputParameters
    })
  }
  catch(ex) {
      console.log(ex)
      try {
        const fileReader = new FileReader();
        fileReader.onload = (event) =>  {
            console.log("fileReader " + event.target.result)
        }
        fileReader.readAsDataURL(targetFile)
      }
      catch (e) {
        console.log("file upload not supported : ")
      }
    }
  }
})