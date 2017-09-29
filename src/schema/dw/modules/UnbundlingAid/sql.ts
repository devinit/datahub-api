export default {
    // tslint:disable-next-line:max-line-length
    total: 'SELECT SUM(value) FROM ( SELECT SUM(value) as value FROM ${table^} where year = ${year} GROUP BY to_di_id) t'
};
