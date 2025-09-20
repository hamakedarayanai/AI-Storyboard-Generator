
import React, { useState, useRef } from 'react';
import { Frame } from '../types';
import Loader from './Loader';
import { DeleteIcon, EditIcon, RegenerateIcon, UploadIcon } from './Icons';

interface FrameCardProps {
  frame: Frame;
  index: number;
  updateFramePrompt: (id: string, newPrompt: string) => void;
  regenerateFrameImage: (id: string) => void;
  deleteFrame: (id: string) => void;
  updateFrameImage: (id: string, imageUrl: string) => void;
}

const FrameCard: React.FC<FrameCardProps> = ({ frame, index, updateFramePrompt, regenerateFrameImage, deleteFrame, updateFrameImage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState(frame.prompt);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateFramePrompt(frame.id, prompt);
    setIsEditing(false);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFrameImage(frame.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-indigo-500/30">
      <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
        {frame.status === 'generating' && (
          <div className="text-center">
            <Loader />
            <p className="mt-2 text-sm text-gray-400">Generating...</p>
          </div>
        )}
        {frame.status === 'error' && (
          <div className="text-center text-red-400 p-4">
            <p>Image generation failed.</p>
            <p className="text-xs">Try a different prompt or regenerate.</p>
          </div>
        )}
        {frame.imageUrl && frame.status === 'done' && (
          <img src={frame.imageUrl} alt={frame.prompt} className="w-full h-full object-cover" />
        )}
        {frame.status === 'new' && (
           <div className="text-center text-gray-400 p-4">
            <p>New Frame</p>
            <p className="text-xs">Generate or upload an image.</p>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">{index + 1}</div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        {isEditing ? (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full flex-grow bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500"
            rows={3}
          />
        ) : (
          <p className="text-sm text-gray-300 flex-grow">{frame.prompt}</p>
        )}
        {isEditing && (
          <button
            onClick={handleSave}
            className="mt-2 w-full bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Save
          </button>
        )}
      </div>
      <div className="p-2 bg-gray-800/50 border-t border-gray-700 grid grid-cols-4 gap-1">
        <button onClick={() => setIsEditing(!isEditing)} title={isEditing ? 'Cancel' : 'Edit Prompt'} className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white flex justify-center"><EditIcon /></button>
        <button onClick={() => regenerateFrameImage(frame.id)} title="Regenerate Image" className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white flex justify-center"><RegenerateIcon /></button>
        <button onClick={handleUploadClick} title="Upload Image" className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white flex justify-center">
            <UploadIcon />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </button>
        <button onClick={() => deleteFrame(frame.id)} title="Delete Frame" className="p-2 rounded-md hover:bg-red-800 transition-colors text-gray-400 hover:text-red-400 flex justify-center"><DeleteIcon /></button>
      </div>
    </div>
  );
};

export default FrameCard;
