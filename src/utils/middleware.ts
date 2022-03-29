const {compose} = require('node-fetch-middleware')


const reject= async (url, init, next) => {
    const response = await next(url, init)
    if (response.status != 200){
        throw new Error(`request error: ${JSON.stringify(response)}`)
    }
    else return  response
}

export const fetch = compose([reject])
