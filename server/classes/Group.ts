import { User } from "./User"

export class Group {
    email: string
    display_name: string
    users: User[]
    constructor(email: string, display_name: string, users: User[]) {
        this.email = email
        this.display_name = display_name
        this.users = users
    }
}
