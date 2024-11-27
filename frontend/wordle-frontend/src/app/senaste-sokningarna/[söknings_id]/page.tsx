"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import makeApiRequest from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import PotentialWordsList from '@/components/GuessArea/potentialWordsListComponent';

const SearchResultPage: React.FC = () => {
    const { söknings_id } = useParams();
    const useApi = makeApiRequest();

    const [wordleSearch, setWordleSearch] = useState<any>({});
    const [wordsProvided, setWordsProvided] = useState<any>([]);

    const getSearchedData = async () => {
        const { response, error } = await useApi.makeAPICall(
            `/get_search/${söknings_id}`,
            {
                method: 'GET',
            }
        );

        if (error) {
            console.error(error);
        }

        if (response) {
            setWordleSearch(response.search.wordle_search[0]);

            let words: string[] = [];
            response.search.words.forEach((word: any) => {
                words.push(word.word);
            });
            setWordsProvided(words);

            console.log(response.search.wordle_search[0]);
            console.log(response.search.words);
            // console.log(response);
        }
    }

    useEffect(() => {
        getSearchedData();
    }, []);
        

    return (
    <div className="recent-search border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition duration-200 ease-in-out m-4">
        <div className='flex flex-row items-center text-center mb-4'>
            <h3 className="text-lg font-semibold text-gray-700">Sökning - Korrekta bokstäver i ord:</h3>
            <div>
                <p className="text-base text-gray-800 font-medium ml-2">{wordleSearch.correct_chars}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-gray-500">Included Characters:</p>
                <p className="text-base text-gray-800 font-medium">
                    {wordleSearch.included_chars || <span className="italic text-gray-400">None</span>}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Excluded Characters:</p>
                <p className="text-base text-gray-800 font-medium">
                    {wordleSearch.excluded_chars || <span className="italic text-gray-400">None</span>}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Searched Time:</p>
                <p className="text-base text-gray-800 font-medium">
                    {new Date(wordleSearch.searched_time).toLocaleString()}
                </p>
            </div>

        </div>
            <div>
                <p className="text-sm text-gray-500">Words Provided:</p>
                <PotentialWordsList words={wordsProvided} />
            </div>
    </div>
    );
};

export default SearchResultPage;