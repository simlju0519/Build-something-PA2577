import React, { useState, useEffect } from 'react';

interface GuessAreaProps {
    lengthOfWord: number;
}

const GuessAreaComponent: React.FC<GuessAreaProps> = ({ lengthOfWord }) => {
    // State for correct characters (array, based on lengthOfWord)
    const [correctCharacters, setCorrectCharacters] = useState<string[]>([]);
    // State for excluded and wrongly positioned characters (plain strings)
    const [excludedCharacters, setExcludedCharacters] = useState<string>('');
    const [wronglyPositionedCharacters, setWronglyPositionedCharacters] = useState<string>('');

    const [listOfPotentialWords, setListOfPotentialWords] = useState<string[]>([]);

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


    const sendGuess = () => {
        // Example of format correct _d__f
        const joinedCorrectCharacters = correctCharacters.join('');
        const guess = {
            correct: joinedCorrectCharacters,
            excluded: excludedCharacters,
            wronglyPositioned: wronglyPositionedCharacters
        };
        console.log(guess);
    }

    return (
        <div className="guess-area flex flex-col items-center justify-center">
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
                Submit Guess
            </button>
        </div>
    );
};

export default GuessAreaComponent;
