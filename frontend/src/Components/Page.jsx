import { useContext } from "react"
import { StateContext } from "../App"
import Table from "../Components/Table/Table";

export function Page({TableColumns, TableData, CustomRowFunction, CustomComponentFunctionInSearchAndFilterSection}) {
    
    let [state, setState] = useContext(StateContext);

    return  <>
            <Table 
                TableData = {TableData} 
                TableColumns = {TableColumns}
                CustomRowFunction = {CustomRowFunction}
                CustomComponentFunctionInSearchAndFilterSection = {CustomComponentFunctionInSearchAndFilterSection}
            />
            {/* Navigation */}
            <button
                onClick={() => {setState({...state, VisiblePage: "Homepage"})}}
            >
                Homepage
            </button>
            </> 
    
}