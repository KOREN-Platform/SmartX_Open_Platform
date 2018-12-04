$(document).ready(function() {
    var table2 = $('#dtVerticalScrollExample1').DataTable({
    "scrollY": "200px",
    "scrollCollapse": true,
    "order" : [[1, "desc"]]
});
  allRefreshState();
  setInterval( allRefreshState ,2000);
  })

  $('.stateList').change(function() {
      var application_id = $(this).val()
      $.ajax({
          url: '/client/appState',
          dataType: 'json',
          type: 'GET',
          data: {"id":application_id},
          success:function(result) {
              var elapsedTime = result.result.elapsedTime;
              var sec_gap = elapsedTime /1000;
              var min_gap = Math.floor(elapsedTime /1000/60);
              var hour_gap = Math.floor(elapsedTime / 1000 / 60 /60);
              var name = result.result.name;			

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
        var stateLen = result.result.length;
        let runningData =[]
        let finishedData = []
        let RunningLen = 0
        let FinishedLen = 0
        for(var i=0; i<stateLen; i++) {
          var id = result.result[i].id;
          var name = result.result[i].name;
          var state = result.result[i].state;
          var elapsedTime = result.result[i].elapsedTime;
          var sec_gap = elapsedTime /1000;
          var min_gap = Math.floor(elapsedTime /1000/60);
          var hour_gap = Math.floor(elapsedTime / 1000 / 60 /60);
          var startedTime = new Date(result.result[i].startedTime).toString()
          var finishedTime = new Date(result.result[i].finishedTime).toString()
          
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
        if (RunningLen != beforeRunningLen) {
          $('#runState1').empty()
          for (var i=0; i<runningData.length; i++) {
            let id = runningData[i].id
            let name = runningData[i].name
            let state = runningData[i].state
            let elapsedTime = runningData[i].elapsedTime
            let startedTime = runningData[i].startedTime
            let finishedTime = runningData[i].finishedTime
          }
          beforeRunningLen = RunningLen
          RunningLen = 0
        } 
        if (FinishedLen != beforeFinishedLen) {
          $('#doneState1').empty()
          $('#dtVerticalScrollExample1').DataTable().clear()
          $('#dtVerticalScrollExample1').DataTable().destroy()
          for (var i =0; i <finishedData.length; i++) {
            let id = finishedData[i].id
            let name = finishedData[i].name
            let state = finishedData[i].state
            let elapsedTime = finishedData[i].elapsedTime
            let startedTime = finishedData[i].startedTime
            let finishedTime = finishedData[i].finishedTime
            $('#doneState1').append('<tr><td>'+id.split("application_")[1]+'</td><td>'+name+'</td><td>'+state+'</td><td>'+elapsedTime+'</td><td>'+startedTime+'</td><td>'+finishedTime+'</td></tr>')
          }

          var table2 = $('#dtVerticalScrollExample1').DataTable({
            "scrollY": "200px",
            "scrollCollapse": true,
            "order" : [[1, "desc"]]
          }).draw()

          $("#doneState1").on('click', 'tr', function(){
            if (!$(this).hasClass('selected')){
              table2.$('tr.selected').removeClass('selected')
              $(this).addClass('selected')
            }
            $('#resultTextBox').html('processing...')
            let app_id = table2.row(this).data()[0].split('_')[1]
            app_id *= 1
            $.ajax({
              url: '/client/resultLoad',
              method: 'post',
              data: {
                'app_id' : app_id
                },
              dataType: 'json',
              success: function(result) {
                if(result){
                  $('#resultTextBox').html(result.result)
                }
              }
            })
          })

          beforeFinishedLen = FinishedLen
          FinishedLen =0
        }
        
      },
        error : function(error) {
          console.log(error)
          }
      })
  }