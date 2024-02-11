// src/routes/api/getId.js

/**
 * Get a the fragment for the current user that matches the
 * id sent as parameter and is of appropriate extension type
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

module.exports = async (req, res) => {
  let query = path.parse(req.params.id);
  let ext = query.ext.split('.').pop();
  try {
    let fragmentMetadata = await Fragment.byId(req.user, query.name);
    let fragment = await fragmentMetadata.getData();

    if (query.ext == '' || fragmentMetadata.type.endsWith(ext)) {
      res.setHeader('Content-type', fragmentMetadata.getData());
      res.status(200).send(Buffer.from(fragment));
      logger.info(
        { fragmentData: fragment, contentType: fragmentMetadata.type },
        'successfully received Fragment data'
      );
    } else {
      try {
        if (fragmentMetadata.isText) {
          logger.debug(true);
          res.setHeader('Content-type', 'text/plain');
          res.status(200).send(Buffer.from(fragment));
          logger.info({ targetType: ext }, `Extension converted to ${ext}`);
        }
      } catch (err) {
        res
          .status(415)
          .json(createErrorResponse(415, `Cannot convert and return Fragment as extension ${ext}`));
      }
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, `Fragment with ${req.params.id} doesn't exist`));
  }
};
