const {point, featureCollection} = require('@turf/helpers');
import React, {useEffect} from 'react';
import useMapContext from '../../hooks/useMapContext';
import useGetStatsData from '../../queries/compound/stats/useTotals';

const HeatMapRenderProp = () => {
  const mapContext = useMapContext();
  const { data } = useGetStatsData();

  useEffect(() => {
    try {
      if (mapContext.intialized && data && data.totals) {
        let maxDates = 0;
        const points: any[] = [];
        if (data.totals.mountains) {
          data.totals.mountains.forEach(m => {
            if (m.mountain && m.mountain.location) {
              points.push(point(m.mountain.location, {weight: 10, count: m.dates.length * 10}));
              if (m.dates.length > maxDates) {
                maxDates = m.dates.length;
              }
            }
          });
        }
        if (data.totals.campsites) {
          data.totals.campsites.forEach(m => {
            if (m.campsite && m.campsite.location) {
              points.push(point(m.campsite.location, {weight: 10, count: m.dates.length * 10}));
              if (m.dates.length > maxDates) {
                maxDates = m.dates.length;
              }
            }
          });
        }
        if (data.totals.trails) {
          data.totals.trails.forEach(m => {
            if (m.trail && m.trail.line) {
              m.trail.line.forEach(c => points.push(point(c, {weight: 1, count: m.dates.length * 0.1})));
              if (m.dates.length > maxDates) {
                maxDates = m.dates.length;
              }
            }
          });
        }
        mapContext.setHeatmap(featureCollection(points), maxDates * 10);
      }
    } catch (err) {
      console.error(err);
    }
    return () => {
      if (mapContext.intialized) {
        mapContext.unsetHeatmap();
      }
    };
  }, [data, mapContext]);

  return <></>;
};

export default HeatMapRenderProp;
