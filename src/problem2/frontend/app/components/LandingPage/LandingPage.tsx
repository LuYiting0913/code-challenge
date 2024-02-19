import React from 'react';
import GetStartedButton from '../Client/LandingPage/GetStartedButton';

const LandingPage = () => {
  return (
    <section className="text-white  body-font">
      <div className="container mx-auto flex flex-col items-center justify-center h-screen">
        <div className="md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl mb-5 font-bold">
            Uniswap
          </h1>
          <p className="mb-10 leading-relaxed text-xl">
            Swap anytime, anywhere!
          </p>
          <div className="flex justify-center">
            <GetStartedButton/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
