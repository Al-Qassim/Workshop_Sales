
export default function SearchUI({TableState, setTableState}) {
    
    function HandleChange(term) {
        setTableState({...TableState, SearchTerm: term})
    }

    return (
            <input 
                className="SearchInput"    
                placeholder="Search"
                value={TableState.SearchTerm}
                onChange={ (e) => {
                    HandleChange(e.target.value)
                }}
            />
    )
}