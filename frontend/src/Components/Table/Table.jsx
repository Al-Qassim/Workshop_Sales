import { useState } from "react"

import Sheet from "./Sheet"
import "./Table.css"

import SearchUI from "./SearchUI"
import { SearchLogic } from "../../logic/SearchLogic";

import FilterUI from "./FilterUI";
import { FilterLogic } from "../../logic/FilterLogic";
import { DownloadCSV } from "../DownloadCSV";


export default function Table({ 
    TableData, 
    TableColumns, 
    CustomRowFunction, 
    CustomComponentFunctionInSearchAndFilterSection, 
    HideSearchAndFilterSection, 
    HideHeader,
    SubSheet,
    NotIndexed
}) {
    if (!CustomRowFunction) {
        CustomRowFunction = () => {}
    }
    if (!CustomComponentFunctionInSearchAndFilterSection) {
        CustomComponentFunctionInSearchAndFilterSection = () => {}
    }
    // selecting
    
    // setup the table state
    let [TableState, setTableState] = useState({
        SearchTerm: "",                         // searching
        Filters: Object.fromEntries(            // filtring
            Object.entries(TableColumns)
            .filter(([k, v]) => v.filter)
            .map(([k, v]) => [k, "All"])
        ),
        IndexOfRowWithMouseOn: null
    });
    
    // Apply functions
    const ColumnsWithFunction = Object.entries(TableColumns)
        .filter(([ColumnKey, ColumnProp]) => {
            return ColumnProp.Function
        })
        .map(([ColumnKey, ColumnProp]) => {
            return [ColumnKey, ColumnProp.Function]
        })
    
    TableData = TableData.map(row => {
        let NewRow = {}
        Object.entries(row).forEach(([k, v]) => {
            NewRow[k] = v
        })
        ColumnsWithFunction.forEach(([ColumnKey, ColumnFunction]) => {
            NewRow[ColumnKey] = ColumnFunction(NewRow, ColumnKey, row[ColumnKey], TableState, setTableState)
        });
        return NewRow
    })

    // sorting 
    // TODO make good sorting, right know it's very simple
    const arr = Object.entries(TableColumns)
        .filter(([k, v]) => {
            return (typeof (v.SortFunction)) == "function"
        }).map(([k, v]) => {
            return [k, v.SortFunction]
        })
    if (arr.length > 0) {
        const [key, SortFunction] = arr[0] 
        TableData = TableData.sort((a, b) => {return SortFunction(a[`${key}`], b[`${key}`])})
    }


    // apply the search and filters
    TableData = SearchLogic(TableData, TableColumns, TableState.SearchTerm);
    TableData = FilterLogic(TableData, TableColumns, TableState.Filters);
    
    return (
        <div key="Container" className="Container">
            {!HideSearchAndFilterSection && <div key="SearchAndFilterSideBar" className="SearchAndFilterSideBar">
                <SearchUI TableState={TableState} setTableState={setTableState}/>
                <FilterUI TableState={TableState} setTableState={setTableState} TableData={TableData} TableColumns={TableColumns}/>
                <DownloadCSV TableData={TableData} TableColumns={TableColumns} />
                {CustomComponentFunctionInSearchAndFilterSection()}
            </div>}
            <Sheet 
                TableData = {TableData} 
                TableColumns = {TableColumns} 
                TableState={TableState} 
                setTableState={setTableState} 
                CustomRowFunction = {CustomRowFunction}
                HideHeader = {HideHeader}
                SubSheet = {SubSheet}
                NotIndexed = {NotIndexed}
            />
        </div>
    )
}