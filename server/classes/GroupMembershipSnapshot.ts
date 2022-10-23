import { Group } from "./Group"
import { User } from "./User"

export class GroupMembershipSnapshot {
    constructor (
        public date_created: Date, 
        public groups: Map<Group, User[]>
    ) {}
}