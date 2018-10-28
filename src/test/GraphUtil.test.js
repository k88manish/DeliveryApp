import GraphUtil from '../util/GraphUtil';

const gu = new GraphUtil();
gu.initialize(['AB1', 'AC4', 'AD10', 'BE3', 'CD4', 'CF2', 'DE1', 'EB3', 'EA2', 'FD1']);

describe('Test Possible Routes:', () => {
  it('Possible Routes between E to D should be 3', () => {
    const result = gu.getAllPossibleRoutes('E', 'D');
    expect(result.length).toEqual(3);
  });

  it('Possible Routes between E to E should be 1', () => {
    const result = gu.getAllPossibleRoutes('E', 'E');
    expect(result.length).toEqual(1);
  });
});

describe('Test Delivery Cost of given input:', () => {
  it('Delivery cost of A-B-E should be 4', () => {
    const result = gu.calcRouteCost(['A', 'B', 'E']);
    expect(result).toEqual(4);
  });

  it('Delivery cost of A-D should be 10', () => {
    const result = gu.calcRouteCost(['A', 'D']);
    expect(result).toEqual(10);
  });

  it('Delivery cost of E-A-C-F should be 8', () => {
    const result = gu.calcRouteCost(['E', 'A', 'C', 'F']);
    expect(result).toEqual(8);
  });

  it('Delivery cost of A-D-F should be No Such Route', () => {
    const result = gu.calcRouteCost(['A', 'D', 'F']);
    expect(result).toEqual('No Such Route');
  });
});

describe('Test Cost of cheapest Delivery:', () => {
  it('Cheapset Delivery cost of E-D should be 9', () => {
    const result = gu.getShortestPath('E', 'D');
    expect(result.distance).toEqual(9);
  });
});
