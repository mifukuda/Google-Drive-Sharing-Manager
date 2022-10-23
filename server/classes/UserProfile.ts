import { Query } from "./Query";
import { AccessControlPolicy } from "./AccessControlPolicy";

export class UserProfile {
    constructor (
        query_history: Query[],
        logs: Log[],
        access_control_policies: AccessControlPolicy[]
    ) {}
}