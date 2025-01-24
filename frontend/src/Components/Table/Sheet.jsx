import { useState } from "react";

export default function Sheet({ TableData, TableColumns, TableState, setTableState, CustomRowFunction, HideHeader, SubSheet, NotIndexed }) {

    const keys = Object.keys(TableColumns);

    const cell = (key, row) => {
        let result = row[key]
    
        if (TableColumns[key].Format) {
            result = TableColumns[key].Format(result)
        }
        return result
    }

    return (
        <div className={SubSheet? "sheet sub-sheet" : "sheet"}>
            {/* head */}
            {!HideHeader && <table key="sheet-head" className="sheet-head">
                <thead>
                    <tr className="sheet-head-row">
                        {
                            !NotIndexed && 
                            <th 
                                className="sheet-head-cell" 
                                key="index"
                                style={{maxWidth: "20px"}}
                            ></th>
                        }
                        {
                        keys.map(key =>{ 
                            return !TableColumns[key].hide 
                            && 
                                <th 
                                    className="sheet-head-cell" 
                                    key={key}
                                >
                                    {TableColumns[key].header}
                                </th>
                            })
                        }
                    </tr>
                </thead>
            </table>}
            {/* body */}
            <div className="sheet-body">
            {!TableData[0] ?
                <table className="no results table">{/* no results */}
                    <tbody>
                        <tr>
                            <td>
                                <p>Empty Table</p> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                : 
                TableData.map((row, index) => 
                <div key={index}>
                    <table 
                        className={TableState.IndexOfRowWithMouseOn == index ? "sheet-row-table MouseOn" : "sheet-row-table"}
                        key={index}
                    >
                        <tbody>
                                <tr 
                                    className="sheet-row"
                                    onMouseOver={() => setTableState({...TableState, IndexOfRowWithMouseOn: index})}
                                    onMouseOut={() => setTableState({...TableState, IndexOfRowWithMouseOn: null})}
                                >
                                    {/* rows */}
                                    {/* <td className="sheet-body-row-cell">{index+1}</td> */}
                                    {
                                        !NotIndexed && 
                                        <td 
                                            className="sheet-body-cell" 
                                            key="index" 
                                            style={{maxWidth: "20px"}}
                                        >{index+1}</td>
                                    }
                                    {keys.map(
                                        key => 
                                    !TableColumns[key].hide 
                                    && 
                                    <td 
                                        className="sheet-body-cell" 
                                        key={key} 
                                        style={(()=>{
                                                let styles = {}
                                                if (key=="index"){  // make the cell width small for index column
                                                    styles = {...styles, maxWidth: "20px"}
                                                }
                                                if (TableState.IndexOfRowWithMouseOn != index){  // hide cells when appropite
                                                    if (TableColumns[key].HideWhenMouseNotOnRow){
                                                        styles = {...styles, visibility: "hidden"}
                                                    }
                                                }
                                                return styles
                                            })()}
                                    >
                                        {
                                            cell(key, row)
                                        }    
                                    </td>
                                    )}
                                </tr>
                        </tbody> 
                    </table>
                    {CustomRowFunction(row, index, TableState, setTableState)}
                </div>
                )}
            </div>
        </div>
    )
}