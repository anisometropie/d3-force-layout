const nodes = fetch("data/nodes.json").then(res => res.json());
const links = fetch("data/links.json").then(res => res.json());

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3.forceLink().id(function(d) {
      return d.id;
    })
  )
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

Promise.all([nodes, links]).then(res => {
  const nodes = res[0];
  const links = res[1];

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line");

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 2.5)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  node.append("title").text(function(d) {
    return d.id;
  });

  simulation.nodes(nodes).on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node.attr("cx", d => d.x).attr("cy", d => d.y);
  });

  simulation.force("link").links(links);
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
