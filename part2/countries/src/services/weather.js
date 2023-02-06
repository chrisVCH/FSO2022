import axios from 'axios'
const getWeather = (loc1, loc2, api_key) => {
    const baseUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${loc1}&lon=${loc2}&appid=${api_key}`
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

export default { getWeather }