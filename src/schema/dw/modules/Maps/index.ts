import {IDatabase, IMain} from 'pg-promise';

export default class Maps {

    private db: IDatabase<any>;

    private pgp: IMain;

    constructor(db: any, pgp: IMain) {
        this.db = db;
        this.pgp = pgp; // library's root, if ever needed;
    }

    public find(id: number) {
        return this.db.oneOrNone('SELECT * FROM someTable WHERE id = $1', id);
    }
}
