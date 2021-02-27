import MountainIcon from '../../../../../assets/images/icons/mountain-highlighted.svg';
import TentIcon from '../../../../../assets/images/icons/tent-highlighted.svg';
import TrailIcon from '../../../../../assets/images/icons/trail-highlighted.svg';
import { primaryColor, primaryFont, tertiaryColor } from '../../../../../styling/styleUtils';
import { CoreItem } from '../../../../../types/itemTypes';

const getHoverPopupHtml = (name: string, subtitle: string, type: CoreItem) => {
  let imgSrc: string = '';
  if (type === CoreItem.mountain) {
    imgSrc = MountainIcon;
  } else if (type === CoreItem.trail) {
    imgSrc = TrailIcon;
  } else if (type === CoreItem.campsite) {
    imgSrc = TentIcon;
  } else {
    imgSrc = MountainIcon;
  }

  return `
    <div style='
      padding: 0.4rem 1rem 0.4rem 0.5rem;
      display: grid;
      grid-template-columns: 1.5rem 1fr;
      grid-column-gap: 0.4rem;
      background-color: ${tertiaryColor};
      font-size: 0.85rem;
      align-items: center;
    '>
      <div>
        <img src=${imgSrc} title='${name}' alt='${name}' />
      </div>
      <div style='
        display: flex;
        flex-direction: column;
      '>
        <div style='
          font-family: ${primaryFont};
          color: ${primaryColor};
          padding: 0;
          font-weight: 600;
        '>
          ${name}
        </div>
        <small>${subtitle}</small>
      </div>
    </div>
  `;
};

export default getHoverPopupHtml;
