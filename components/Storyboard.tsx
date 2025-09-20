
import React, { useRef } from 'react';
import { Frame } from '../types';
import FrameCard from './FrameCard';
import { AddIcon } from './Icons';

interface StoryboardProps {
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
  updateFramePrompt: (id: string, newPrompt: string) => void;
  regenerateFrameImage: (id: string) => void;
  deleteFrame: (id: string) => void;
  addFrame: () => void;
  updateFrameImage: (id: string, imageUrl: string) => void;
}

const Storyboard: React.FC<StoryboardProps> = ({ 
  frames, 
  setFrames, 
  updateFramePrompt, 
  regenerateFrameImage, 
  deleteFrame, 
  addFrame,
  updateFrameImage
}) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    const list = [...frames];
    const draggedItemContent = list[dragItem.current!];
    list.splice(dragItem.current!, 1);
    list.splice(dragOverItem.current!, 0, draggedItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setFrames(list);
  };

  if (frames.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-300">Your Storyboard</h2>
        <button 
          onClick={addFrame}
          className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
        >
          <AddIcon />
          Add Frame
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={() => dragItem.current = null}
            onDragOver={(e) => e.preventDefault()}
            className="cursor-move"
          >
            <FrameCard
              frame={frame}
              index={index}
              updateFramePrompt={updateFramePrompt}
              regenerateFrameImage={regenerateFrameImage}
              deleteFrame={deleteFrame}
              updateFrameImage={updateFrameImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Storyboard;
