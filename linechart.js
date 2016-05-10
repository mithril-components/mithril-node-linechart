#!/usr/bin/env node
'use strict'

// Load required modules
const m = require('mithril');


/*
    Problems :
    1. Limited the number of line and the number of points
    2. Normalize the Y scale :
        [ 100, 150, 200, 300, 400 ]
        [ 100, 200, 300, 3000, 4000 ]

    Questions :
    1. How could I 
    Normalize the scale :
    Utiliser des couleurs differentes pour les echelles
    Un nombre de 4000 en axe Y peut aussi partager la meme valeur de l'echelle qu'un nombre 200, il faut juste utiliser deux couleurs differentes.
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

    console.log("Biggest : ");
    console.log(yBiggest);
    console.log("Scale : ");
    console.log(scales);
    console.log("Grid : ");
    console.log(xLength);

    return {
        'grid':       xLength,
        'biggest':    yBiggest,
        'lines':      data.lines

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
        }, drawXGrids(total)),
        
        // Draw grid Y.
        m('g', {
            stroke:             'black',
            opacity:            0.3,
            'stroke-width':     0.3,
            'stroke-dasharray': '1, 1'
        }, drawYGrids(total)),
        /*
        // Draw grid X legends.
        m('g', { style: 'font-size: ' + (85 - (85 - (75 / totalX))) + '%' }, [
            ctrl.xGrid.map((x, index) => {
            // If the text length is above 7 characters then slice it and add '...'.
            const cutText = x.length > 7 ? x.slice(0, 7) + '...' : x;
                return m('text', {
                    x: 0,
                    y: 85 - (index * 75 / totalX)
                }, cutText);
            })
        ]),
       
        

        // Draw Grid Y legends.
        m('g', { style: 'font-size: ' + (85 - (85 - (75 / totalX))) + '%' }, [
            ctrl.yGrid.map((y, index) => {
                // If the text length is above 7 characters then slice it and add '...'.
                const cutText = y.length > 7 ? y.slice(0, 7) + '...' : y;
                const x = (10 + (index * 85 / totalY));
                return m('text', {
                    x: x,
                    y: 97,
                    style: `transform: rotate(-60deg); transform-origin: ${x}px <97></97>px;`
                }, cutText);
            })
        ]),
        */
        /*
        // Draw lines points.
        m('g', [
            ctrl.lines.map((line, index) => {
                return m('g', [
                    line.points.map((point, index) => {
                        return m('circle', {
                           cx:      10 + (point[0] * 75 / totalY),
                           cy:      85 - (point[1] * 75 / totalX),
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
            ctrl.lines.map((line, index) => {
                return m('polyline', {
                    points: line.points.map((point, index) => {
                        return 10 + (point[0] * 75 / totalY) + ',' + (85 - (point[1] * 75 / totalX));
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
                        y1:             20 + (index * 25 / totalX),
                        x2:             92,
                        y2:             20 + (index * 25 / totalX),
                        stroke:         line.color,
                        'stroke-width': 0.5
                    }),
                    m('text', {
                        x:      93,
                        y:      20 + (index * 27 / totalX),
                        style: 'font-size: ' + (85 - (85 - (75 / totalX))) + '%'
                    }, cutText)
                ])
            })
        ])
        */
    ]);

}

module.exports = {
    controller,
    view
}