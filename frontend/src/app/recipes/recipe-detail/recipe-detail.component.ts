import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/auth/auth.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  private id: string;
  canComment = true;
  loggedIn = false;
  user: User;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( paramMap => {
      this.id = paramMap.get('id');
    })
    this.recipeService.getRecipe(this.id).subscribe(data => {
      this.recipe = data;
      if (this.recipe.comments.length >= 5) {
        this.canComment =  false;
      }
      this.loggedIn = this.authService.loggedIn;
      this.user = this.authService.user;
    })
  }

  delete(index: string) {
    this.recipeService.delComment(this.id, index).subscribe(data => {
      this.recipe = data;
    })
  }

  deleteRecipe() {
    this.recipeService.delRecipe(this.id);
  }

  onSubmit (form: NgForm) {
    const request = {
      author: this.authService.user.name,
      content: form.form.value.content
    };
    this.recipeService.addComment(this.id, request).subscribe(response => {
      this.recipe = response;
       if (this.recipe.comments.length >= 5) {
        this.canComment =  false;
      }
    });
  }

}
