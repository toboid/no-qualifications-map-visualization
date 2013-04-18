﻿/*jslint browser: true*/
/*global d3, unqualified, topojson, boundaries*/

/// <reference path="libraries/d3.v3.min.js" />
/// <reference path="libraries/topojson.v0.js" />
/// <reference path="data/unqualified.js" />
/// <reference path="data/boundaries.js" />

var ts = ts || {};

ts.choropleth = (function () {
    "use strict";

    var body,
        svg,
        mapGrp,
        width = 960,
        height = 1160,
        centered,
        tooltip,

    projection = d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(6000)
        .translate([width / 2, height / 2]),

    path = d3.geo.path().projection(projection),

    colourScale = d3.scale.quantize()
        .domain([unqualified.summary.min_percent, unqualified.summary.max_percent])
        .range(d3.range(9).map(function (i) { return "q" + i + "-9"; })),

    click = function(d) {
        var x,
            y,
            scaleFactor,
            lineScaleFactor;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            scaleFactor = 6;
            lineScaleFactor = 3;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            scaleFactor = 1;
            lineScaleFactor = 1;
            centered = null;
        }

        d3.selectAll("path")
            .classed("active", centered && function (d) {
                return d === centered;
            });

        mapGrp.transition()
            .duration(1000)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scaleFactor + ")translate(" + -x + "," + -y + ")");

        d3.transition()
            .duration(1000)
            .select("#constituencies")
            .style("stroke-width", 0.05 / lineScaleFactor + "px");

        // If using the filter then change this to adjust the filter instead.
        d3.transition()
            .duration(1000)
            .select("#cntry-bndry-ext")
            .style("stroke-width", 2.5 / lineScaleFactor + "px");

    },

    mouseover = function (d, i) {
        var vals = unqualified.data[d.id];
        tooltip.style("opacity", .9).text(vals.name);
    },

    mousemove = function (d, i) {
        tooltip.style("left", (d3.event.pageX - 65) + "px")
            .style("top", (d3.event.pageY - 60) + "px");
    },

    mouseout = function () {
        tooltip.style("opacity", 1e-6);
    },

    draw = function (b) {
        body = b;

        tooltip = b.append("div")
            .attr("class", "tooltip")
            .style("opacity", 1e-6);

        svg = body.append("svg")
             .attr("viewBox", "0 0 " + width + " " + height)
             .attr("width", width)
             .attr("height", height);

        mapGrp = svg.append("g").attr("id", "mapGrp");

        svg.append("filter")
            .attr("id", "dropshadow")
            .append("feGaussianBlur")
            .attr("stdDeviation", 5);

        // External boundary.
        mapGrp.append("path")
           .datum(topojson.mesh(boundaries, boundaries.objects.constituencies, function (a, b) { return a === b; }))
           .attr("id", "cntry-bndry-ext")
           .attr("d", path);

        // Constituencies.
        mapGrp.append("g")
            .attr("class", "YlGn constituency")
            .attr("id", "constituencies")
            .selectAll("path")
            .data(topojson.object(boundaries, boundaries.objects.constituencies).geometries)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return colourScale(unqualified.data[d.id].percent_unqual);
            })
            .attr("d", path)
            .on("click", click)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);
    };

    return {
        draw: draw
    };
}());

