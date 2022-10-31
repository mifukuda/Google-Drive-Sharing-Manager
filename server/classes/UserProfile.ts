import { Query, QueryModel } from "./Query";
import { AccessControlPolicy } from "./AccessControlPolicy";
import { FileInfoSnapshot } from "./FileInfoSnapshot";

export class UserProfile {
    constructor (
        public userID: string,
        public query_history: Query[],
        // public logs: Log[],
        public access_control_policies: AccessControlPolicy[],
        public snapshots: FileInfoSnapshot[]
    ) {}

}