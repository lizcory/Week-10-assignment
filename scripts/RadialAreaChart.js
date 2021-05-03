function RadialAreaChart() {

    this._data = null;
    this._sel = null;
    this._colorScale = null;
    this._size = 180;
    this._outerRadius = () => { return this._size/2 };
    this._innerRadius = 150;

    this.data = function () {
        if (arguments.length > 0) {
            this._data = arguments[0];
            return this;
        }
        return this._data;
    };

    this.selection = function () {
        if (arguments.length > 0) {
            this._sel = arguments[0];
            return this;
        }
        return this._sel;
    };

    this.colorScale = function () {
        if (arguments.length > 0) {
            this._colorScale = arguments[0];
            return this;
        }
        return this._colorScale;
    };

    this.size = function () {
        if (arguments.length > 0) {
            this._size = arguments[0];
            this._outerRadius = this._size/2;
            return this;
        }
        return this._size;
    };

    //// DRAW BARS + ARCS ////
    this.draw = function () {

        // X SCALE // 
        let scaleX = d3.scaleBand()
            .domain(this._data.map(d => d.name))
            .range([0, 2 * Math.PI])
            .padding(0.1);

        
        console.log(this._data.map(d => d.name));


        // Y SCALE //
        let scaleY = d3.scaleLinear()
            .domain([0, d3.max(this._data, d => d.total)])
            // .domain([d3.min(this._data, d => d.total), d3.max(this._data, d => d.total)])
            .range([this._innerRadius, this._outerRadius]);

        
        console.log(d3.min(this._data, d => d.total));


        //// ARC ////
        // let arc = d3.arc()
        //     .innerRadius(d => scaleY(d.prevTotal))
        //     .outerRadius(d => scaleY(d.prevTotal+d.value))
        //     // .innerRadius(this._innerRadius)
        //     // .outerRadius(300)
        //     .startAngle(0)
        //     .endAngle(scaleX.bandwidth())
        //     .padAngle(0.01)
        //     .padRadius(this._innerRadius);

        //// BAR ////
        // let barG = this._sel
        //     .selectAll('g')
        //     .data(this._data)
        //     .join('g')
        //     .attr('transform', d => `rotate(${scaleX(d.name) * 180/Math.PI})`);
        // barG.selectAll('path')
        //     .data(d => d.arr)
        //     .join('path')
        //     .attr('fill', d => this._colorScale(d.key))
        //     .attr('d', arc)



       let areaFn = d3.areaRadial()
            .angle(d => scaleX(d.name))
            .innerRadius(scaleY(0))
            // .innerRadius(scaleY(d3.min(this._data, d => d.total)))
            .outerRadius(d => scaleY(d.total));


        pathData = areaFn(this._data);
        // area = d3.areaRadial()
        //     .curve(d3.curveLinearClosed)
        //     .angle(d => scaleX(d.name))

        console.log(pathData);

        this._sel.append("path")
            .attr("fill", "darkslateblue")
            .attr("fill-opacity", 0.6)
            .attr("d", pathData);

        // let areaG = this._sel
        //     .selectAll('g.areaGroup')
        //     .data([1]) // magic number!
        //     .join("g")
        //     .classed("areaGroup",true)
        //     .datum(this._data)
        //     .join('g')

        // areaG.selectAll('path')
        //     .append("path")
        //     .attr("d", areaFn(this._data))
        //     .attr("fill", "green")
        //     .attr("stroke", "black");        
// 

        // this._sel.append("path")
        //     .attr("fill", "steelblue")
        //     .attr("fill-opacity", 0.2)
        //     .attr("d", area
        //         .innerRadius(d => scaleY(d.min))
        //         .outerRadius(d => scaleY(d.max))
        //       (this._data));


        this._drawAxisX(scaleX);
        this._drawAxisY(scaleY);
        // this._legend();
    }

    //// X AXIS ////
    this._drawAxisX = function (scaleX) {
        let axisXG = this._sel
            .selectAll('g.axis-x')
            .data([0])
            .join('g')
            .classed('axis-x', true);

        axisXG.selectAll('g')
            .data(this._data)
            .join('g')
            .attr('transform', d => `
                rotate(${(scaleX(d.name) + scaleX.bandwidth()/2) * 180/Math.PI - 180})
                translate(${this._innerRadius - 10}, 0)
            `)
            .call(g => {
                // append ticks
                g.selectAll('line')
                    .data([0])
                    .join('line')
                    .attr('x1', 8)
                    .attr('x2', 10)
                    .attr('stroke', '#000');
                 // append lines
                g.selectAll('line')
                    .data([0])
                    .join('line')
                    .attr('x1', 8)
                    .attr('x2', 200)
                    .attr('stroke', 'rgba(180,180,180)');
            })
            .call(g => {
                // append text
                g.selectAll('text')
                    .data(d => [d.name])
                    .join('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', d => {
                        let angle = (scaleX(d) + scaleX.bandwidth()/2 + Math.PI) % (2*Math.PI);
                        let rotate = 90;
                        if (angle < Math.PI) {
                            rotate = -90;
                        }
                        return `rotate(${rotate}) translate(0, 3)`;
                    })
                    .text(d => d);
            })
    }

    //// Y AXIS ////
    this._drawAxisY = function (scaleY) {
        let axisYG = this._sel
            .selectAll('g.axis-y')
            .data([0])
            .join('g')
            .classed('axis-y', true);

        axisYG
            .call(g => {
                g.selectAll('g')
                    .data(scaleY.ticks(3))
                    .join('g')
                    .call(g => {
                        g.append('circle')
                            .attr('r', d => scaleY(d))
                    })
                    .call(g => {
                        g.append('text')
                            .attr('y', d => -scaleY(d))
                            .text(d => d)
                    })
            })
    }

    //// LEGEND ////
    // this._legend = function () {
    //     let legendG = this._sel
    //         .selectAll('g.legend')
    //         .data([0])
    //         .join('g')
    //         .classed('legend', true);
        
    //     legendG
    //         .selectAll('g')
    //         .data(colorScale.domain())
    //         .join('g')
    //         .attr('transform', (_, i) => `translate(0, ${i*30})`)
    //         .call(g => {
    //             g.append('rect')
    //                 .attr('width', 15)
    //                 .attr('height', 15)
    //                 .attr('fill', d => colorScale(d))
    //         })
    //         .call(g => {
    //             g.append('text')
    //                 .attr('x', 20)
    //                 .attr('y', 10)
    //                 .text(d => d)
    //         });
    //     legendG
    //         .attr('transform', function() {
    //             let h = this.getBBox().height;
    //             let w = this.getBBox().width;

    //             return `translate(${-w/2}, ${-h/2})`;
    //         })
    // }
// 
    return this;
}