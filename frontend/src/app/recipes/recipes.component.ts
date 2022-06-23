import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[];
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes = data;
    })
  }
}
