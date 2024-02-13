// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger=require ('../../logger');

//GET user's fragments with or without ?expand=1
module.exports= async (req, res)=>{
  const fragment=await Fragment.byUser(req.user, req.query.expand);
  res.status(200).json(createSuccessResponse({
    fragments: fragment
  }));
  logger.info({fragments: fragment}, 
    `User's fragments successfully received`);
}
