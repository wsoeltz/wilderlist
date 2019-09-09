/* tslint:disable:max-line-length */
import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  min-height: 170px;
`;

const Ribbon = ({fill}: {fill: string}) => {
  return(
    <Svg viewBox='0 0 1330 970'>
      <path style={{fill}} d='M240.77,379.29c0,9.12.58,18.29-.2,27.35-1.4,16.08-2.63,32.28-5.76,48.08-4.88,24.59-16,46.36-34.62,63.66-13.2,12.26-29.32,19.2-46.42,24.16-3.54,1-4.62-.19-5.63-3.56q-15.7-52.47,17.49-95.87a197.48,197.48,0,0,1,41.16-40.38c10.89-7.88,21.38-16.3,32.06-24.48Z'/>
      <path style={{fill}} d='M240.37,511.77c1,10.58,1.8,19.76,2.67,28.94,2.19,23.2,2.18,46.42-3.3,69.12-7.26,30-24.8,52.86-51.72,68.23-4.46,2.55-9.27,4.5-13.94,6.68-3.64,1.7-6.35.43-7.67-3.11-7.54-20.26-11.8-41.17-7-62.57,5.57-25.06,18.9-46.29,36.38-64.8,10.87-11.51,22.39-22.4,33.73-33.45C232.33,518,235.6,515.69,240.37,511.77Z'/>
      <path style={{fill}} d='M242.17,788.27c-20-29.38-26.9-60.27-17.16-93.95,6.09-21,16.85-39.9,29.3-57.74,6.57-9.41,14-18.21,21.09-27.28,1.35-1.74,2.78-3.43,4.49-5.53,10.14,30,18.12,59.82,17.78,90.91C297.32,726.1,287,753.73,261.42,774,255.31,778.78,248.93,783.25,242.17,788.27Z'/>
      <path style={{fill}} d='M215.39,920.55c6.87-3.24,12.9-6.44,19.19-9,13.49-5.42,26.85-11.38,40.74-15.48,21.13-6.23,43.06-9.52,64.84-5,22.29,4.66,41.13,16.39,56.12,33.84,1.16,1.35,3.23,2.34,3.61,3.82.52,2.05.76,5.44-.43,6.48-31.78,27.71-68.33,34.05-108.17,22.61-25.65-7.37-49-20.17-71.88-33.61C218.3,923.62,217.47,922.5,215.39,920.55Z'/>
      <path style={{fill}} d='M45.78,679c28.61-.14,55.43,1.93,81.49,9.1,29.55,8.13,54.16,24,69.2,51.54,5.81,10.63,9,22.7,14.22,36.32-12.94,1.51-23.83,3.22-34.79,4-22,1.51-41.23-6.76-59-18.73S84.49,734,72.3,716.47C63.79,704.22,55.09,692.1,45.78,679Z'/>
      <path style={{fill}} d='M298.17,865.42c-19,8.61-36.65,14.9-56.29,14-25.93-1.16-47.73-12-68.65-26.56-19.61-13.64-35.88-30.57-52.24-47.58-.45-.47-.56-1.26-1.25-2.87,14.26-1.93,28.16-4.5,42.19-5.54,20.62-1.54,41.21-1.38,61.6,3.71,22.42,5.6,41.23,16.39,54.85,35.28C285.07,845.17,291.15,854.9,298.17,865.42Z'/>
      <path style={{fill}} d='M144.89,671.24C118,673.94,93.73,669,71.8,653.13c-18.27-13.24-32.1-30.34-42.86-49.62C18.76,585.24,10.74,565.77,1,545.2c15.69,4,29.42,6.94,42.77,11.1,28.68,9,55.7,20.77,76,44.49,16.23,19,23.6,40.81,24.38,65.33A47.69,47.69,0,0,0,144.89,671.24Z'/>
      <path style={{fill}} d='M246.76,6.79c4.13,17,8.28,32.32,11.49,47.8,4.78,23,6.74,46.28,1.05,69.43-5.19,21.09-16.76,38.43-33.41,52.27-6.28,5.23-13.11,9.81-20.15,15-13.67-19-20.88-39.07-20.84-61.53.07-32.07,14.11-59,31.9-84.36,7.88-11.23,16.63-21.85,25-32.72C243,11.18,244.26,9.76,246.76,6.79Z'/>
      <path style={{fill}} d='M350,877.83c-12.35-11-24.26-21.83-32.28-37.29-14.45-27.87-15.8-56.71-9.46-86.22,4.57-21.32,11.36-42.16,17.16-63.22h2.67c6.48,10,13,20,19.43,30.12,4.54,7.16,9.3,14.22,13.19,21.73,11.73,22.67,19.79,46.1,18.31,72.42-1.34,23.72-12.75,42.41-26.09,60.59C352.43,876.66,351.4,877,350,877.83Z'/>
      <path style={{fill}} d='M272.48,256.64c-3.84,14.75-6.63,28.6-11.14,41.87-4.39,12.93-10.19,25.42-16,37.81-6.7,14.25-17,25.86-28.57,36.44-19.79,18-43.95,23.47-70.63,25.35-.31-5.48-1-10.61-.82-15.72.77-23.66,7.93-45.36,23.44-63.26,13.05-15.06,27.84-28.42,46.55-36.78,15.58-7,30.75-14.84,46.18-22.16C264.45,258.78,267.79,258.13,272.48,256.64Z'/>
      <path style={{fill}} d='M53,277.15c14.7,15.09,28.83,28.23,41.33,42.76C113,341.69,128,365.68,130.69,395.4c2,21.15-4.12,40.41-13.26,59A12.68,12.68,0,0,1,115,457c-16.52-8.5-31.11-18.89-42.71-33.93-16-20.76-23-44.35-23.59-69.75-.48-22.14,1.37-44.34,2.31-66.51C51.15,284.26,52,281.78,53,277.15Z'/>
      <path style={{fill}} d='M141.36,136.43c3.89,7,8.48,13.74,11.51,21.11,6.87,16.71,13.85,33.47,19.16,50.7,6.43,20.88,7.17,42.37,1,63.65-5.77,20-18.59,35.45-33.19,49.59-.64.62-3.56,0-4.51-1a111.25,111.25,0,0,1-26-41c-9-25-7.69-50.49.46-75,7.77-23.31,18.59-45.61,28.07-68.36Z'/>
      <path style={{fill}} d='M4.7,423.74c9.6,3.57,18.17,6.51,26.55,9.92,21.54,8.77,42.32,18.95,60.43,33.86,27.43,22.59,41.12,51.46,39.87,87.17-.07,1.83.8,4.11,0,5.38-1.32,2.09-3.74,5.07-5.59,5-28.44-1.13-52.4-12.25-72-33-17.55-18.66-28.34-41.12-36.63-64.92C13.22,455.22,10,443,6.44,430.91,5.88,429,5.5,427,4.7,423.74Z'/>
      <path style={{fill}} d='M275.38,129.92c.32-22.44,7.68-40.89,20-57.83,14.54-20,34.64-31.9,56.59-41.81,19.71-8.91,40.33-14.45,61.34-18.89,2.39-.5,4.86-.61,8.54-1.06-3.45,8.58-5.79,16.75-9.84,24-10.43,18.58-20,38-32.87,54.78-19.55,25.49-46.11,40.63-79.11,41.91C292.11,131.29,284.12,130.33,275.38,129.92Z'/>
      <path style={{fill}} d='M371.62,139.74c-15.32,29-30.93,56.13-54.48,77.72-22.14,20.3-47.49,32.36-78.27,29.9-8.44-.68-16.82-2.11-25.63-3.24,1.37-17.6,7.15-32.59,17.39-45.11,8.6-10.52,18.1-21.14,29.31-28.52,21.69-14.29,46.69-21.22,72.19-25.59C344.83,142.72,357.7,141.53,371.62,139.74Z'/>
      <path style={{fill}} d='M1078.26,379.29c0,9.12-.58,18.29.2,27.35,1.4,16.08,2.63,32.28,5.76,48.08,4.88,24.59,16,46.36,34.62,63.66,13.2,12.26,29.31,19.2,46.42,24.16,3.54,1,4.62-.19,5.63-3.56q15.7-52.47-17.49-95.87a197.48,197.48,0,0,0-41.16-40.38c-10.89-7.88-21.38-16.3-32.06-24.48Z'/>
      <path style={{fill}} d='M1078.66,511.77c-1,10.58-1.8,19.76-2.67,28.94-2.2,23.2-2.18,46.42,3.3,69.12,7.25,30,24.8,52.86,51.72,68.23,4.46,2.55,9.27,4.5,13.94,6.68,3.64,1.7,6.35.43,7.67-3.11,7.54-20.26,11.8-41.17,7-62.57-5.57-25.06-18.9-46.29-36.39-64.8-10.86-11.51-22.38-22.4-33.72-33.45C1086.7,518,1083.42,515.69,1078.66,511.77Z'/>
      <path style={{fill}} d='M1076.86,788.27c20-29.38,26.9-60.27,17.15-93.95-6.08-21-16.84-39.9-29.29-57.74-6.57-9.41-14-18.21-21.09-27.28-1.35-1.74-2.78-3.43-4.49-5.53-10.14,30-18.12,59.82-17.78,90.91.35,31.42,10.68,59.05,36.25,79.27C1063.71,778.78,1070.1,783.25,1076.86,788.27Z'/>
      <path style={{fill}} d='M1103.64,920.55c-6.87-3.24-12.9-6.44-19.19-9-13.49-5.42-26.85-11.38-40.74-15.48-21.13-6.23-43.06-9.52-64.84-5-22.29,4.66-41.13,16.39-56.12,33.84-1.16,1.35-3.23,2.34-3.61,3.82-.53,2.05-.76,5.44.43,6.48,31.78,27.71,68.33,34.05,108.17,22.61,25.65-7.37,49-20.17,71.87-33.61C1100.72,923.62,1101.56,922.5,1103.64,920.55Z'/>
      <path style={{fill}} d='M1273.25,679c-28.61-.14-55.44,1.93-81.49,9.1-29.55,8.13-54.16,24-69.2,51.54-5.81,10.63-9,22.7-14.22,36.32,12.93,1.51,23.83,3.22,34.79,4,22,1.51,41.23-6.76,59-18.73s32.37-27.12,44.57-44.69C1255.24,704.22,1263.94,692.1,1273.25,679Z'/>
      <path style={{fill}} d='M1020.86,865.42c19,8.61,36.65,14.9,56.29,14,25.93-1.16,47.72-12,68.65-26.56,19.61-13.64,35.88-30.57,52.24-47.58.45-.47.56-1.26,1.25-2.87-14.26-1.93-28.16-4.5-42.19-5.54-20.62-1.54-41.21-1.38-61.6,3.71-22.42,5.6-41.24,16.39-54.85,35.28C1034,845.17,1027.88,854.9,1020.86,865.42Z'/>
      <path style={{fill}} d='M1174.14,671.24c26.89,2.7,51.16-2.22,73.09-18.11,18.27-13.24,32.1-30.34,42.85-49.62,10.19-18.27,18.21-37.74,28-58.31-15.69,4-29.42,6.94-42.77,11.1-28.68,9-55.7,20.77-76,44.49-16.23,19-23.6,40.81-24.38,65.33A47.69,47.69,0,0,1,1174.14,671.24Z'/>
      <path style={{fill}} d='M1072.27,6.79c-4.13,17-8.28,32.32-11.49,47.8-4.78,23-6.74,46.28-1,69.43,5.19,21.09,16.76,38.43,33.41,52.27,6.28,5.23,13.11,9.81,20.15,15,13.67-19,20.88-39.07,20.84-61.53-.07-32.07-14.11-59-31.91-84.36-7.87-11.23-16.62-21.85-25-32.72C1076.06,11.18,1074.77,9.76,1072.27,6.79Z'/>
      <path style={{fill}} d='M969,877.83c12.35-11,24.26-21.83,32.28-37.29,14.45-27.87,15.8-56.71,9.46-86.22-4.58-21.32-11.36-42.16-17.16-63.22h-2.67c-6.48,10-13,20-19.43,30.12-4.54,7.16-9.3,14.22-13.19,21.73-11.73,22.67-19.8,46.1-18.31,72.42,1.34,23.72,12.75,42.41,26.09,60.59C966.6,876.66,967.63,877,969,877.83Z'/>
      <path style={{fill}} d='M1046.55,256.64c3.84,14.75,6.63,28.6,11.14,41.87,4.39,12.93,10.19,25.42,16,37.81,6.7,14.25,17,25.86,28.57,36.44,19.79,18,44,23.47,70.63,25.35.31-5.48,1-10.61.82-15.72-.77-23.66-7.93-45.36-23.44-63.26-13-15.06-27.84-28.42-46.55-36.78-15.58-7-30.75-14.84-46.18-22.16C1054.58,258.78,1051.24,258.13,1046.55,256.64Z'/>
      <path style={{fill}} d='M1266,277.15c-14.7,15.09-28.83,28.23-41.33,42.76-18.72,21.78-33.63,45.77-36.37,75.49-2,21.15,4.11,40.41,13.26,59A12.68,12.68,0,0,0,1204,457c16.52-8.5,31.11-18.89,42.71-33.93,16-20.76,23-44.35,23.59-69.75.47-22.14-1.37-44.34-2.31-66.51C1267.88,284.26,1267,281.78,1266,277.15Z'/>
      <path style={{fill}} d='M1177.66,136.43c-3.88,7-8.47,13.74-11.5,21.11-6.87,16.71-13.85,33.47-19.16,50.7-6.43,20.88-7.17,42.37-1,63.65,5.77,20,18.59,35.45,33.19,49.59.64.62,3.56,0,4.51-1a111.25,111.25,0,0,0,26-41c9-25,7.69-50.49-.46-75-7.77-23.31-18.59-45.61-28.07-68.36Z'/>
      <path style={{fill}} d='M1314.33,423.74c-9.6,3.57-18.17,6.51-26.55,9.92-21.55,8.77-42.32,18.95-60.43,33.86-27.43,22.59-41.12,51.46-39.87,87.17.07,1.83-.8,4.11,0,5.38,1.32,2.09,3.74,5.07,5.58,5,28.45-1.13,52.41-12.25,72-33,17.55-18.66,28.34-41.12,36.63-64.92,4.14-11.89,7.33-24.12,10.91-36.2C1313.15,429,1313.53,427,1314.33,423.74Z'/>
      <path style={{fill}} d='M1043.65,129.92c-.32-22.44-7.68-40.89-20-57.83-14.54-20-34.65-31.9-56.59-41.81-19.71-8.91-40.33-14.45-61.34-18.89-2.39-.5-4.86-.61-8.54-1.06,3.45,8.58,5.79,16.75,9.84,24,10.43,18.58,20,38,32.87,54.78C959.42,114.56,986,129.7,1019,131,1026.92,131.29,1034.91,130.33,1043.65,129.92Z'/>
      <path style={{fill}} d='M947.41,139.74c15.32,29,30.93,56.13,54.48,77.72,22.14,20.3,47.49,32.36,78.27,29.9,8.44-.68,16.82-2.11,25.63-3.24-1.37-17.6-7.15-32.59-17.39-45.11-8.61-10.52-18.1-21.14-29.31-28.52-21.69-14.29-46.69-21.22-72.19-25.59C974.2,142.72,961.33,141.53,947.41,139.74Z'/>
      <path style={{fill}} d='M968.34,1008.94c-12.67-7.77-41.62-7.77-68.15-12.1S855,978.12,839.28,972.76s-33.17.53-33.17.53-25.33-11.52-41-17.95S737.36,954,737.36,954s-35.59-15.55-46.44-20.37-19.91-2.42-43.43,5.62c-10.29,3.52-49.22,23.16-89.76,44.13-5.42-2.54-11.6-5.38-16.46-7.49-11.2-4.87-19.81-1-19.81-1s-25.4-11.75-33.15-15.39-14.21-1.83-31,4.25S317,1039.49,317,1039.49h697.21S981,1016.71,968.34,1008.94Z'/>
    </Svg>
  );
};

export default Ribbon;
