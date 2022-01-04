export class GraphQLQueryPart {
  constructor(
    public type: GraphQLQueryPartType,
    public key: string,
    public path = key
  ) {
  }

  public queryFormula(): string {
    if (this.type === GraphQLQueryPartType.Simple || this.type === GraphQLQueryPartType.Boolean) {
      return '$N: $V'
    }

    return '$N: "$V"';
  }
}

export enum GraphQLQueryPartType {
  String,
  Date,
  Boolean,
  Simple
}