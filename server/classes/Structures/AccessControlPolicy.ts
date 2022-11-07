import { Group } from "../UserClasses";

export class AccessControlPolicy {
    constructor (
        public AllowedReaders: Group[],
        public AllowedWriters: Group[],
        public DeniedReaders: Group[],
        public DeniedWriters: Group[],
    ) {}
}