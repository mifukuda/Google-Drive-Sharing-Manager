import { UploadedFile } from 'express-fileupload'

export class GroupMembershipSnapshot {
    members: string[]
    constructor (
        public group_name: string,
        public file: UploadedFile,
        public date_created: Date
    ) {
        let emails: Set<string> = new Set<string>()
        let text: string = file.data.toString()
        Array.from(text.matchAll(/mailto:[^\"]*\"/g)).forEach((match) => {
            emails.add(match[0].slice(match[0].indexOf(":") + 1, -1))
        })
        this.members = [...emails]
    }
}