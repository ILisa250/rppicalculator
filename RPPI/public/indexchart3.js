const margin3 = { top: 20, right: 20, bottom: 30, left: 40 };
const width3 = 500 - margin3.left - margin3.right;
const height3 = 300 - margin3.top - margin3.bottom;

const colors3 = {
Gasabo: "#ebcf8a",
Kicukiro: "#b69024",
Nyarugenge: "#652c2e",
};

const x3 = d3.scaleBand().range([0, width3]).padding(0.1);
const y3 = d3.scaleLinear().range([height, 0]);
const svg3 = d3
.select("#barChart2")
.append("svg")
.attr("width", width3 + margin3.left + margin3.right)
.attr("height", height3 + margin3.top + margin3.bottom)
.append("g")
.attr("transform", `translate(${margin3.left},${margin3.top})`);

const barData3 = [
{ key: "Gasabo", class: "bar gasabo", labelColor: "black" },
{ key: "Kicukiro", class: "bar Kicukiro", labelColor: "black" },
{ key: "Nyarugenge", class: "bar nyarugenge", labelColor: "black" },
];

// Fetching data from the server and visualizing it using D3.js
fetch('http://localhost:3000/getIndicesbyRegionhouse')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    }).then((data) => {
data.forEach((d) => {
    d.Gasabo = +d.Gasabo;
    d.Kicukiro = +d.Kicukiro;
    d.Nyarugenge = +d.Nyarugenge;
});

x3.domain(data.map((d) => d.Quarter));
y3.domain([
    0,
    d3.max(data, (d) =>
    Math.max(d.Gasabo, d.Kicukiro, d.Nyarugenge)
    ),
]);

barData3.forEach((bar) => {
    svg3
    .selectAll(`.${bar.class}`)
    .data(data)
    .enter()
    .append("rect")
    .attr("class", bar.class)
    .attr(
        "x",
        (d) => x3(d.Quarter) + (barData3.indexOf(bar) * x3.bandwidth()) / 3
    )
    .attr("width", x3.bandwidth() / 3)
    .attr("y", height3)
    .attr("height", 0)
    .style("fill", colors3[bar.key])
    .transition()
    .duration(1000)
    .attr("y", (d) => y3(d[bar.key]))
    .attr("height", (d) => height3 - y3(d[bar.key]));

    svg3
    .selectAll(`.label.${bar.class}`)
    .data(data)
    .enter()
    .append("text")
    .attr("class", `label ${bar.class}`)
    .attr(
        "x",
        (d) =>
        x(d.Quarter) + ((2 * barData3.indexOf(bar) + 1) * x.bandwidth()) / 6
    )
    .attr("y", (d) => y3(d[bar.key]) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "10px") // font size
    .style("fill", bar.labelColor || colors3[bar.key])
    .text((d) => d[bar.key]);
});

svg3
    .append("g")
    .attr("transform", `translate(0,${height3})`)
    .call(d3.axisBottom(x3))
    .selectAll("text") 
    .style("fill", "black");
svg3.append("g").call(d3.axisLeft(y3));

// X-axis label
svg3
    .append("text")
    .attr("x", width3 / 2)
    .attr("y", height3 + margin3.bottom - 1)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .text("Quarters");

// Y-axis label
svg3
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height3 / 2)
    .attr("y", -margin3.left)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .text("Index");

const legendData = [
    { label: "Nyarugenge", key: "Nyarugenge" },
    { label: "Kicukiro", key: "Kicukiro" },
    { label: "Gasabo", key: "Gasabo" },   
];

const legend = svg3
    .selectAll(".legend")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width3 - 350 + i * 100}, ${-margin3.top})`);

legend
    .append("rect")
    .attr("x", (d, i) => i * 20)
    .attr("width", 10) // Size of the legend rect
    .attr("height", 10)
    .style("fill", (d) => colors3[d.key]);

legend
    .append("text")
    .attr("x", (d, i) => i * 20 + -11 + 6)
    .attr("y", 4)
    .attr("dy", ".35em")
    .style("font-size", "10px") //font size
    .style("fill", "#9e9d9d")
    .style("text-anchor", "end")
    .text((d) => d.label);
});