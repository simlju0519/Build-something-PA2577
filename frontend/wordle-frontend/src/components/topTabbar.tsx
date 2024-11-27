"use client";
import React from 'react';
import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface RedirectButtonProps {
    link: string;
    text: string;
    isActive: boolean;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ link, text, isActive }) => {
    return (
        <Link 
            href={link} 
            className={'py-4 px-8 font-bold'} 
            prefetch={true}
        >
            <p 
                className={`font-bold text-3xl hover:text-gray-200 cursor-pointer ${isActive ? 'text-blue-200' : 'text-gray-100'}`}
            > 
                {text} 
            </p>
        </Link>
    );
};
const TopTabbar: React.FC = () => {
    const pathname = usePathname();
    const lastRoute = pathname?.split('/').pop();

    console.log('lastRoute', lastRoute);

    return (
        <div className='TopTabbar h-[120px] bg-gray-500 flex  items-center'>
            <div className='flex items-center'>
                <div className='bg-white rounded-full p-2'>
                    <Image src="/images/ordel.png" alt="Wordle" width={180} height={80} className='rounded-full' />
                </div>
                <div className='flex ml-4 space-x-4'>
                    <RedirectButton link='/' text='HEM' isActive={lastRoute === ""} />
                    <RedirectButton link='/senaste-sokningarna' text='SENASTE SÖKNINGARNA' isActive={lastRoute === "senaste-sokningarna"} />
                </div>
            </div>
        </div>
    );
};

export default TopTabbar;