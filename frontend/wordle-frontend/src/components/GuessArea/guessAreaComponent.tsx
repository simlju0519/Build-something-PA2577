import React, { useState, useEffect } from 'react';
import makeApiRequest from '@/hooks/useApi';

const PotentialWordsList: React.FC<{ words: string[] }> = ({ words }) => {
    if (words.length === 0) {
        return (
            <div className="potential-words-list mt-4 w-full">
                <h3 className="text-lg font-semibold text-gray-700">Potential Words:</h3>
                <p className="text-gray-500 mt-2">No words match your criteria. Try adjusting your inputs.</p>
            </div>
        );
    }

    return (
        <div className="potential-words-list mt-4 w-full">
            <h3 className="text-lg font-semibold text-gray-700">Potential Words:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {words.map((word, index) => (
                    <div
                        key={index}
                        className="word-item border p-3 rounded-lg text-center text-gray-800 font-medium bg-white shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                        aria-label={`Word: ${word}`}
                    >
                        {word}
                    </div>
                ))}
            </div>
        </div>
    );
};


interface GuessAreaProps {
    lengthOfWord: number;
}

const GuessAreaComponent: React.FC<GuessAreaProps> = ({ lengthOfWord }) => {
    // State for correct characters (array, based on lengthOfWord)
    const [correctCharacters, setCorrectCharacters] = useState<string[]>([]);
    // State for excluded and wrongly positioned characters (plain strings)
    const [excludedCharacters, setExcludedCharacters] = useState<string>('');
    const [wronglyPositionedCharacters, setWronglyPositionedCharacters] = useState<string>('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [PotentialWords, setPotentialWords] = useState<string[]>([]);

    const useApi = makeApiRequest();

    // Initialize the correctCharacters array based on lengthOfWord
    useEffect(() => {
        setCorrectCharacters(Array(lengthOfWord).fill(' ')); // Fill with empty spaces
    }, [lengthOfWord]);

    // Handle input for correct characters
    const handleCorrectInputChange = (index: number, value: string) => {
        const updatedCharacters = [...correctCharacters];
        updatedCharacters[index] = value.toLowerCase();
        setCorrectCharacters(updatedCharacters);
    };

    // Handle changes for excluded characters
    const handleExcludedChange = (value: string) => {
        setExcludedCharacters(value.toLowerCase());
    };

    // Handle changes for wrongly positioned characters
    const handleWronglyPositionedChange = (value: string) => {
        setWronglyPositionedCharacters(value.toLowerCase());
    };

    const handleClear = () => {
        setCorrectCharacters(Array(lengthOfWord).fill(' '));
        setExcludedCharacters('');
        setWronglyPositionedCharacters('');
    }



    const sendGuess = async () => {
        // Join the correct characters array into a single string
        let joinedCorrectCharacters = "";
        for (let i = 0; i < correctCharacters.length; i++) {
            if (correctCharacters[i] === ' ' || correctCharacters[i] === '') {
                joinedCorrectCharacters += '_';
                continue;
            }
            else{
                joinedCorrectCharacters += correctCharacters[i];
            }
            
        }
        const guess = {
            correct: joinedCorrectCharacters,
            excluded: excludedCharacters,
            wronglyPositioned: wronglyPositionedCharacters
        };

        setIsLoading(true);
        setError(null);


        const { response, error: apiError } = await useApi.makeAPICall(
            '/make_guess',
            {
                method: 'POST',
                params: { 
                    correctChars: joinedCorrectCharacters,
                    excludedChars: excludedCharacters,
                    includedChars: wronglyPositionedCharacters
                }
            }
        );
        setIsLoading(false);

        if (apiError) {
            setError(apiError);
            return;
        }


        if (response) {
            
            setPotentialWords(response.answare);
            console.log(response.answare);
        }

    }

    return (
        <div className="guess-area flex flex-col items-center justify-center">
            {/* Clearing button */}
            <button className="submit-button bg-red-500 text-white px-4 py-2 mt-4" onClick={handleClear}>
                clear
            </button>
            

            {/* Correct Characters */}
            <div className="correct-characters flex my-2">
                <h3 className="mr-4">Correct:</h3>
                {correctCharacters.map((char, index) => (
                    <input
                        key={`correct-${index}`}
                        type="text"
                        maxLength={1}
                        className="guess-input border text-center mx-1"
                        value={char === ' ' ? '' : char} // Show empty if it's a space
                        onChange={(e) => handleCorrectInputChange(index, e.target.value)}
                    />
                ))}
            </div>

            {/* Excluded Characters */}
            <div className="excluded-characters flex my-2">
                <h3 className="mr-4">Excluded:</h3>
                <input
                    type="text"
                    className="guess-input border w-full"
                    value={excludedCharacters}
                    onChange={(e) => handleExcludedChange(e.target.value)}
                />
            </div>

            {/* Wrongly Positioned Characters */}
            <div className="wrongly-positioned-characters flex my-2">
                <h3 className="mr-4">Wrongly Positioned:</h3>
                <input
                    type="text"
                    className="guess-input border w-full"
                    value={wronglyPositionedCharacters}
                    onChange={(e) => handleWronglyPositionedChange(e.target.value)}
                />
            </div>

            {/* Submit Button */}
            <button className="submit-button bg-blue-500 text-white px-4 py-2 mt-4" onClick={sendGuess}>
                {
                    isLoading ? 'Loading...' : 'Submit'
                }
            </button>
            

            {/* Potential Words List */}
            <PotentialWordsList words={PotentialWords} />
        </div>
    );
};

export default GuessAreaComponent;
