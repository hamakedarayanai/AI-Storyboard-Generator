
export interface Frame {
  id: string;
  prompt: string;
  imageUrl: string | null;
  status: 'new' | 'generating' | 'done' | 'error';
}
