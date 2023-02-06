const Searchresult = ({numberofcountries, countries, handleClickShow}) => {

    if (numberofcountries === 0) {
        return (
            <div>
                No countries match, please adjust the filter
            </div>
        )
    }
    if (numberofcountries > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    }
    if (numberofcountries !== 1) {
        const displaycountries = [...countries].sort( (a, b) => a.name.common > b.name.common ? 1 : -1,)
        return (
            <div>
                {displaycountries.map(c => <div key={c.cca3}>{c.name.common} <button onClick={() => handleClickShow(c.name.common)}>Show</button><br /></div>)} 
            </div>
        )        
    } 
}

export default Searchresult
