/* tslint:disable:await-promise */
import { State } from '../../graphql/schema/queryTypes/stateType';
interface RawStateDatum {
  _id: string;
  name: string;
  abbreviation: string;
  regions: string[];
  mountains: string[];
  peakLists: string[] | null;
}

interface StateWithFips extends RawStateDatum {
  FIPS: string;
}

const fips_codes = [
  {abbr: 'AL', FIPS: '01', name: 'Alabama'},
  {abbr: 'AK', FIPS: '02', name: 'Alaska'},
  {abbr: 'AZ', FIPS: '04', name: 'Arizona'},
  {abbr: 'AR', FIPS: '05', name: 'Arkansas'},
  {abbr: 'CA', FIPS: '06', name: 'California'},
  {abbr: 'CO', FIPS: '08', name: 'Colorado'},
  {abbr: 'CT', FIPS: '09', name: 'Connecticut'},
  {abbr: 'DE', FIPS: '10', name: 'Delaware'},
  {abbr: 'DC', FIPS: '11', name: 'District of Columbia'},
  {abbr: 'FL', FIPS: '12', name: 'Florida'},
  {abbr: 'GA', FIPS: '13', name: 'Georgia'},
  {abbr: 'HI', FIPS: '15', name: 'Hawaii'},
  {abbr: 'ID', FIPS: '16', name: 'Idaho'},
  {abbr: 'IL', FIPS: '17', name: 'Illinois'},
  {abbr: 'IN', FIPS: '18', name: 'Indiana'},
  {abbr: 'IA', FIPS: '19', name: 'Iowa'},
  {abbr: 'KS', FIPS: '20', name: 'Kansas'},
  {abbr: 'KY', FIPS: '21', name: 'Kentucky'},
  {abbr: 'LA', FIPS: '22', name: 'Louisiana'},
  {abbr: 'ME', FIPS: '23', name: 'Maine'},
  {abbr: 'MD', FIPS: '24', name: 'Maryland'},
  {abbr: 'MA', FIPS: '25', name: 'Massachusetts'},
  {abbr: 'MI', FIPS: '26', name: 'Michigan'},
  {abbr: 'MN', FIPS: '27', name: 'Minnesota'},
  {abbr: 'MS', FIPS: '28', name: 'Mississippi'},
  {abbr: 'MO', FIPS: '29', name: 'Missouri'},
  {abbr: 'MT', FIPS: '30', name: 'Montana'},
  {abbr: 'NE', FIPS: '31', name: 'Nebraska'},
  {abbr: 'NV', FIPS: '32', name: 'Nevada'},
  {abbr: 'NH', FIPS: '33', name: 'New Hampshire'},
  {abbr: 'NJ', FIPS: '34', name: 'New Jersey'},
  {abbr: 'NM', FIPS: '35', name: 'New Mexico'},
  {abbr: 'NY', FIPS: '36', name: 'New York'},
  {abbr: 'NC', FIPS: '37', name: 'North Carolina'},
  {abbr: 'ND', FIPS: '38', name: 'North Dakota'},
  {abbr: 'OH', FIPS: '39', name: 'Ohio'},
  {abbr: 'OK', FIPS: '40', name: 'Oklahoma'},
  {abbr: 'OR', FIPS: '41', name: 'Oregon'},
  {abbr: 'PA', FIPS: '42', name: 'Pennsylvania'},
  {abbr: 'RI', FIPS: '44', name: 'Rhode Island'},
  {abbr: 'SC', FIPS: '45', name: 'South Carolina'},
  {abbr: 'SD', FIPS: '46', name: 'South Dakota'},
  {abbr: 'TN', FIPS: '47', name: 'Tennessee'},
  {abbr: 'TX', FIPS: '48', name: 'Texas'},
  {abbr: 'UT', FIPS: '49', name: 'Utah'},
  {abbr: 'VT', FIPS: '50', name: 'Vermont'},
  {abbr: 'VA', FIPS: '51', name: 'Virginia'},
  {abbr: 'WA', FIPS: '53', name: 'Washington'},
  {abbr: 'WV', FIPS: '54', name: 'West Virginia'},
  {abbr: 'WI', FIPS: '55', name: 'Wisconsin'},
  {abbr: 'WY', FIPS: '56', name: 'Wyoming'},
  {abbr: 'AS', FIPS: '60', name: 'American Samoa'},
  {abbr: 'FM', FIPS: '64', name: 'Federated States of Micronesia'},
  {abbr: 'GU', FIPS: '66', name: 'Guam'},
  {abbr: 'MP', FIPS: '69', name: 'Northern Mariana Islands'},
  {abbr: 'PW', FIPS: '70', name: 'Palau'},
  {abbr: 'PR', FIPS: '72', name: 'Puerto Rico'},
  {abbr: 'VI', FIPS: '78', name: 'Virgin Islands'},
];

export default async (abbreviation?: string) => {
  try {
    const res = await State.find({});
    const mergedData: StateWithFips[] = [];
    res.map(state => {
      const targetFips = fips_codes.find(({abbr}) => abbr === (state as any)._doc.abbreviation);
      if (targetFips) {
        mergedData.push({...(state as any)._doc, FIPS: targetFips.FIPS});
      }
    })

    const getStateFromFips = (stctyfips: string) => {
      const stateFipsId = stctyfips.slice(0, 2);
      const target = mergedData.find(({FIPS}) => FIPS === stateFipsId);
      return target;
    }
    return getStateFromFips;
  } catch (err) {
    console.error(err);
    return null;
  }
};
