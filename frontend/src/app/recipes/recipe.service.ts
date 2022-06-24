import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

import { Recipe } from "./recipe.model";

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private api: string = 'http://127.0.0.1:3000/api/'

    recipes: Recipe[]
    recipesChanged = new Subject<Recipe[]>();
    loggedIn: boolean;
    authChanged: any;

    constructor(private http: HttpClient, private router: Router) {}
    
    getRecipes(only?: string, author?: string, dif?: string) {
        let params = new HttpParams()
        if (only) {
            params = params.set('only', only);
        }
        if (author) {
            params = params.set('author', author);
        }
        console.log(dif)
        if (dif) {
            params = params.set('dif', dif);
        }

        return this.http
            .get<Recipe[]>(
                this.api + 'getRecipes',
                {params}
            ).pipe(tap(data => {
                this.recipes = data;
            }))
    }

    getRecipe(id: string) {
        let params = [];
        return this.http
            .get<Recipe>(
                this.api + 'getRecipe/' + id
            )
    }

    delRecipe(id: string) {
        return this.http.delete<Recipe[]>(this.api + 'deleteRecipe/' + id, {withCredentials: true}).subscribe(data => {
            this.recipes = data;
            this.router.navigate(['/recipes']);
        })
    }

    delComment(id: string, index: string) {
        return this.http.delete<Recipe>(this.api + 'deleteComment/' + id + '/' + index, {withCredentials: true})
    }

    addComment(id: string, data: {author: string, content: string}) {
        return this.http.post<Recipe>(this.api + 'addComment/' + id, data, {withCredentials: true})
    }

    addRecipe(data) {
        this.http.post<{id:string}>(this.api + 'addRecipe', data, {withCredentials: true}).subscribe({
            next: response => {
                console.log('Response')
                console.log(response)
                this.router.navigate(['/recipes/' + response.id]);
            }
        })
    }
}