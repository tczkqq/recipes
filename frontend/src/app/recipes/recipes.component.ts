import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[];
  users: string[];

  constructor(private recipeService: RecipeService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.refresh();
    this.authService.getUsers().subscribe(data => {
      this.users = data;
      console.log(data)
    })
  }

  refresh() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes = data;
    })
  }

  onFilter(form?: NgForm) {
    this.recipeService.getRecipes(
      form.form.value.only,
      form.form.value.author,
      form.form.value.dif,
      ).subscribe(data => {
      this.recipes = data;
    })
  }
}
