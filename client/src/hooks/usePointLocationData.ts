import axios from 'axios';
import {useEffect, useState} from 'react';

interface Input {
  latitude: number | undefined;
  longitude: number | undefined;
}

interface Output {
  loading: boolean;
  error: string | undefined;
  data: undefined | {
    state: string | null;
    elevation: number | null;
  };
}

export default (input: Input) => {
  const {latitude, longitude} = input;

  const [output, setOutput] = useState<Output>({
    loading: true, error: undefined, data: undefined,
  });
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | undefined>(undefined);
  // const [data, setData] = useState<Output['data']>(undefined);

  useEffect(() => {
    const getLocationData = async () => {
      try {
        let state: string | null;
        let elevation: number | null;
        if (latitude && longitude) {
          const geoKey = process.env.REACT_APP_GEO_PLUGIN_API_KEY;
          const resGeo = await axios.get(
            `https://ssl.geoplugin.net/extras/location.gp?lat=${latitude}&lon=${longitude}&format=json&k=${geoKey}`,
          );
          const resUSGS = await axios.get(
            `https://nationalmap.gov/epqs/pqs.php?x=${longitude}&y=${latitude}&units=Feet&output=json`,
          );
          if (resGeo && resGeo.data && resGeo.data.geoplugin_region) {
            state = resGeo.data.geoplugin_region;
          } else {
            state = null;
          }
          if (resUSGS && resUSGS.data &&
              resUSGS.data.USGS_Elevation_Point_Query_Service &&
              resUSGS.data.USGS_Elevation_Point_Query_Service.Elevation_Query &&
              resUSGS.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation) {
            elevation = Math.round(resUSGS.data.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation);
          } else {
            elevation = null;
          }
        } else {
          state = null;
          elevation = null;
        }
        setOutput({loading: false, data: {state, elevation}, error: undefined});
      } catch (e) {
        console.error(e);
        setOutput({loading: false, data: undefined, error: 'Unable to fetch state data'});
      }
    };
    setOutput({loading: true, data: undefined, error: undefined});
    getLocationData();
  }, [latitude, longitude, setOutput]);

  return output;
};
