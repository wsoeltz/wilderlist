/* tslint:disable:await-promise */
import mongoose from 'mongoose';
import { PeakListVariants } from './graphQLTypes';

export async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array);
    } catch (err) {
      console.error(err);
    }
  }
}

type Models = typeof mongoose.Model;

export const removeConnections = (
  PrimaryModel: Models, id: string, connectedField: string, SecondaryModel: Models, othersConnectField: string,
  ) => {
  return new Promise((resolve, reject) => {
    PrimaryModel.findById(id)
      .select({[connectedField]: true})
      .exec(async function(err: any, doc: any) {
        if (err) {
          console.error(err);
        } else if (doc) {
          try {
            await asyncForEach(doc[connectedField], async (itemId: string) => {
              await SecondaryModel.findByIdAndUpdate(itemId, {
                $pull: { [othersConnectField]: id},
              });
            });
            resolve(true);
          } catch (err) {
            reject(err);
          }
        }
    });
  });
};

// Errors out at compile time if a discriminating `switch` doesn't catch all cases
// of an enum and at run time if for some reason an invalid enum value is passed.
// See https://basarat.gitbooks.io/typescript/content/docs/types/discriminated-unions.html
export function failIfValidOrNonExhaustive(_variable: never, message: string): never {
  throw new Error(message);
}

export const getType = (type: PeakListVariants) => {
  if (type === PeakListVariants.standard) {
    return '';
  } else if (type === PeakListVariants.winter) {
    return ' - Winter';
  } else if (type === PeakListVariants.fourSeason) {
    return ' - 4-Season';
  } else if (type === PeakListVariants.grid) {
    return ' - Grid';
  } else {
    failIfValidOrNonExhaustive(type, 'Invalid PeakListVariants ' + type);
    return '';
  }
};
