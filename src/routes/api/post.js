// src/routes/api/post.js

/**
 * creates and posts the fragment under the given user and stores it into the database
 */

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const api=process.env.API_URL || 'http://localhost:8080'

module.exports = async (req, res) => {
  if (!Fragment.isSupportedType(req.get('Content-Type'))) {
    res.status(415).json(createErrorResponse(415, 'Content-Type not supported'));
  }else{
    try {
        const fragment = new Fragment({
          ownerId: req.user,
          type: req.get('Content-Type'),
          size: req.body.length,
        });
        await fragment.save();
        await fragment.setData(req.body);
        logger.debug({ fragment }, 'New fragment created');
      
        res
        .set('location', `${api}/v1/fragments/${fragment.id}`)
        .status(201)
        .send(createSuccessResponse({ fragment }));
      
        logger.info({ fragment: fragment }, `Fragment posted successfully`);
        
      } catch (err) {
        logger.error("Unable to POST the fragment");
        res.status(404).json(createErrorResponse(404, 'Unable to POST the fragment'));
    }
  }
};
