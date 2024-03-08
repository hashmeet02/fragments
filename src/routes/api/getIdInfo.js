const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

/**
 * Get fragment metadata for given id (GET /fragments/:id/info)
 */

module.exports = async (req, res) => {
  try {
    const convertExt = path.extname(req.params.id);
    const fragmentId = path.basename(req.params.id, convertExt);
    if (fragmentId) {
      const fragment = await Fragment.byId(req.user, req.params.id);
      res.status(200).send(createSuccessResponse({ fragment: fragment }));
      logger.info({ fragmentInfo: fragment }, `Fragment metadata successfully received`);
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};
