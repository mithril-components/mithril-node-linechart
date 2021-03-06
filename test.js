#!/usr/bin/env node
'use strict'

// Load required modules
const fs            = require('fs');
const render        = require('mithril-node-render');
const linechart     = require('./linechart');

const model = {
    "lines": [
        {
            "title": "Line A",
            "color": "#02B3E7",
            "data": [
                {
                    "label": "label 0",
                    "value": 1000,
                    "tooltip": "More details"
                },
                {
                    "label": "label 1",
                    "value": 120,
                    "tooltip": "More details"
                },
                {
                    "label": "label 2",
                    "value": 20050,
                    "tooltip": "More details"
                },
                {
                    "label": "label 3",
                    "value": 30000,
                    "tooltip": "More details"
                },
                {
                    "label": "label 4",
                    "value": 15000,
                    "tooltip": "More details"
                }
            ]
        },
        {
            "title": "Line B",
            "color": "#FFEC62",
            "data": [
                {
                    "label": "label 0",
                    "value": 1000,
                    "tooltip": "More details"
                },
                {
                    "label": "label B",
                    "value": 2000,
                    "tooltip": "More details"
                },
                {
                    "label": "label C",
                    "value": 3000,
                    "tooltip": "More details"
                },
                {
                    "label": "label D",
                    "value": 4000,
                    "tooltip": "More details"
                },
                {
                    "label": "label E",
                    "value": 5000,
                    "tooltip": "More details"
                }
            ]
        },
        {
            "title": "Line C",
            "color": "#EB0D42",
            "data": [
                {
                    "label": "label 9",
                    "value": 75,
                    "tooltip": "More details"
                },
                {
                    "label": "label 8",
                    "value": 100,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 150,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 150,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 200,
                    "tooltip": "More details"
                }
            ]
        },
        {
            "title": "Line D",
            "color": "#1A5EA3",
            "data": [
                {
                    "label": "label 9",
                    "value": 20,
                    "tooltip": "More details"
                },
                {
                    "label": "label 8",
                    "value": 10,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 50,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 0,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 35,
                    "tooltip": "More details"
                }
            ]
        },
        {
            "title": "Line E",
            "color": "#31E02A",
            "data": [
                {
                    "label": "label 9",
                    "value": 0,
                    "tooltip": "More details"
                },
                {
                    "label": "label 8",
                    "value": 8,
                    "tooltip": "More details"
                },
                {
                    "label": "label 7",
                    "value": 3,
                    "tooltip": "More details"
                }
            ]
        }
    ]
};

const ctrl = linechart.controller(model);
const view = linechart.view(ctrl);
const innerHtml = render(view);

console.log(innerHtml);
