// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
//GET user's fragments with or without ?expand=1
module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user, req.query.expand);
    res.status(200).send(createSuccessResponse({ fragments }));
    logger.info({ fragments }, `User's fragments successfully received`);
  } catch (err) {
    res.status(404).send(createErrorResponse(404, err));
  }
};
