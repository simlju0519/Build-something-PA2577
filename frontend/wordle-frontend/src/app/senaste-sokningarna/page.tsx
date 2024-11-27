"use client";
import makeApiRequest from '@/hooks/useApi';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const RecentSearches: React.FC<{
    included_chars: string;
    excluded_chars: string;
    correct_chars: number;
    searched_time: string;
    id: number;
}> = ({ included_chars, excluded_chars, correct_chars, searched_time, id }) => {

    const handleOnclick = () => {
        console.log('Clicked', id);
    }

    return (
        <Link 
            onClick={handleOnclick}
            href={"/senaste-sokningarna/" + id} 
            prefetch={true}
        >
            <div className="recent-search border rounded-lg p-4 bg-white cursor-pointer shadow-sm hover:shadow-md transition duration-200 ease-in-out mb-4">
                <div className='flex flex-row items-center text-center mb-4'>
                    <h3 className="text-lg font-semibold text-gray-700">Sökning - Korrekta bokstäver i ord:</h3>
                    <div>
                        <p className="text-base text-gray-800 font-medium ml-2">{correct_chars}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Included Characters:</p>
                        <p className="text-base text-gray-800 font-medium">
                            {included_chars || <span className="italic text-gray-400">None</span>}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Excluded Characters:</p>
                        <p className="text-base text-gray-800 font-medium">
                            {excluded_chars || <span className="italic text-gray-400">None</span>}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Searched Time:</p>
                        <p className="text-base text-gray-800 font-medium">
                            {new Date(searched_time).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const AktivaSokningarPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    interface Search {
        included_chars: string;
        excluded_chars: string;
        correct_chars: number;
        searched_time: string;
        wordle_search_id: number;
    }

    const [recentSearches, setRecentSearches] = useState<Search[]>([]);
    const [amountOfRecentSearches, setAmountOfRecentSearches] = useState<number>(20);

    const useApi = makeApiRequest();

    const getRecentSearches = async () => {
        setIsLoading(true);
        setError(null);

        const { response, error: apiError } = await useApi.makeAPICall(
            `/get_top_recent_searches/${amountOfRecentSearches}`,
            {
                method: 'GET',
            }
        );
        setIsLoading(false);

        if (apiError) {
            setError(apiError);
            return;
        }

        if (response) {
            setRecentSearches(response.recent_searches);
            console.log(response);
        }
    };

    useEffect(() => {
        getRecentSearches();
    }, [amountOfRecentSearches]);

    useEffect(() => {
        // const interval = setInterval(() => {
        //     getRecentSearches();
        // }, 1000);
        getRecentSearches();
        // return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center overflow-auto mb-10">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold">Senaste sökningar</h1>
                <p className="text-lg">I realtid!</p>
            </div>
            {error && (
                <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}
            {!isLoading && !error && recentSearches.length === 0 && (
                <div className="text-center text-gray-500">
                    <p>No recent searches found.</p>
                </div>
            )}
            <div className="w-full max-w-4xl">
                {recentSearches.map((search, index) => (
                    <RecentSearches
                        key={index}
                        included_chars={search.included_chars}
                        excluded_chars={search.excluded_chars}
                        correct_chars={search.correct_chars}
                        searched_time={search.searched_time}
                        id={search.wordle_search_id}
                    />
                ))}
            </div>
        </div>
    );
};

export default AktivaSokningarPage;
