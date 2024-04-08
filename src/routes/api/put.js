const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const api = process.env.API_URL;
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    if (req.get('Content-Type') != fragment.type) {
      res
        .status(400)
        .send(createErrorResponse(400, 'Unable to change fragment type after creation'));
    } else {
      await fragment.setData(req.body);
      res.location(`${api}/v1/fragments/${fragment.id}`);
      res.status(200).send(createSuccessResponse({ fragment, formats: fragment.formats }));
      logger.info({ fragment: fragment }, `Fragment data updated successfully.`);
    }
  } catch (err) {
    res.status(404).send(createErrorResponse(404, 'Unknown fragment'));
  }
};
