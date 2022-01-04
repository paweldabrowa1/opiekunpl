import { GraphQLQueryPart } from './GraphQLQueryPart';

type QueryValues = {
  [key: string]: string;
};

export class GraphQLQueryCreator {
  constructor(
    private parts: GraphQLQueryPart[]
  ) {
  }

  public query(values: QueryValues): string {
    const factory = new GQLFlyweightFactory();

    for (let part of this.parts) {
      factory.createFlyweight(part.path, part.key, part.queryFormula());
    }

    return factory.queryFinal(values);
  }
}

/*
  Flyweight
 */

interface GQLFlyweight {
  key(): string;
  formula(): string;

  createFlyweight(path: string, key: string, queryFormula: string): GQLFlyweight
  query(values: QueryValues): string
}

type GQLFlyweightMap = {
  [key: string]: GQLFlyweight;
};

class GQLConcreteFlyweight implements GQLFlyweight {

  private flyweights: GQLFlyweightMap = {};

  constructor(
    private _key: string,
    private queryFormula: string,
  ) {
  }

  key(): string {
    return this._key;
  }

  formula(): string {
    return this.queryFormula;
  }

  createFlyweight(path: string, key: string, queryFormula: string): GQLFlyweight {
    const dot = path.indexOf('.');

    if (dot < 0) {
      let flyweight = this.flyweights[path];
      if (flyweight) {
        return flyweight;
      }

      flyweight = new GQLConcreteFlyweight(key, queryFormula);
      this.flyweights[path] = flyweight;
      return flyweight;
    }

    const fName = path.substring(0, dot);
    let fParent = this.flyweights[fName];
    path = path.substring(dot + 1);

    if (!fParent) {
      fParent = new GQLConcreteFlyweight(fName, '');
      this.flyweights[fName] = fParent;
    }

    if (!fParent) {
      throw new Error("This should not happen!")
    }

    return fParent.createFlyweight(path, key, queryFormula);
  }

  query(values: QueryValues): string {
    const formulas: string[] = [];

    for (let key of Object.keys(this.flyweights)) {
      const flyweight = this.flyweights[key];

      if (!flyweight) {
        continue;
      }

      let formula = '';

      if (flyweight.formula()) {
        let value = values[flyweight.key()];
        if (!value || value.length == 0) {
          continue;
        }

        formula = flyweight.formula().replace("$N", key).replace("$V", value)

        formulas.push(formula);
      }

      formula = flyweight.query(values);

      if (!formula) {
        continue;
      }

      formulas.push(formula);
    }

    if (!formulas || formulas.length == 0) {
      return '';
    }

    let prefix = this.key() ? `${this.key()}: ` : '';
    return `${prefix}{${formulas.join(', ')}}`;
  }
}

class GQLFlyweightFactory extends GQLConcreteFlyweight {

  constructor() {
    super('', '');
  }

  public queryFinal(values: QueryValues) {
    const q = this.query(values);

    if (!q) {
      return '';
    }

    return `query: ${q}`
  }
}