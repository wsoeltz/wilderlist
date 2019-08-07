import React, { useState } from 'react';

interface Props {
  addRegion: (name: string) => void;
}

const AddRegion = (props: Props) => {
  const { addRegion } = props;

  const [name, setName] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    addRegion(name);
    setName('');
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
      >
        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit">Add Region</button>
      </form>
    </div>
  );
}

export default AddRegion;