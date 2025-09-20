
import React, { useState, useCallback } from 'react';
import { Frame } from './types';
import Header from './components/Header';
import ScriptInput from './components/ScriptInput';
import Storyboard from './components/Storyboard';
import { splitScriptIntoScenes, generateImageForPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [script, setScript] = useState<string>('');
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStoryboard = useCallback(async () => {
    if (!script.trim()) {
      setError('Script cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFrames([]);
    
    try {
      setLoadingMessage('Analyzing script and identifying scenes...');
      const prompts = await splitScriptIntoScenes(script);

      const initialFrames: Frame[] = prompts.map(prompt => ({
        id: crypto.randomUUID(),
        prompt,
        imageUrl: null,
        status: 'generating'
      }));
      setFrames(initialFrames);

      await Promise.all(initialFrames.map(async (frame, index) => {
        try {
          setLoadingMessage(`Generating image for frame ${index + 1} of ${prompts.length}...`);
          const imageUrl = await generateImageForPrompt(frame.prompt);
          setFrames(prevFrames => prevFrames.map(f => f.id === frame.id ? { ...f, imageUrl, status: 'done' } : f));
        } catch (e) {
          console.error(`Failed to generate image for prompt: "${frame.prompt}"`, e);
          setFrames(prevFrames => prevFrames.map(f => f.id === frame.id ? { ...f, status: 'error' } : f));
        }
      }));

    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the storyboard. Please check the console for details.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [script]);

  const updateFramePrompt = (id: string, newPrompt: string) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, prompt: newPrompt } : f));
  };

  const regenerateFrameImage = async (id: string) => {
    const frame = frames.find(f => f.id === id);
    if (!frame) return;

    setFrames(prev => prev.map(f => f.id === id ? { ...f, status: 'generating', imageUrl: null } : f));
    try {
      const imageUrl = await generateImageForPrompt(frame.prompt);
      setFrames(prev => prev.map(f => f.id === id ? { ...f, imageUrl, status: 'done' } : f));
    } catch (e) {
      console.error(`Failed to regenerate image for prompt: "${frame.prompt}"`, e);
      setFrames(prev => prev.map(f => f.id === id ? { ...f, status: 'error' } : f));
    }
  };

  const deleteFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
  };
  
  const addFrame = () => {
    const newFrame: Frame = {
      id: crypto.randomUUID(),
      prompt: 'A new scene, edit this prompt.',
      imageUrl: null,
      status: 'new',
    };
    setFrames(prev => [...prev, newFrame]);
  };
  
  const updateFrameImage = (id: string, imageUrl: string) => {
     setFrames(prev => prev.map(f => f.id === id ? { ...f, imageUrl, status: 'done' } : f));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ScriptInput 
          script={script}
          setScript={setScript}
          onGenerate={handleGenerateStoryboard}
          isLoading={isLoading}
        />
        {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
        {isLoading && <div className="mt-6 text-center text-indigo-300">{loadingMessage}</div>}
        
        <Storyboard 
          frames={frames}
          setFrames={setFrames}
          updateFramePrompt={updateFramePrompt}
          regenerateFrameImage={regenerateFrameImage}
          deleteFrame={deleteFrame}
          addFrame={addFrame}
          updateFrameImage={updateFrameImage}
        />
      </main>
    </div>
  );
};

export default App;
