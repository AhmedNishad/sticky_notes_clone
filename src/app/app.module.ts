import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';
import { NgModule } from '@angular/core';

import {Routes, RouterModule, Router} from '@angular/router';

import { AppComponent } from './app.component';
import { NoteComponent } from './note/note.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { NotesListComponent } from './notes-list/notes-list.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';

const appRoutes: Routes = [
  {
    path: 'list',
    component: NotesListComponent,
    data: { title: 'Note List' },
    pathMatch: 'full'
  },
  {
    path: 'edit/:id',
    component: NoteEditComponent,
    data: { title: 'Edit Note' }
  },
  {path: '', redirectTo:'list', pathMatch:'full'},
  {path: '**', redirectTo:''}
]

//  {path: '**', redirectTo:''}

@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    NoteEditComponent,
    NotesListComponent,
    TopBarComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: true ,enableTracing: false}),
    BrowserModule,
    NgxElectronModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
