import React from 'react';
import { Link } from 'react-router-dom';
import { mobileSize } from '../../Utils';
import { AppContext, IAppContext } from '../App';

interface Props {
  mobileURL: string;
  desktopURL: string;
  children: React.ReactNode;
  [key: string]: any;
}
const DynamicLink = (props: Props) => {
  const { mobileURL, desktopURL, children, ...rest } = props;
  const renderProp = ({windowWidth}: IAppContext) => {
    const url = windowWidth >= mobileSize ? desktopURL : mobileURL;
    return (
      <Link to={url} {...rest}>
        {children}
      </Link>
    );
  };

  return (
    <AppContext.Consumer
      children={renderProp}
    />
  );
};

export default DynamicLink;
