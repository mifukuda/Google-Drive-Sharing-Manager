export class Query {
    operator: string
    argument: string
    constructor(property: string, value: string) {
        this.operator = property
        this.argument = value
    }
}
