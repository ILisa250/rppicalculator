const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 660 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

const colors = {
    Houses: "#ebcf8a",
    Apartments: "#b69024",
    "Aggregated Index": "#652c2e",
};

const x = d3.scaleBand().range([0, width]).padding(0.6);
const y = d3.scaleLinear().range([height, 0]);
const svg = d3
    .select("#barChart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Fetching data from the server and visualizing it using D3.js
fetch('http://localhost:3000/getIndices')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
    }).then((data) => {
    data.forEach((d) => {
        d.Houses = +d.Houses;
    });

    x.domain(data.map((d) => d.Quarter));
    y.domain([0, d3.max(data, (d) => d.Houses)]);

    svg
        .selectAll(".bar.houses")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar houses")
        .attr("x", (d) => x(d.Quarter))
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .style("fill", colors["Houses"])
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d.Houses))
        .attr("height", (d) => height - y(d.Houses));

    svg
        .selectAll(".label.bar.houses")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label bar houses")
        .attr("x", (d) => x(d.Quarter) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.Houses) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "15px") // font size
        .style("fill", "black")
        .text((d) => d.Houses);

    svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("fill", "black");
    svg.append("g").call(d3.axisLeft(y));
// X-axis label
svg
.append("text")
.attr("x", width / 2)
.attr("y", height + margin.bottom - 1)
.style("text-anchor", "middle")
.style("font-size", "10px")
.style("font-weight", "bold")
.text("Quarters");

// Y-axis label
svg
.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -height / 2)
.attr("y", -margin.left)
.attr("dy", "1em")
.style("text-anchor", "middle")
.style("font-size", "10px")
.style("font-weight", "bold")
.text("Index");
});
