import { useState, useEffect } from 'react'
import Searchresult from './components/Searchresult'
import Displaycountryinfo from './components/Displaycountryinfo'
import weatherService from './services/weather'
import countryService from './services/countries'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [showcountry, setShowcountry] = useState('')
  const [weatherinfo, setWeatherinfo] = useState({})
  const api_key = process.env.REACT_APP_API_KEY

  useEffect( () => {
      countryService
        .getAll()
        .then(initalcountries => {
          setCountries(initalcountries) 
        })
        .catch (error => {console.log('Error fetching data for countries')})
  }, [])

  const filteredcountries = countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase()))
  const displayedcountry =  countries.filter(c => c.name.common === showcountry) 
  
  const numberofcountries = filteredcountries.length

  const handleSearch = (event) => {
    const val = event.target.value
    setValue(event.target.value)        
    const filtered = countries.filter(c => c.name.common.toLowerCase().includes(val.toLowerCase()))
    const num = filtered.length
    
    if (num === 1 ) {    
        setShowcountry(filtered[0].name.common)
        const geolocation = filtered.map(c => c.capitalInfo.latlng)
        const latlng = geolocation[0]
        weatherService
          .getWeather(latlng[0], latlng[1], api_key)
          .then(weatherinfo => {  setWeatherinfo(weatherinfo)
                                })
          .catch(error => {
                            console.log(`Error fetching weather condition for capital`)
                          })

    } else if (num !== 1) {
        setShowcountry('')
        setWeatherinfo({})
    }
  }

  const handleClickShow = (name) => {
      setShowcountry(name)
  }

 
  return (
    <div>
      find countries <input value={value} onChange={handleSearch} />
      {value && countries && <Searchresult numberofcountries={numberofcountries} countries={filteredcountries} handleClickShow={handleClickShow} />}
      {showcountry && <Displaycountryinfo weatherinfo={weatherinfo} showcountry={showcountry} country={displayedcountry} />}
      
    </div>
  )
}

export default App;
