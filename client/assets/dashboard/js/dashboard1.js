 $(document).ready(function () {
    'use strict';

    let months = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var populateTable = function(scores) {
        var html = '';
        $('#scoresTable tbody').html(html);
        for (let entry of scores){
            html += '<tr>' +
                    '<td>' + entry.date + '</td>' +
                    '<td>' + entry.score + '</td>' +
                    '<td class="txt-oflo">' + entry.comment + '</td>' +
                    '<td><button class="fa fa-trash rb" value="' + entry.date + '"></button></td>' +
                    '</tr>';
        }
        $('#scoresTable tbody').html(html);
    }

    $('.fa-trash').click(function() {
        var base = window.location.hostname;
        var date = $(this).val();
        $.post('/api/scores/' + date, {date:date}, function(data, status){
            window.location.reload();
        })
    });

    var getData = function(graph, filter, happySadWidget){
       $.ajax({
           type: 'GET',
           url:  '/api/scores',
       }).done(function(data){
           var v = {x:[], y:[]};
           var scoresArrangedByMonths = {};
           var happy = 0;
           var sad = 0;

           for (let obj of data){
                var yyMM = obj.date.substring(0,7);
                if (yyMM in scoresArrangedByMonths) scoresArrangedByMonths[yyMM].push(obj);
                else scoresArrangedByMonths[yyMM] = [obj];

                v.x.unshift(obj.date);
                v.y.unshift(obj.score)
                if(obj.score > 5) happy+=1;
                else sad+=1;
            }

            happySadWidget(happy, sad)

            filter(scoresArrangedByMonths);
            graph(
                {
                   values: v,
                   key: 'scores',
                   color: '#ff7f0e'
                },
            );
        }); 
    };

    let loadGraph = function(data) {
        $('#mood-count').html(data.values.x.length);

        var config = {
            type: 'line',
            data: {
                labels: data.values.x,
                datasets: [{
                    label: "score",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: data.values.y,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Mood Score'
                        }
                    }]
                }
            }
        };

        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx, config);

         $('.counter').counterUp({
            delay: 100,
            time: 1200
         });
    }

    let applyMonthsFilter = function(scoresArrangedByMonths) {
        var filters = [];

        for (let key in scoresArrangedByMonths) {
            let year = key.substring(0,4);
            let month = key.substring(5,7)
            $('#scoreFilter').append('<option value="' + year + '-' + month + '">'+ months[parseInt(month)] + " " + year + '</option>');
        }

        $('#scoreFilter').change(function() {
            let selectedMonth = $(this).val();
            populateTable(scoresArrangedByMonths[selectedMonth]);
        });
    }

    let populateHappySadWidget = function(happy, sad) {
       $('#happy-days').html(happy);
       $('#sad-days').html(sad);
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
     getData(loadGraph, applyMonthsFilter, populateHappySadWidget);

     //popup for adding mood
    $('#add-mood').click(function() {
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
