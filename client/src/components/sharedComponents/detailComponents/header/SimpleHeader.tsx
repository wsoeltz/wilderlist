import React from 'react';
import styled from 'styled-components/macro';
import {
  BasicIconInText,
  IconContainer as IconContainerBase,
  primaryColor,
  tertiaryColor,
} from '../../../../styling/styleUtils';
import {CoreItem} from '../../../../types/itemTypes';
import EditFlagButton from './EditFlagButton';
import StarButtonWrapper from './starButton';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr 5.625rem;
  grid-column-gap: 0.35rem;
  margin-bottom: 1rem;
  margin-right: -1rem;
`;

const IconHeader = styled.h1`
  display: flex;
  align-items: center;
  margin: 0;
`;

const IconContainer = styled(IconContainerBase)`
  font-size: 2rem;
  margin-right: 0.75rem;

  svg {
    width: 2rem;
  }
`;

const Subtitle = styled.div`
  margin: 0.45rem 0;
`;

const Settings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const EditFlagButtonContainer = styled.div`
  margin-right: 0.5rem;
`;

interface Props {
  loading: boolean;
  id: string;
  title: string;
  customIcon: boolean;
  icon: string | any;
  subtitle: string;
  actionLine?: React.ReactElement<any> | null;
  authorId: null | string;
  type: CoreItem;
  isParentTrail?: boolean;
}

const SimpleHeader = (props: Props) => {
  const {
    id, title, loading, customIcon, icon, subtitle, actionLine,
    authorId, type, isParentTrail,
  } = props;

  const iconEl = customIcon ? (
    <IconContainer
      $color={primaryColor}
      dangerouslySetInnerHTML={{__html: icon}}
    />
  ) : (
    <IconContainer $color={primaryColor}>
      <BasicIconInText icon={icon} />
    </IconContainer>
  );

  return (
    <Root>
      <div>
        <IconHeader>
          {iconEl}
          <span
            style={loading ? {
              width: '75%', backgroundColor: tertiaryColor, color: 'transparent',
            } : undefined}
          >
            {title}
          </span>
        </IconHeader>
        <Subtitle
          style={loading ? {
            width: '45%', backgroundColor: tertiaryColor, color: 'transparent',
          } : undefined}
        >
          {subtitle}
        </Subtitle>
        <div>{actionLine}</div>
      </div>
      <Settings>
        <StarButtonWrapper
          id={id}
          name={title}
          type={type}
        />
        <EditFlagButtonContainer>
          <EditFlagButton
            authorId={authorId}
            type={type}
            id={id}
            name={title}
            isParentTrail={isParentTrail}
          />
        </EditFlagButtonContainer>
      </Settings>
    </Root>
  );
};

export default SimpleHeader;
