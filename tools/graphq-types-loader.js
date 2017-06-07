/**
 * this loader looks for .gql or graphql files
 * and builds out TS types for them
 * depends on @gql2ts/from-schema && merge-graphql-schemas
 */
const fromSchema = require('@gql2ts/from-schema');
const mergeGraphqlSchemas = require('merge-graphql-schemas');

module.exports = function(source) {
  return source;
};