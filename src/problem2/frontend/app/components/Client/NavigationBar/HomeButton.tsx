'use client';
import React from 'react';
import Link from 'next/link';

interface Props {
  href: string;
}

const HomeButton = ({ href }: Props) => {
  return (
    <Link href={href} className="btn btn-ghost upper-case text-2xl">
      Home
    </Link>
  );
};

export default HomeButton;
