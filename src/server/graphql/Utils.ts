/* tslint:disable:await-promise */
import mongoose from 'mongoose';

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
