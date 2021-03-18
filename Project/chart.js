const buildChartData = (data) => {
    let chartData = [];
    for(let date in data.cases){
        let newDataPoint = {
            x: date,
            y: data.cases[date]
        }
        // console.log(date);
        // console.log(newDataPoint)
        chartData.push(newDataPoint);
        
    }
    // console.log(chartData);
    return chartData;
}

const buildPieChart = (data) => {
    let ctx = document.getElementById('pieChart').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    data.active, 
                    data.recovered, 
                    data.deaths
                ],
                backgroundColor : [
                    '#F1DC2D', //aldo
                    '#90F12D', //aldo
                    '#F14141', //aldo
                ],
                hoverBackgroundColor : [
                    '#F1A32D', //aldo
                    '#5CEC0E', //aldo
                    '#EC0E0E', //aldo
                ]
            }],
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                '現在の感染者数',
                '回復した患者の数',
                '死亡者数'
            ]
        },
        options: {
            responsive : true,
            maintainAspectRatio: false,
        }
    });
}

const buildChart = (chartData) => {
    const timeFormat = 'MM/DD/YY';
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            datasets: [{
                label: 'グローバルに蓄積されたコロナデータ',
                backgroundColor: '#959492', //aldo change this, for color
                borderColor: '#000000', //aldo change this, for color
                data: chartData 
            }]
        },
    
        // Configuration options go here
        options: {
            maintainAspectRatio: false,
            tooltips: {
                modex: 'index',
                intersect:false
            },
            scales:     {
                xAxes: [{
                    type: "time",
                    time: {
                        format: timeFormat,
                        tooltipFormat: 'll'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'ケース数'
                    },
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return numeral(value).format('0a');
                        }
                    }
                }]
            }
        }
    });
}