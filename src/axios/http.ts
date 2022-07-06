import Request from './index'
const Requests = new Request({
  baseURL: 'https://api.github.com',
  timeout: 30000,
})
export default Requests
