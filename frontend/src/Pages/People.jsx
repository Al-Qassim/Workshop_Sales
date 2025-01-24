import { useContext, useState } from "react"
import { StateContext } from "../App"
import { CompareDates, FormatMoney, NewId, Today } from "../logic/helpers";
import { AddRowsUpdateValuesDeleteTable, AddUpdateRowInData, GetData, GetRows, UpdateValueInData, UpdateValuesInData } from "../logic/InteractWithData";
import Table from "../Components/Table/Table";
import PageToolBar from "../Components/PageToolBar";
import { Form, InputField } from "../Components/Form";

export default function People() {

    let [state, setState] = useContext(StateContext);
    const [HideSearchAndFilterSection, setHideSearchAndFilterSection] = useState(true)

    const [PayDebtId, setPayDebtId] = useState(null)
    const [PayDebtFormInputs, setPayDebtFormInputs] = useState({
            AmountPayed:    {label: "Amount Payed",  value: 0, ValueType: "number", InputType: "number", MinimumValue: 0, MaximumValue: 0},
            Date:           {label: "Date",  value: Today(), ValueType: "string", InputType: "date"},
            Notes:          {label: "Bill Notes",     value: "", ValueType: "string", InputType: "textarea"},
        })

    const PayDebtFormSaveButtonHandleClick = () => {
        if (PayDebtFormInputs.AmountPayed.value == 0){
            return null
        }
        const PeopleRow = GetRows(state.data, "People", "Id", PayDebtId)[0]
        setPayDebtId(null)

        var ArrayOfRowsDetails = []
        var UpdateValuesRequests = []
        const PersonId = PayDebtId
        
        // 1 update the people row
        
        UpdateValuesRequests = [
            ...UpdateValuesRequests,
            ["People", "Id", PersonId, "Debt", PeopleRow.Debt - PayDebtFormInputs.AmountPayed.value]
        ]                
        
        // 2
        // new Bill
        const NewBillId = NewId("Bills", state.data)
        ArrayOfRowsDetails = [
            ...ArrayOfRowsDetails,
            {TableName: "Bills", Rows: [
                {
                    BillTypeId: 2,
                    Date: PayDebtFormInputs.Date.value,
                    Debt: PeopleRow.Debt - PayDebtFormInputs.AmountPayed.value,
                    Id: NewBillId,
                    InTrash: 0,
                    Notes: PayDebtFormInputs.Notes.value,
                    Payed: PayDebtFormInputs.AmountPayed.value,
                    PersonId: PersonId
                }
            ]}
        ]
        
        console.log("Rows that will be added", ArrayOfRowsDetails)
        console.log("Items that will be modefied", UpdateValuesRequests)
        
        // UpdateValuesInData()
        AddRowsUpdateValuesDeleteTable(
            ArrayOfRowsDetails, 
            UpdateValuesRequests, 
            null, 
            [state, setState]
        )
    }

    const TableData = state.data.People.filter(PeopleRow=>{return !PeopleRow.InTrash})
    const TableColumns = {
        Id:             {hide: true},
        Name:           {header: "Name", SortFunction: ((a, b) => {return a.localeCompare(b)})},              
        Info:           {header: "Info"},
        Debt:           {header: "Debt", Format: FormatMoney},
        Buttons:        {HideWhenMouseNotOnRow: true, Function: (row, key, value, TableState, setTableState) => {
                            return  <div className="buttons-container-in-rows"> 
                                        <img // delete-button
                                            src="/Workshop_Sales/Icons/trash-black.png"
                                            key={`Delete-button `}
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
                                                console.log(`edit button was click `)
                                            }}
                                        />
                                        <img // edit-button
                                            src="/Workshop_Sales/Icons/pencil-black.png"
                                            key={`EditButton `}
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
                                                console.log(`edit button was click `)
                                            }}
                                        />
                                        <img // list-button
                                            src="/Workshop_Sales/Icons/list-black.png"
                                            key={`SubTransactions `}
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
                                                
                                                console.log(`edit button was click `)
                                            }}
                                        />
                                        <img // PayDebt-button
                                            src="/Workshop_Sales/Icons/PayDebt.png"
                                            key="PayDebt"
                                            className="IconButton"
                                            onClick={()=>{
                                                setPayDebtId(row.Id)
                                                console.log(`PayDebt button was click`)
                                            }}
                                            onMouseEnter={()=>{
                                                const CurrentDebt = GetData("People", "Id", row.Id, "Debt", state.data)
                                                setPayDebtFormInputs({
                                                    ...PayDebtFormInputs,
                                                    AmountPayed: {
                                                        ...PayDebtFormInputs.AmountPayed, 
                                                        value: CurrentDebt,
                                                        MaximumValue: CurrentDebt,
                                                    }
                                                })        
                                            }}
                                        />
                                    </div>
                        }},
        };
    
    const CustomRowFunction = (row, index, TableState, setTableState) => {
        
        if (row.Id==TableState.IdWithVisibleEditForm){
            var [Inputs, setInputs] = useState({
                Name: {label: "Name",      value: row.Name, ValueType: "string", InputType: "string"},
                Info: {label: "Info", value: row.Info, ValueType: "string", InputType: "textarea"},
                Debt: {label: "Debt",      value: row.Debt, ValueType: "number", InputType: "number"},
                })
        }

        return <>
        {/* // sub transactions */}
        {row.Id==TableState.IdWithVisibleSubTransactions &&
            <>
            {/* <h3 style={{textAlign: "center"}}>آخر العمليات التجارية مع {row.Name}</h3> */}
            <Table
                TableData = {
                    state.data.Transactions.filter(Row=>{return !Row.InTrash})
                    .filter(TransactionsRow => !TransactionsRow.InTrash)
                    .filter(TransactionsRow => {return GetData("Bills", "Id", TransactionsRow.BillId, "PersonId", state.data) == row.Id})
                }
                TableColumns = {{
                    Id:                             {hide: true},
                    ItemId:                         {hide: true},
                    BillType:                       {header: "Bill Type", Function: (TransactionsRow, key, index, value) => {return GetData("Billtypes", "Id", GetData("Bills", "Id", TransactionsRow.BillId, "BillTypeId", state.data), "Type", state.data)}},
                    ItemName:                       {header: "Item Name", Function: (TransactionsRow, key, index, value) => {return GetData("Items", "Id", TransactionsRow.ItemId, "Name", state.data)}},
                    Quantity:                       {header: "Quantity"},
                    PricePerUnit:                   {header: "Price Per Unit", Format: FormatMoney},
                    TotalItemPrice:                 {header: "Total", Format: FormatMoney, Function: (TransactionsRow, key, index, value) => {return TransactionsRow.Quantity * TransactionsRow.PricePerUnit}},
                    BillId:                         {header: "Bill Id", Function: (TransactionsRow, key, index, value) => {return TransactionsRow.BillId}},
                    Date:                           {header: "Date", SortFunction: ((a, b) => CompareDates(b, a)), Function: (TransactionsRow, key, index, value) => {return GetData("Bills", "Id", TransactionsRow.BillId, "Date", state.data)}},
                    InTrash:                        {hide: true}
                }}
                CustomRowFunction = {()=>{}}
                HideHeader = {false}
                HideSearchAndFilterSection = {true}
                SubSheet = {true}
            />
            </>
        }
        {/* // Edit Form */}
        {row.Id==TableState.IdWithVisibleEditForm &&
                // Edit form UI
                <Form
                    FormTitle={"ُEdit Person Info"}
                    Inputs={Inputs}
                    setInputs={setInputs}
                    FormFooter={[
                        <button key="save" className="button EditSaveButton" onClick={()=>{
                            const NewPeopleRow = {
                                ...state.data.People.filter(Row=>{return !Row.InTrash}).filter(Row => Row.Id == row.Id)[0],
                                ...Object.fromEntries(
                                    Object.entries(Inputs)
                                    //.filter(([k, v]) => k != "PersonName")
                                    .map(([k, v]) => [k, v.value])
                                )
                            }
                            // NewPeopleRow.PersonId = GetData("People", "Name", Inputs.PersonName, "Id", state.data)
                            AddUpdateRowInData(NewPeopleRow, "People", "Id", state, setState)
                            
                            console.log(`save button was click in edit form `)
                            console.log(`data that have been saved`, NewPeopleRow)
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
                            console.log(`cencel button was click in edit form `)
                        }}>Cancel</button>
                    ]}
                />      
        }
        {/* // Delete Confermation Form */}
        {row.Id==TableState.IdWithVisibleDeleteConfermationForm &&
                <Form
                FormTitle={""}
                Inputs={{}}
                setInputs={()=>{}}
                FormFooter={[
                    <button key="delete button" className="button DeleteConformationButton" onClick={()=>{
                        
                        // let NewBillsRow = GetRows(state.data, "Bills", "Id", row.Id)[0]
                        // NewBillsRow.InTrash = 1
                        // AddUpdateRowInData(NewBillsRow, "Bills", "Id", state, setState)
                        UpdateValueInData("People", "Id", row.Id, "InTrash", 1, state, setState)
                        // UpdateValueInData("Transactions", "BillId", row.Id, "InTrash", 1, state, setState)

                        console.log(`delete confermation button was click in delete form `)
                        console.log(`Id that will be deleted is: `, row.Id)
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
                        console.log(`cencel button was click in edit form `)
                    }}>Cancel</button>
                ]}
            />
        }
        </>

    }

    const AddNewForm = (() => {
        let [state, setState] = useContext(StateContext);
            
        const [AddNewFormVisibility, setAddNewFormVisibility] = useState(false)
        const [Inputs, setInputs] = useState({
                Name:                   {label: "Name",       value: "", ValueType: "string", InputType: "string"},
                Info:                   {label: "Info",          value: "", ValueType: "string", InputType: "textarea"},    
                Debt:                   {label: "Debt",     value: 0, ValueType: "number", InputType: "number"},    
            })
        
                // AddNewItemForm
                if (!AddNewFormVisibility) { 
                    return <button 
                        className="button AddNewItemButton green-button"
                        onClick={()=>{
                            setAddNewFormVisibility(true)
                        }}
                    >Add New Person</button>
                } else {
                
                    return <Form
                    FormTitle={"Add New Person"}
                    Inputs={Inputs}
                    setInputs={setInputs}
                    FormFooter={[
                        <button 
                            key="save AddNewItemForm" 
                            className="button EditSaveButton" 
                            onClick={() => {
                                console.log(Inputs)
                                const NewPeopleRow = {
                                    Debt: Inputs.Debt.value,
                                    Id: NewId("People", state.data),
                                    InTrash: 0,
                                    Info: Inputs.Info.value,
                                    Name: Inputs.Name.value
                                }
                                AddUpdateRowInData(NewPeopleRow, "People", "Id", state, setState)
                                setAddNewFormVisibility(false)
                            }}
                        >
                            Save
                        </button>,

                        <button key="cancel AddNewItemForm" className="button CancelButton" onClick={()=>{
                            setAddNewFormVisibility(false)
                            console.log(`cencel button was click in AddNewItemForm`)
                        }}>Cancel</button>
                    ]}
                />       
            }
        })()
                
    return (
        <div className="PageBody">
        <PageToolBar 
            Title="Customers and Suppliers"
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
            setHideSearchAndFilterSection = {setHideSearchAndFilterSection}
        />
        <Table
            TableData = {TableData} 
            TableColumns = {TableColumns}
            CustomRowFunction = {CustomRowFunction}
            // CustomComponentFunctionInSearchAndFilterSection = {CustomComponentFunctionInSearchAndFilterSection}
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
            CustomComponentFunctionInSearchAndFilterSection={()=>{return AddNewForm}}
        />
        
        {(()=>{ //PayDebt Form
            if (PayDebtId == null){
                return <></>
            }
            const CurrentDebt = GetData("People", "Id", PayDebtId, "Debt", state.data)
            return <Form
                FormTitle = {"تسديد Debt"}
                Inputs = {PayDebtFormInputs}
                setInputs = {setPayDebtFormInputs}
                FormFooter = {[<div key="PayDeptForm Footer">
                    <span>Debt left on ( {GetData("People", "Id", PayDebtId, "Name", state.data)} ) is {FormatMoney(CurrentDebt - PayDebtFormInputs.AmountPayed.value)}</span>
                    <br></br>
                    <button 
                        key="save" 
                        className="button green-button" 
                        onClick={PayDebtFormSaveButtonHandleClick}
                    >Save</button>

                    <button 
                        key="cancel" 
                        className="button red-button" 
                        onClick={()=>{setPayDebtId(null)}}
                    >Cancel</button>
                </div>]}
            />
        })()
        }
        </div>
    )
}
  