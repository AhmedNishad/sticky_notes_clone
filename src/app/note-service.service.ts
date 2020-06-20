import { Injectable } from '@angular/core';
import Note from './models/note';
import { BehaviorSubject } from 'rxjs';
import { ElectronService } from 'ngx-electron';

import {IPCActions} from  '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  notes: Note[] = [new Note("Note 1", "Make this happen mate!"),
                  new Note("Write lyrics", "All the best")];

  noteSubject: BehaviorSubject<Note[]> = new BehaviorSubject(this.notes);

  constructor(private electronService: ElectronService) { 
    electronService.ipcRenderer.on(IPCActions.UPDATE_NOTE, (e, note)=>{
      this.updateSample(note);
    })
    electronService.ipcRenderer.on(IPCActions.ADD_NOTE_FROM_EDIT, (e, n)=>{
      console.log("Added note from edit!")
      electronService.ipcRenderer.send(IPCActions.ADD_NOTE_FROM_LIST, this.addNote());
    })
  }

  getNotes(){
    return this.noteSubject;
  }

  getById(id){
    let upI = this.notes.findIndex(n =>  n.id == id);
    console.log(id)
    console.log(this.notes[upI])
    return this.notes[upI];
  }

  addNote(){
    let note = new Note("", "");
    this.notes.unshift(note);
    this.noteSubject.next(this.notes);
    return note;
  }

  updateSample(note: Note){ 
    let upI = this.notes.findIndex(n =>  n.id == note.id);
    this.notes[upI] = note;
    console.log(this.notes);
    this.noteSubject.next(this.notes);
  }
}
