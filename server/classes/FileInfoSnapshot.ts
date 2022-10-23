import { DriveRoot } from "./DriveRoot"
import { DriveFile } from "./DriveFile"
import { Query } from "./Query"
import { GroupMembershipSnapshot } from "./GroupMembershipSnapshot"
import { operatorToQueryPredicate, QueryPredicate } from "../predicates"

export class FileInfoSnapshot {
    date_created: Date
    drive_roots: DriveRoot[]
    group_membership_snapshots: GroupMembershipSnapshot[]
    constructor(date_created: Date, drive_roots: DriveRoot[], group_membership_snapshots: GroupMembershipSnapshot[]) {
        this.date_created = date_created
        this.drive_roots = drive_roots
        this.group_membership_snapshots = group_membership_snapshots
    }

    applyQuery(query: Query): DriveFile[] {
        let f: QueryPredicate = operatorToQueryPredicate[query.operator]
        let all_files: DriveFile[] = this.drive_roots.flatMap((d: DriveRoot) => d.getSubtree())     
        return all_files.filter((d: DriveFile) => f(query.argument, d))
    }
    
    serialize(): FileInfoSnapshot { // TODO: use structuredClone to seralize instead of JSON.stringify: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
        let save_drive_roots = this.drive_roots
        this.drive_roots = this.drive_roots.map((d: DriveRoot) => d.serialize())
        let copy: FileInfoSnapshot = structuredClone(this)
        this.drive_roots = save_drive_roots
        return copy
    }

    toString(): string {
        let depth: number = 0
        let s = "\t".repeat(depth) + "Type: " + this.constructor.name + "\n"
        for (let i = 0; i < this.drive_roots.length; i++) {
            let child: DriveFile = this.drive_roots[i]
            s = s + child.toString(depth+1) 
        }
        return s
    }
}