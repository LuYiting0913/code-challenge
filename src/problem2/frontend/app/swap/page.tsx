'use client';
import React from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { useRouter } from 'next/navigation';
import SwapForm from '../components/Swap/SwapForm';

const Swap = () => {
  const router = useRouter();

  return (
    <section className="text-white p-4">
        <NavigationBar />
        <div className="container mx-auto w-2/5 flex md:flex-row flex-col items-center pt-10 max-w-5xl pl-2">
          <SwapForm></SwapForm>
        </div>

    </section>
  );
};

export default Swap;
