const margin = {t: 50, r:50, b: 50, l: 50};
const padding = 15;
const size = {w: 1000, h: 800};
const svg = d3.select('svg#area');

svg.attr('width', size.w)
    .attr('height', size.h);

const containerG = svg.append('g')
    .classed('container', true)
    .attr('transform', `translate(${size.w/2}, ${size.h/2})`);

size.w = size.w - margin.l - margin.r;
size.h = size.h - margin.t - margin.b;

const columns = ['hp', 'speed', 'attack', 'defense', 'spAtk', 'spDef'];
const colorScale = d3.scaleOrdinal()
    .domain(columns)
    .range(d3.schemeSet2);

d3.csv('data/Pokemon_subset.csv', function(d) {
    d.total = +d.total;
    d.hp = +d.hp;
    d.attack = +d.attack;
    d.defense = +d.defense;
    d.spAtk = +d.spAtk;
    d.spDef = +d.spDef;
    d.speed = +d.speed;



    // d.arr = [
    //     {key: 'hp', value: d.hp},
    //     {key: 'attack', value: d.attack},
    //     {key: 'defense', value: d.defense},
    //     {key: 'spAtk', value: d.spAtk},
    //     {key: 'spDef', value: d.spDef},
    //     {key: 'speed', value: d.speed}
    // ];

    // let sortedArr = d.arr.sort((a, b) => a.key > b.key);
    // let comVal = 0;
    // for (let i in sortedArr) {
    //     let obj = sortedArr[i];
    //     obj.prevTotal = comVal;

    //     comVal += obj.value;
    // }
    // d.arr = sortedArr;


    


    return d;
})
.then(function(data) {
    data = data.sort((a, b) => a.total < b.total);

    // data.forEach((pokemon, index) => {
        // let chart = new RadialAreaChart();
        // chart.data(data)
        //     .selection(containerG)
        //     .colorScale(colorScale)
        //     .size(size.h)
        //     .draw();
    // });

    
    let chart = new RadialAreaChart();
        chart.data(data)
            .selection(containerG)
            .colorScale(colorScale)
            .size(size.h)
            .draw();


});





// function drawArea(data) {
  
//     svg.append("path")
//         .attr("fill", "steelblue")
//         .attr("fill-opacity", 0.2)
//         .attr("d", area
//             .innerRadius(150)
//             .outerRadius(d => scaleY(d.total))
//           (data));
  
//     svg.append("g")
//         .call(xAxis);
  
//     svg.append("g")
//         .call(yAxis);
  
//     return svg.node();
// }

// drawArea();