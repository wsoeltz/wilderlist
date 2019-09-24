/* tslint:disable:max-line-length */
import React from 'react';
import { classNames } from './index';

const clipPathId = 'mountain-logo-circle-clip-path-';

const DefaultClipPath = ({id}: {id: string}) => {
  return (
    <defs>
      <clipPath id={`${clipPathId}${id}`}>
        <circle cx='410.16' cy='410.17' r='284.17'/>
      </clipPath>
    </defs>
  );
};

const Badge = ({id}: {id: string}) => {
  const hexValue = id[id.length - 1];
  if (hexValue === '0') {
    // from Artboard 49
    return(
      <>
        <DefaultClipPath id={id} />
        <g clipPath={`url(#${clipPathId}${id})`}>
          <polygon className={classNames.sky} points='223.15 360.63 297.61 431.27 432.6 226.66 575.68 487.29 682.04 387.43 708.56 435.24 708.56 105 105 105 105 538.63 124.27 538.63 223.15 360.63'/>
          <path className={classNames.mountainInterior} d='M336.35,416.65h34.19l15.2,60.9,63.82-67,49.38,49.93s-15.19-90.12-20.51-108.39-31.15,1.22-41.78-17.05-4-70.64-4-70.64Z'/>
          <path className={classNames.mountainInterior} d='M295.33,481.2l-73.7-70.63-40.27,68.2,24.32,4.87s-5.32,87.69,25.07,112S297.6,581.07,312,562.8s40.27-9.74,40.27-9.74L315.08,460.5Z'/>
          <path className={classNames.mountainInterior} d='M648.62,484.86c-16,25.57-60,17.05-60,17.05,63.47,107.4,153.87,75.79,167.64,70.18V568l-78-147.64S664.57,459.28,648.62,484.86Z'/>
        </g>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.64-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM312,562.8c-14.44,18.27-50.9,57.24-81.29,32.88s-25.07-112-25.07-112l-24.32-4.87,40.27-68.2,73.7,70.63,19.75-20.7,37.23,92.56S326.47,544.53,312,562.8ZM449.56,410.57l-63.82,67-15.2-60.9H336.35L432.6,264.42s-6.59,52.37,4,70.64,36.46-1.22,41.78,17.05S498.94,460.5,498.94,460.5Zm-17-183.9-135,204.6-74.45-70.64L150.74,491q-2.73-8.79-4.89-17.75a250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17c.91,5.79,1.63,12.41,2.14,19.28l-105.3,98.86ZM638.16,558C621,545.9,604,528,588.6,501.91c0,0,44.06,8.52,60-17.05s29.63-64.55,29.63-64.55l3.08,5.83A271.73,271.73,0,0,1,638.16,558Z'/>
      </>
    );
  } else if (hexValue === '1') {
    // from Artboard 48
    return(
      <>
        <path className={classNames.mountainInterior} d='M634.36,563.69c-16.52-20.13-46.56-70.6-57.85-86.64-13.32-18.94-28-28.1-28-23.92s20.21,35.54,26,48.08-1,23-14.43,10.46-93.34-93-109.69-109.75-25-28.22-36.57-24,4.81,44.95,10.59,58.15,16.35,21.29,36.55,26.51,19.25,15.68,22.14,25.09,14.43,35.53,27.91,38.67,28.86,19.86,32.71,41.81-10.59,17.76-16.37,0-26.93-22-41.37-29.27-6.73-29.27-21.16-42.85-20.21-14.64-37.53-8.36-25,8.36-35.6-15.68,1-46-12.51-59.58-10.59-24-13.47-46-26-51.22-53.88-73.17-54.84,38.68-54.84,38.68c-6.84,17.72,37.52,13.58,57.73,21.94s1,28.22,16.35,40.77,23.09,25.08,1,40.76-16.36,31.35,11.54,41.68,53.88,29.39,48.11,54.47-92.38-24-115.47-38.67,1,36.58,19.25,59.58,34.64,10.45,50,27.17,27.91,57.49,67.36,59.08,60.62-38.18,82.74-30.86c20.92,6.92,33.25,24.09,63.76,29.48q8.69-5.67,16.91-12l.33-.25.77-.61,2.05-1.64c1.19-1,2.38-1.93,3.55-2.91q3.78-3.13,7.45-6.41,7.83-7,15.13-14.52a260.81,260.81,0,0,0,25.69-30.72Q632.79,566,634.36,563.69Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM631.17,568.27A260.81,260.81,0,0,1,605.48,599q-7.29,7.53-15.13,14.52-3.66,3.27-7.45,6.41c-1.17,1-2.36,2-3.55,2.91l-2.05,1.64-.77.61-.33.25q-8.22,6.3-16.91,12c-30.51-5.39-42.84-22.56-63.76-29.48-22.12-7.32-43.29,32.45-82.74,30.86s-52-42.35-67.36-59.08-31.75-4.18-50-27.17-42.34-74.21-19.25-59.58,109.69,63.76,115.47,38.67-20.2-44.15-48.11-54.47-33.68-26-11.54-41.68,14.42-28.22-1-40.76,3.85-32.4-16.35-40.77-64.57-4.22-57.73-21.94c0,0,26.93-60.63,54.84-38.68s51,51.22,53.88,73.17,0,32.39,13.47,46S381,447.91,391.62,472s18.28,21.95,35.6,15.68,23.1-5.23,37.53,8.36,6.73,35.54,21.16,42.85,35.6,11.5,41.37,29.27,20.21,21.94,16.37,0-19.25-38.68-32.71-41.81S485.91,497,483,487.63s-1.93-19.87-22.14-25.09S430.11,449.23,424.34,436s-22.14-54-10.59-58.15,20.21,7.32,36.57,24S546.53,499.12,560,511.67s20.2,2.09,14.43-10.46-26-43.9-26-48.08,14.73,5,28,23.92c11.29,16,41.33,66.51,57.85,86.64Q632.78,566,631.17,568.27ZM657,523.73q-2.3-.86-4.58-1.75c-42.34-16.87-72.17-73-97.19-93.93s-52.91,2.09-52.91,2.09-40.42-44.94-65.44-70-44.26-5.23-44.26-5.23-56.77-60.62-74.09-79.43-31.75-9.41-69.28,22c-13.58,11.35-58.45,65.72-110.16,130.47a268.65,268.65,0,0,1,7.12-82.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41A272.23,272.23,0,0,1,657,523.73Z'/>
        <path className={classNames.sky} d='M249.21,297.41c37.53-31.36,52-40.77,69.28-22s74.09,79.43,74.09,79.43,19.24-19.86,44.26,5.23,65.44,70,65.44,70,27.89-23,52.91-2.09S610,505.11,652.38,522q2.28.9,4.58,1.75a272.23,272.23,0,0,0,24.87-113.56,286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,268.65,268.65,0,0,0-7.12,82.09C190.76,363.13,235.63,308.76,249.21,297.41Z'/>
      </>
    );
  } else if (hexValue === '2') {
    // from Artboard 50
    return(
      <>
        <DefaultClipPath id={id} />
        <g clipPath={`url(#${clipPathId}${id})`}>
          <path className={classNames.sky} d='M184.91,609.63A305,305,0,0,1,104,402.33C104,233.26,241.1,96.21,410.16,96.21S716.29,233.26,716.29,402.33a305,305,0,0,1-76,201.88'/>
          <polygon className={classNames.mountainInterior} points='235.52 446.17 200.34 537.38 137.39 579.07 257.74 559.85 307.68 438.55 281.81 404.48 235.52 446.17'/>
          <polygon className={classNames.mountainInterior} points='324.4 448.77 248.48 636.4 433.64 579.07 459.56 517.82 391.06 515.52 466.97 417.5 466.97 279.39 431.79 357.57 324.4 448.77'/>
          <polygon className={classNames.mountainInterior} points='663.25 532.17 652.13 451.99 609 476.41 616.95 558.23 641.03 579.07 663.25 532.17'/>
          <polygon className={classNames.mountainInterior} points='531.78 478.59 514.93 420.11 449.31 485.96 531.78 478.59'/>
        </g>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM190.78,570.54c-.75-1-1.53-2.13-2.38-3.34-3.51-5-6.84-10.09-10-15.28l22-14.54,35.18-91.21,46.29-41.69,25.87,34.07-49.94,121.3ZM256.23,634c-1.77-1.22-3.53-2.45-5.27-3.71L324.4,448.77l107.39-91.2L467,279.4V417.51l-75.91,98,68.51,2.29-25.93,61.25ZM449.31,486l65.62-65.85,16.85,58.48ZM624.6,577.08q2.86-3.68,5.56-7.42Q627.46,573.41,624.6,577.08Zm6.57-8.81c-.33.47-.67.93-1,1.39L617,558.23l-8-81.82L652.13,452l8.72,62.87A274.74,274.74,0,0,1,631.17,568.27Zm-468.7-46.2c-1.5-3.27-2.67-6-3.49-8a287.91,287.91,0,0,1-13.13-40.85,250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41,276.31,276.31,0,0,1-2.27,34.72l-20-19.57-61.1,28.92L550.35,340.39,466.57,238.75l-51.44,91.71L320.69,414.9,281.81,368l-61.65,64.3L180,517.82l-15.21,9.11'/>
      </>
    );
  } else if (hexValue === '3') {
    // from Artboard 51
    return(
      <>
        <DefaultClipPath id={id} />
        <g clipPath={`url(#${clipPathId}${id})`}>
          <path className={classNames.sky} d='M143.9,464.49c36.4-49.77,68.62-93.74,73.37-99.94,11.6-15.16,20.3-32.33,34.08-18.19s74,69.72,74,69.72,97.17-111.15,107.33-123.27,23.92-27.28,40.6-11.12,65.27,59.62,65.27,59.62S558.1,326.15,569,318.07s25.38-17.18,41.34,9.09c6.38,10.52,36.46,56.95,70.24,108.88q1.23-12.84,1.27-25.87a286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09A246.73,246.73,0,0,0,143.9,464.49Z'/>
        </g>
        <path className={classNames.mountainInterior} d='M442.8,594.92s31.91-34.35,41.33-53.55c10.16,30.31,0,67.7,0,67.7S453.67,617.15,442.8,594.92Z'/>
        <path className={classNames.mountainInterior} d='M191.18,610.23q-.74,1.39-1.47,2.88a29.45,29.45,0,0,1,2.89-1.32Z'/>
        <path className={classNames.mountainInterior} d='M637.15,441.34c-12.33-6.06-25.38,6.08-25.38,6.08l-4.35,40.4-32.64-29.3L529.1,466.6s25.38-45.47,12.32-45.47S503,437.34,492.84,447.42s-43.52,105.07-66,105.07c23.21-72.75,74-157.63,80.5-168.74s0-23.24-4.35-34.36-39.89-57.59-45-52.54-40.61,42.44-39.89,62.65-4.35,38.39,10.15,36.37,32.64-20.21,36.26-39.4c13.78,33.34,8.7,67.69-11.6,81.84s-62.37,34.35-63.09,72.75c-11.6-30.31-15.23-66.69-6.53-84.88C348.52,467.61,350,509,306.46,510.05c-21.75,31.32-45,65.68-45,65.68s39.88,29.3,66,17.17,29.74-56.58,42.79-51.53,2.18,61.64-41.34,69.72c-30.26,5.62-72.81-2.44-104.94-3.11a270.81,270.81,0,0,0,112,63.6,264.45,264.45,0,0,0,85.42,10q10.77-.42,21.49-1.65l3.19-.38,1-.13c1.82-.26,3.62-.53,5.43-.83,3.37-.54,6.73-1.15,10.08-1.81a283.11,283.11,0,0,0,41.51-11.62A252.39,252.39,0,0,0,541,648.33a280.32,280.32,0,0,0,35.23-23l.33-.25.77-.61,2.05-1.64c1.19-1,2.38-1.93,3.55-2.91q3.78-3.13,7.45-6.41,7.83-7,15.13-14.52c2.92-3,5.7-6,8.38-9-18.31-6.3-39.08-14-39.08-14s18.13-14.36,34.08-10.32c8.13,2.06,15.3,3.72,20.88,4.63l1.43-2a272.84,272.84,0,0,0,42.69-92.84C659.72,459.81,644.35,444.88,637.15,441.34Zm-153,167.73s-30.46,8.08-41.33-14.15c0,0,31.91-34.35,41.33-53.55C494.29,571.68,484.13,609.07,484.13,609.07Z'/>
        <path className={classNames.mountainInterior} d='M162.47,522.07q2.07,4.51,4.3,9,4.72,9.45,10.16,18.52T188.4,567.2c4.4,6.26,7.07,9.74,11.59,15.2q3.39,4.1,6.92,8.05c11.46-9.3,23.85-11.91,37.19-25.84,20.3-21.22,58-102.05,58-102.05s-19.58,2-29.73-7.07S260.77,407,236.12,411,206.39,434.31,202,447.42s-10.15,37.37-29,46.46a83,83,0,0,0-17.3,11.77c1.05,2.82,2.12,5.63,3.25,8.42C159.8,516.11,161,518.8,162.47,522.07Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM200,582.4c-4.52-5.46-7.19-8.94-11.59-15.2q-6.06-8.61-11.47-17.65T166.77,531q-2.24-4.44-4.3-9c-1.5-3.27-2.67-6-3.49-8-1.13-2.79-2.19-5.6-3.23-8.43A83,83,0,0,1,173,493.88c18.85-9.09,24.65-33.34,29-46.46s9.43-32.35,34.09-36.39,26.1,35.36,36.26,44.46,29.73,7.07,29.73,7.07-37.71,80.83-58,102.05c-13.34,13.93-25.73,16.54-37.19,25.84Q203.39,586.51,200,582.4Zm429.75-12.15c-5.58-.91-12.75-2.57-20.88-4.63-16-4-34.08,10.32-34.08,10.32s20.77,7.71,39.08,14c-2.68,3-5.46,6-8.38,9q-7.29,7.53-15.13,14.52-3.66,3.27-7.45,6.41c-1.17,1-2.36,2-3.55,2.91l-2.05,1.64-.77.61-.33.25a280.32,280.32,0,0,1-35.23,23,252.39,252.39,0,0,1-36.85,16.86,283.11,283.11,0,0,1-41.51,11.62c-3.35.66-6.71,1.27-10.08,1.81-1.81.3-3.61.57-5.43.83l-1,.13-3.19.38q-10.71,1.23-21.49,1.65a264.45,264.45,0,0,1-85.42-10A270.83,270.83,0,0,1,224,608c32.13.67,74.67,8.73,104.93,3.11,43.52-8.08,54.39-64.67,41.34-69.72s-16.68,39.41-42.79,51.53-66-17.17-66-17.17,23.21-34.36,45-65.68c43.52-1,42.06-42.44,76.87-83.87-8.7,18.19-5.07,54.57,6.53,84.88.72-38.4,42.79-58.6,63.09-72.75s25.38-48.5,11.6-81.84c-3.62,19.19-21.75,37.38-36.26,39.4s-9.42-16.16-10.15-36.37S453,301.9,458,296.85s40.61,41.43,45,52.54,10.88,23.24,4.35,34.36-57.29,96-80.5,168.74c22.48,0,55.84-95,66-105.07s35.53-26.29,48.58-26.29S529.1,466.6,529.1,466.6l45.68-8.08,32.64,29.3,4.35-40.4s13.05-12.14,25.38-6.08c7.2,3.54,22.56,18.46,36.7,34.08a272.67,272.67,0,0,1-42.68,92.85M680.54,436c-33.78-51.91-63.84-98.33-70.22-108.84-16-26.27-30.46-17.17-41.34-9.09s-30.46,23.24-30.46,23.24-48.58-43.45-65.27-59.62-30.45-1-40.6,11.12S325.32,416.08,325.32,416.08s-60.19-55.57-74-69.72-22.48,3-34.08,18.19c-4.75,6.2-37,50.17-73.37,99.94a246.73,246.73,0,0,1-4.58-32.61,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41C681.81,418.83,681.36,427.45,680.54,436Z'/>
      </>
    );
  } else if (hexValue === '4') {
    // from Artboard 52
    return(
      <>
        <path className={classNames.mountainInterior} d='M579.35,622.83c1.19-1,2.38-1.93,3.55-2.91q3.78-3.13,7.45-6.41,7.83-7,15.13-14.52a260.81,260.81,0,0,0,25.69-30.72A272.05,272.05,0,0,0,678.07,455l-34.41-21.3,21.43,61.4-117-106-65.45,43.44,49.81,110.63L383,370l-18,10.42-50.39-48.07L204.6,549l8.11-121-51-16.8-22.13,24.27a250.21,250.21,0,0,0,6.24,37.84A287.91,287.91,0,0,0,159,514.07c.82,2,2,4.73,3.49,8q2.07,4.51,4.3,9,4.72,9.45,10.16,18.52T188.4,567.2c4.4,6.26,7.07,9.74,11.59,15.2,35.75,43.19,82.8,74.13,136,89.18a264.45,264.45,0,0,0,85.42,10q10.77-.42,21.49-1.65l3.19-.38,1-.13c1.82-.26,3.62-.53,5.43-.83,3.37-.54,6.73-1.15,10.08-1.81a283.11,283.11,0,0,0,41.51-11.62A252.39,252.39,0,0,0,541,648.33a280.32,280.32,0,0,0,35.23-23l.32-.25.78-.61Z'/>
        <path className={classNames.sky} d='M157.69,392.58l60.24,16.21L316.4,306.85l49.81,49.82,17.38-12.75,74.14,84,91.52-56.19,67.19,56.19,27.8-22.59,36.2,32q1.35-13.45,1.39-27.11a286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,266.21,266.21,0,0,0-7.6,71.36Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM605.48,599q-7.29,7.53-15.13,14.52-3.66,3.27-7.45,6.41c-1.17,1-2.36,2-3.55,2.91l-2.05,1.64-.78.61-.32.25a280.32,280.32,0,0,1-35.23,23,252.39,252.39,0,0,1-36.85,16.86,283.11,283.11,0,0,1-41.51,11.62c-3.35.66-6.71,1.27-10.08,1.81-1.81.3-3.61.57-5.43.83l-1,.13-3.19.38q-10.71,1.23-21.49,1.65a264.45,264.45,0,0,1-85.42-10c-53.21-15.05-100.26-46-136-89.18-4.52-5.46-7.19-8.94-11.59-15.2q-6.06-8.61-11.47-17.65T166.77,531q-2.24-4.44-4.3-9c-1.5-3.27-2.67-6-3.49-8a287.91,287.91,0,0,1-13.13-40.85,250.21,250.21,0,0,1-6.24-37.84l22.13-24.27,51,16.8L204.6,549,314.66,332.34l50.39,48.07L383,370,532.45,543.17,482.64,432.54l65.45-43.44,117,106-21.43-61.4L678.07,455a272.05,272.05,0,0,1-46.9,113.27A260.81,260.81,0,0,1,605.48,599Zm75-161.71-36.2-32-27.8,22.59-67.19-56.19-91.52,56.19-74.14-84-17.38,12.75L316.4,306.85,217.93,408.79l-60.24-16.21-19.12,24.57a266.21,266.21,0,0,1,7.6-71.36,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41Q681.8,423.82,680.44,437.28Z'/>
      </>
    );
  } else if (hexValue === '5') {
    // from Artboard 53
    return(
      <>
        <path className={classNames.sky} d='M144.78,468.59l44.34-12.93,118.26-183h93.28L454,399.54l62.46,19.52,49.05,68,60.23-72.85h56.09c0-1.34.05-2.67.05-4a286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09A246.77,246.77,0,0,0,144.78,468.59Z'/>
        <path className={classNames.mountainInterior} d='M164.07,525.48q1.32,2.79,2.7,5.55c1.76,3.52,3.61,7,5.52,10.44l115.63-54.61,30.41-95.14,71.87-99.54H314.74Z'/>
        <polygon className={classNames.mountainInterior} points='447.45 545.94 485.89 497.68 502.09 435.33 447.45 418.97 418.83 466.23 347.27 538.16 347.35 602.87 447.45 545.94'/>
        <polygon className={classNames.mountainInterior} points='673.83 428.16 630.32 429.55 571.24 503.64 517.21 584.45 634.41 542.32 639.07 479.17 673.83 428.16'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM164.07,525.48l150.67-233.3H390.2l-71.87,99.54-30.41,95.14L172.29,541.47M166.77,531m180.58,71.83-.08-64.7,71.56-71.93L447.45,419l54.64,16.36-16.2,62.34-38.44,48.27Zm99.72,76.59h0Zm-.13,0-.17,0Zm192.13-200.3-4.66,63.15-117.2,42.13,54-80.81,59.08-74.09,43.51-1.39ZM576.52,625.09h0l.09-.07-.09.07Zm-.32.24.24-.18ZM681.78,414.18H625.69L565.46,487l-49.05-68L454,399.54,400.66,272.67H307.38l-118.26,183-44.34,12.93a246.77,246.77,0,0,1-5.46-36.71,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41'/>
      </>
    );
  } else if (hexValue === '6') {
    // from Artboard 54
    return(
      <>
        <path className={classNames.mountainInterior} d='M427.4,562.3l87.27-94L558.31,602s30.45-38.18,30.45-60.89-2-167.22-7.11-194-30.44-9.29-54.8-16.52-39.58-47.48-39.58-47.48L381.73,424.46a261.81,261.81,0,0,0,0,69.15C386.8,531.81,427.4,562.3,427.4,562.3Z'/>
        <path className={classNames.sky} d='M194,526.65c25.36-40.26,75.09-119.74,75.09-119.74s22.33,50.58,44.65,41.29S487.27,238.67,487.27,238.67s26.39,49.54,47.7,60.89,47.7-11.35,61.9,8.26S639.5,401.75,674,444.07q2.41,3,4.87,5.83-.9,6.11-2.07,12.15a275.06,275.06,0,0,0,5-51.88,286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09,250.51,250.51,0,0,0,6.53,41.34A287.91,287.91,0,0,0,159,514.07c.82,2,2,4.73,3.49,8,.89,1.94,1.81,3.86,2.74,5.79C178.41,526.63,189.41,527.58,194,526.65Z'/>
        <path className={classNames.mountainInterior} d='M624.28,416.2s11.16,63,12.17,98.06a185.25,185.25,0,0,0,5.18,38.16,272.67,272.67,0,0,0,25.58-54.31A703.26,703.26,0,0,0,624.28,416.2Z'/>
        <path className={classNames.mountainInterior} d='M352.3,552.45,331,571,271.11,458.52,210.22,561.74c69,11.36,73.07,63,83.22,87.52s70,17.76,83.22,7.45,34.5-7.45,34.5-7.45Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM376.66,656.71c-13.2,10.31-73.07,17.1-83.22-7.45s-14.21-76.16-83.22-87.52l60.89-103.22L331,571l21.31-18.58,58.86,96.81S389.85,646.39,376.66,656.71ZM558.31,602,514.67,468.33l-87.27,94s-40.6-30.49-45.67-68.69a261.81,261.81,0,0,1,0-69.15L487.27,283.05s15.23,40.25,39.58,47.48,49.73-10.32,54.8,16.52,7.11,171.34,7.11,194.05S558.31,602,558.31,602Zm83.32-49.57a185.25,185.25,0,0,1-5.18-38.16c-1-35.09-12.17-98.06-12.17-98.06a702.93,702.93,0,0,1,42.93,81.89A272.27,272.27,0,0,1,641.63,552.42ZM678.87,449.9q-2.46-2.88-4.87-5.83c-34.5-42.32-62.92-116.64-77.13-136.25s-40.59,3.1-61.9-8.26-47.7-60.89-47.7-60.89S336.06,438.91,313.73,448.2s-44.65-41.29-44.65-41.29S219.35,486.39,194,526.65c-4.58.93-15.58,0-28.78,1.21-.93-1.93-1.85-3.85-2.74-5.79-1.5-3.27-2.67-6-3.49-8a287.91,287.91,0,0,1-13.13-40.85,250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41A276.34,276.34,0,0,1,678.87,449.9Z'/>
      </>
    );
  } else if (hexValue === '7') {
    // from Artboard 55
    return(
      <>
      <path className={classNames.mountainInterior} d='M270.65,376.1c-7.09,30.72-36.25,54.27-63.83,83.95s-23.65,69.63-23.65,69.63l112.71-130Z'/>
      <path className={classNames.mountainInterior} d='M638.74,479c11.42,10.23,21.27,12.8,28,10.75,1.16-.35,2.31-.69,3.48-.95A270.88,270.88,0,0,0,678,455.5l-44-56.36C625.34,392.48,627.3,468.76,638.74,479Z'/>
      <path className={classNames.mountainInterior} d='M387.31,312.62c7.88,9.22,14.19,61.44-9.46,164.85,29.95-19.46,92.22-65.53,117.44-42,20.63,19.25,110.29,96,142.28,123.37.66-1,1.3-2,1.94-3L423.57,264.5Z'/>
      <path className={classNames.sky} d='M681.83,410.17a286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09,250.51,250.51,0,0,0,6.53,41.34c.13.55.27,1.09.41,1.64l122-117.53L303,386,421.73,242.66,559.39,427,634,380.54l46.44,56.54Q681.79,423.73,681.83,410.17Z'/>
      <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM183.17,529.68s-3.94-39.93,23.65-69.63,56.74-53.23,63.83-83.95l25.23,23.55Zm454.4,29.18c-32-27.34-121.65-104.12-142.28-123.37-25.22-23.55-87.49,22.52-117.44,42,23.65-103.41,17.34-155.63,9.46-164.85l36.26-48.12L639.51,555.83C638.87,556.84,638.23,557.85,637.57,558.86Zm32.61-70.06c-1.16.26-2.31.6-3.46.95-6.71,2.05-16.56-.52-28-10.75s-13.4-86.52-4.73-79.86l44,56.36A270.53,270.53,0,0,1,670.18,488.8Zm10.27-51.72L634,380.54,559.39,427,421.73,242.66,303,386,268.3,357.33l-122,117.53c-.14-.55-.28-1.09-.41-1.64a250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41Q681.8,423.72,680.45,437.08Z'/>
      </>
    );
  } else if (hexValue === '8' || hexValue === 'c') { // Need to create 4 additional mountains
    // from Artboard 56
    return(
      <>
        <path className={classNames.mountainInterior} d='M540.38,393.9c-5.73-6.29-49.4-6.29-65.72,20.32l119.09,103s-61.31-89.5-61.75-99.66S546.11,400.2,540.38,393.9Z'/>
        <path className={classNames.mountainInterior} d='M347.62,449.06c19.85-7.26,109.83-11.62,109.83-11.62L331.74,331.5,160.36,517.35q.91,2.1,2.11,4.72,2.07,4.51,4.3,9,4.72,9.45,10.16,18.52T188.4,567.2l.31.44c16.44-1.7,33.87-3.88,53-8.29C298.66,546.29,327.77,456.31,347.62,449.06Z'/>
        <path className={classNames.sky} d='M678.84,369.15a282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09,250.51,250.51,0,0,0,6.53,41.34q2.46,10.27,5.7,20.32L327.77,296.67,456.13,393.9s59.55-45,94-13.06c13.47,12.5,62,63.21,116.06,120.33a273.19,273.19,0,0,0,15.69-91A286.73,286.73,0,0,0,678.84,369.15Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM347.62,449.06c-19.85,7.25-49,97.23-105.86,110.29-19.18,4.41-36.61,6.59-53,8.29l-.31-.44q-6.06-8.61-11.47-17.65T166.77,531q-2.24-4.44-4.3-9-1.2-2.62-2.11-4.72L331.74,331.5,457.45,437.44S367.47,441.8,347.62,449.06Zm127-34.84c16.32-26.61,60-26.61,65.72-20.32s-8.82,13.55-8.38,23.71,61.75,99.66,61.75,99.66Zm191.48,86.95c-54.08-57.12-102.59-107.83-116.06-120.33-34.4-31.93-94,13.06-94,13.06L327.77,296.67,151.55,493.54q-3.23-10.05-5.7-20.32a250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41A273.19,273.19,0,0,1,666.14,501.17Z'/>
      </>
    );
  } else if (hexValue === '9' || hexValue === 'd') {
    // from Artboard 57
    return(
      <>
        <path className={classNames.mountainInterior} d='M425.55,430.07c8.16-14.21-18.77-74.89-26.11-89.09s-4.89-36.16-9.79-50.36,0-58.11-10.6-50.36-22.84,29.7-30.19,56.82-42.42,85.22-46.5,109.75c0,0,31,46.48,43.24,51.64s27.73,3.88,35.89,20.67S409.23,525.62,419,523s14.69-24.53,6.53-46.49-20.4-34.86-19.58-56.82S417.39,444.28,425.55,430.07Z'/>
        <path className={classNames.mountainInterior} d='M212.62,595.35c17.13,19.36,40.79,14.19,57.93,6.44S307.26,607,307.26,607A120.44,120.44,0,0,0,294.2,572.1c-9.79-16.78,0-47.78,0-60.69s-14.68-19.37-25.29-40,6.53-37.45,4.9-51.66S245.26,372,245.26,372c-4.29-5.59-32.38,84.67-77.66,160.67q4.38,8.61,9.33,16.91,5.41,9,11.47,17.65c4.4,6.26,7.07,9.74,11.59,15.2q3.34,4,6.81,7.93A29.72,29.72,0,0,1,212.62,595.35Z'/>
        <path className={classNames.mountainInterior} d='M573.21,516.57c-20.4-12.9-10.61-40-13.05-59.38s-8.16-31-11.43-20.8-20.39,53.84-20.39,53.84,9,32.81,20.39,52.17c9.1,15.42,32.16,36.57,59.3,53.92,4.52-4.79,8.72-9.56,12.68-14.38C608.72,554.48,588.46,526.24,573.21,516.57Z'/>
        <path className={classNames.sky} d='M678.84,369.15a282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09,250.51,250.51,0,0,0,6.53,41.34q2.4,10,5.56,19.88c16-22.72,33-53.84,45.71-78.53,21.21-41.32,31.82-94.26,40-95.55s49.76,60.69,49.76,60.69,23.66-47.77,31.82-73.6,21.21-50.36,27.73-56.82,9.8-23.24,17.14-42.61,12.23-32.27,30.18-6.44,13,69.72,22.85,82.63,28.55,64.56,40.78,78.76,19.59,47.78,29.37,64.56,30.19,45.2,30.19,45.2,19.58-49.07,24.47-62,13.06-28.41,27.74-12.92,26.92,36.17,41.61,51.66,9.78,42.61,22.84,65.85c6,10.7,12,17,18,20.72a272,272,0,0,0,30.23-124.55A286.73,286.73,0,0,0,678.84,369.15Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM270.55,601.79c-17.14,7.75-40.8,12.92-57.93-6.44a30.2,30.2,0,0,0-5.77-5q-3.49-3.92-6.86-8c-4.52-5.46-7.19-8.94-11.59-15.2q-6.06-8.61-11.47-17.65-5-8.29-9.33-16.91c45.28-76,73.37-166.26,77.66-160.67,0,0,26.92,33.56,28.55,47.76s-15.5,31-4.9,51.66,25.29,27.12,25.29,40-9.79,43.91,0,60.69A120.44,120.44,0,0,1,307.26,607S287.68,594.05,270.55,601.79ZM419,523c-9.79,2.58-29.37-27.12-37.53-43.9s-23.65-15.49-35.89-20.67-43.24-51.64-43.24-51.64c4.08-24.53,39.16-82.64,46.5-109.75s19.58-49.07,30.19-56.82,5.71,36.15,10.6,50.36,2.45,36.15,9.79,50.36,34.27,74.88,26.11,89.09S406.78,397.8,406,419.73s11.42,34.87,19.58,56.82S428.81,520.45,419,523Zm27.74,156.45.32,0ZM608,596.32c-27.14-17.35-50.2-38.5-59.29-53.92-11.42-19.36-20.4-52.17-20.4-52.17s17.13-43.63,20.4-53.84,9,1.43,11.42,20.8-7.35,46.48,13.05,59.38c15.25,9.66,35.51,37.9,47.49,65.36C616.75,586.75,612.55,591.53,608,596.32Zm43.57-61.6c-6-3.71-12-10-18-20.72-13.06-23.24-8.16-50.35-22.84-65.85S583.82,412,569.13,396.49s-22.84,0-27.74,12.92-24.47,62-24.47,62-20.4-28.41-30.19-45.2-17.13-50.35-29.37-64.56-31-65.86-40.78-78.76-4.9-56.82-22.85-82.63-22.84-12.92-30.18,6.44-10.61,36.17-17.14,42.61-19.57,31-27.73,56.82-31.82,73.6-31.82,73.6-41.6-62-49.76-60.69-18.77,54.23-40,95.55c-12.67,24.69-29.7,55.81-45.71,78.53q-3.15-9.83-5.56-19.88a250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41A272,272,0,0,1,651.6,534.72Z'/>
      </>
    );
  } else if (hexValue === 'a' || hexValue === 'e') {
    // from Artboard 58
    return(
      <>
        <path className={classNames.mountainInterior} d='M497,302.11c-23.28,7.58-47.52-10.82-52.38,17.32S437.85,499.14,437.85,523s29.09,63.87,29.09,63.87l52.38,37.78,38.37-136.47s54.27,2.8,59.12-37.25-39-73.73-39-73.73l2.68-116.34S520.28,294.53,497,302.11Z'/>
        <path className={classNames.mountainInterior} d='M337,586.83c41.7,9.75,54.31-55.21,55.27-92S403.9,392,403.9,392,335.05,512.14,337,586.83Z'/>
        <path className={classNames.mountainInterior} d='M200,582.4a278.68,278.68,0,0,0,46.25,44.39c24.87-17.63,40.12-40.5,42.26-54,2.91-18.4-6.79-30.24-19.4-27.57s-36.85-4.91-40.73-28.73-5.41-32.14-12.6-27.53c-10.1,6.46-19.4,8-26.19,37.28-2.25,9.7-4.93,20.47-8,30.81q3.31,5.16,6.83,10.18C192.8,573.46,195.47,576.94,200,582.4Z'/>
        <path className={classNames.sky} d='M678.84,369.15a282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09,250.51,250.51,0,0,0,6.53,41.34A287.91,287.91,0,0,0,159,514.07c.81,2,2,4.69,3.46,7.92l-.05-.09c21.38-30.69,42.49-61.19,60.16-87.1,59.16,90.94,100.86,30.79,133.83-13.6s60.13-122.33,73.71-142.9,38.79,3.24,59.16-8.67,91.28-55.36,91.28-55.36S645.81,347.42,681.7,402.49A276.51,276.51,0,0,0,678.84,369.15Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.64-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM288.5,572.76c-2.14,13.52-17.39,36.4-42.25,54A278.27,278.27,0,0,1,200,582.4c-4.52-5.46-7.19-8.94-11.59-15.2q-3.53-5-6.83-10.18c3.08-10.34,5.76-21.11,8-30.81,6.79-29.24,16.09-30.82,26.19-37.28,7.19-4.61,8.72,3.71,12.6,27.53s28.12,31.4,40.73,28.73S291.41,554.36,288.5,572.76Zm103.76-77.95c-1,36.81-13.57,101.77-55.27,92C335.05,512.14,403.9,392,403.9,392S393.24,458,392.26,494.81Zm224.55-43.92c-4.85,40.05-59.12,37.25-59.12,37.25L519.32,624.61l-52.38-37.78S437.85,546.77,437.85,523s1.93-175.38,6.78-203.53,29.1-9.74,52.38-17.32,83.52-41.29,83.52-41.29l-2.68,116.34S621.66,410.84,616.81,450.89ZM580.53,214.27s-70.91,43.46-91.28,55.36-45.59-11.9-59.16,8.67-40.73,98.51-73.71,142.9-74.67,104.54-133.83,13.6c-17.67,25.91-38.78,56.41-60.16,87.1l.05.09c-1.48-3.23-2.65-5.9-3.46-7.92a287.91,287.91,0,0,1-13.13-40.85,250.51,250.51,0,0,1-6.53-41.34,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,276.51,276.51,0,0,1,2.86,33.34C645.81,347.42,580.53,214.27,580.53,214.27Z'/>
      </>
    );
  } else { // if (hexValue === 'b' || hexValue === 'f')
    // from Artboard 59
    return(
      <>
        <path className={classNames.mountainInterior} d='M579.35,622.83c1.19-1,2.38-1.93,3.55-2.91q3.78-3.13,7.45-6.41,7.83-7,15.13-14.52a261.79,261.79,0,0,0,25.69-30.72,273.26,273.26,0,0,0,39.12-79.75l-21.73,9.69,6.06-27-68.37-70.53-58.85,62.8,18.18,71.49-53.66-58-87.41,48.3,57.12-70.52L511,441.21,431.34,331.72,340.17,481.79l-17.79-38.57-84,94.61,10.39-59.9-40.68-33.82-57.2,47.25q3.6,11.52,8.12,22.71c.82,2,2,4.73,3.49,8q2.07,4.51,4.3,9,4.72,9.45,10.16,18.52T188.4,567.2c4.4,6.26,7.07,9.74,11.59,15.2,35.75,43.19,82.8,74.13,136,89.18a264.45,264.45,0,0,0,85.42,10q10.77-.42,21.49-1.65l3.19-.38,1-.13c1.82-.26,3.62-.53,5.43-.83,3.37-.54,6.73-1.15,10.08-1.81a283.45,283.45,0,0,0,41.51-11.62A252.39,252.39,0,0,0,541,648.33a280.32,280.32,0,0,0,35.23-23l.32-.25.78-.61Z'/>
        <path className={classNames.sky} d='M268.64,448l56.26-51.21h38.94l66.64-109L535.19,421.89l54.52-47.33,86.42,90.73a275.23,275.23,0,0,0,5.7-55.12,286.73,286.73,0,0,0-3-41,282.72,282.72,0,0,0-10-42.17,243.91,243.91,0,0,0-15.31-37.68,284.29,284.29,0,0,0-21.63-36.17c-4.39-6.24-7.07-9.74-11.59-15.2s-9.11-10.61-14-15.65a271.55,271.55,0,0,0-142.45-78.49c-54.37-11.09-114.75-4.5-165.07,18.4a283.73,283.73,0,0,0-37,20.32A244.57,244.57,0,0,0,230,206.82a285.73,285.73,0,0,0-29.15,30.1,265.41,265.41,0,0,0-23.22,32.73,261.84,261.84,0,0,0-31.44,76.14,269.45,269.45,0,0,0-6.85,86.09,247.66,247.66,0,0,0,5.45,36.68l64.16-55.36Z'/>
        <path className={classNames.mountainExterior} d='M652.38,238.9a300.87,300.87,0,0,0-141-107.64c-57.87-21.25-122.76-23.4-182-6.62A296.87,296.87,0,0,0,156,563.3C186.69,614,232.79,655.55,286.85,680a300.62,300.62,0,0,0,183.07,20.78c58.65-11.83,113.3-42.29,154.6-85.53,41.45-43.39,69.61-99.37,78.64-158.78a313.57,313.57,0,0,0,3.67-46.3C706.68,349.18,687.87,288.61,652.38,238.9ZM631.17,568.27A261.79,261.79,0,0,1,605.48,599q-7.29,7.53-15.13,14.52-3.66,3.27-7.45,6.41c-1.17,1-2.36,2-3.55,2.91l-2.05,1.64-.78.61-.32.25a280.32,280.32,0,0,1-35.23,23,252.39,252.39,0,0,1-36.85,16.86,283.45,283.45,0,0,1-41.51,11.62c-3.35.66-6.71,1.27-10.08,1.81-1.81.3-3.61.57-5.43.83l-1,.13-3.19.38q-10.71,1.23-21.49,1.65a264.45,264.45,0,0,1-85.42-10c-53.21-15.05-100.26-46-136-89.18-4.52-5.46-7.19-8.94-11.59-15.2-4-5.74-18.48-29.87-21.63-36.17-1.49-3-7-14.92-7.79-17q-4.51-11.19-8.12-22.71l57.2-47.25,40.68,33.82-10.39,59.9,84-94.61,17.79,38.57,91.17-150.07L511,441.21l-49.33,13.53-57.12,70.52L491.92,477l53.66,58L527.4,463.44l58.85-62.8,68.37,70.53-6.06,27,21.72-9.69A273.48,273.48,0,0,1,631.17,568.27Zm45-103-86.42-90.73-54.52,47.33L430.48,287.77l-66.64,109H324.9L268.64,448,208.93,413.2l-64.16,55.36a247.66,247.66,0,0,1-5.45-36.68,269.45,269.45,0,0,1,6.85-86.09,261.84,261.84,0,0,1,31.44-76.14,265.41,265.41,0,0,1,23.22-32.73A285.73,285.73,0,0,1,230,206.82a244.57,244.57,0,0,1,31.86-24.31,283.73,283.73,0,0,1,37-20.32c50.32-22.9,110.7-29.49,165.07-18.4a271.55,271.55,0,0,1,142.45,78.49q7.26,7.56,14,15.65c4.52,5.46,7.2,9,11.59,15.2a284.29,284.29,0,0,1,21.63,36.17A243.91,243.91,0,0,1,668.87,327a282.72,282.72,0,0,1,10,42.17,286.73,286.73,0,0,1,3,41A275.23,275.23,0,0,1,676.13,465.29Z'/>
      </>
    );
  }
};

export default Badge;
