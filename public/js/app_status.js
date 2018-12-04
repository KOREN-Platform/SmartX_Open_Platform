$(document).ready(function() {
  let table1 = $('#dtVerticalScrollExample').DataTable({
    "scrollY": "200px",
    "scrollCollapse": true,
    "order" : [[1, "desc"]]
  });
  allRefreshState();
  setInterval( allRefreshState ,2000);
  })
  $('.stateList').change(function() {
    let application_id = $(this).val()
    $.ajax({
      url: '/client/appState',
      dataType: 'json',
      type: 'GET',
      data: {"id":application_id},
      success:function(result) {
          let elapsedTime = result.result.elapsedTime;
          let sec_gap = elapsedTime /1000;
          let min_gap = Math.floor(elapsedTime /1000/60);
          let hour_gap = Math.floor(elapsedTime / 1000 / 60 /60);
          let name = result.result.name;			

          $('#id').html("id : "+result.result.id)
          $('#name').html("name : "+result.result.name)
          $('#elapsedTime').html("elapsedTime : "+  hour_gap + "시" + min_gap+ "분" +sec_gap + "초")
          $('#startedTime').html("startedTime : "+new Date(result.result.startedTime).toString())
          $('#finishedTime').html("finishedTime : "+ new Date(result.result.finishedTime).toString())
          $('#state').html("state : " + result.result.state)
        },	
      error:function(error) {
        console.log("error : " + error)	
      }
    })
  })
let beforeRunningLen = null
let beforeFinishedLen = null
function allRefreshState() {
  $.ajax({
    url:'/client/clientYarnAll',
    method:'get',
    success: function(result){
      let stateLen = result.result.length;
      let runningData =[]
      let finishedData = []
      let RunningLen = 0
      let FinishedLen = 0
      for(let i=0; i<stateLen; i++) {
        let id = result.result[i].id;
        let name = result.result[i].name;
        let state = result.result[i].state;
        let elapsedTime = result.result[i].elapsedTime;
        let sec_gap = elapsedTime /1000;
        let min_gap = Math.floor(elapsedTime /1000/60);
        let hour_gap = Math.floor(elapsedTime / 1000 / 60 /60);
        let startedTime = new Date(result.result[i].startedTime).toString()
        let finishedTime = new Date(result.result[i].finishedTime).toString()
        
        if (state =="RUNNING"){
          runningData.push({
            id : id,
            name : name,
            state : state,
            elapsedTime :hour_gap + "시" + min_gap+ "분" +sec_gap + "초",
            startedTime :startedTime,
            finishedTime : finishedTime
          })
          RunningLen++
        } else if (state =="FINISHED"){
          FinishedLen++
          finishedData.push({
            id : id,
            name : name,
            state : state,
            elapsedTime :hour_gap + "시" + min_gap+ "분" +sec_gap + "초",
            startedTime :startedTime,
            finishedTime : finishedTime
          })
        }
      }
        $('#runState1').empty()
        $('#dtVerticalScrollExample').DataTable().clear()
        $('#dtVerticalScrollExample').DataTable().destroy()
        for (let i=0; i<runningData.length; i++) {
          let id = runningData[i].id
          let name = runningData[i].name
          let state = runningData[i].state
          let elapsedTime = runningData[i].elapsedTime
          let startedTime = runningData[i].startedTime
          let finishedTime = runningData[i].finishedTime
          $('#dtVerticalScrollExample').find('tbody').append('<tr> <td>'+id.split("application_")[1]+'</td>'+'<td>'+name+'</td>'+'<td>'+elapsedTime+'</td>'+'<td>'+startedTime+'</td>'+'<td>'+finishedTime+'</td>'+'<td>'+state+' <img src="images/ajax-loader.gif" width="20px" height="20px"> </td> </tr> ')
        }
        $('#dtVerticalScrollExample').DataTable({
          "scrollY": "200px",
          "scrollCollapse": true,
          "order" : [[1, "desc"]]
        }).draw()  
        beforeRunningLen = RunningLen
        RunningLen = 0

      if (FinishedLen != beforeFinishedLen) {
        $('#doneState1').empty()  
        for (let i =0; i <finishedData.length; i++) {
          let id = finishedData[i].id
          let name = finishedData[i].name
          let state = finishedData[i].state
          let elapsedTime = finishedData[i].elapsedTime
          let startedTime = finishedData[i].startedTime
          let finishedTime = finishedData[i].finishedTime
        }
        beforeFinishedLen = FinishedLen
        FinishedLen =0
      }
    },
    error : function(error) {
      console.log(error)
    }
  })
}