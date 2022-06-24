import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "./auth.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: User = null;
    loggedIn: boolean = false;
    authChanged = new Subject<{user: User, loggedIn: boolean, error: boolean}>();

    private api: string = 'http://127.0.0.1:3000/api/'

    constructor(private http: HttpClient,private router: Router) {}

    getUsers() {
        return this.http.get<string[]>(this.api + 'getUsers');
    }
    
    login(data) {
        this.http.post<User>(this.api + 'login', data, {withCredentials: true}).subscribe({
            next: data => {
                this.user = data;
                this.loggedIn = true;
                this.authChanged.next( {
                    user: this.user, 
                    loggedIn: true,
                    error: false
                })
                this.router.navigate(['/recipes']);
            },
            error: data => {
                this.loggedIn = false;
                this.authChanged.next( {
                    user: null, 
                    loggedIn: false,
                    error: true
                })
            }
        })
    }

    register(data) {
        this.http.post<User>(this.api + 'register', data, {withCredentials: true}).subscribe({
            next: data => {
                this.user = data;
                this.loggedIn = true;
                this.authChanged.next( {
                    user: this.user, 
                    loggedIn: true,
                    error: false
                })
                this.router.navigate(['/recipes']);
            },
            error: data => {
                this.loggedIn = false;
                this.authChanged.next( {
                    user: null, 
                    loggedIn: false,
                    error: true
                })
            }
        })
    }

    logout() {
        this.http.get(this.api + 'logout', {withCredentials: true}).subscribe();
        this.user = null;
        this.loggedIn = false;
        this.authChanged.next( {
            user: null, 
            loggedIn: false,
            error: false
        })
        this.router.navigate(['/recipes']);
    }
}