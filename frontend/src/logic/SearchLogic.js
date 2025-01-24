export function SearchLogic(data, columns, SearchTerm) {
    
    function SearchFilter(row) {
        let s;
        let hidden;
        return Object.entries(row).some(([k, v]) => {
            hidden = columns[k].hide
            
            if (hidden){
                return false
            }
            
            try {
                s = String(v)
            } catch (error) {
                console.log("Error while filtering for search", error)
                return false
            }
            
            return s.includes(SearchTerm)
        })
    }

    if (SearchTerm != ""){
        console.log("search term is", SearchTerm)
        data = data.filter(SearchFilter)
    }

    return data
}