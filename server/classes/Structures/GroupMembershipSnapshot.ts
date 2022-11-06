import { Group } from "../UserClasses/Group"
import { User } from "../UserClasses/User"
import { UploadedFile } from 'express-fileupload'

export class GroupMembershipSnapshot {
    members: User[]
    constructor (
        public group_name: string,
        public file: UploadedFile,
        public date_created: Date
    ) {
        let emails: Set<string> = new Set<string>()
        let text: string = file.data.toString()
        let pattern: RegExp = /mailto:[^\"]*\"/g
        Array.from(text.matchAll(pattern)).forEach((match) => {
            emails.add(match[0].slice(match[0].indexOf(":") + 1, -1))
        })
        this.members = [...emails].map((email: string) => new User(email, email))
    }

    save_to_db(): void {
        // needs implementation
    }
}