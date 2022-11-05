import { User } from "./User"

export class Group {
    timestamp: Date
    constructor (
        public email: string, 
        public display_name: string,
        public users: User[]
    ) {
        this.timestamp = new Date()
    }
}