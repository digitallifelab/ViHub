/**
 * Created by AVAndriets on 04.10.16.
 */

import {Injectable} from '@angular/core';
import {ElementVi, Favorite, MessageVi, NoteVi, UserVi} from './base-classes';
import {Headers, Http, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ElementsService {
    //URLs
    private elementsUrl = '/rest/elements/';
    private favoriteUrl = '/rest/element-favorite/';
    private messageUrl = '/rest/messages/';
    private noteUrl = '/rest/notes/';

    private headers = new Headers({'Content-Type': 'application/json'});

    cardView: boolean = true;
    currentUser: UserVi;

    constructor(private http: Http) {

        const url = `/vi-hub/me`;
        this.http
            .get(url)
            .toPromise()
            .then((response) => {
                this.currentUser = response.json() as UserVi;
            })
            .catch((err)=> {
                this.handleError = err;
            });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    getElementById(id: number): Promise<ElementVi> {

        const url = `${this.elementsUrl}${id}/`;

        return this.http
            .get(url)
            .toPromise()
            .then((response) => {

                return (response.json() as ElementVi);
            })
            .catch(this.handleError);
    }

    getElements(parent: number): Promise<ElementVi[]> {

        let parent_param: string = "-1";
        if (parent != null) {
            parent_param = parent.toString();
        }

        let params = new URLSearchParams();
        params.set('parent', parent_param); // the user's search value

        return this.http
            .get(this.elementsUrl, {search: params})
            .toPromise()
            .then((response) => {
                return response.json() as ElementVi[];
            })
            .catch(this.handleError);
    }

    getFavorite(): Promise<Favorite[]> {

        return this.http
            .get(this.favoriteUrl)
            .toPromise()
            .then((response) => {
                return response.json() as Favorite[];
            })
            .catch(this.handleError);
    }

    createElement(name: string, description: string, element_type: string, parentElement: ElementVi): Promise<ElementVi> {
        let parent_el: any = null;
        if (parentElement != null) {
            parent_el = parentElement.element;
        }
        return this.http
            .post(this.elementsUrl, JSON.stringify({name: name, description: description, element_type: element_type, parent: parent_el}), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    setFavorite(id: number): Promise<any> {
        const url = `${this.elementsUrl}${id}/set-favorite/`;

        return this.http
            .post(url, null, {headers: this.headers})
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    editElement(currentElement: ElementVi): Promise<ElementVi> {

        const url = `${this.elementsUrl}${currentElement.element}/`;

        return this.http
            .put(url, JSON.stringify(currentElement), {headers: this.headers})
            .toPromise()
            .then(() => currentElement)
            .catch(this.handleError);
    }

    createMessage(newMessage: MessageVi): Promise<MessageVi> {
        return this.http
            .post(this.messageUrl, JSON.stringify(newMessage), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    createNote(newNote: NoteVi): Promise<NoteVi> {
        return this.http
            .post(this.noteUrl, JSON.stringify(newNote), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    editNote(editedNote: NoteVi): Promise<NoteVi> {

        const url = `${this.noteUrl}${editedNote.id}/`;

        return this.http
            .put(url, JSON.stringify(editedNote), {headers: this.headers})
            .toPromise()
            .then((res) => res.json() as NoteVi)
            .catch(this.handleError);
    }

    deleteNote(deleteNote: NoteVi): Promise<NoteVi> {

        const url = `${this.noteUrl}${deleteNote.id}/`;

        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then(() => deleteNote)
            .catch(this.handleError);
    }

    getMessages(element: number): Promise<MessageVi[]> {

        // let element_owner: string = "-1";
        // if (element != null) {
        //     element_owner = element.toString();
        // }
        //
        // let params = new URLSearchParams();
        // params.set('element', element_owner); // the user's search value
        const url = `${this.elementsUrl}${element}/get-messages/`;

        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then((response) => {
                return response.json() as MessageVi[];
            })
            .catch(this.handleError);
    }

    getNotes(element: number): Promise<NoteVi[]> {
        const url = `${this.elementsUrl}${element}/get-notes/`;

        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then((response) => {
                return response.json() as NoteVi[];
            })
            .catch(this.handleError);
    }

    getBreadcrumbs(element: number): Promise<ElementVi[]> {
        const url = `${this.elementsUrl}${element}/get-breadcrumbs`;

        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    getMembers(element: number): Promise<UserVi[]> {
        const url = `${this.elementsUrl}${element}/get-members`;

        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then((response) => {
                return response.json() as UserVi[];
            })
            .catch(this.handleError);
    }

    deleteMember(element: number, deletedUser: UserVi): Promise<UserVi> {
        const url = `${this.elementsUrl}${element}/delete-member/`;

        let member: string = deletedUser.id.toString();
        let params = new URLSearchParams();
        params.set('member', member); // the user's search value

        return this.http
            .post(url, params)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    searchMembers(searchString: string): Promise<UserVi[]> {
        const url = `/vi-hub/search-user/`;

        let params = new URLSearchParams();
        params.set('search', searchString); // the user's search value

        return this.http
            .get(url, {search: params})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    addMember(element: number, addUser: UserVi): Promise<UserVi> {
        const url = `${this.elementsUrl}${element}/add-member/`;

        let member: string = addUser.id.toString();
        let params = new URLSearchParams();
        params.set('member', member); // the user's search value

        return this.http
            .post(url, params)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    syncMailMessages(element: number): Promise<boolean> {
        const url = `${this.elementsUrl}${element}/sync-messages/`;

        if (this.currentUser.provider == 'M') {

            return this.http
                .get(url)
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
        }
        else
            return new Promise<boolean>(() => {
                return false;
            });
    }

    editMessage(editedMessage: MessageVi): Promise<MessageVi> {

        const url = `${this.messageUrl}${editedMessage.id}/`;

        return this.http
            .put(url, JSON.stringify(editedMessage), {headers: this.headers})
            .toPromise()
            .then((res) => res.json() as MessageVi)
            .catch(this.handleError);
    }

    deleteMessage(deleteMessage: MessageVi): Promise<MessageVi> {

        const url = `${this.messageUrl}${deleteMessage.id}/`;

        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then(() => deleteMessage)
            .catch(this.handleError);
    }
}