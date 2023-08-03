import * as d3 from 'd3'
import "./Content.css";

export function DotPlot(props) {  
  chart = {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);
    
    svg.append("g")
        .attr("fill", "steelblue")
      .selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length));
  
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
    
    return svg.node();
  }


  data = {
    const data = await d3.json("https://data.sfgov.org/resource/vw6y-z8j6.json?$limit=5000");
    
    data.forEach(d => {
      d.requested_datetime = new Date(d.requested_datetime);
      if (d.updated_datetime) d.updated_datetime = new Date(d.updated_datetime);
      if (d.closed_date) d.closed_date = new Date(d.closed_date);
    })
    
    return Object.assign(data, { x: "", y: "Incidents" });
  }

  dateTimeExtent = d3.extent(data, d => d.requested_datetime)

  thresholds = d3.timeHour.every(2).range(...dateTimeExtent)

  bins = d3.histogram()
    .domain(dateTimeExtent)
    .thresholds(thresholds)
    .value(d => d.requested_datetime)
  (data)

  x = d3.scaleTime()
    .domain(dateTimeExtent)
    .range([margin.left, width - margin.right])

  y = d3.scaleLinear()
  .domain([0, d3.max(bins, d => d.length)]).nice()
  .range([height - margin.bottom, margin.top])

  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
          .tickValues(thresholds) // <-- aligns ticks with bins correctly
          .tickSizeOuter(0))
    .call(g => g.selectAll(".tick > text")
        .attr("transform", "rotate(90) translate(23 -12)")) // <-- rotates axis tick labels to keep them readable
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -4)
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(data.x))
    
        yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))
  
  height = 500

  margin = ({top: 20, right: 20, bottom: 60, left: 40})

  
  return (
      <div>
        <div className="plot">
        </div>
      </div>
  )
}