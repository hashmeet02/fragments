const {createErrorResponse, createSuccessResponse}=require('../../response');
const {Fragment}=require('../../model/fragment');
const logger =require('../../logger');

/**
 * Get fragment metadata for given id (GET /fragments/:id/info)
 */

let fragment;
module.exports = async (req, res) => {
  try {
    fragment = await Fragment.byId(req.user, req.params.id);

    res.status(200).send(createSuccessResponse({fragment: fragment}));
    logger.info({ fragmentInfo: fragment }, `Fragment metadata successfully received`);
  } catch (err) {
    res
      .status(404)
      .json(createErrorResponse(404, `Metadata for fragment with id: ${req.params.id} not found`));
  }
};
