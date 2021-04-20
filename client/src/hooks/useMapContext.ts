import { useContext } from 'react';
import MapContext from '../contextProviders/mapContext';

const useMapContext = () => {
  const mapContext = useContext(MapContext);
  return mapContext;
};

export default useMapContext;
