import { Component, OnInit, OnChanges, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { NoteServiceService } from '../note-service.service';
import Note from '../models/note';
import { ActivatedRoute } from '@angular/router';

import {IPCActions} from  '../../utils/constants';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-note-edit',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent implements OnInit, OnChanges {

  note:Note = {id:0, title: '', body:'', createdOn: new Date()};
  constructor(private noteService: NoteServiceService, private route: ActivatedRoute, 
    private electronService: ElectronService, private zone: NgZone) {
    this.electronService.ipcRenderer.on(IPCActions.SEND_NOTE_FROM_LIST, (e, d: Note)=>{
      this.zone.run(()=>{
        console.log(d);
        console.log(this);
        this.note = d;
      })
    })
  }

  changeTitle(e){
    this.note.title = e.target.value;
    this.electronService.ipcRenderer.send(IPCActions.SEND_NOTE_TO_LIST, this.note);
  }

  changeBody(e){
    this.note.body = e.target.value;
    this.electronService.ipcRenderer.send(IPCActions.SEND_NOTE_TO_LIST, this.note);
  }

  
  ngOnInit(){
    //console.log("Note edit");
    //console.log(this.route.snapshot)
    /* this.route.params.subscribe(params => {
      console.log(params)
      this.note = this.noteService.getById(params.id);
    }) */
    
  }

  ngOnChanges(){
    console.log(this.note);
  }

}
