class Request {
  constructor() {

  }

  request(message, result) {
    return new Promise(function (resolve, reject) {
      if (message) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  }
}

export default Request;
