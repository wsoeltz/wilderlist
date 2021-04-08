import axios from 'axios';
import {useEffect, useState} from 'react';
import {getPointInfoURL} from '../../../routing/services';

interface Input {
  latitude: number | undefined;
  longitude: number | undefined;
}

interface StateDatum {
  id: string | null;
  name: string | null;
  abbreviation: string | null;
}

interface Output {
  loading: boolean;
  error: string | undefined;
  data: undefined | {
    state: null | StateDatum;
    elevation: number | null;
    county: string | null;
    locationText: string | null;
    locationTextShort: string | null;
  };
}

const usePointLocationData = (input: Input) => {
  const {latitude, longitude} = input;

  const [output, setOutput] = useState<Output>({
    loading: true, error: undefined, data: undefined,
  });

  useEffect(() => {
    const getLocationData = async () => {
      try {
        let state: StateDatum | null = null;
        let elevation: number | null = null;
        let county: string | null = null;
        let locationText: string | null = null;
        let locationTextShort: string | null = null;
        if (latitude && longitude) {
          const url = getPointInfoURL({
            coord: [longitude, latitude],
            state: true,
            elevation: true,
            county: true,
          });
          const response = await axios.get(url);
          if (response && response.data) {
            const d = response.data;
            state = {
              id: d.state_id ? d.state_id : null,
              name: d.state_name ? d.state_name : null,
              abbreviation: d.state_abbr ? d.state_abbr : null,
            };
            county = d.county ? d.county : null;
            elevation = d.elevation || d.elevation === 0 ? d.elevation : null;
            locationTextShort = d.state_abbr ? d.state_abbr : null;
            if (d.county && d.state_name) {
              locationText = d.county + ' County, ' + d.state_name;
            } else if (d.state_name) {
              locationText = d.state_name;
            }
          }
        }
        setOutput({loading: false, data: {
          state, elevation, county, locationText, locationTextShort,
        }, error: undefined});
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

export default usePointLocationData;
