import { useEffect, useState } from 'react';
import { getCount, Count, addCount } from '@api/count';
import { Button } from '@components';
import AnimatedNumbers from 'react-animated-numbers';
import './Counter.css';

export const Counter = () => {
  const [count, setCount] = useState<Count>({ count: 0 });

  const handleGetCount = async () => {
    await getCount().then(setCount);
  };

  const handleUpdateCount = async () => {
    await addCount().then(setCount);
  };

  useEffect(() => {
    handleGetCount();
  }, []);

  const formattedCount = count.count.toString().padStart(8, '0').split('');

  return (
    <div className='counter'>
      <h1>
        {formattedCount.map((digit, index) => (
          <span className='digit' key={index}>
            <AnimatedNumbers
              transitions={(index) => ({
                type: 'spring',
                duration: index + 0.2,
              })}
              animateToNumber={parseInt(digit, 10)}
            />
          </span>
        ))}
      </h1>
      <Button
        sx={{
          backgroundColor: '#e1dbe7',
          '&:hover': {
            backgroundColor: '#cbc1d4',
            border: 'none',
          },
        }}
        onClick={handleUpdateCount}
      >
        Click here!
      </Button>
    </div>
  );
};
