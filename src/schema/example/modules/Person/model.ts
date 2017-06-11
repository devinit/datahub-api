// tslint:disable-next-line:no-reference
// for vscode
/// <reference path="../../../../types/dh.d.ts" />

class Person {
  private db: DH.IPersonType[];

  constructor(db) {
    this.db = db;
  }

  public findPerson = (id: string): DH.IPersonType | undefined  => {
    return this.db.find((person) => person.id === id);
  }

  public addPerson = (person: DH.IPersonType): DH.IPersonType[]  => {
    this.db.push(person);
    return this.db;
  }
}

export default Person;
