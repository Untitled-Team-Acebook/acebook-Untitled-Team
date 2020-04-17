var containerWidth = +d3.select("#friends-graph").style("width").slice(0, -2);
var h = 900;
var margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};
var width = containerWidth - margin.left - margin.right;
var height = h - margin.top - margin.bottom;
var radius = 18;
var linkStrength = 0.2;
var linkLength = 10;
//create a simulation for an array of nodes, and compose the desired forces.
simulation = d3
  .forceSimulation()
  .force(
    "charge",
    d3.forceManyBody().strength(function (d) {
      return -d.rank * d.rank;
    })
  ) // This adds repulsion (if it's negative) between nodes.
  .force("center", d3.forceCenter(width / 2, height / 2.5)) // This force attracts nodes to the center of the svg area
  .force("collision", d3.forceCollide().radius(radius).strength(1.2));

simulation.force(
  "link",
  d3
    .forceLink()
    .distance(linkLength)
    .strength(linkStrength) // This force provides links between nodes
    .id((d) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
);

friendGraph = function () {
  var svg = d3
    .select("#friends-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  console.log("dataset is ... ", friends);

  // Initialize the links
  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(friends.links)
    .enter()
    .append("line");

  // Initialize the nodes
  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(friends.nodes)
    .enter()
    .append("circle")
    .attr("r", radius)
    .style("fill", function (d) {
      return d3.interpolateCool(d.rank / 5);
    })
    .call(
      d3
        .drag() //sets the event listener for the specified typenames and returns the drag behavior.
        .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
        .on("drag", dragged) //drag - after an active pointer moves (on mousemove or touchmove).
        .on("end", dragended) //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
    );

  // Text to nodes
  const text = svg
    .append("g")
    .attr("class", "text")
    .selectAll("text")
    .data(friends.nodes)
    .enter()
    .append("text")
    .text((d) => d.name);

  //Listen for tick events to render the nodes as they update in your Canvas or SVG.
  simulation
    .nodes(friends.nodes) //sets the simulation’s nodes to the specified array of objects, initializing their positions and velocities, and then re-initializes any bound forces;
    .on("tick", ticked); //use simulation.on to listen for tick events as the simulation runs.
  // After this, Each node must be an object. The following properties are assigned by the simulation:
  // index - the node’s zero-based index into nodes
  // x - the node’s current x-position
  // y - the node’s current y-position
  // vx - the node’s current x-velocity
  // vy - the node’s current y-velocity

  simulation.force("link").links(friends.links); //sets the array of links associated with this force, recomputes the distance and strength parameters for each link, and returns this force.
  // After this, Each link is an object with the following properties:
  // source - the link’s source node;
  // target - the link’s target node;
  // index - the zero-based index into links, assigned by this method

  // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    text
      .attr("x", (d) => d.x) //position of the lower left point of the text
      .attr("y", (d) => d.y + 5); //position of the lower left point of the text
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart(); //sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  //the targeted node is released when the gesture ends
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;

    console.log("dataset after dragged is ... ", friends);
  }
  return d3.select("#friends-graph");
};
friendGraph();
