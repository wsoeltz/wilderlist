import React from 'react';
import { mountainDetailLink } from '../../routing/Utils';
import {
  lightBorderColor,
} from '../../styling/styleUtils';
import { CompletedMountain, PeakListVariants } from '../../types/graphQLTypes';
import {
  MountainDatum,
} from '../peakListDetail';
import {
  // TableCellBase,
  MountainName,
  NameCell,
} from '../peakListDetail/MountainRow';

// interface AllPeakGoals {
//   mountainId: string;
//   type: PeakListVariants
// }

interface Props {
  userMountains: CompletedMountain[];
  myMountains: CompletedMountain[];
  mountain: MountainDatum;
  type: PeakListVariants;
  index: number;
  // allMyPeakGoals: AllPeakGoals
  // allUserPeakGoals: AllPeakGoals
}

const ComparisonTable = (props: Props) => {
  const { mountain, index } = props;
  const backgroundColor: React.CSSProperties['backgroundColor'] = (index % 2 === 0) ? undefined : lightBorderColor;

  // let rowContent

  // check is each user is doing this list
  // if one of the users is not
    // return 'Not working on list' for all columns
    // return completion status for other user, no comparison necessarry

  // get all ascents by each user
  // const usersAscents = userMountains.map()
  // const mysAscents = myMountains.map()

  // if neither have any ascents
    // rowContent = <TableCellFullWidth>Open</TableCellFullWidth>
  // else
    // get completion dates for type
    // const user[Variant]Ascent = get[Variant]Completion
    // const my[Variant]Ascent = get[Variant]Completion
    // if neither have any ascents that match the variant
       // rowContent = Open
    // if standard or winter
      // if one or both users have completed the hike for specified variant
      // mark completion dates for each user or list open if no completion
    // if 4-season
      // check if each user has each season
      // if both have all seasons
        // rowContent = <TableCellFullWidth>Completed all seasons</TabelCellFullWidth>
      // else
        // State which ones are open for both parties
    // if grid
      // check if each user has each month
      // if both have all months
        // rowContent = completed all months
      // else
        // state which ones are open for both parties

  return (
    <NameCell style={{backgroundColor}}>
      <MountainName to={mountainDetailLink(mountain.id)}>
        {mountain.name}
      </MountainName>
    </NameCell>
  );

};

export default ComparisonTable;
