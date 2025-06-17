
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Edit, Save, X, Pin, PinOff, StickyNote, Bold, Italic, List, ListOrdered, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  isFormatted?: boolean;
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
  const [editContent, setEditContent] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-formatting patterns
  const formatText = (text: string): string => {
    let formatted = text;
    
    // Auto-format bullet points
    formatted = formatted.replace(/^- /gm, '• ');
    formatted = formatted.replace(/^\* /gm, '• ');
    
    // Auto-format numbered lists
    formatted = formatted.replace(/^(\d+)\. /gm, '$1. ');
    
    // Auto-format headers
    formatted = formatted.replace(/^# (.+)$/gm, '<strong style="font-size: 1.2em; color: #1e40af;">$1</strong>');
    formatted = formatted.replace(/^## (.+)$/gm, '<strong style="font-size: 1.1em; color: #3b82f6;">$1</strong>');
    
    // Auto-format bold text
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Auto-format code blocks
    formatted = formatted.replace(/`(.+?)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');
    
    // Auto-format links
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #3b82f6; text-decoration: underline;">$1</a>');
    
    // Convert line breaks to HTML
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [newNote]);

  useEffect(() => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = `${Math.min(editTextareaRef.current.scrollHeight, 200)}px`;
    }
  }, [editContent]);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: new Date(),
        isFormatted: true
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
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editContent.trim()) {
      setNotes(prev => prev.map(note => 
        note.id === editingId 
          ? { ...note, content: editContent.trim(), isFormatted: true }
          : note
      ));
    }
    setEditingId(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handlePinToggle = () => {
    const newPinnedState = !isPinned;
    if (onPinToggle) {
      onPinToggle(newPinnedState);
    }
  };

  const insertFormatting = (format: string, textarea: HTMLTextAreaElement, setValue: (value: string) => void, currentValue: string) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'bullet':
        formattedText = `• ${selectedText || 'list item'}`;
        break;
      case 'numbered':
        formattedText = `1. ${selectedText || 'numbered item'}`;
        break;
      case 'header':
        formattedText = `# ${selectedText || 'header'}`;
        break;
    }
    
    const newValue = currentValue.substring(0, start) + formattedText + currentValue.substring(end);
    setValue(newValue);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const baseSize = isPinned ? "w-full min-h-[600px]" : "w-96 max-h-[700px]";
  const position = isPinned ? "relative" : "fixed bottom-6 right-6 z-50";

  return (
    <Card className={cn(
      "bg-gradient-to-br from-white via-slate-50 to-purple-50 border border-slate-200/50 shadow-2xl backdrop-blur-sm transition-all duration-300",
      position,
      baseSize,
      isMinimized && !isPinned ? "h-16" : "",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-t-lg">
        <div className="flex items-center gap-3">
          <StickyNote className="w-6 h-6 text-yellow-400" />
          <div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <p className="text-slate-300 text-sm">Rich text notes with auto-formatting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePinToggle}
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 text-white hover:bg-white/20 rounded-full"
            title={isPinned ? "Unpin from table" : "Pin below table"}
          >
            {isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
          </Button>
          {!isPinned && (
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              size="sm"
              variant="ghost"
              className="h-10 w-10 p-0 text-white hover:bg-white/20 rounded-full"
            >
              {isMinimized ? <Plus className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {(!isMinimized || isPinned) && (
        <div className="p-6">
          {/* Add new note */}
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <Button
                onClick={() => textareaRef.current && insertFormatting('bold', textareaRef.current, setNewNote, newNote)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => textareaRef.current && insertFormatting('italic', textareaRef.current, setNewNote, newNote)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => textareaRef.current && insertFormatting('bullet', textareaRef.current, setNewNote, newNote)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => textareaRef.current && insertFormatting('numbered', textareaRef.current, setNewNote, newNote)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => textareaRef.current && insertFormatting('header', textareaRef.current, setNewNote, newNote)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                title="Header"
              >
                <Type className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note here... Use **bold**, *italic*, # headers, • bullets, 1. numbered lists, `code`, or paste links for auto-formatting"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    addNote();
                  }
                }}
                className="flex-1 min-h-[120px] text-sm border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg p-4 resize-none"
                style={{ minHeight: '120px' }}
              />
              <Button 
                onClick={addNote}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg h-12 w-12 flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Tip: Press Ctrl/Cmd + Enter to add note quickly</p>
          </div>

          {/* Notes list */}
          <ScrollArea className={isPinned ? "max-h-[400px]" : "max-h-96"}>
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <StickyNote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-medium">No notes yet</p>
                <p className="text-slate-400 text-sm">Start writing your first note above with rich text formatting!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {notes.map((note) => (
                  <li key={note.id} className="p-5 rounded-xl bg-white/90 shadow-md hover:shadow-lg transition-all duration-200 border border-slate-100 group">
                    {editingId === note.id ? (
                      <div className="space-y-4">
                        <div className="flex gap-2 mb-3">
                          <Button
                            onClick={() => editTextareaRef.current && insertFormatting('bold', editTextareaRef.current, setEditContent, editContent)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => editTextareaRef.current && insertFormatting('italic', editTextareaRef.current, setEditContent, editContent)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => editTextareaRef.current && insertFormatting('bullet', editTextareaRef.current, setEditContent, editContent)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <List className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => editTextareaRef.current && insertFormatting('numbered', editTextareaRef.current, setEditContent, editContent)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <ListOrdered className="w-4 h-4" />
                          </Button>
                        </div>
                        <textarea
                          ref={editTextareaRef}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                              saveEdit();
                            }
                          }}
                          className="w-full min-h-[100px] text-sm border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg p-3 resize-none"
                          autoFocus
                        />
                        <div className="flex gap-3">
                          <Button 
                            onClick={saveEdit} 
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            onClick={cancelEdit} 
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <div 
                            className="text-sm text-slate-700 font-medium leading-relaxed mb-3"
                            dangerouslySetInnerHTML={{ __html: formatText(note.content) }}
                          />
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200 flex-shrink-0">
                          <Button
                            onClick={() => startEdit(note)}
                            size="sm"
                            variant="ghost"
                            className="h-10 w-10 p-0 hover:bg-purple-100 rounded-full"
                          >
                            <Edit className="w-4 h-4 text-purple-600" />
                          </Button>
                          <Button
                            onClick={() => deleteNote(note.id)}
                            size="sm"
                            variant="ghost"
                            className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
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
