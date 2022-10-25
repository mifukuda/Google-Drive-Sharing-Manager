import { DriveRoot } from "./DriveRoot"
import { DriveFile } from "./DriveFile"
import { Query } from "./Query"
import { operatorToQueryPredicate, QueryPredicate } from "../predicates"

export class FileInfoSnapshot {
    constructor (
        public date_created: Date, 
        public drive_roots: DriveRoot[], 
    ) {}

    applyQuery(query: Query): DriveFile[] {
        let f: QueryPredicate = operatorToQueryPredicate[query.operator]
        let all_files: DriveFile[] = this.drive_roots.flatMap((d: DriveRoot) => d.getSubtree())     
        return all_files.filter((d: DriveFile) => f(query.argument, d))
    }
    
    serialize(): FileInfoSnapshot {
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