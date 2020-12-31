import {GetString} from 'fluent-react/compat';
import startCase from 'lodash/startCase';
import { UserDatum } from '../../../queries/lists/useComparePeakList';
import { CompletedMountain, PeakListVariants } from '../../../types/graphQLTypes';
import {
  formatDate,
  getFourSeasonCompletion,
  getGridCompletion,
  getStandardCompletion,
  getWinterCompletion,
} from '../Utils';

type BasicAscentGoal = {
  goal: false;
} | {
  goal: true;
  completed: string | null;
};

type FourSeasonAscentGoal = {
  goal: false;
} | {
  goal: true;
  summer: string | null;
  fall: string | null;
  winter: string | null;
  spring: string | null;
};

type GridAscentGoal = {
  goal: false;
} | {
  goal: true;
  january: string | null;
  february: string | null;
  march: string | null;
  april: string | null;
  may: string | null;
  june: string | null;
  july: string | null;
  august: string | null;
  september: string | null;
  october: string | null;
  november: string | null;
  december: string | null;
};

export interface AscentGoals {
  mountainId: string;
  standard: BasicAscentGoal;
  winter: BasicAscentGoal;
  fourSeason: FourSeasonAscentGoal;
  grid: GridAscentGoal;
}

export const getAscentGoals = (
  peakLists: UserDatum['peakLists'], mountainList: CompletedMountain[]) => {

  const ascentGoals: AscentGoals[] = [];
  peakLists.forEach(peakList => {
    const { type } = peakList;
    const listMountains: Array<{id: string}> = peakList.mountains !== null ? peakList.mountains : [];
    listMountains.forEach(mountain => {
      const goalIndex = ascentGoals.findIndex((goal) => goal.mountainId === mountain.id);
      const completedDates = mountainList.find(
        (completedMountain) => completedMountain.mountain && completedMountain.mountain.id === mountain.id);
      // If a peak has been completed, push to the array the information
      if (completedDates !== undefined) {
        if (type === PeakListVariants.standard) {
          const completedDate = getStandardCompletion(completedDates);
          const formattedDate = completedDate !== null && completedDate !== undefined
            ? formatDate(completedDate) : null;
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: {
                goal: true,
                completed: formattedDate,
              },
              winter: { goal: false },
              fourSeason: { goal: false },
              grid: { goal: false },
            });
          } else {
            ascentGoals[goalIndex].standard = {
              goal: true,
              completed: formattedDate,
            };
          }
        } else if (type === PeakListVariants.winter) {
          const completedDate = getWinterCompletion(completedDates);
          const formattedDate = completedDate !== null && completedDate !== undefined
            ? formatDate(completedDate) : null;
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              winter: {
                goal: true,
                completed: formattedDate,
              },
              standard: { goal: false },
              fourSeason: { goal: false },
              grid: { goal: false },
            });
          } else {
            ascentGoals[goalIndex].winter = {
              goal: true,
              completed: formattedDate,
            };
          }
        } else if (type === PeakListVariants.fourSeason) {
          const completedDate = getFourSeasonCompletion(completedDates);

          let summerDate: string | null = null;
          let fallDate: string | null = null;
          let springDate: string | null = null;
          let winterDate: string | null = null;
          if (completedDate !== null) {
            const {summer, fall, spring, winter} = completedDate;
            summerDate = summer !== undefined ? formatDate(summer) : null;
            fallDate = fall !== undefined ? formatDate(fall) : null;
            springDate = spring !== undefined ? formatDate(spring) : null;
            winterDate = winter !== undefined ? formatDate(winter) : null;
          }
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: { goal: false },
              winter: { goal: false },
              fourSeason: {
                goal: true,
                summer: summerDate,
                fall: fallDate,
                spring: springDate,
                winter: winterDate,
              },
              grid: { goal: false },
            });
          } else {
            ascentGoals[goalIndex].fourSeason = {
              goal: true,
              summer: summerDate,
              fall: fallDate,
              spring: springDate,
              winter: winterDate,
            };
          }
        } else if (type === PeakListVariants.grid) {
          const completedDate = getGridCompletion(completedDates);

          let januaryDate: string | null = null;
          let februaryDate: string | null = null;
          let marchDate: string | null = null;
          let aprilDate: string | null = null;
          let mayDate: string | null = null;
          let juneDate: string | null = null;
          let julyDate: string | null = null;
          let augustDate: string | null = null;
          let septemberDate: string | null = null;
          let octoberDate: string | null = null;
          let novemberDate: string | null = null;
          let decemberDate: string | null = null;
          if (completedDate !== null) {
            const {
              january, february, march, april,
              may, june, july, august, september,
              october, november, december,
            } = completedDate;
            januaryDate = january !== undefined ? formatDate(january) : null;
            februaryDate = february !== undefined ? formatDate(february) : null;
            marchDate = march !== undefined ? formatDate(march) : null;
            aprilDate = april !== undefined ? formatDate(april) : null;
            mayDate = may !== undefined ? formatDate(may) : null;
            juneDate = june !== undefined ? formatDate(june) : null;
            julyDate = july !== undefined ? formatDate(july) : null;
            augustDate = august !== undefined ? formatDate(august) : null;
            septemberDate = september !== undefined ? formatDate(september) : null;
            octoberDate = october !== undefined ? formatDate(october) : null;
            novemberDate = november !== undefined ? formatDate(november) : null;
            decemberDate = december !== undefined ? formatDate(december) : null;
          }
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: { goal: false },
              winter: { goal: false },
              fourSeason: { goal: false },
              grid: {
                goal: true,
                january: januaryDate,
                february: februaryDate,
                march: marchDate,
                april: aprilDate,
                may: mayDate,
                june: juneDate,
                july: julyDate,
                august: augustDate,
                september: septemberDate,
                october: octoberDate,
                november: novemberDate,
                december: decemberDate,
              },
            });
          } else {
            ascentGoals[goalIndex].grid = {
              goal: true,
              january: januaryDate,
              february: februaryDate,
              march: marchDate,
              april: aprilDate,
              may: mayDate,
              june: juneDate,
              july: julyDate,
              august: augustDate,
              september: septemberDate,
              october: octoberDate,
              november: novemberDate,
              december: decemberDate,
            };
          }
        }
      } else {
        // if it hasn't, push the peak as a goal for the variant, but with no completion
        if (type === PeakListVariants.standard) {
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: { goal: true, completed: null },
              winter: { goal: false },
              fourSeason: { goal: false},
              grid: { goal: false },
            });
          } else {
            ascentGoals[goalIndex].standard = { goal: true, completed: null };
          }
        } else if (type === PeakListVariants.winter) {
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: { goal: false },
              winter: { goal: true, completed: null },
              fourSeason: { goal: false},
              grid: { goal: false },
            });
          } else {
            ascentGoals[goalIndex].winter = { goal: true, completed: null };
          }
        } else if (type === PeakListVariants.fourSeason) {
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: { goal: false },
              winter: { goal: false },
              fourSeason: {
                goal: true,
                summer: null,
                fall: null,
                spring: null,
                winter: null,
              },
              grid: { goal: false },
            });
          } else {
            ascentGoals[goalIndex].fourSeason = {
              goal: true,
              summer: null,
              fall: null,
              spring: null,
              winter: null,
            };
          }
        } else if (type === PeakListVariants.grid) {
          if (goalIndex === -1) {
            ascentGoals.push({
              mountainId: mountain.id,
              standard: { goal: false },
              winter: { goal: false },
              fourSeason: { goal: false},
              grid: {
                goal: true,
                january: null,
                february: null,
                march: null,
                april: null,
                may: null,
                june: null,
                july: null,
                august: null,
                september: null,
                october: null,
                november: null,
                december: null,
              },
            });
          } else {
            ascentGoals[goalIndex].grid = {
              goal: true,
              january: null,
              february: null,
              march: null,
              april: null,
              may: null,
              june: null,
              july: null,
              august: null,
              september: null,
              october: null,
              november: null,
              december: null,
            };
          }
        }
      }
    });
  });

  return ascentGoals;

};

const getBasicGoal = (ascentGoal: BasicAscentGoal) => {
  if (ascentGoal.goal === true) {
    if (ascentGoal.completed === null) {
      return 'open';
    } else {
      return ascentGoal.completed;
    }
  } else {
    return null;
  }
};

const getFourSeasonGoals = (fourSeason: FourSeasonAscentGoal) => {
  const seasonsNeeded: string[] = [];
  const seasonsCompleted: string[] = [];
  for (const season in fourSeason) {
    if (season as keyof FourSeasonAscentGoal !== 'goal') {
      if (fourSeason[season as keyof FourSeasonAscentGoal] === null) {
        seasonsNeeded.push(season);
      } else {
        seasonsCompleted.push(season);
      }
    }
  }
  return {seasonsNeeded, seasonsCompleted};
};

const getGridGoals = (grid: GridAscentGoal) => {
  const monthsNeeded: string[] = [];
  const monthsCompleted: string[] = [];
  for (const month in grid) {
    if (month as keyof GridAscentGoal !== 'goal') {
      if (grid[month as keyof GridAscentGoal] === null) {
        monthsNeeded.push(month);
      } else {
        monthsCompleted.push(month);
      }
    }
  }
  return {monthsNeeded, monthsCompleted};
};

export const getGoalText = (
  ascentGoals: AscentGoals | undefined, getFluentString: GetString) => {
  if (ascentGoals !== undefined) {
    if (ascentGoals.grid.goal === true) {
      const {monthsNeeded} = getGridGoals(ascentGoals.grid);
      if (monthsNeeded.length === 12) {
        return {text: getFluentString('global-text-value-open'), open: true};
      } else if (monthsNeeded.length === 0) {
        return {text: getFluentString('global-text-value-completed-in-every-month'), open: false};
      } else if (monthsNeeded.length === 1) {
        return {
          text: getFluentString('global-text-value-open-for') + ' ' + startCase(monthsNeeded[0]).slice(0, 3),
          open: false,
        };
      } else {
        const monthList = monthsNeeded.reduce((text, month, index) => {
          if (index === 0) {
            return text = startCase(month).slice(0, 3);
          }
          const divider = index === monthsNeeded.length - 1 ? ' & ' : ', ';
          return text = text + divider + startCase(month).slice(0, 3);
        }, '');
        return {
          text: getFluentString('global-text-value-open-for')
                + ' ' + monthList,
          open: true,
        };
      }
    } else if (ascentGoals.fourSeason.goal === true) {
      const {seasonsNeeded} = getFourSeasonGoals(ascentGoals.fourSeason);
      if (seasonsNeeded.length === 4) {
        return {text: getFluentString('global-text-value-open'), open: true};
      } else if (seasonsNeeded.length === 0) {
        return {text: getFluentString('global-text-value-completed-in-every-season'), open: false};
      } else if (seasonsNeeded.length === 1) {
        return {
          text: getFluentString('global-text-value-open-for') + ' ' + startCase(seasonsNeeded[0]),
          open: false,
        };
      } else {
        const seasonList = seasonsNeeded.reduce((text, season, index) => {
          if (index === 0) {
            return text = startCase(season);
          }
          const divider = index === seasonsNeeded.length - 1 ? ' & ' : ', ';
          return text = text + divider + startCase(season);
        }, '');
        return {
          text: getFluentString('global-text-value-open-for') + ' ' + seasonList,
          open: true,
        };
      }
    } else if (ascentGoals.winter.goal === true) {
      const winterGoal = getBasicGoal(ascentGoals.winter);
      if (winterGoal !== null) {
        if (winterGoal === 'open') {
          if (ascentGoals.standard.goal === true) {
            const standardGoal = getBasicGoal(ascentGoals.standard);
            if (standardGoal === 'open') {
              return {text: getFluentString('global-text-value-open'), open: true};
            }
          }
          return {text: getFluentString('global-text-value-open-for-winter'), open: true};
        } else {
          return {text: getFluentString('global-text-value-completed-on') + ' ' + winterGoal, open: false};
        }
      }
    } else if (ascentGoals.standard.goal === true) {
      const standardGoal = getBasicGoal(ascentGoals.standard);
      if (standardGoal !== null) {
        if (standardGoal === 'open') {
          return {text: getFluentString('global-text-value-open'), open: true};
        } else {
          return {text: getFluentString('global-text-value-completed-on') + ' ' + standardGoal, open: false};
        }
      }
    }
  }
  return {text: getFluentString('global-text-value-mountain-not-being-pursued'), open: null};
};
