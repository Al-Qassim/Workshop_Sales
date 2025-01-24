// import axiosInstance from "./axiosinstance"
import { PostDataToBackEnd, PostDeleteRow, PostRowToTable } from "./GetPostData"

export function GetData(table, IdentifierKey, IdentifierValue, key, data) {
    const rows = data[table]
                    .filter((row) => 
                        row[IdentifierKey] == IdentifierValue
                        &&
                        !row.InTrash
                    )

    if (rows.length == 0) {
        return null
    } else {
        return rows[0][key]
    }
}
export function GetDataIncludeTrash(table, IdentifierKey, IdentifierValue, key, data) {
    const rows = data[table]
                    .filter((row) => 
                        row[IdentifierKey] == IdentifierValue
                    )

    if (rows.length == 0) {
        return null
    } else {
        return rows[0][key]
    }
}

export function GetRows(data, TableName, IdentifierKey, IdentifierValue){
    return data[TableName]
            .filter((row) => 
                row[IdentifierKey] == IdentifierValue
                &&
                !row.InTrash
            )
}

export function AddUpdateRowInData(NewRow, TableName, IdentifierKey, state, setState) {
    
    let Data = {}
    Data[TableName] = [
        ...state.data[TableName].filter(row => row[IdentifierKey] != NewRow[IdentifierKey]),
        NewRow
    ]
    // console.log("Hear is data", {
    //     ...state, 
    //     data: {
    //         ...state.data,
    //         ...Data
    //     }
    // }
    // )
    setState({
        ...state, 
        data: {
            ...state.data,
            ...Data
        }
    })
    PostRowToTable(NewRow, TableName, IdentifierKey)
}

export function DeleteRowInData(TableName, IdentifierKey, IdentifierValue, state, setState) {
    let Data = {}
    Data[TableName] = [
        ...state.data[TableName].filter(row => row[IdentifierKey] != IdentifierValue),
    ]
    setState({
        ...state, 
        data: {
            ...state.data,
            ...Data
        }
    })
    PostDeleteRow(TableName, IdentifierKey, IdentifierValue)
}

export function UpdateValueInData(TableName, IdentifierKey, IdentifierValue, NewValueKey, NewValue, state, setState){
    console.log(`change ${TableName} ${IdentifierKey} ${IdentifierValue} ${NewValueKey} ${NewValue} `)
    
    let Rows = state.data[TableName]
        .map(Row => {
            if (Row[IdentifierKey] != IdentifierValue) return Row // keep if Identifier doesn't match
            Row[NewValueKey] = NewValue    
            return Row
        })

    let Data = {}
    Data[TableName] = Rows
    // console.log("here is new data", Data)
    setState({
        ...state, 
        data: {
            ...state.data,
            ...Data
        }
    })
    // Post
    // axiosInstance
    //     .post(
    //         '/UpdateValue',
    //         {
    //             TableName: TableName,
    //             IdentifierKey: IdentifierKey,
    //             IdentifierValue: IdentifierValue,
    //             NewValueKey: NewValueKey,
    //             NewValue: NewValue,
    //         }
    //     )
    //     .then((response) => {
    //         console.log('Row posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting row: ', error);
    //     });
    
}

/**
 *  @param {Array} UpdateValuesRequests
 *  @example
 *  
 *  UpdateValuesInData(
 *      [
 *          [TableName, IdentifierKey, IdentifierValue, NewValueKey, NewValue],
 *          [TableName, IdentifierKey, IdentifierValue, NewValueKey, NewValue],
 *          ...
 *      ]    
 *  )
 */

export function UpdateValuesInData(UpdateValuesRequests, [state, setState]){
    
    let Data = {}
    
    UpdateValuesRequests.forEach(([TableName, IdentifierKey, IdentifierValue, NewValueKey, NewValue]) => {
        console.log(`in ${TableName} change ${NewValueKey} to ${NewValue} where ${IdentifierKey} = ${IdentifierValue}`)
        
        Data[TableName] = state.data[TableName]
                            .map(Row => {
                                if (Row[IdentifierKey] != IdentifierValue) return Row // keep if Identifier doesn't match
                                Row[NewValueKey] = NewValue    
                                return Row
                            })
    })
    
    console.log("here is new data ", Data)
    setState({
        ...state, 
        data: {
            ...state.data,
            ...Data
        }
    })
    // Post
    // axiosInstance
    //     .post(
    //         '/UpdateValues',
    //         {
    //             UpdateValuesRequests: UpdateValuesRequests
    //         }
    //     )
    //     .then((response) => {
    //         console.log('Row posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting row: ', error);
    //     });
    
}

/**
 *  @param {Array} ArrayOfRowsDetails
 *  @example
 *  
 *  AddRows(
 *      [
 *          {TableName: string, Rows: array of RowsObjects},
 *          {TableName: string, Rows: array of arrays},
 *          ...
 *      ], 
 *      [state, setState]    
 *  )
 */

export function AddRows(ArrayOfRowsDetails, [state, setState]) {
    var Data = state.data
    console.log(ArrayOfRowsDetails)
    ArrayOfRowsDetails.forEach((RowsDetail) => {  
        Data[RowsDetail.TableName] = [
            ...Data[RowsDetail.TableName],
            ...RowsDetail.Rows
        ]
    })
    setState(
        {
            ...state,
            data: Data
        }
    )
    // axiosInstance
    //     .post(
    //         '/PostRows',
    //         {
    //             ArrayOfRowsDetails: ArrayOfRowsDetails
    //         }
    //     )
    //     .then((response) => {
    //         console.log('Rows posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting rows: ', error);
    //     });
}

export function TestBackend(message) {
    
    // axiosInstance
    //     .post(
    //         '/test',
    //         {
    //             message: message
    //         }
    //     )
    //     .then((response) => {
    //         console.log('message posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting message: ', error);
    //     });
}

export function AddRowsUpdateValuesDeleteTable(ArrayOfRowsDetails, UpdateValuesRequests, DeleteTableName, [state, setState]){
    var Data = state.data

    ////////////////////////

    ArrayOfRowsDetails.forEach((RowsDetail) => {  
        // console.log("Test 1", Data)      
        Data[RowsDetail.TableName] = [
            ...Data[RowsDetail.TableName],
            ...RowsDetail.Rows
        ]
        // console.log("Test 2", Data)
    })
    
    ////////////////////////
    
    UpdateValuesRequests.forEach(([TableName, IdentifierKey, IdentifierValue, NewValueKey, NewValue]) => {
        console.log(`in ${TableName} change ${NewValueKey} to ${NewValue} where ${IdentifierKey} = ${IdentifierValue}`)
        
        Data[TableName] = state.data[TableName]
                            .map(Row => {
                                if (Row[IdentifierKey] != IdentifierValue) return Row // keep if Identifier doesn't match
                                Row[NewValueKey] = NewValue    
                                return Row
                            })
    })

    /////////////////////

    if (DeleteTableName != null){
        Data[DeleteTableName] = []
    }

    ////////////////////

    setState({
        ...state,
        data: Data
    })

    ////////////////////////
    // axiosInstance
    //     .post(
    //         '/AddRowsUpdateValuesDeleteTable',
    //         {
    //             UpdateValuesRequests: UpdateValuesRequests,
    //             ArrayOfRowsDetails: ArrayOfRowsDetails,
    //             DeleteTableName: DeleteTableName
    //         }
    //     )
    //     .then((response) => {
    //         console.log('Row posted successfully: ', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Error posting row: ', error);
    //     });
}