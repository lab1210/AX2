"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AiOutlineHome, AiFillHome } from 'react-icons/ai'; 
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io';
import { MdOutlineCalendarMonth, MdCalendarMonth } from 'react-icons/md'; 
import { FaRegUser, FaUser } from 'react-icons/fa6'; 

const BottomNavBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolid');
  const userId = searchParams.get('userid');

  const dashboardRoute = "/Student/DashBoard";
  const profileRoute = "/Student/Profile";
  const timetableRoute = "/Student/Timetable"; 
  const notificationRoute = ""; 

  const navItems = [
    { id: 'dashboard', href: dashboardRoute, icon: AiOutlineHome, activeIcon: AiFillHome },
    { id: 'notifications', href: notificationRoute, icon: IoMdNotificationsOutline, activeIcon: IoMdNotifications },
    { id: 'timetable', href: timetableRoute, icon: MdOutlineCalendarMonth, activeIcon: MdCalendarMonth },
    { id: 'profile', href: profileRoute, icon: FaRegUser, activeIcon: FaUser },
  ];

  const buildHref = (baseHref) => {
    return `${baseHref}?schoolid=${schoolId}&userid=${userId}`;
  };

  const isActive = (itemHref) => pathname === itemHref;

  const isSpecialActive = !isActive(dashboardRoute) && !isActive(profileRoute);

  return (
    
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const currentHref = buildHref(item.href);
          let itemIsActive = false;

          if (item.id === 'dashboard') {
            itemIsActive = isActive(item.href);
          } else if (item.id === 'profile') {
            itemIsActive = isActive(item.href);
          } else if (item.id === 'notifications' || item.id === 'timetable') {
             itemIsActive = isSpecialActive && isActive(item.href);
          }

          const IconComponent = itemIsActive ? item.activeIcon : item.icon;
          const textColor = itemIsActive ? 'text-[#4169E1]' : 'text-gray-500';

          return (
            <Link href={currentHref} key={item.id} legacyBehavior>
              <a className={`flex flex-col items-center justify-center w-full ${textColor} hover:text-[rgba(0,64,128,0.8)] transition-colors`}>
                <IconComponent size={24} />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;