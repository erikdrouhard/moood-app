import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { getWelcomeMessage } from '@/lib/utils';

const WelcomeUser = () => {
  const [name, setName] = useState('');
  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="text-center text-lg font-medium">
        {getWelcomeMessage(name)}
      </p>
    </div>
  );
};

export default WelcomeUser;
