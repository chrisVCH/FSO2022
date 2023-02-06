import "../index.css"

const Displaycountryinfo = ({weatherinfo, showcountry, country}) => {

    const cel = weatherinfo.main?.temp - 273.15
    const windspeed = weatherinfo.wind?.speed
    const icon1 = weatherinfo.weather?.['0']?.icon
    const weathericon = `http://openweathermap.org/img/wn/${icon1}@2x.png`
    const lang = country.map(c => c.languages).map(Object.values)
    
    return (
    <div>
        <h2>{showcountry}</h2> 
        capital {country.map(c => c.capital)} <br />
        area {country.map(c => c.area)} <br />
        <h3>languages:</h3>
        <ul>
        {lang[0].map( language => <li key={language}>{language}</li>)}
        </ul>
        <img className="flag" alt="flag" src={country.map(c => c.flags.png)}  />
        <h2>Weather in {country.map(c => c.capital)}</h2>
        temperature {cel.toFixed(2)} Celcius <br />
        <img className="weather" src={weathericon} alt="weather icon"  /> <br />
        wind {windspeed} m/s 
    </div>
    )
}

export default Displaycountryinfo