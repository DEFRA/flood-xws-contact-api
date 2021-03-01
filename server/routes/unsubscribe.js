const joi = require('joi')

module.exports = [
  {
    method: 'POST',
    path: '/unsubscribe',
    handler: (request, h) => {
      const { address, areaCode } = request.payload

      const result = {
        status: 'ok'
      }

      return {
        result,
        address,
        areaCode
      }
    },
    options: {
      validate: {
        payload: joi.object().keys({
          address: joi.string().required(),
          areaCode: joi.string().required()
        })
      }
    }
  }
]