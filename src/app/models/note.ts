import {v1 as uuid} from 'uuid';

export default class Note{
    title: string;
    body: string;
    createdOn: Date;
    id;

    constructor(title, body){
        this.title = title;
        this.body = body;
        this.createdOn = new Date();
        this.id = uuid();
    }
}