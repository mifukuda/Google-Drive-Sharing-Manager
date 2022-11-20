import Models from "../../db/Models";

export class User {
    constructor (
        public type: string,
        public email: string, 
        public display_name: string
    ) {}

    getModel() {
        return new Models.DriveUserModel({ type: this.type, email: this.email, display_name: this.display_name })
    }
}

