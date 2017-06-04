import './stylesheets/index.scss'
var d3 = require('d3')
var $ = require('jquery')

var rankingScale = [],
    secondsBehindScale = [],
    riderData = [];

$.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(data) {

    for (var i = 0; i < data.length; i++) {

        rankingScale.push(data[i]['Place']);
        secondsBehindScale.push(data[i]['Seconds'] - data[0]['Seconds'])
        riderData.push(data[i])

    }

    console.log(secondsBehindScale)
    plotChart(riderData)



})

function plotChart(data) {

    var margin = {
        top: 50,
        bottom: 50,
        right: 70,
        left: 70
    };

    var width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        xScale = d3.scaleLinear()
        .domain([0, d3.max(secondsBehindScale)])
        .range([0, width]),
        yScale = d3.scaleLinear()
        .domain([0, d3.max(rankingScale)])
        .range([0, height]),
        tooltip = d3.select('body')
        .append('div')
        .style('background', 'white')
        .style('font-size', '10px')
        .style('line-height', '100%')
        .style('position', 'absolute')
        .style('padding', '5px')
        .style('border-radius', '3px')
        .style('opacity', '0'),

        label = d3.select('body')
        .append('div')




    var chart = d3.select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .selectAll('circle')

        .data(data)
        .enter()
        .append('circle')
        .attr('opacity', '0')
        .attr('r', '4')
        .attr('cx', function(d, i) {
            return xScale(d['Seconds'] - riderData[0]['Seconds']);
        })
        .attr('cy', function(d, i) {
            return yScale(d['Place'])
        })
        .attr('fill', function(d, i) {
          return d['Doping'] === "" ? '#FF0' : '#FFF'
        })
        .on('mouseover', function(d, i) {
            d3.select(this)
                .style('opacity', '0.5')

            tooltip.transition()
                .style('opacity', '1')
                .style('z-index', '2')

            var minutes = Math.floor(d['Seconds'] / 60);
            var seconds = (d['Seconds'] - (minutes * 60)) < 10 ? '0' + (d['Seconds'] - (minutes * 60)) : d['Seconds'] - (minutes * 60);
            var time = minutes + ':' + seconds
            var doping = d['Doping'] === "" ? '<br><br>No doping allegations' : '<br><br>' + d['Doping']

            tooltip.html(d['Name'] + ': '+ d['Nationality'] +'<br>Year: '+d['Year']+', Time: '+time + doping)
                .style('left', d3.event.pageX + 8 + 'px')
                .style('top', d3.event.pageY - 65 + 'px')


        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .style('opacity', '1')

            tooltip.style('opacity', '0')
            .style('z-index', '-1')

        })

    var labeling = d3.select('#chart').select('svg').select('g')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .html(function(d, i) {
            return d['Name']
        })
        .attr('opacity', '0')
        .attr('x', function(d, i) {
            return xScale(d['Seconds'] - riderData[0]['Seconds']) + 7;
        })
        .attr('y', function(d, i) {
            return yScale(d['Place']) + 3
        })
        .attr('fill', 'white')
        .attr('font-size', '8px')



        chart.transition()
        .attr('opacity', '1')
        .delay(function(d, i) {
            return i * 70
        })


labeling.transition()
.attr('opacity', '1')
.delay(function(d, i) {
    return i * 70
})



    // Add vertical axis
    function tickNumbers() {
        var a = []
        for (var i = 1; i < 36; i++) {
            a.push(i)
        }
        return a;
    }


    var yAxisScale = d3.scaleLinear()
        .domain([d3.max(rankingScale), 0])
        .range([height, 0]),

        yAxis = d3.axisLeft()
        .scale(yAxisScale)
        .tickValues(tickNumbers())

    var yAxisSelect = d3.select('svg').append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('class', 'axisWhite')


    var yAxisLabel = d3.select('svg')
        .append("text") // text label for the x axis
        .style("fill", "white")
        .text("Ranking")
        .attr('transform', 'translate(' + (margin.left - 30) + ',' + (height / 2 + 80) + ') rotate(-90)')



    yAxis(yAxisSelect); //insert axis

    // Add horizontal axis

    var xAxisScale = d3.scaleLinear()
        .domain([d3.max(secondsBehindScale), 0])
        .range([width, 0]),

        xAxis = d3.axisBottom()
        .scale(xAxisScale)
        .ticks(20),

        xAxisSelect = d3.select('svg').append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
        .attr('class', 'axisWhite')


    var xAxisLabel = d3.select('svg')
        .append("text") // text label for the x axis
        .style("fill", "white")
        .text("Seconds Behind Leader")
        .attr('transform', 'translate(' + (width / 2 - 20) + ',' + (height + margin.top + 40) + ')')



    xAxis(xAxisSelect);


d3.select('svg').append('g')
.append('circle')
.attr('r', '4')
.attr('cx', 150)
.attr('cy', 350)
.attr('fill', '#FF0')

d3.select('svg').append('g').append('circle')
.attr('r', '4')
.attr('cx', 150)
.attr('cy', 375)
.attr('fill', '#FFF')

d3.select('svg')
.append('text')
.style('font-size', '12px')
.style("fill", "white")
.text("Riders with doping allegations")
.attr('transform', 'translate(159,379)')

d3.select('svg')
.append('text')
.style('font-size', '12px')
.style("fill", "white")
.text("Riders with no doping allegations")
.attr('transform', 'translate(159,354)')


}
