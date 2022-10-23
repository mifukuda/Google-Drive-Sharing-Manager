import { User } from "./User"

export class Group {
    constructor (
        public email: string, 
        public display_name: string, 
        public users: User[]
    ) {}
}