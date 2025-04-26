import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid"; // we'll use this to generate unique IDs

/**
 * State for managing note content
 */
interface NoteState {
    notes: Map<string, string>;
    writeNote: (note: string) => void;
    deleteNote: (id: string) => void;
    clearNotes: () => void;
}

/**
 * Store for handling notes and persisting them to localStorage
 */
const useNoteStore = create<NoteState>()(
    persist(
        (set) => ({
            notes: new Map(),

            writeNote: (newNote: string) => {
                set((state) => {
                    const updatedNotes = new Map(state.notes);
                    updatedNotes.set(nanoid(), newNote);
                    return { notes: updatedNotes };
                });
            },

            deleteNote: (id: string) => {
                set((state) => {
                    const updatedNotes = new Map(state.notes);
                    updatedNotes.delete(id);
                    return { notes: updatedNotes };
                });
            },

            clearNotes: () => {
                set(() => ({ notes: new Map() }));
            },
        }),
        {
            name: "note-storage", // localStorage key
            partialize: (state) => ({
                // Convert Map to array for saving to localStorage
                notes: Array.from(state.notes.entries()),
            }),
            merge: (persistedState, currentState) => ({
                ...currentState,
                notes: new Map((persistedState as any).notes),
            }),
        }
    )
);

export default useNoteStore;
