import Dexie, { Table } from 'dexie';
import { Note } from '../types';

export class QaydlarDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('qaydlar_db');
    this.version(1).stores({
      notes: 'id, title, createdAt, updatedAt' // Primary key and indexed fields
    });
  }
}

export const db = new QaydlarDatabase();

// Helper functions to maintain compatibility with App.tsx
export const getAllNotes = async (): Promise<Note[]> => {
  return await db.notes.toArray();
};

export const saveNote = async (note: Note): Promise<void> => {
  await db.notes.put(note);
};

export const deleteNoteFromDB = async (id: string): Promise<void> => {
  await db.notes.delete(id);
};

export const saveAllNotes = async (notes: Note[]): Promise<void> => {
  await db.notes.bulkPut(notes);
};
