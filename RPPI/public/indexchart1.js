// Setup
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const colors = {
    Houses: "#ebcf8a",
    Apartments: "#b69024",
    "Aggregated Index": "#652c2e",
};

const x = d3.scaleBand().range([0, width]).padding(0.1);
const y = d3.scaleLinear().range([height, 0]);
const svg = d3.select("#barChart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const barData = [
    { key: "Houses", class: "bar houses", labelColor: "black" },
    { key: "Apartments", class: "bar Apartments", labelColor: "black" },
    { key: "Aggregated Index", class: "bar index", labelColor: "black" },
];

// Fetching data from the server and visualizing it using D3.js
fetch('http://localhost:3000/getIndices')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.forEach((d) => {
            d.Houses = +d.Houses;
            d.Apartments = +d.Apartments;
            d["Aggregated Index"] = +d["Aggregated Index"];
        });

        x.domain(data.map((d) => d.Quarter));
        y.domain([0, d3.max(data, (d) => Math.max(d.Houses, d.Apartments, d["Aggregated Index"]))]);

        // Bars
        barData.forEach((bar) => {
            svg.selectAll(`.${bar.class}`)
                .data(data)
                .enter()
                .append("rect")
                .attr("class", bar.class)
                .attr("x", (d) => x(d.Quarter) + (barData.indexOf(bar) * x.bandwidth()) / 3)
                .attr("width", x.bandwidth() / 3)
                .attr("y", height)
                .attr("height", 0)
                .style("fill", colors[bar.key])
                .transition()
                .duration(1000)
                .attr("y", (d) => y(d[bar.key]))
                .attr("height", (d) => height - y(d[bar.key]));

            // Labels
            svg.selectAll(`.label.${bar.class}`)
                .data(data)
                .enter()
                .append("text")
                .attr("class", `label ${bar.class}`)
                .attr("x", (d) => x(d.Quarter) + ((2 * barData.indexOf(bar) + 1) * x.bandwidth()) / 6)
                .attr("y", (d) => y(d[bar.key]) - 5)
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .style("fill", bar.labelColor || colors[bar.key])
                .text((d) => d[bar.key]);
        });

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("fill", "black");

        svg.append("g").call(d3.axisLeft(y));

        // X-axis label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 1)
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text("Quarters");

        // Y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text("Index");

        // Legend
        const legendData = [
            { label: "Houses", key: "Houses" },
            { label: "Apartments", key: "Apartments" },
            { label: "Aggregated Index", key: "Aggregated Index" },
        ];

        const legend = svg.selectAll(".legend")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
            .attr("x", width - 16)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", (d) => colors[d.key]);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 4)
            .attr("dy", ".35em")
            .style("font-size", "10px")
            .style("fill", "#9e9d9d")
            .style("text-anchor", "end")
            .text((d) => d.label);
    })
    .catch(error => {
        console.error('Fetch error: ', error);
    });