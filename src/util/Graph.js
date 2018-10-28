export default class Graph {
  constructor() {
    this.edges = {};
    this.nodes = [];
  }

  addEdges(from, to, cost) {
    if (!this.edges[from]) {
      this.addNodes(from);
      this.edges[from] = {};
    }
    this.addNodes(to);
    this.edges[from][to] = cost;
  }

  addNodes(node) {
    if (!this.hasNode(node)) {
      this.nodes.push(node);
    }
  }

  hasNode(node) {
    return this.nodes.indexOf(node) > -1;
  }

  getCost(from, to) {
    const cost = this.edges[from][to];
    return cost || 0;
  }
}
