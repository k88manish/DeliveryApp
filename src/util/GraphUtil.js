import Graph from './Graph';

export default class GraphUtil {
  initialize(edges) {
    this.routes = [];

    this.graph = new Graph();

    if (Array.isArray(edges)) {
      edges.forEach((edge) => {
        if (edge.length >= 3) {
          const from = edge.charAt(0);
          const to = edge.charAt(1);
          const cost = edge.substr(2);

          this.graph.addEdges(from, to, cost);
        }
      });
    }
  }

  getShortestPath = (from, to) => {
    // If passed node not exists return 'no route found'
    if (!this.graph.hasNode(from) || !this.graph.hasNode(to)) {
      return 'No route found';
    }

    const startNode = this.graph.edges[from];
    const costs = Object.assign({ [to]: Infinity }, startNode);

    const parents = { [to]: null };

    const childNodes = Object.keys(startNode);
    childNodes.forEach((child) => {
      // add children of start node
      parents[child] = from;
    });

    const processed = [];

    let node = this.lowestCostNode(costs, processed);
    while (node) {
      const children = this.graph.edges[node];
      this.calculateChildCost(node, children, costs, parents, from);
      processed.push(node);
      node = this.lowestCostNode(costs, processed);
    }

    const optimalPath = [to];
    let parent = parents[to];
    while (parent) {
      optimalPath.push(parent);
      parent = parents[parent];
    }

    optimalPath.reverse(); // reverse array to get correct order
    const results = {
      distance: costs[to],
      path: optimalPath,
    };
    return results;
  };

  calculateChildCost = (node, children, costs, parents, startNode) => {
    if (node && children) {
      const cost = costs[node];
      const childKeys = Object.keys(children);
      childKeys.forEach((n) => {
        if (n !== startNode) {
          const newCost = Number(cost) + Number(this.graph.getCost(node, n));
          if (!costs[n] || costs[n] > newCost) {
            costs[n] = newCost;
            parents[n] = node;
          }
        }
      });
    }
  };

  lowestCostNode = (costs, processed) => Object.keys(costs).reduce((lowest, node) => {
    let low = lowest;
    if (low === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        low = node;
      }
    }
    return low;
  }, null);

  calcRouteCost = (input) => {
    if (input.length <= 1) throw new Error('Invalid Input');

    let totalCost = 0;
    for (let i = 0; i < input.length - 1; i += 1) {
      const id0 = input[i];
      const id1 = input[i + 1];

      const node0 = this.graph.edges[id0];
      if (node0) {
        const cost = node0[id1];
        if (!cost) {
          return 'No Such Route';
        }
        totalCost += Number(cost);
      } else {
        return 'No Such Node';
      }
    }

    return totalCost;
  };

  traverse = (source, destination, visitedList, pathList) => {
    // Mark the current node
    const visited = visitedList;
    visited[source] = true;

    if (source === destination) {
      this.routes.push(pathList.map(e => e));
    }

    // Recur for all the vertices
    // adjacent to current vertex
    const node = this.graph.edges[source];
    if (node) {
      Object.keys(node).forEach((child) => {
        if (!visited[child]) {
          // store current node
          // in path[]
          pathList.push(child);
          this.traverse(child, destination, visited, pathList);

          // remove current node
          // in path[]
          pathList.pop();
        }
      });
    }
    // Mark the current node
    visited[source] = false;
  };

  getAllPossibleRoutes = (from, to) => {
    const visited = {};
    const pathList = [];
    this.routes = [];
    this.traverse(from, to, visited, pathList);
    return this.routes;
  };
}
