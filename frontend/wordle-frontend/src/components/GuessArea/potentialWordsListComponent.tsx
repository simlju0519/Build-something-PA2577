const PotentialWordsList: React.FC<{ words: string[] }> = ({ words }) => {
    if (words.length === 0) {
        return (
            <div className="potential-words-list mt-4 w-full">
                <h3 className="text-lg font-semibold text-gray-700">Potentiella ord:</h3>
                <p className="text-gray-500 mt-2">Inga ord matchar dina kriterier. Försök att justera dina inmatningar.</p>
            </div>
        );
    }

    return (
        <div className="potential-words-list mt-4 w-full">
            <h3 className="text-lg font-semibold text-gray-700">Potentiella ord:</h3>
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

export default PotentialWordsList;