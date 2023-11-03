const width2 = 200;
const height2 = 350;
const radius = Math.min(width2, height2) / 2;

const svg2 = d3.select("#donutChart")
  .append("svg")
  .attr("width", width2)
  .attr("height", height2)
  .append("g")
  .attr("transform", `translate(${width2 / 2},${height2 / 2})`);

// Fetching data from the server and visualizing it using D3.js
fetch('http://localhost:3000/getcountsbyRegion')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();}).then(data => {
  // Filter the data to get only the "Kicukiro" location
  const kicukiroData = data.find(d => d.Location === "kicukiro");

  // Convert string values to numbers
  kicukiroData.Houses = +kicukiroData.Houses;
  kicukiroData.Apartments = +kicukiroData.Apartments;

  // Calculate the total number of houses and apartments in Kicukiro
  const totalKicukiro = kicukiroData.Houses + kicukiroData.Apartments;

  // Convert counts to percentages
  const housePercentage = (kicukiroData.Houses / totalKicukiro) * 100;
  const apartmentPercentage = (kicukiroData.Apartments / totalKicukiro) * 100;

  const kicukiroChartData = [
    { label: "Houses", value: housePercentage },
    { label: "Apartments", value: apartmentPercentage }
  ];

  const color = d3.scaleOrdinal()
    .domain(kicukiroChartData.map(d => d.label))
    .range(['#ebcf8a', '#b69024']);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().outerRadius(radius).innerRadius(0);

  const arcs = svg2.selectAll(".arc")
    .data(pie(kicukiroChartData))
    .enter().append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .transition()
    .duration(1000)
    .attrTween("d", d => {
      const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return t => arc(interpolate(t));
    });

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("font-size", "15px") // font size
    .style("text-anchor", "middle")
    .text(d => d3.format(".1f")(d.value) + "%");

  const legend = svg2.selectAll(".legend")
    .data(kicukiroChartData.map(d => d.label))
    .enter().append("g")
    .attr("class", "legend")
    .style("display", "flex")
    .attr("transform", (d, i) => `translate(${width2 / 2 - 80},${-height2 / 2 + i * 20})`);

  legend.append("rect")
    .attr("x", 60)
    .attr("y", 15)
    .attr("width", 13)
    .attr("height", 13)
    .style("fill", color);

  legend.append("text")
    .attr("x",55)
    .attr("y", 22)
    .attr("dy", ".35em")
    .style("font-size", "13px") // font size
    .style("fill", "#9e9d9d")
    .style("text-anchor", "end")
    .text(d => d);
});
