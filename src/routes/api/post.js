// src/routes/api/post.js

/**
 * creates and posts the fragment under the given user and stores it into the database
 */

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let fragment;
  const api = process.env.API_URL || req.header.host;

  try {
    fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });
    await fragment.save();
    await fragment.setData(req.body);
    logger.debug({ fragment }, 'New fragment created');

    res.location(`${api}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));

    logger.info({ fragment: fragment }, `Fragment posted successfully`);
  } catch (err) {
    logger.error('Unsupported Fragment Content-type');
    res.status(415).json(createErrorResponse(415, 'Non-supported content-type'));
  }
};
