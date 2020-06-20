import { Component, OnInit, Input } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { NoteServiceService } from '../note-service.service';
import Note from '../models/note';

import {IPCActions} from  '../../utils/constants';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  @Input("note") note:Note;
  constructor(private electronService: ElectronService, private noteService: NoteServiceService) { }

  ngOnInit() {
  }

  close(){
    console.log("Closing")
    if(this.note == null){
      this.electronService.ipcRenderer.send('close', 0);
      return;
    }
    this.electronService.ipcRenderer.send('close', this.note.id);
  }

  addNote(){
    if(this.note == null){
      console.log("Added from list")
      let addedNote = this.noteService.addNote();
      this.electronService.ipcRenderer.send(IPCActions.ADD_NOTE_FROM_LIST, addedNote);
      return;
    }
    console.log("Added from note")
    // Open a new window
    this.electronService.ipcRenderer.send(IPCActions.ADD_NOTE_FROM_EDIT, null);
  }
}
