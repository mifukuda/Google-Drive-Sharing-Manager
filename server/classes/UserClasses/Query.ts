export class Query {
    date_queried: Date
    constructor (
        public operator: string, 
        public argument: string,
    ) {
        this.date_queried = new Date()
    }
}