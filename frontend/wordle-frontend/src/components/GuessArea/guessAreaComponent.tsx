import React, { useState, useEffect } from 'react';
import makeApiRequest from '@/hooks/useApi';
import PotentialWordsList from './potentialWordsListComponent';

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
        <div className="guess-area flex flex-col items-center justify-center w-1/2">
            {/* Clearing button */}
            <button className="submit-button bg-red-500 text-white px-4 py-2 mt-4" onClick={handleClear}>
                Ränsa
            </button>
            

            {/* Correct Characters */}
            <div className="correct-characters flex my-2">
                <h3 className="mr-4">Korrekta bokstäver:</h3>
                {correctCharacters.map((char, index) => (
                    <input
                        key={`correct-${index}`}
                        type="text"
                        maxLength={1}
                        className="guess-input border text-center mx-1"
                        value={char === ' ' ? '' : char} // Show empty if it's a space
                        onChange={(e) => handleCorrectInputChange(index, e.target.value)}
                        style={{ width: '50px' }}
                    />
                ))}
            </div>

            {/* Excluded Characters */}
            <div className="excluded-characters flex my-2">
                <h3 className="mr-4">Exkluderade bokstäver:</h3>
                <input
                    type="text"
                    className="guess-input border w-full"
                    value={excludedCharacters}
                    onChange={(e) => handleExcludedChange(e.target.value)}
                />
            </div>

            {/* Wrongly Positioned Characters */}
            <div className="wrongly-positioned-characters flex my-2">
                <h3 className="mr-4">Felpacerade bokstäver:</h3>
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
                    isLoading ? 'Laddar...' : 'Få potentiella ord!'
                }
            </button>
            

            {/* Potential Words List */}
            <PotentialWordsList words={PotentialWords} />
        </div>
    );
};

export default GuessAreaComponent;
