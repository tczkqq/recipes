export class User {
    public username: string;
    public name: string;
    public password: string;
    public type: number;

    constructor(username: string, name: string, password: string, type: number) {
        this.name = username;
        this.type = type;
    }
}