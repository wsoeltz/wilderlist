import React from 'react';
import Header from './Header';

const Core = () => {
  return (
    <div>
      <Header />
      <div>Global Map</div>
      <main>
        <nav>
          <button>Tools</button>
        </nav>
        <div>
          <div>Breadcrumbs</div>
          <input />
          <div>Content</div>
        </div>
      </main>
    </div>
  );
}

export default Core;
