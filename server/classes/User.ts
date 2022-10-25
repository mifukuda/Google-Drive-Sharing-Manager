import { Group } from "./Group"
import { Schema, model } from "mongoose"

export class User {
    constructor (
        public email: string, 
        public display_name: string
    ) {}
}

export const userSchema = new Schema<User>({
    email: String,
    display_name: String
})

export const UserModel = model("User", userSchema)