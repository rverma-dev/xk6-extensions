import sql from 'k6/x/sql';
import {randomIntBetween, randomString} from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const db = sql.open('postgres', 'postgres://jack:secret@pg.example.com:5432/mydb?sslmode=disable&pool_max_conns=10');

export const options = {
    vus: 100,
    duration: '15s',
}
export function setup() {
}

export function teardown() {
    db.close();
}

export default function () {
    create()
//     db.exec("INSERT INTO keyvalues (key, value) VALUES('plugin-name', 'k6-plugin-sql');");
//     let results = sql.query(db, 'SELECT * FROM keyvalues WHERE key = $1;', 'plugin-name');
//     for (const row of results) {
//         console.log(`key: ${row.key}, value: ${row.value}`);
//     }
}

export function create() {
    let col = ["pk_str", "insert_time"]
    let col_index = []
    const ge = randomIntBetween(8, 99)
    const tenant = randomIntBetween(10000, 99999)
    const geBit = dec2bin(ge).slice(-3).split('').map(Number)
    const tenantBit = dec2bin(tenant).slice(-10).split('').map(Number)
    let vals = [`'${randomString(16)}'`, `'${randomString(16)}'`, Date.now()]
    for (let i = 0; i <= 3; i++) {
      if (geBit[i] === 1) {
            col_index.push(`index_str${i}`)
            vals.push(`'${randomString(16)}'`)
        }
    }
    for (let i = 1; i <= 10; i++) {
        if (tenantBit[i - 1] === 1) {
            col.push(`str${i}`)
            vals.push(`'${randomString(16)}'`)
        }
    }
    db.exec(`CREATE TABLE IF NOT EXISTS ge_${ge} ${col[0]}  PRIMARY KEY, ${col_index.join(" varchar(256) NOT NULL,")}  varchar(256) NOT NULL, ${col.slice(2).join(" varchar(256),")} varchar(256)`)
    // sql.insert(db, keyspace, 'record', col, vals)
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}