const joi = require('joi')

module.exports = {
  contactId: joi.string().guid().required(),
  subscriptionId: joi.string().guid().required(),
  address: joi.string().required(),
  channelName: joi.string().allow('sms', 'email', 'voice').required(),
  areaCode: joi.string().required(),
  wnlif: joi.boolean().required()
}
