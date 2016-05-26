// Defines that JS code should be executed in "strict mode".
"use strict";

// Load required modules
const m = require("mithril");



// Return a JSON containing all data to build the line chart.
const controller = (data) => {
    const lines = data.lines;
    let scales = [];
    let total = 0;

    // Compute the x axis length.
    for (let i = 0; lines.length > i; ++i) {
        if (lines[i].data.length > total)
            total = lines[i].data.length;
    }

    // Retrieve the biggest Y value of each line and store it in an array.
    lines.map((line, index) => {
        let copy = line.data.slice();
        copy.sort((a, b) => {
            if (a.value > b.value)
                return 1;
            else if (a.value < b.value)
                return -1;
            return 0;
        });
        scales[index] = copy.pop().value;
    });

    return {
        "grid":         total,
        "scales":       scales,
        "lines":        data.lines

    };
}

// Draw x grid.
const drawXGrids = (length) => {
    let render = [];

    for (let index = 0; index < length + 1; ++index) {

        render.push(m("line", {
            x1:                 10, //Grid X beginning.
            x2:                 85, // Grid X ending.
            y1:                 45 - (index * 35 / length),
            y2:                 45 - (index * 35 / length)
        }));
    }
    return render;
}

// Draw y grid.
const drawYGrids = (length) => {
    let render = [];

    for (let index = 0; index < length + 1 ; ++index) {
        render.push(m("line", {
            x1:     10 + (index * 75 / length),
            x2:     10 + (index * 75 / length),
            y1:     10,
            y2:     45
        }));
    }
    return render;
}

// Draw legends for y axis.
const drawYLegends = (lines, scale, color, length, i) => {

    const ySize = 35 / (length + 1);
    const elements = lines.length;
    const legendSize = (ySize / elements > 2 ? 2 : ySize / elements);

    let render = [];

    for (let index = (i >= 1 ? 1 : 0); index < length + 1; ++index) {
        let nb = scale / length * index;
        nb = (Number(nb) === nb && nb % 1 === 0 ? nb : parseFloat(scale / length * index).toFixed(1));
        render.push(m("text", {
            x: 0,
            y: index === 0 ? ((45 - index * ySize) + i * (legendSize * 9 / 10)) : ((45 - index * ySize) - ySize / 3 + i * (legendSize * 9 / 10)),
            fill: color,
            "font-size": legendSize * 9 / 10
        }, nb));
    }

    return render;
}

// Draw legends for x axis.
const drawXLegends = (lines, length) => {

    const xSize = 10 + (75 / length);
    const elements = lines.length;
    const legendSize = (xSize / elements > 2 ? 2 : xSize / elements);

    const render = [];

    for (let index = 0; index < length; ++index) {

        const tmp = [];
        
        lines.forEach((line, lIndex) => {
            if (line.data[index] != undefined) {
                tmp.push({
                    "label": line.data[index].label.length > 10 ? line.data[index].label.slice(0, 10) + "..." : line.data[index].label,
                    "color": line.color
                });
            }
        });
        
        tmp.forEach((value, tIndex) => {
            const x = 5 + (index * 85 / length) + tIndex * legendSize;
            render.push(m("text", {
                x: x,
                y: 53,
                fill: value.color,
                "font-size": legendSize * 9 / 10,
                style: `transform: rotate(-60deg); transform-origin: ${x}px 53px;`
            }, value.label));
        });
    }

    return render;
}

// Return a SVG line chart.
const view = (ctrl) => {

    const total = ctrl.grid;

    return m("svg", {
        viewBox:        "0 0 100 55",
        xmlns:          "http://www.w3.org/2000/svg",
        "xmlns:xlink":  "http://www.w3.org/1999/xlink"
    }, [

        // Draw x grid.
        m("g", {
            stroke:             "black",
            opacity:            0.3,
            "stroke-width":     0.3,
            "stroke-dasharray": "1, 1"
        }, drawXGrids(total + 1)),
        
        // Draw grid Y.
        m("g", {
            stroke:             "black",
            opacity:            0.3,
            "stroke-width":     0.3,
            "stroke-dasharray": "1, 1"
        }, drawYGrids(total)),

        // Draw grid Y legends.
        m("g", [
            ctrl.scales.map((scale, index) => {
                return drawYLegends(ctrl.lines, scale, ctrl.lines[index].color, total, index);
            })
        ]),

        // Draw Grid X legends.
        m("g", [
            drawXLegends(ctrl.lines, total)
        ]),

        // Draw lines points.
        m("g", [
            ctrl.lines.map((line, lIndex) => {
                let scale = ctrl.scales[lIndex];
                return m("g", [
                    line.data.map((point, pIndex) => {
                        return m("circle", {
                           cx:      10 + (pIndex * 75 / total),
                           cy:      45 - ((point.value * total / scale) * 35 / (total + 1)),
                           r:       0.7,
                           fill:    line.color
                        });
                    })
                ])
            })
        ]),

        // Draw straight lines.
        m("g", {
            "stroke-width": 0.5,
            fill:           "none"
        }, [
            ctrl.lines.map((line, lIndex) => {
                let scale = ctrl.scales[lIndex];
                return m("polyline", {
                    points: line.data.map((point, pIndex) => {
                        return 10 + (pIndex * 75 / total) + "," + (45 - ((point.value * total / scale) * 35 / (total + 1)));
                    }),
                    stroke: line.color,
                });
            })
        ]),

        // Draw lines legends.
        m("g", [
            ctrl.lines.map((line, index) => {
                const fontSize = ((30 / ctrl.lines.length > 2) ? 2 : 30 / ctrl.lines.length);
                // If the text length is above 7 characters then slice it and add "...".
                const cutText = line.title.length > 7 ? line.title.slice(0, 7) + "..." : line.title;
                return m("g", [
                    m("line", {
                        x1:             90,
                        y1:             12 + (index * fontSize),
                        x2:             92,
                        y2:             12 + (index * fontSize),
                        stroke:         line.color,
                        "stroke-width": 0.5
                    }),
                    m("text", {
                        x:      93,
                        y:      12.5 + (index * fontSize),
                        "font-size": fontSize * 9 / 10 + "px"
                    }, cutText)
                ])
            })
        ])
    ]);
}

// Export all previous functions.
module.exports = {
    controller,
    view
}