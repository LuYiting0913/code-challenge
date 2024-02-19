'use client';
import React from 'react';
import Image from 'next/image';
import ProfilePic from '../../images/ProfilePicture.jpg';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from '@nextui-org/react';
import HomeButton from '../Client/NavigationBar/HomeButton';

import LogoutButton from '../Client/NavigationBar/LogoutButton';
import SwapButton from '../NavigationBar/SwapButton';
import TokenButton from '../NavigationBar/TokenButton';

interface NavigationBarProps {}
const NavigationBar: React.FC<NavigationBarProps> = () => {
  return (

    <Navbar>
      <NavbarBrand>
        <HomeButton href={'/dashboard'} />
        <SwapButton href={'/swap'} />
        <TokenButton href={'/tokenSummary'} />
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">

      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>

            <label tabIndex={0} className="btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image src={ProfilePic} alt="ProfilePicture" />
              </div>
            </label>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as test user</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              <LogoutButton href={'/'} />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

    </Navbar>
  );
};

export default NavigationBar;
