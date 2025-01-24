import { useContext, useState } from "react"
import { setBillIdToBePrintedContext, StateContext } from "../App"
import { CompareDates, FormatMoney, Sum } from "../logic/helpers";
import { AddUpdateRowInData, GetData, GetRows, UpdateValuesInData } from "../logic/InteractWithData";
import Table from "../Components/Table/Table";
import PageToolBar from "../Components/PageToolBar";
import { Form } from "../Components/Form";

export default function Bills() {

    let [state, setState] = useContext(StateContext);
    const [HideSearchAndFilterSection, setHideSearchAndFilterSection] = useState(true)

    const setBillIdToBePrinted = useContext(setBillIdToBePrintedContext);
    
    const TableData = state.data.Bills.filter(ItemRow=>!ItemRow.InTrash)
    const TableColumns = {
        Id:             {header: "Bill Id"},
        SummaryOfItems: {header: "Items Summary", Function: (row, key, value) => {
                                                                                    let result = ""
                                                                                
                                                                                    GetRows(state.data, "Transactions", "BillId", row.Id)
                                                                                    .forEach(TransactionRow => { 
                                                                                        let ItemName = GetData("Items", "Id", TransactionRow.ItemId, "Name", state.data)
                                                                                        if (ItemName != null) {
                                                                                            result += ItemName + " - \n "
                                                                                        }
                                                                                    })
                                                                                
                                                                                    return result
                                                                                }},
        PersonId:       {hide: true},        
        PersonName:     {header: "Name", Function: (row, key, value) => {return GetData("People", "Id", row.PersonId, "Name", state.data)}},
        Date:           {header: "Date", SortFunction: ((a, b) => CompareDates(b, a))},
        TotalPrice:     {header: "Total", Format: FormatMoney, Function: (row, key, value, TableState, setTableState) => {
            const ItemsTotals = GetRows(state.data, "Transactions", "BillId", row.Id)
            .map(TransactionsRow=> TransactionsRow.Quantity * TransactionsRow.PricePerUnit)
            if (ItemsTotals.length == 0){return row.Payed + row.Debt}
            return Sum(ItemsTotals)
                                            }},
        Discount:      {header: "Discount", Format: FormatMoney, Function: (row, key, value, TableState, setTableState) => {
                                                return row.TotalPrice - row.Payed - row.Debt
                                            }},
        Payed:          {header: "Payed", Format: FormatMoney},
        Debt:           {header: "Debt", Format: FormatMoney},
        InTrash:        {hide: true},
        Notes:          {header: "Notes"},
        BillType:       {header: "Bill Type", filter: true, Function: (row, key, value) => {return GetData("Billtypes", "Id", row.BillTypeId, "Type", state.data)}},
        BillTypeId:     {hide: true},
        Buttons:        {HideWhenMouseNotOnRow: true, DontExport: true, Function: (row, key, value, TableState, setTableState) => {
                            return  <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
                                        <img // list-button
                                            src="/Icons/list-black.png"
                                            key={`SubTransactions`}
                                            className="IconButton"
                                            onClick={()=>{
                                                if (TableState.IdWithVisibleSubTransactions != row.Id){
                                                    setTableState({
                                                        ...TableState,
                                                        IdWithVisibleSubTransactions: row.Id
                                                    })
                                                }
                                                else {
                                                    setTableState({
                                                        ...TableState,
                                                        IdWithVisibleSubTransactions: null
                                                    })
                                                }
                                                
                                                console.log(`edit button was click on index`)
                                            }}
                                        />
                                        <img // print-button
                                            src="/Icons/print-black.png"
                                            key={`print-button`}
                                            className="IconButton"
                                            onClick={()=>{
                                                console.log(`Print Button was click on index`)
                                                setBillIdToBePrinted(row.Id)
                                            }}
                                        />
                                        <img // edit-button
                                            src="/Icons/pencil-black.png"
                                            key={`EditButton`}
                                            className="IconButton"
                                            onClick={()=>{
                                        
                                                if (TableState.IdWithVisibleEditForm != row.Id){
                                                    setTableState({
                                                        ...TableState,
                                                        IdWithVisibleEditForm: row.Id
                                                    })
                                                }
                                                else {
                                                    setTableState({
                                                        ...TableState,
                                                        IdWithVisibleEditForm: null
                                                    })
                                                }
                                                console.log(`edit button was click on index`)
                                            }}
                                        />
                                        <img // delete-button
                                            src="/Icons/trash-black.png"
                                            key={`Delete-button`}
                                            className="IconButton IconButtonDelete"
                                            onClick={()=>{
                                                if (TableState.IdWithVisibleDeleteConfermationForm != row.Id){
                                                    setTableState({
                                                        ...TableState,
                                                        IdWithVisibleDeleteConfermationForm: row.Id
                                                    })
                                                }
                                                else {
                                                    setTableState({
                                                        ...TableState,
                                                        IdWithVisibleDeleteConfermationForm: null
                                                    })
                                                }
                                                console.log(`edit button was click on index`)
                                            }}
                                        />

                                    </div>
                        }},
        };
    
    const CustomRowFunction = (row, index, TableState, setTableState) => {
        
        if (row.Id==TableState.IdWithVisibleEditForm){
        var [Inputs, setInputs] = useState({
                PersonId: {label: "Name",          value: row.PersonId, ValueType: "number", InputType: "select", options: state.data.People.filter(PeopleRow=>{return !PeopleRow.InTrash}).map(PeopleRow=><option key={PeopleRow.Id} value={PeopleRow.Id}>{PeopleRow.Name}</option>)},
                Date: {label: "Date",              value: row.Date, ValueType: "string", InputType: "date"},
                Payed: {label: "Payed",             value: row.Payed, ValueType: "number", InputType: "string"},
                Debt: {label: "Debt",               value: row.Debt, ValueType: "number", InputType: "string"},
                Notes: {label: "Notes",             value: row.Notes, ValueType: "string", InputType: "textarea"},
            })
        }

        return <>
        {/* // sub transactions */}
        {row.Id==TableState.IdWithVisibleSubTransactions &&
            <Table
                TableData = {
                    GetRows(state.data, "Transactions", "BillId", row.Id)
                    .filter(TransactionsRow => !TransactionsRow.InTrash)
                }
                TableColumns = {{
                    Id:                             {hide: true},
                    ItemId:                         {hide: true},
                    ItemName:                       {header: "Item Name", Function: (TransactionsRow, key, index, value) => {return GetData("Items", "Id", TransactionsRow.ItemId, "Name", state.data)}},
                    Quantity:                       {header: "Quantity"},
                    PricePerUnit:                   {header: "Price Per Unit", Format: FormatMoney},
                    TotalItemPrice:                 {header: "Total", Format: FormatMoney, Function: (TransactionsRow, key, index, value) => {return TransactionsRow.Quantity * TransactionsRow.PricePerUnit}},
                }}
                CustomRowFunction = {()=>{}}
                HideHeader = {false}
                HideSearchAndFilterSection = {true}
                SubSheet = {true}
            />
        }
        {/* // Edit Form */}
        {row.Id==TableState.IdWithVisibleEditForm &&
                <Form
                    key={`EditForm`}
                    FormTitle={"Edit the Bill Info"}
                    Inputs={Inputs}
                    setInputs={setInputs}
                    FormFooter={[
                        <button key="save" className="button EditSaveButton" onClick={()=>{
                            const NewBillsRow = {
                                ...state.data.Bills.filter(Row=>{return !Row.InTrash}).filter(Row => Row.Id == row.Id)[0],
                                ...Object.fromEntries(
                                    Object.entries(Inputs)
                                    //.filter(([k, v]) => k != "PersonName")
                                    .map(([k, v]) => [k, v.value])
                                )
                            }
                            // NewBillsRow.PersonId = GetData("People", "Name", Inputs.PersonName, "Id", state.data)
                            AddUpdateRowInData(NewBillsRow, "Bills", "Id", state, setState)
                            
                            console.log(`save button was click in edit form on index`)
                            console.log(`data that have been saved`, NewBillsRow)
                            setTableState({
                                ...TableState,
                                IdWithVisibleEditForm: null
                            })
                
                        }}>Save Changes</button>,
                        
                        <button key="cancel" className="button CancelButton" onClick={()=>{
                            setTableState({
                                ...TableState,
                                IdWithVisibleEditForm: null
                            })
                            console.log(`cencel button was click in edit form on index`)
                        }}>Cancel</button>
                    ]}
                />        
        }
        {/* // Delete Confermation Form */}
        {row.Id==TableState.IdWithVisibleDeleteConfermationForm &&
                <Form
                    FormTitle = {""}
                    Inputs = {{}}
                    setInputs = {()=>{}}
                    FormFooter = {[
                        <button key="delete button" className="button DeleteConformationButton" onClick={()=>{
                            console.log(`delete confermation button was click in delete form on index`)
                            
                            console.log("Transactions that will be deleted", 
                                GetRows(state.data, "Transactions", "BillId", row.Id)
                            )
                            const sign = row.BillTypeId == 0 ? -1 : 1

                            let UpdateValuesRequests = GetRows(     // get the transactions with this bill Id
                                    state.data, "Transactions", "BillId", row.Id
                                ) 
                                .map(TransactionsRow => [       // get the ItemId, TransactionQuantity, QuantityInInventory
                                    TransactionsRow.ItemId, 
                                    TransactionsRow.Quantity, 
                                    GetData("Items", "Id", TransactionsRow.ItemId, "Quantity", state.data)
                                ])                              // make update requests to return Quantities to inventory
                                .map(([ItemId, TransactionQuantity, QuantityInInventory])=>{                                                
                                    return ["Items", "Id", ItemId, "Quantity", QuantityInInventory + sign * TransactionQuantity]
                                })
                            
                            UpdateValuesRequests = [                // also, remove bill and transactions
                                ...UpdateValuesRequests,
                                ["Bills", "Id", row.Id, "InTrash", 1],
                                ["Transactions", "BillId", row.Id, "InTrash", 1]
                            ]
                            // if the bill was a sell Bill, and It had a debt, remove the debt from the person 
                            if (row.BillTypeId == 1){
                                UpdateValuesRequests = [                
                                    ...UpdateValuesRequests,
                                    ["People", "Id", row.PersonId, "Debt", - row.Debt + GetData("People", "Id", row.PersonId, "Debt", state.data)]
                                ]
                            }
                            // if the bill was a PayDabt Bill, get the debt back on the person 
                            if (row.BillTypeId == 2){
                                UpdateValuesRequests = [                
                                    ...UpdateValuesRequests,
                                    ["People", "Id", row.PersonId, "Debt", row.Payed + GetData("People", "Id", row.PersonId, "Debt", state.data)]
                                ]
                            }
                            console.log("All update requests", 
                                UpdateValuesRequests
                            )
                            UpdateValuesInData(
                                UpdateValuesRequests, [state, setState]
                            )

                            setTableState({
                                ...TableState,
                                IdWithVisibleDeleteConfermationForm: null
                            })

                        }}>Conferm Deletion</button>,
                        <button key="Cancel button" className="button CancelButtonDeleteForm" onClick={()=>{
                            setTableState({
                                ...TableState,
                                IdWithVisibleDeleteConfermationForm: null
                            })
                            console.log(`cencel button was click in edit form on index`)
                        }}>Cancel</button>
                    ]}
                />
        }
        </>

    }
    return (
        <div className="PageBody">
        <PageToolBar 
            Title="Bills History"
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
            setHideSearchAndFilterSection = {setHideSearchAndFilterSection}
            />
        <Table
            TableData = {TableData} 
            TableColumns = {TableColumns}
            CustomRowFunction = {CustomRowFunction}
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
        />
        </div>
    )
}
  