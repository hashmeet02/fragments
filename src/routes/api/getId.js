// src/routes/api/getId.js

/**
 * Get a the fragment for the current user that matches the
 * id sent as parameter and is of appropriate extension type
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = async (req, res) => {
  const extension = path.extname(req.params.id);
  const fragmentId = path.basename(req.params.id, extension);
  try {
    let fragmentMetadata = await Fragment.byId(req.user, fragmentId);
    let fragment = await fragmentMetadata.getData();

    if (!extension) {
      res.set('Content-type', fragmentMetadata.mimeType).status(200).send(fragment);
      logger.info(
        { fragmentData: fragment, contentType: fragmentMetadata.type },
        'successfully received Fragment data'
      );
    } else if (extension) {
      if (
        (fragmentMetadata.mimeType.startsWith('text/') && extension === '.txt') ||
        (fragmentMetadata.mimeType === 'applications/json' && extension === '.txt')
      ) {
        fragmentMetadata.type = 'text/plain';
        res.set('Content-type', fragmentMetadata.mimeType).status(200).send(fragment);
        logger.info({ targetType: extension }, `Extension converted to ${extension}`);
      } else if (
        (fragmentMetadata.mimeType === 'text/markdown' && extension === '.md') ||
        (fragmentMetadata.mimeType === 'text/html' && extension === '.html') ||
        (fragmentMetadata.mimeType === 'application/json' && extension === '.json')
      ) {
        res.set('Content-type', fragmentMetadata.mimeType).status(200).send(fragment);
        logger.info({ targetType: extension }, `Extension converted to ${extension}`);
      } else if (fragmentMetadata.mimeType === 'text/markdown' && extension === '.html') {
        fragmentMetadata.type = 'text/html';
        res
          .set('Content-type', fragmentMetadata.mimeType)
          .status(200)
          .send(md.render(`# ${fragment}`));
        logger.info({ targetType: extension }, `Extension converted to ${extension}`);
      } else {
        throw new Error('Unknown or unsupported extension type!');
      }
    }
  } catch (err) {
    if (err.message == "unable to read fragment data") {
      res
        .status(404)
        .json(createErrorResponse(404, `Fragment with given id doesn't exist`));
    } else {
      res
        .status(415)
        .json(
          createErrorResponse(415, `Cannot convert and return Fragment as extension ${extension}`)
        );
    }
  }
};
