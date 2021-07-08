require('dotenv').config()
const joi = require('joi')
const envs = ['local', 'sandbox', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  env: joi.string().valid(...envs).default(envs[0]),
  host: joi.string().hostname().required(),
  port: joi.number().default(3000),
  contactGetUrl: joi.string().required(),
  subscriptionGetUrl: joi.string().required(),
  subscriptionPostUrl: joi.string().required(),
  subscriptionPatchUrl: joi.string().required(),
  subscriptionDeleteUrl: joi.string().required()
})

// Build config
const config = {
  env: process.env.ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  contactGetUrl: process.env.CONTACT_GET_URL,
  subscriptionGetUrl: process.env.SUBSCRIPTION_GET_URL,
  subscriptionPatchUrl: process.env.SUBSCRIPTION_PATCH_URL,
  subscriptionPostUrl: process.env.SUBSCRIPTION_POST_URL,
  subscriptionDeleteUrl: process.env.SUBSCRIPTION_DELETE_URL
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

// Add some helper props
value.isLocal = value.env === 'local'

module.exports = value
