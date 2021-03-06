/* eslint-disable max-len */
/* tslint:disable:max-line-length */
import React from 'react';
import styled from 'styled-components/macro';

const LetterPath = styled.path`
  @media(max-width: 690px) {
    display: none;
  }
`;

const Logo = () => (
    <svg xmlns='http://www.w3.org/2000/svg'>
       <defs>
        <pattern id='logBackgroundPattern' patternUnits='userSpaceOnUse' width='100%' height='100%'>
          <image href={require('./header-bg-texture.jpg').default} width='351' height='124' x='0' y='0'/>
        </pattern>
      </defs>
      <g fill='url(#logBackgroundPattern)'>
        <path d='M58.8,1.2L55.5,0L43.4,30.1L31,14V9.4l7.4,9.7l2.4-1.8L29.5,2.5L18.3,17.2l2.4,1.8L28,9.4V14L15.6,30.3L3.3,0L0.1,1.2
          l13.8,42.6l-3.7,5.1l3.2,2.3L28,31.1V36L16,51.7l3.2,2.4L28,42.6v4.3l-5.4,7l2.4,1.8l3-3.9V62h3V51.8l3,3.9l2.4-1.8l-5.4-7v-4.3
          l8.9,11.6l3.2-2.4L31,36v-4.5l7.7,10.2v0.1h0.1l8,10.6L50,50l-4.9-6.4L58.8,1.2z M18.5,37.5l-1.2-2.9l10.7-14v3.7L18.5,37.5z
           M31,24.9v-4.3l10.6,13.8l-1.2,2.9L31,24.9z'/>
        <LetterPath d='M56.5,16.4h4.1v25.8h-4.1V16.4z'/>
        <LetterPath d='M66.5,16.4h3.8V39h9.1v3.2H66.5V16.4z'/>
        <LetterPath d='M81.9,42.1V16.4h7.9c6.4,0,9.9,4.7,9.9,12.9c0,8.8-4.6,12.8-10.3,12.8H81.9z M85.8,19.5V39h3.6c4.4,0,6.3-3.7,6.3-9.7
          c0-6.2-1.8-9.9-6.1-9.9h-3.8V19.5z'/>
        <LetterPath d='M104.4,16.4h14.1v3.2h-10.2V27h7.8v3.3h-7.8v8.5H119v3.3h-14.6V16.4z'/>
        <LetterPath d='M128.2,32.9c-0.3-0.1-1-0.5-1-0.5v9.7h-4V16.4h6c7.4,0,10.1,3.9,10.1,8c0,3.9-2.1,7.2-6.3,8.4l7.5,8v1.4h-3.7L128.2,32.9z
           M127.3,19.5v9.7c0,0.1,1.4,0.8,2.8,0.8c3.4,0,5.4-2.5,5.4-5.6c0-2.8-2-4.9-6.1-4.9H127.3z'/>
        <LetterPath d='M144.4,16.4h3.8V39h9.1v3.2h-12.9L144.4,16.4L144.4,16.4z'/>
        <LetterPath d='M159.8,16.4h4.1v25.8h-4.1V16.4z'/>
        <LetterPath d='M168.5,40.3l1.8-2.8c0.4,0.3,1,0.7,1.9,1.2c1,0.5,2.1,1,3.1,1c2.4,0,4.2-1.6,4.2-4.1c0-1.4-1.1-2.9-2.6-3.8l-4.8-2.9
          c-2.1-1.3-4-3.5-4-6.6c0-4.4,3.1-6.9,7.6-6.9c3.9,0,6.1,2.6,6.6,3.3l-2.4,1.9c-0.5-0.5-2-2.1-4.2-2.1c-2.1,0-3.8,1.2-3.8,3.3
          c0,1.9,1.3,3.3,2.8,4.2l4.3,2.7c2.7,1.6,4.2,3.9,4.2,6.9c0,4.4-3.6,7.2-8.1,7.2C172.2,42.9,169.2,40.8,168.5,40.3z'/>
        <LetterPath d='M194.4,42.1h-3.9V19.7h-6.4v-3.4h16.6v3.4h-6.4L194.4,42.1L194.4,42.1z'/>
      </g>
    </svg>
);

export default Logo;
