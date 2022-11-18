import Models from "../../db/Models";

export class User {
    constructor (
        public email: string, 
        public display_name: string
    ) {}

    getModel() {
        return new Models.DriveUserModel({ email: this.email, display_name: this.display_name })
    }
}

