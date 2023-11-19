import { TypeAnimation } from 'react-type-animation';
import FadeIn from 'react-fade-in';
import './Hero.css';

export const Hero = () => {
  return (
    <div className='hero-container'>
      <div className='hero-content'>
        <h1 className='hero-title'>
          <TypeAnimation sequence={["Welcome to Hima's Blog", 100]} speed={50} cursor={false} />
        </h1>
        <p className='hero-subtitle'>
          <FadeIn>
            This is where the ramblings and yapping of engineering lies. It could be about work,
            personal projects, or anything really. I would ideally like to update the blog with new
            post every week to document down my engineering journey but we shall see how it goes!
          </FadeIn>
        </p>
      </div>
    </div>
  );
};
