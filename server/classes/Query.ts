import { Schema, model } from "mongoose"

export class Query {
    date_queried: Date
    constructor (
        public operator: string, 
        public argument: string,
    ) {
        this.date_queried = new Date()
    }
}

const querySchema: Schema = new Schema<Query>({
    date_queried: { type: Date, required: true },
    operator: { type: String },
    argument: { type: String }
})

export const QueryModel = model("Query", querySchema)