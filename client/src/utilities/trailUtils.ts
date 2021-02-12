enum SteepnessClass {
  Level = 'flat',
  NearlyLevel = 'nearly flat',
  VeryGentleSlope = 'very gentle',
  GentleSlope = 'gentle',
  ModerateSlope = 'moderate',
  StrongSlope = 'moderately steep',
  VeryStrongSlope = 'steep',
  ExtremeSlope = 'very steep',
  SteepSlope = 'extremely steep',
  VerySteepSlope = 'extremely steep',
}

export const slopeToSteepnessClass = (slope: number) => {
  if (slope < 0.5) {
    return SteepnessClass.Level;
  } else if (slope < 1.1) {
    return SteepnessClass.NearlyLevel;
  } else if (slope < 3) {
    return SteepnessClass.VeryGentleSlope;
  } else if (slope < 5) {
    return SteepnessClass.GentleSlope;
  } else if (slope < 8) {
    return SteepnessClass.ModerateSlope;
  } else if (slope < 16.5) {
    return SteepnessClass.StrongSlope;
  } else if (slope < 24) {
    return SteepnessClass.VeryStrongSlope;
  } else if (slope < 35) {
    return SteepnessClass.ExtremeSlope;
  } else if (slope < 45) {
    return SteepnessClass.SteepSlope;
  } else {
    return SteepnessClass.VerySteepSlope;
  }
};
