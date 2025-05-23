import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { getWelcomeMessage } from '@/lib/utils';
import { motion } from 'framer-motion';

const WelcomeUser = () => {
  const [name, setName] = useState(() => 
    localStorage.getItem('userName') || ''
  );
  const [isEditing, setIsEditing] = useState(!name);

  useEffect(() => {
    if (name) {
      localStorage.setItem('userName', name);
    }
  }, [name]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {isEditing ? (
        <div className="relative">
          <Input
            placeholder="What's your name?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name && setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && name && setIsEditing(false)}
            className="text-center text-lg font-medium pr-8"
            autoFocus
          />
          {name && (
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-600 hover:text-purple-700"
            >
              Done
            </button>
          )}
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <p className="text-center text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getWelcomeMessage(name)}
          </p>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click to change name
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default WelcomeUser;
