import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NoteServiceService } from '../note-service.service';
import Note from '../models/note';
import { Subscription } from 'rxjs';

import {IPCActions} from  '../../utils/constants';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements  OnDestroy {

  notes: Note[];
  noteSubscription: Subscription;

  constructor(private noteService: NoteServiceService, private zone: NgZone, private electronService: ElectronService){
    this.noteSubscription = noteService.getNotes().subscribe(notes => {
      console.log(notes)
      zone.run(()=>{
        this.notes = notes;
      })
    });
  }

  

  ngOnDestroy(){
    this.noteSubscription.unsubscribe();
  }

}
