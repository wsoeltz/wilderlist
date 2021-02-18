const {point} = require('@turf/helpers');
const explode = require('@turf/explode').default;
const nearestPoint = require('@turf/nearest-point').default;
const PathFinder = require('./geojson-path-finder');

const getPathFinder = (geojson: any) => {
  const pathFinder = new PathFinder(geojson, {
    weightFn: function(a: [number, number], b: [number, number], props: any) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        let multiplier = 1;
        if (props.type !== 'road' && props.type !== 'dirtroad') {
          multiplier -= 0.3;
        }
        if (props.name) {
          multiplier -= 0.3;
        }
        const weight =  Math.sqrt(dx * dx + dy * dy) * multiplier;
        return weight;
    },
    edgeDataReduceFn: function (_unused: any, props: any) {
      return {
        ...props,
        id: props.id ? props.id : `DEST ID ${props.name}`.toUpperCase().split(' ').join('_'),
      };
    }
  });

  const graph = explode(geojson);
  const nearestPointInNetwork = (coords: [number, number]) => nearestPoint(point(coords), graph);

  return {pathFinder, nearestPointInNetwork};
}

export default getPathFinder;
