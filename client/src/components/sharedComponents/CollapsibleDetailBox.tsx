import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/macro';
import {
  DetailBox,
  DetailBoxTitle,
  secondaryColor,
  semiBoldFontBoldWeight,
} from '../../styling/styleUtils';
import {AppContext} from '../App';

const Root = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled(DetailBoxTitle)`
  display: grid;
  grid-template-columns: 1fr auto;
  cursor: pointer;
`;

const Contents = styled.div`
  overflow: hidden;
  transition: height 0.25s ease;
`;

const ToggleButton = styled.button`
  text-transform: uppercase;
  text-align: center;
  font-weight: ${semiBoldFontBoldWeight};
  font-size: 0.8rem;
  color: ${secondaryColor};
  background-color: transparent;
  line-height: 1;
  outline: none;

  &:hover {
    color: #333;
  }
`;

interface Props {
  title?: React.ReactNode;
  children?: React.ReactNode;
  defaultHidden?: boolean;
}

const CollapsibleDetailBox = (props: Props) => {
  const {
    title, children, defaultHidden,
  } = props;

  const {windowWidth} = useContext(AppContext);
  const ref = useRef<HTMLDivElement | null>(null);

  const [hidden, setHidden] = useState<boolean>(!!defaultHidden);
  const toggleHidden = useCallback(() => setHidden(curr => !curr), [setHidden]);
  const [contentsHeight, setContentsHeight] = useState<number>(0);

  useEffect(() => {
    if (ref && ref.current) {
      const node = ref.current;
      const currentHeight = node.style.height;
      node.style.height = 'auto';
      setContentsHeight(node.offsetHeight);
      node.style.height = currentHeight;
    }
  }, [ref, windowWidth, setContentsHeight, children]);

  const toggleText = !hidden ? 'Hide' : 'Show';

  return (
    <Root>
      <Title onClick={toggleHidden}>
        <div>
          {title}
        </div>
        <div>
          <ToggleButton>[{toggleText}]</ToggleButton>
        </div>
      </Title>
      <Contents ref={ref} style={{height: hidden ? 0 : contentsHeight}}>
        <DetailBox>
          {children}
        </DetailBox>
      </Contents>
    </Root>
  );
};

export default CollapsibleDetailBox;
