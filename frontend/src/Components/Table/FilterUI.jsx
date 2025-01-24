
export default function FilterUI({TableState, setTableState, TableData, TableColumns}) {
    
    const Keys = Object.keys(TableState.Filters)
    
    const FilterOptions = Object.fromEntries(
        Object.entries(TableState.Filters)
        .map(([k, FilterInput]) => {
            return [k, [...new Set(TableData.map(row => row[`${k}`]))]]
        })
    )

    function HandleChange(k, input) {
        setTableState({...TableState, Filters: {...TableState.Filters, ...Object.fromEntries([[k, input]])}})
    }

    const RenderFilterOptions = ([k, option]) => {
        return <div key={`div ${k} ${option}`}>
            <label key={`label ${k} ${option}`} className="FilterOption">
                {/* {option == "All" ? "الكل" : option} */}
                <input 
                    type="radio" 
                    className="FilterInput"
                    key={`input ${k} ${option}`}
                    value={option} 
                    name={k}
                    onChange={(e) => {return HandleChange(k, e.target.value)}}
                    checked={TableState.Filters[`${k}`]==option}
                />
                {option == "All" ? "All" : option}
            </label>
            <br key={`br ${k} ${option}`}></br>
            </div>
    }

    const RenderFilterSection = ([k, Options]) => {
        return (
        <div 
            key={`div ${k}`} 
            className="FilterSection"
            >
            <p 
                key={`p ${k}`} 
                className="FilterHeader"
                >
                {TableColumns[`${k}`].header}
            </p>
            
            {/* filter options */}
            {["All", ...Options].map(option => {
            return RenderFilterOptions([k, option])
        })}    
        </div>
        )
    }

    const RenderFilterSections = () => {
        return (
        <div key="FilterUI" className="FilterUI">
            {Object.entries(FilterOptions).map(
                ([k, Options]) => {return RenderFilterSection([k, Options])}
            )}
        </div>)
    }
    
    return RenderFilterSections()
}