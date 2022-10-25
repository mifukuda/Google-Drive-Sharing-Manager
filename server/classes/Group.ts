import { User } from "./User"
import { Schema, model } from "mongoose"

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

export const groupSchema = new Schema<User>({
    email: String,
    display_name: String
})

export const GroupModel = model("Group", groupSchema)