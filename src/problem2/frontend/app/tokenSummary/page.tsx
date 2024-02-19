'use client';
import React from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { useRouter } from 'next/navigation';
import TokenTable from '../components/Token/TokenTable';

const Dashboard = () => {
  const router = useRouter();

  return (
    <section className="text-white p-4">
      <NavigationBar />
      <div className="container mx-auto flex md:flex-row flex-col items-center pt-10 max-w-5xl pl-2">
        <TokenTable></TokenTable>
      </div>

    </section>
  );
};

export default Dashboard;
