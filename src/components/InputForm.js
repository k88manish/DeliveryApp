import React, { Component } from 'react';
import swal from 'sweetalert2';
import GraphUtil from '../util/GraphUtil';
import logo from '../assets/Eko-logo.png';

export default class InputForm extends Component {
  constructor() {
    super();
    this.state = {
      routeText: '',
      findRouteText: '',
      activeOption: '0',
      fromTown: '',
      toTown: '',
      inputError: false,
      maxCost: 0,
      maxStops: 0,
    };
    this.graphUtil = new GraphUtil();
  }

  onRouteChange = (e) => {
    this.setState({ routeText: e.target.value });
  };

  onOptionChange = (e) => {
    this.setState({ activeOption: e.target.value });
  };

  onFindRouteChange = (e) => {
    this.setState({ findRouteText: e.target.value });
  };

  onTownChange = (key, e) => {
    this.setState({ [key]: e.target.value });
  };

  onMaxCostChange = (e) => {
    this.setState({ maxCost: e.target.value });
  };

  onMaxStopChange = (e) => {
    this.setState({ maxStops: e.target.value });
  };

  onRouteInputBlur = () => {
    const { routeText } = this.state;
    const nodes = routeText.split(',').map(e => e.toUpperCase().trim());
    if (routeText.length > 0) {
      if (nodes.length > 1) {
        // this.setState({ nodes });
        this.graphUtil.initialize(nodes);
      } else {
        swal('Error', 'Routes information is not correct. Please correct.', 'error');
      }
    }
  };

  onSubmitClick = () => {
    const { activeOption, routeText } = this.state;
    if (routeText.length === 0) {
      swal({
        type: 'info',
        title: 'Info',
        text: 'Please provide information of routes',
      });
      return;
    }

    if (activeOption === '0') {
      swal({
        type: 'info',
        title: 'Info',
        text: 'Please select an option from dropdown',
      });
    }

    switch (activeOption) {
      case '1':
        this.findPath();
        break;
      case '2':
        this.findPossibleDeliveryRoutes();
        break;
      case '3':
        this.findCheapestRoute();
        break;
      default:
        break;
    }
  };

  findCheapestRoute = () => {
    const { fromTown, toTown } = this.state;

    const from = fromTown.length === 1 && isNaN(Number(fromTown)) ? fromTown.toUpperCase() : false;
    const to = fromTown.length === 1 && isNaN(Number(toTown)) ? toTown.toUpperCase() : false;

    if (from && to) {
      const cheapestRoute = this.graphUtil.getShortestPath(from, to);
      if (cheapestRoute.distance) {
        swal({
          title: '<strong>Cheapest Routes</strong>',
          html: `<strong>Distance</strong>: ${cheapestRoute.distance} <br/>
                  ${cheapestRoute.path.join(' -> ')}`,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Okay!',
        });
      } else {
        swal({
          title: '<strong>Cheapest Routes</strong>',
          html: cheapestRoute,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> Okay!',
        });
      }
    } else {
      console.log('error');
    }
  };

  findPossibleDeliveryRoutes = () => {
    const {
      fromTown, toTown, maxStops, maxCost,
    } = this.state;

    const from = fromTown.length === 1 && isNaN(Number(fromTown)) ? fromTown.toUpperCase() : false;
    const to = fromTown.length === 1 && isNaN(Number(toTown)) ? toTown.toUpperCase() : false;

    if (from && to) {
      let possibleRoutes = this.graphUtil.getAllPossibleRoutes(from, to);

      // filter the routes having zero cost
      possibleRoutes = possibleRoutes.filter(
        route => this.graphUtil.calcRouteCost(route) > 0,
      );

      // Max stop is given, filter the routes for max stops
      if (maxStops > 0) {
        possibleRoutes = possibleRoutes.filter(route => route.length <= maxStops);
      }

      // Max cost is given, filter the routes for max cost
      if (maxCost > 0) {
        possibleRoutes = possibleRoutes.filter(
          route => this.graphUtil.calcRouteCost(route) <= maxCost,
        );
      }

      swal({
        title: '<strong>Possible Routes</strong>',
        html: `<strong>Possible Routes</strong>: ${possibleRoutes.length} <br/>
                ${possibleRoutes.map(route => `${route.join(' -> ')}`).join('<br />')}`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Okay!',
      });
    } else {
      swal('Error', 'Incorrect input', 'error');
    }
  };

  findPath = () => {
    const { findRouteText } = this.state;

    const findingNodes = findRouteText
      .split('-')
      .filter(f => f.trim().length > 0)
      .map(e => e.toUpperCase().trim());
    if (findingNodes.length > 2) {
      const routeCost = this.graphUtil.calcRouteCost(findingNodes);

      swal({
        title: '<strong>Route Cost</strong>',
        html: `${routeCost}`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Okay!',
      });
    } else {
      swal('Error', 'Incorrect input', 'error');
    }
  };

  render() {
    const {
      routeText,
      activeOption,
      toTown,
      fromTown,
      inputError,
      findRouteText,
      maxStops,
      maxCost,
    } = this.state;
    return (
      <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-5-tablet is-4-desktop is-3-widescreen">
              <div className="column">
                <form className="box">
                  <div className="field has-text-centered">
                    <img src={logo} width="167" alt="" />
                  </div>
                  <div className="field">
                    <label className="label">Enter routes (Ex. AB1, AC4, AD10, BE3 ...)</label>
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        className={`input ${inputError ? 'is-danger' : ''}`}
                        onChange={this.onRouteChange}
                        value={routeText}
                        onBlur={this.onRouteInputBlur}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="select">
                      <select defaultValue="0" onChange={this.onOptionChange}>
                        <option value="0">Select Option</option>
                        <option value="1">Get Delivery Cost of Route</option>
                        <option value="2">Get Possible Delivery Routes</option>
                        <option value="3">Get Cheapest Delivery Route between Two town.</option>
                      </select>
                    </div>
                  </div>
                  {activeOption === '1' && (
                    <div className="field">
                      <label className="label">Enter route (Ex. A-B-C)</label>
                      <div className="control has-icons-left">
                        <input
                          type="text"
                          className="input"
                          onChange={this.onFindRouteChange}
                          value={findRouteText}
                        />
                      </div>
                    </div>
                  )}
                  {['2', '3'].indexOf(activeOption) > -1 && (
                    <div className="field columns is-mobile is-centered">
                      <div className="column is-half">
                        <label className="label">From</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            className="input"
                            onChange={e => this.onTownChange('fromTown', e)}
                            value={fromTown}
                          />
                        </div>
                      </div>
                      <div className="column is-half">
                        <label className="label">To</label>
                        <div className="control has-icons-left">
                          <input
                            type="text"
                            className="input"
                            onChange={e => this.onTownChange('toTown', e)}
                            value={toTown}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeOption === '2' && (
                    <div className="field columns is-mobile is-centered">
                      <div className="column is-half">
                        <label className="label">Max. Stops</label>
                        <div className="control has-icons-left">
                          <input
                            type="number"
                            className="input"
                            onChange={this.onMaxStopChange}
                            value={maxStops}
                          />
                        </div>
                      </div>
                      <div className="column is-half">
                        <label className="label">Max. Cost</label>
                        <div className="control has-icons-left">
                          <input
                            type="number"
                            className="input"
                            onChange={this.onMaxCostChange}
                            value={maxCost}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="field">
                    <button
                      type="button"
                      className="button is-success"
                      onClick={this.onSubmitClick}
                    >
                      Get Results
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
