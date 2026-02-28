const { errorResponse, successResponse } = require("../helpers");

class BaseController {
    error =  (res, message, code = 500) => {
        return errorResponse(res, message, code)
    }

    success = (res, message, data = {}, code = 200) => {
        return successResponse(res, message, data, code)
    }
}

module.exports = BaseController;