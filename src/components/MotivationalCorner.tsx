import React from 'react';
import { getMotivationQuote } from '@/lib/motivation';

export type CornerPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const positionClasses: Record<CornerPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

interface Props {
  position: CornerPosition;
}

const MotivationalCorner: React.FC<Props> = ({ position }) => {
  const quote = getMotivationQuote();

  return (
    <div
      className={`hidden md:flex flex-col items-center absolute ${positionClasses[position]} p-2`}
    >
      <div className="text-5xl">😊</div>
      <p className="mt-2 text-lg font-semibold text-center max-w-xs">
        {quote}
      </p>
    </div>
  );
};

export default MotivationalCorner;
