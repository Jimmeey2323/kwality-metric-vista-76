
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit, Save, X, Pin, PinOff, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  text: string;
  timestamp: Date;
}

interface FloatingNoteTakerProps {
  storageKey: string;
  title?: string;
  className?: string;
  isPinned?: boolean;
  onPinToggle?: (pinned: boolean) => void;
}

const FloatingNoteTaker: React.FC<FloatingNoteTakerProps> = ({
  storageKey,
  title = "Notes",
  className,
  isPinned = false,
  onPinToggle
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          timestamp: new Date(note.timestamp)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
  }, [storageKey]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        timestamp: new Date()
      };
      setNotes(prev => [note, ...prev]);
      setNewNote("");
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setNotes(prev => prev.map(note => 
        note.id === editingId 
          ? { ...note, text: editText.trim() }
          : note
      ));
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handlePinToggle = () => {
    const newPinnedState = !isPinned;
    if (onPinToggle) {
      onPinToggle(newPinnedState);
    }
  };

  return (
    <Card className={cn(
      "bg-gradient-to-br from-white via-slate-50 to-purple-50 border border-slate-200/50 shadow-2xl backdrop-blur-sm transition-all duration-300",
      isPinned ? "relative w-full mt-6" : "fixed bottom-6 right-6 w-80 z-50",
      isMinimized && !isPinned ? "h-16" : "max-h-[600px]",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePinToggle}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            title={isPinned ? "Unpin from table" : "Pin below table"}
          >
            {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </Button>
          {!isPinned && (
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
            >
              {isMinimized ? <Plus className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {(!isMinimized || isPinned) && (
        <div className="p-4">
          {/* Add new note */}
          <div className="flex gap-2 mb-4">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              onKeyDown={(e) => e.key === 'Enter' && addNote()}
              className="text-sm border-slate-200 focus:border-purple-400 focus:ring-purple-400"
            />
            <Button 
              onClick={addNote}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Notes list */}
          <ScrollArea className="max-h-80">
            {notes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No notes yet. Add your first note above!</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li key={note.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/80 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    {editingId === note.id ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="text-sm border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={saveEdit} 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button 
                            onClick={cancelEdit} 
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-start justify-between group">
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 font-medium leading-relaxed mb-1">{note.text}</p>
                          <p className="text-xs text-slate-500">
                            {note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all duration-200 ml-2">
                          <Button
                            onClick={() => startEdit(note)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-purple-100 rounded-full"
                          >
                            <Edit className="w-3 h-3 text-purple-600" />
                          </Button>
                          <Button
                            onClick={() => deleteNote(note.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      )}
    </Card>
  );
};

export default FloatingNoteTaker;
