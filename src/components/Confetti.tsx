import { useEffect } from 'react';

const Confetti = () => {
  useEffect(() => {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const colors = ['#F472B6', '#FCD34D', '#86EFAC', '#A5B4FC'];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(piece);
    }
    const cleanup = () => {
      container.innerHTML = '';
    };
    const timeout = setTimeout(cleanup, 4000);
    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  }, []);

  return <div id="confetti-container" className="fixed inset-0 pointer-events-none overflow-hidden z-50" />;
};

export default Confetti;
