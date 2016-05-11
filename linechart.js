#!/usr/bin/env node
'use strict'

// Load required modules
const m = require('mithril');


/*
    Problems :
    1. Limited the number of line and the number of points
*/

// Return a JSON containing all data to build the line chart.
const controller = (data) => {
    const lines = data.lines;
    let scales = [];
    let yBiggest = [];
    let xLength = 0;

    // Compute the x axis length.
    for (let i = 0; lines.length > i; ++i) {
        if (lines[i].data.length > xLength)
            xLength = lines[i].data.length;
    }

    // Retrieve the biggest Y value of each line and store it in an array.
    lines.map((line, index) => {
        let copy = line.data.slice();
        copy.sort();
        yBiggest[index] = copy.pop().value;
    });

    // Create an array with the different scale to display.
    let copy = yBiggest.slice();
    copy.sort().reverse();

    let current = copy[0];
    scales.push(current);
    copy.map((big, index) => {
        if (big < current && current - big > 1000) {
            scales.push(big);
            current = big;
        }
    })

    return {
        'grid':         xLength,
        'biggest':      yBiggest,
        'scales':       scales,
        'lines':        data.lines

    };
}

const drawXGrids = (length) => {
    let render = [];

    for (let index = 0; index < length; ++index) {
        render.push(m('line', {
            x1:                 10, //Grid X beginning.
            x2:                 85, // Grid X ending.
            y1:                 85 - (index * 75 / length),
            y2:                 85 - (index * 75 / length)
        }));
    }
    return render;
}


const drawYGrids = (length) => {
    let render = [];

    for (let index = 0; index < length; ++index) {
        render.push(m('line', {
            x1:     10 + (index * 75 / length),
            x2:     10 + (index * 75 / length),
            y1:     10,
            y2:     85
        }));
    }
    return render;
}



// TODO: Add the right color.
const drawYLegends = (scale, length, i) => {
    let render = [];

    for (let index = (i >= 1 ? 1 : 0); index < length + 1; ++index) {
        render.push(m('text', {
            x: 0,
            y: 85 - (index * 75 / (length + 1)) + i * 3
        }, (scale / length * index)));
    }

    return render;
}

const drawXLegends = (lines, length) => {
    const render = [];

    for (let index = 0; index < length; ++index) {

        const tmp = [];
        
        lines.forEach((line, lIndex) => {
            if (line.data[index] != undefined) {
                tmp.push({
                    "label": line.data[index].label.length > 10 ? line.data[index].label.slice(0, 10) + '...' : line.data[index].label,
                    "color": line.color
                });
            }
        });

        let temp = [];
        label : for (let i = 0; i < tmp.length; ++i) {
            for (let j = 0; j < temp.length; j++ ) {
                if (temp[j].label == tmp[i].label)
                    continue label;      
            }
            temp[temp.length] = tmp[i];
        }
        
        temp.forEach((value, tIndex) => {
            const x = (10 + (index * 85 / length) + tIndex * 3);
            render.push(m('text', {
                x: x,
                y: 97,
                fill: value.color,
                style: `transform: rotate(-60deg); transform-origin: ${x}px 97px;`
            }, value.label));
        });
    }

    return render;
}

const chooseScale = (scales, nb) => {
    for (let index = 0; scales.length > index; ++index) {
        if (scales[index] - nb < 1000)
            return scales[index];
    }
}

// Return a SVG line chart.
const view = (ctrl) => {

    const total = ctrl.grid;

    return m('svg', {
        viewBox:        '0 0 100 100',
        xmlns:          'http://www.w3.org/2000/svg',
        'xmlns:xlink':  'http://www.w3.org/1999/xlink'
    }, [        

        // Draw x grid.
        m('g', {
            stroke:             'black',
            opacity:            0.3,
            'stroke-width':     0.3,
            'stroke-dasharray': '1, 1'
        }, drawXGrids(total + 1)),
        
        // Draw grid Y.
        m('g', {
            stroke:             'black',
            opacity:            0.3,
            'stroke-width':     0.3,
            'stroke-dasharray': '1, 1'
        }, drawYGrids(total)),
    
        // Draw grid Y legends.
        m('g', { style: 'font-size: ' + (85 - (85 - (75 / total))) + '%' }, [
            ctrl.scales.map((scale, index) => {
                return drawYLegends(scale, total, index);
            })
        ]),

        // Draw Grid X legends.
        m('g', { style: 'font-size: ' + (85 - (85 - (75 / total))) + '%' }, [
            drawXLegends(ctrl.lines, total)
        ]),

        // Draw lines points.
        m('g', [
            ctrl.lines.map((line, lIndex) => {
                let scale = chooseScale(ctrl.scales, ctrl.biggest[lIndex]);
                return m('g', [
                    line.data.map((point, pIndex) => {
                        return m('circle', {
                           cx:      10 + (pIndex * 75 / total),
                           cy:      85 - ((point.value * total / scale) * 75 / (total + 1)),
                           r:       0.7,
                           fill:    line.color
                        });
                    })
                ])
            })
        ]),

        // Draw straight lines.
        m('g', {
            'stroke-width': 0.5,
            fill:           'none'
        }, [
            ctrl.lines.map((line, lIndex) => {
                let scale = chooseScale(ctrl.scales, ctrl.biggest[lIndex]);
                return m('polyline', {
                    points: line.data.map((point, pIndex) => {
                        return 10 + (pIndex * 75 / total) + ',' + (85 - ((point.value * total / scale) * 75 / (total + 1)));
                    }),
                    stroke: line.color,
                });
            })
        ]),

        // Draw lines legends.
        m('g', [
            ctrl.lines.map((line, index) => {
                // If the text length is above 7 characters then slice it and add '...'.
                const cutText = line.title.length > 7 ? line.title.slice(0, 7) + '...' : line.title;
                return m('g', [
                    m('line', {
                        x1:             90,
                        y1:             20 + (index * 25 / total),
                        x2:             92,
                        y2:             20 + (index * 25 / total),
                        stroke:         line.color,
                        'stroke-width': 0.5
                    }),
                    m('text', {
                        x:      93,
                        y:      20 + (index * 27 / total),
                        style: 'font-size: ' + (85 - (85 - (75 / total))) + '%'
                    }, cutText)
                ])
            })
        ])
    ]);

}

module.exports = {
    controller,
    view
}