import './Hero.css';

export const Hero = () => {
  return (
    <div className='hero-container'>
      <div className='hero-background'>{/* Background and decoration elements go here */}</div>
      <div className='hero-content'>
        <h1 className='hero-title'>Lorem ipsum dolor sit amet.</h1>
        <p className='hero-subtitle'>
          Lorem ipsum dolor sit amet. Bla bla bla bla bla bla. This is my blog. Lorem ipsum dolor
          sit amet.
        </p>
      </div>
    </div>
  );
};
