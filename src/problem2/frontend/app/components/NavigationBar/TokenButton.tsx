'use client';
import React from 'react';
import Link from 'next/link';

interface Props {
  href: string;
}

const TokenButton = ({ href }: Props) => {
  return (
    <Link href={href} className="btn btn-ghost normal-case text-xl">
      Tokens
    </Link>
  );
};

export default TokenButton;
