'use client';
import React from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  return (
    <section className="text-white p-4">
      <NavigationBar />
      <div className="container mx-auto flex md:flex-row flex-col items-center pt-10 max-w-5xl pl-2">
        Home
      </div>
      <div className="container mx-auto flex md:flex-row flex-col items-center pt-10 max-w-5xl ">
        <div className="mr-4 lg:flex-grow md:w-5/6 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <div className="ml-6 w-full">
            {/* <HistoryTable></HistoryTable> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
