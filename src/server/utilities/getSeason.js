// From https://stackoverflow.com/questions/5670678/javascript-coding-input-a-specific-date-output-the-season
Date.fromJulian = function(j) {
    j = (+j) + (30.0 / (24 * 60 * 60));
    let A = Date.julianArray(j, true);
    return new Date(Date.UTC.apply(Date, A));
};
Date.julianArray = function(j, n) {
    let F = Math.floor;
    let j2;
    let JA;
    let a;
    let b;
    let c;
    let d;
    let e;
    let f;
    let g;
    let h;
    let z;
    j += 0.5;
    j2 = (j - F(j)) * 86400.0;
    z = F(j);
    f = j - z;
    if (z < 2299161) {
        a = z;
    } else {
        g = F((z - 1867216.25) / 36524.25);
        a = z + 1 + g - F(g / 4);
    }
    b = a + 1524;
    c = F((b - 122.1) / 365.25);
    d = F(365.25 * c);
    e = F((b - d) / 30.6001);
    h = F((e < 14) ? (e - 1) : (e - 13));
    JA = [F((h > 2) ? (c - 4716) : (c - 4715)),
    h - 1, F(b - d - F(30.6001 * e) + f)];
    let JB = [F(j2 / 3600), F((j2 / 60) % 60), Math.round(j2 % 60)];
    JA = JA.concat(JB);
    if (typeof n === "number") { return JA.slice(0, n); }
    return JA;
};
Date.getSeasons = function(y, wch) {
    y = y || new Date().getFullYear();
    if (y < 1000 || y > 3000) { throw new Error(y + " is out of range"); }
    let Y1 = (y - 2000) / 1000;
    let Y2 = Y1 * Y1;
    let Y3 = Y2 * Y1;
    let Y4 = Y3 * Y1;
    let jd;
    let t;
    let w;
    let d;
    let est = 0;
    let i = 0;
    let Cos = Math.degCos;
    let A = [y];
    let e1 = [485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8];
    let e2 = [324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02,
        247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45];
    let e3 = [1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443,
        65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226,
        29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029,
        31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074];
    while (i < 4) {
        switch (i) {
            case 0:
                jd = 2451623.80984 + 365242.37404 * Y1 + 0.05169 * Y2 - 0.00411 * Y3 - 0.00057 * Y4;
                break;
            case 1:
                jd = 2451716.56767 + 365241.62603 * Y1 + 0.00325 * Y2 + 0.00888 * Y3 - 0.00030 * Y4;
                break;
            case 2:
                jd = 2451810.21715 + 365242.01767 * Y1 - 0.11575 * Y2 + 0.00337 * Y3 + 0.00078 * Y4;
                break;
            case 3:
                jd = 2451900.05952 + 365242.74049 * Y1 - 0.06223 * Y2 - 0.00823 * Y3 + 0.00032 * Y4;
                break;
            default:
                break;
        }
        t = (jd - 2451545.0) / 36525;
        w = 35999.373 * t - 2.47;
        d = 1 + 0.0334 * Cos(w) + 0.0007 * Cos(2 * w);
        est = 0;
        for (let n = 0; n < 24; n++) {
            est += e1[n] * Cos(e2[n] + (e3[n] * t));
        }
        jd += (0.00001 * est) / d;
        A[++i] = Date.fromJulian(jd);
    }
    return wch && A[wch] ? A[wch] : A;
};
Math.degRad = function(d) {
    return (d * Math.PI) / 180.0;
};
Math.degSin = function(d) {
    return Math.sin(Math.degRad(d));
};
Math.degCos = function(d) {
    return Math.cos(Math.degRad(d));
};

export const getSeasonUtility = (year, month, day) => {
    const seasons = Date.getSeasons(year);
    // year is same as year
    // month is 0 - 11, 0 as Jan and 11 as Dec, but app is built with 1 - 12
    // day is 1 - 31
    // time is 23:59 so as to count the whole day as the new season, even though
    // in some cases the change of season may not include the whole day
    const date = new Date(year, month - 1, day, 23, 59);
    const firstDayOfSpring = seasons[1];
    const firstDayOfSummer = seasons[2];
    const firstDayOfFall = seasons[3];
    const firstDayOfWinter = seasons[4];

    if (date >= firstDayOfSpring && date < firstDayOfSummer) {
        return "spring";
    } else if (date >= firstDayOfSummer && date < firstDayOfFall) {
        return "summer";
    } else if (date >= firstDayOfFall && date < firstDayOfWinter) {
        return "fall";
    } else if (date >= firstDayOfWinter || date < firstDayOfSpring) {
        return "winter";
    }
};

export const getSolsticeAndEquinoxUtility = (year) => {
    const seasons = Date.getSeasons(year);
    return {
        firstDayOfFall: seasons[3],
        firstDayOfSpring: seasons[1],
        firstDayOfSummer: seasons[2],
        firstDayOfWinter: seasons[4],
    };
};
