import React from 'react';

const CowHeader: React.FC = () => (
  <header className="flex flex-col items-center gap-2 my-6">
    <span className="text-6xl" role="img" aria-label="cow">🐮</span>
    <h1 className="text-3xl font-bold">Mooood Tracker</h1>
    <span className="text-4xl" role="img" aria-label="hay">🌾</span>
  </header>
);

export default CowHeader;
