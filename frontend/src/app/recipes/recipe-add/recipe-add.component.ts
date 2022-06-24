import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss']
})
export class RecipeAddComponent implements OnInit {
  recipeForm: FormGroup;
  loggedIn: boolean;

  @ViewChild('form') myTestDiv: ElementRef;
  
  constructor(
    public recipeService: RecipeService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.loggedIn;
    this.initForm();

  }

  initForm(){
    let recipeName: string;
    let recipeImgUrl: string;
    let recipeDescription: string;
    let recipeType: string;
    let recipeAuthor: string = this.authService.user.name;
    let recipeDuration: number;
    let recipeDifficulty: number;
    let recipeComments: string[] = [];
    let recipeIngredients: string;
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imgUrl: new FormControl(recipeImgUrl, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      "type": new FormControl(recipeType, Validators.required),
      author: new FormControl(recipeAuthor),
      duration: new FormControl(recipeDuration, [Validators.required, Validators.pattern(`^[1-9][0-9]?$|^100$`)]),
      difficulty: new FormControl(recipeDifficulty, [Validators.required, Validators.pattern(`^[1-5]*$`)]),
      comments: new FormControl(recipeComments),
      ingredients: new FormControl(recipeIngredients, Validators.required),
    });
  }

  onSubmit(){
    this.recipeService.addRecipe(this.recipeForm.value);
  }



}
