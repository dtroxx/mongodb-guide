const Artist = require('../models/artist');

/**
 * Sets a group of Artists as retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = (_ids) => {
  return Artist.update(
    // Look at the _id of every artists
    // if their _id is $in this list of _ids that are passed in
    // change retired to true
    { _id: { $in: _ids } },
    { retired: true },
    { multi: true }
  )
};
