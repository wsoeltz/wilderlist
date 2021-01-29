import {
  faAlignLeft,
  faLink,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback} from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../../hooks/useFluent';
import {
  ItemTitle,
} from '../../../styling/sharedContentStyles';
import {
  BasicIconInText,
  CompactButtonSecondary,
  lightBorderColor,
} from '../../../styling/styleUtils';
import {
  ExternalResource,
} from '../../../types/graphQLTypes';
import DelayedInput from '../../sharedComponents/DelayedInput';
import DelayedTextarea from '../../sharedComponents/DelayedTextarea';
import {
  DeleteResourceButton,
  ResourceContainer,
} from '../../sharedComponents/formUtils';

const Root = styled.div`
  margin: 0 0 1rem -1rem;
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  grid-gap: 0.5rem;
  border-top: solid 1px ${lightBorderColor};
  padding: 1rem;

  @media (max-width: 650px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
  }
`;

interface Props {
  description: string;
  setDescription: (val: string) => void;
  externalResources: ExternalResource[];
  setExternalResources: (val: ExternalResource[] | ((cur: ExternalResource[]) => ExternalResource[])) => void;
}

const FormDetails = (props: Props) => {
  const {
    description, setDescription, externalResources, setExternalResources,
  } = props;

  const getString = useFluent();

  const handleExternalResourceChange = useCallback((value: string) =>
    (field: keyof ExternalResource, index: number) =>
      setExternalResources(curr => {
        return curr.map((resource, _index) => {
          if (resource[field] === value || index !== _index) {
            return resource;
          } else {
            return {...resource, [field]: value};
          }
        });
      },
    ), [setExternalResources]);

  const deleteResource = useCallback((index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExternalResources(curr => curr.filter((_v, i) => i !== index));
  }, [setExternalResources]);

  const addResource = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExternalResources(curr => [...curr, {title: '', url: ''}]);
  }, [setExternalResources]);

  const resourceInputs = externalResources.map((resource, i) => {
    const onDelete = deleteResource(i);
    return (
      <ResourceContainer key={i}>
        <DelayedInput
          initialValue={resource.title}
          setInputValue={value => handleExternalResourceChange(value)('title', i)}
          placeholder={getString('global-text-value-resource-title')}
          compact={true}
        />
        <DelayedInput
          initialValue={resource.url}
          setInputValue={value => handleExternalResourceChange(value)('url', i)}
          placeholder={getString('global-text-value-resource-url')}
          compact={true}
        />
        <DeleteResourceButton onClick={onDelete}>
          ×
        </DeleteResourceButton>
      </ResourceContainer>
    );
  });

  return (
    <Root>
      <div>
        <label htmlFor={'create-peak-list-description'}>
          <ItemTitle>
            <BasicIconInText icon={faAlignLeft} />
            {getString('create-peak-list-peak-list-description-label')}
          </ItemTitle>
        </label>
        <DelayedTextarea
          id={'create-peak-list-description'}
          rows={5}
          initialValue={description}
          setInputValue={setDescription}
          placeholder={getString('create-peak-list-peak-description')}
          maxLength={5000}
          compact={true}
        />
      </div>
      <div>
        <label>
          <ItemTitle>
            <BasicIconInText icon={faLink} />
            {getString('global-text-value-external-resources')}
          </ItemTitle>
        </label>
        {resourceInputs}
        <CompactButtonSecondary onClick={addResource}>
          <BasicIconInText icon={faPlus} />
          {getString('global-text-value-add-external-resources')}
        </CompactButtonSecondary>
      </div>
    </Root>
  );
};

export default FormDetails;
