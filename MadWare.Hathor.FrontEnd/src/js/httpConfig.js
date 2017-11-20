import axios from 'axios'

if (process.env.NODE_ENV == "production") {
  axios.defaults.baseURL = 'http://46.19.11.19:8866';
}
else {
  axios.defaults.baseURL = 'http://46.19.11.19:8866'; //'http://localhost:5000';
}

const baseRemoteUrl = axios.defaults.baseURL;

const getHttpInstance = function(){
  let httpInstance = axios.create({
    baseURL: axios.defaults.baseURL,
    headers: {
      "Content-Type": 'application/json',
      "Access-Control-Allow-Origin": "*"
    }
  });

  return httpInstance;
}

export { getHttpInstance, baseRemoteUrl }
