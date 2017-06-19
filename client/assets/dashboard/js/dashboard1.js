 $(document).ready(function () {
    'use strict';

    var count;
    
    //Delete score from db
    $('.fa-trash').click(function() {
        var base = window.location.hostname;
        var date = $(this).val();
        $.post('/api/scores/' + date, {date:date}, function(data, status){
            window.location.reload();
        })
    });

    var getData = function(callback){
       $.ajax({
           type: 'GET',
           url:  '/api/scores',
       }).done(function(data){
           var v = {x:[], y:[]};
           var happy = 0;
           var sad = 0;

           for (let obj of data){
                v.x.unshift(obj.date);
                v.y.unshift(obj.score)
                if(obj.score > 5) happy+=1;
                else sad+=1;
           }

           $('#happy-days').html(happy);
           $('#sad-days').html(sad);

            callback(
                {
                   values: v,
                   key: 'scores',
                    color: '#ff7f0e'
                },
            );
        }); 
    };

    let loadGraph = function(data) {
        count = data.values.x.length;
        $('#mood-count').html(data.values.x.length);

        var options = {
            high: 10,
            low: 0,
            scaleMinSpace: 1,
            onlyInteger: true
        }

         //ct-visits
         new Chartist.Line('#ct-visits', {
            labels: data.values.x,
            series: [data.values.y]
         }, {
            top: 0,
            high: 10,
            low: 0,
            scaleMinSpace: 1,
            onlyInteger: true,
            showPoint: true,
            fullWidth: true,
            plugins: [
                Chartist.plugins.tooltip()
            ],
            axisY: {
                labelInterpolationFnc: function (value) {
                 return (value / 1);
                }
            },
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value.substring(6);

                }
            },
            showArea: true
        });

         // counter
         $('.counter').counterUp({
            delay: 100,
            time: 1200
         });
    }

     var sparklineLogin = function () {
         $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7ace4c'
         });
         $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7460ee'
         });
         $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#11a0f8'
         });
         $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#f33155'
         });
     }
     var sparkResize;
     $(window).on('resize', function (e) {
         clearTimeout(sparkResize);
         sparkResize = setTimeout(sparklineLogin, 500);
     });
     sparklineLogin();
     getData(loadGraph);

     //popup for adding mood
    $('#add-mood').click(function(){
        $('#about_popup').popup({
            pagecontainer: '.row',
            transition: 'all 0.3s',
            color: '#fff',
            vertical: 'top'       
        });
    });

    //set default date to today
    function toISO8601(date) {
      var d  = date.getDate();
      if(d < 10) d = '0' + d;
      var m = date.getMonth() + 1;
      if(m < 10) m = '0' + m;
      return date.getFullYear() + '-' + m + '-' +  d;
    }
    if($('#date').length) $('#date').val(toISO8601(new Date()));
 });
