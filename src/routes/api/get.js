// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const fragments = await Fragment.byUser(req.user);
  res.status(200).json(
    createSuccessResponse({
      fragments: fragments,
    })
  );
};
