export class Comment {
    public author: string;
    public content: string;

    constructor(author: string, content: string) {
        this.author = author;
        this.content = content;
    }
}

export class Recipe {
    public name: string;
    public type: string;
    public imgUrl: string;
    public author: string;
    public description: string;
    public id: number;
    public difficulty: number;
    public duration: number;
    public ingredients: string;
    public comments: Comment[];

    constructor (
        name: string,
        type: string,
        imgUrl: string,
        author: string,
        description: string,
        id:number,
        difficulty: number,
        duration: number,
        ingredients: string,
        comments: Comment[]) {
            this.name = name;
            this.type = type;
            this.imgUrl = imgUrl;
            this.author = author;
            this.description = description;
            this.id = id;
            this.difficulty = difficulty;
            this.ingredients = ingredients;
            this.comments = comments;
            this.duration = duration;
    }
}
