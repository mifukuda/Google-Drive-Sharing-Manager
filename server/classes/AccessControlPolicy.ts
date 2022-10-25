import { Group } from "./Group";
import { GroupModel } from "./Group";
import { Schema, Types, model } from "mongoose";

export class AccessControlPolicy {
    constructor (
        public AllowedReaders: Group[],
        public AllowedWriters: Group[],
        public DeniedReaders: Group[],
        public DeniedWriters: Group[],
    ) {}
}

export const accessControlPolicySchema = new Schema<AccessControlPolicy>({
    AllowedReaders: [{ }]
    AllowedWriters: Group[],
    DeniedReaders: Group[],
    DeniedWriters: Group[],
})