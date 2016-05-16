node-mithril-linechart
======================

A simple SVG line chart component for Mithril and NodeJS.

![Line chart screenshot](screenshot.png)

Usage
=====
Add `linechart` to your dependencies on `package.json` file then:

    const linechart = require("linechart");
    const model = {
        "lines": [
            {
                "title": "A",
                "color": "#ff33ee",
                "data": [
                    {
                        "label": "Sample label",
                        "value": 100,
                        "tooltip": "More details"
                    },
                    ...
                ]
            },
            {
                "title": "B",
                "color": "#2233ee",
                "data": [
                    {
                        "label": "Some label",
                        "value": 130,
                        "tooltip": "More details"
                    },
                    ...
                ]
            },
            ...
        ]
    };
    const ctrl = linechart.controller(model);
    const view = linechart.view(ctrl);

Options
=======

* **lines**: Define the lines of the line chart.
    * **title**: Define the title of the line.
    * **color**: Define the color of the line.
    * **data**: Define values to draw the line chart.
        * **label**: X value of the point.
        * **value**: Y value of the point.

Test
====

Setup [mithril-component-tools](https://github.com/mithril-components/mitthril-components-tools) first. Then:

    npm install
    mct test pagination.js en


