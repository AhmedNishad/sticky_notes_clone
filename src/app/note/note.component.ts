import { Component, OnInit, Input } from '@angular/core';
import Note from '../models/note';

import { ElectronService } from 'ngx-electron';

import {IPCActions} from  '../../utils/constants';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input('note') note: Note;
  constructor(private electronService: ElectronService) { }

  openNote(){
    console.log(this.note.id);

    if(this.electronService.isElectronApp){
      this.electronService.ipcRenderer.send(IPCActions.OPEN_NOTE, this.note);
    }
  }

  ngOnInit() {
  }

}
