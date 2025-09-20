
import React from 'react';
import Loader from './Loader';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ script, setScript, onGenerate, isLoading }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <label htmlFor="script-input" className="block text-lg font-semibold mb-2 text-gray-300">
        Your Story Script
      </label>
      <textarea
        id="script-input"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Paste your script here... For example: INT. COFFEE SHOP - DAY. JANE sips her latte, looking worried. The door opens and MARK enters, looking triumphant."
        className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || !script.trim()}
        className="mt-4 w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? (
          <>
            <Loader />
            <span className="ml-2">Generating...</span>
          </>
        ) : (
          'Generate Storyboard'
        )}
      </button>
    </div>
  );
};

export default ScriptInput;
