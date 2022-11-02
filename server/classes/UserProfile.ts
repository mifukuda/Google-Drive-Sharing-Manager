import { Query } from "./Query";
import { AccessControlPolicy } from "./AccessControlPolicy";
import { FileInfoSnapshot } from "./FileInfoSnapshot";
import { Types } from "mongoose"

export class UserProfile {
    constructor (
        public _id: Types.ObjectId,
        public driveId: string,
        public driveType: string,
        public displayName: string,
        public email: string,
        public query_history: Query[],
        // public logs: Log[],
        public access_control_policies: AccessControlPolicy[],
        public fileSnapshots: FileInfoSnapshot[],
    ) {}

}