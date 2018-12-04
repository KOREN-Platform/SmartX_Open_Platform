//Run when page starts
$(document).ready(function(){
  listRef()
});
//list refresh function
function listRef() {
  $.ajax({
    url: '/client/makeList',
    method: 'post',
    success: function(result) {
    if(result){
      $('#select_data').empty();
      for(let i=0 ; i<result.datalist.length ; i++){
      $('#select_data').append('<tr id="'+result.datalist[i].dataName+'"><th scope="row"><div class="checkbox"><label style="font-size: 1em"><input type="checkbox" value="'+result.datalist[i].dataName+'" id="data_check"><span class="cr"><i class="cr-icon fa fa-check"></i></span></label></div></th><td>'+result.datalist[i].dataName+'</td><td>'+result.datalist[i].size+'</td><td>'+result.datalist[i].description+'</td><td>'+result.datalist[i].Uploader+'</td></tr></tr>');
        }
      }
    }
  })
}

function buttondDisabled(){
if($('input:checkbox[id=data_check]:checked').length > 0){
  document.getElementById('delete').disabled = false
} else{
  document.getElementById('delete').disabled = true
}

}

$('#select_data').click(function(){
buttondDisabled()
})


$('#fileForm').change(function(){
document.getElementById('data_upload').disabled = false
document.getElementById("dataFileName").innerHTML = fileInput.files[0].name
document.all.data_description.style.display=""
})

//upload button function
$('#data_upload').click(function(){
  let form = $('#fileForm')[0]
let formData = new FormData(form)
let fileSize = fileInput.files[0].size

//add file data to form
formData.append("description",$('#description').val())
formData.append("fileSize",fileSize)

const check = confirm("Do you want upload "+fileInput.files[0].name+"?")

if($('#fileInput').val() == ""){
    alert('please select upload file')
}else{
  if(check){
    $.ajax({
      url:'/client/dataUpload',
      processData: false,
      contentType: false,
      data : formData,
        type: 'POST',
        success: function(result){
        if(result){
          listRef()
          buttondDisabled()
          document.all.data_description.style.display="none"
          document.getElementById("dataFileName").innerHTML = "Choose a file"
          document.getElementById('data_upload').disabled = true
        }
        }
    })
  }
  }
})
//delete button function
$('#delete').click( function() {
const check = confirm("Do you want delete checked data?")
if(check){
  if ($('input:checkbox[id=data_check]').is(':checked') == false){
    alert('please select data file')
  }else{
    for(let i = 0 ; $('input:checkbox[id=data_check]:checked').length > 0 ; i++){
      $.ajax({
        url: '/client/dataDelete',
        method: 'post',
        data: {
          'data' : $('input:checkbox[id=data_check]:checked')[i].value
          },
        dataType: 'json',
        success: function(result) {
          if(!result.result){
            alert('delete failed')
          }else{
            listRef()
            buttondDisabled()
            document.getElementById('delete').disabled = true
          }
        }
      })
    }
  }
}
})