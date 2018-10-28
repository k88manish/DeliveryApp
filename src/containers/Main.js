import React, { Component } from 'react';
import InputForm from '../components/InputForm';
import GraphUtil from '../util/GraphUtil';

export default class Main extends Component {
  state = {};

  componentDidMount() {
    // const gu = new GraphUtil();
    // gu.initialize(['ab1', 'ac4', 'ad10', 'be3', 'cd4', 'cf2', 'de1', 'eb3', 'ea2', 'fd1']);
    // gu.getShortestPath('e', 'd');
    // console.log(gu.calcRouteCost(['e', 'a', 'd']));
    // console.log(gu.calcRouteCost(['e', 'b', 'd']));
    // gu.getAllPossibleRoutes('e', 'd');
  }

  render() {
    return (
      <div>
        <InputForm />
      </div>
    );
  }
}
