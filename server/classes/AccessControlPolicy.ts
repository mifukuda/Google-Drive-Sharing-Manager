import { Group } from "./Group";
import { GroupModel } from "./Group";

export class AccessControlPolicy {
    constructor (
        public AllowedReaders: Group[],
        public AllowedWriters: Group[],
        public DeniedReaders: Group[],
        public DeniedWriters: Group[],
    ) {}
}