export function FilterLogic(data, columns, Filters) {
    
    function FilterFunction(row) {

        return Object.entries(Filters).every(([k, FilterWord]) => {
            if (FilterWord == "All") {
                console.log(`removed Filter on ${k}: All`)
                return true
            }
            console.log(`Applied Filter on ${k}: `, FilterWord)
            return row[`${k}`] == FilterWord
        })
    }

    data = data.filter(FilterFunction)
    

    return data
}