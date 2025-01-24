import { useContext, useState } from "react"
import Table from "../Components/Table/Table";
import { FormatMoney, NewId, Today } from "../logic/helpers";
import { QuantityInCart } from "../Components/QuantityInCart";
import { AddRowsUpdateValuesDeleteTable, AddUpdateRowInData, DeleteRowInData, GetData, GetRows } from "../logic/InteractWithData";
import { StateContext } from "../App";
import PageToolBar from "../Components/PageToolBar";
import { Form } from "../Components/Form";

export default function Inventory() {
    
    let [state, setState] = useContext(StateContext);

    const [HideSearchAndFilterSection, setHideSearchAndFilterSection] = useState(true)

    const TableDate = state.data.Items.filter(ItemRow=>!ItemRow.InTrash)
    
    const InventoryColumns = {
        Id:                         {hide:true},
        Name:                       {header: "Item Name", SortFunction: ((a, b) => {return a.localeCompare(b)})},
        Quantity:                   {header: "Quantity", Function: (row, key, value) => {return row.CategoryId==2 ? 1 : row.Quantity}},
        CategoryId:                 {hide: true},
        Category:                   {header: "Category", Function: (row, key, value) => {return GetData("Categories", "Id", row.CategoryId, "Category", state.data)}, filter: true},
        AssumedSellingPrice:        {header: "Assumed Selling Price", Format: FormatMoney},
        MinimumSellingPrice:        {header: "Minimum Selling Price", Format: FormatMoney},
        Notes:                      {header: "Notes"},
        InTrash:                    {hide: true},
        // AddToCartButton:            {Function: (row, key, value) => {return }},
        Buttons:                    {HideWhenMouseNotOnRow: true, DontExport: true, Function: (row, key, value, TableState, setTableState) => {

                                                                            return  <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}> 
                                                                                        <QuantityInCart InventoryRow={row}/>
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
                                                                                                console.log(`edit button was click on item ${row.Name}`)
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
                                                                                                console.log(`edit button was click on item ${row.Name}`)
                                                                                            }}
                                                                                        />

                                                                                    </div>
                                                                        }},
    };

    function CustomRowFunction(row, index, TableState, setTableState) {

        // Edit Form
        if (row.Id==TableState.IdWithVisibleEditForm){
            var [Inputs, setInputs] = useState({
                Name:                   {label: "Item Name",       value: row.Name,                ValueType: "string", InputType: "string"},
                Quantity:               {label: "Quantity", value: row.Quantity,            ValueType: "number", InputType: "number"},
                CategoryId:             {label: "Category",            value: row.CategoryId,          ValueType: "number", InputType: "select", options: state.data.Categories.filter(Row=>{return !Row.InTrash}).map(CategoryRow=>{return <option key={CategoryRow.Category} value={CategoryRow.Id}>{CategoryRow.Category}</option>})},    
                AssumedSellingPrice:    {label: "Assumed Selling Price",        value: row.AssumedSellingPrice, ValueType: "number", InputType: "number"},
                MinimumSellingPrice:    {label: "Minimum Selling Price",   value: row.MinimumSellingPrice, ValueType: "number", InputType: "number"},
                Notes:                  {label: "Notes",          value: row.Notes,                 ValueType: "string", InputType: "textarea"},
            })
    
            return <Form
            FormTitle = {"Edit Item Info"}
            Inputs = {Inputs}
            setInputs = {setInputs}
            FormFooter = {[
                <button 
                    key="save" 
                    className="button EditSaveButton" 
                    onClick={()=>{
                        const NewItemRow = {   
                            AssumedSellingPrice:    Inputs.AssumedSellingPrice.value,
                            CategoryId:             Inputs.CategoryId.value,
                            Id:                     row.Id,
                            InTrash:                row.value,
                            MinimumSellingPrice:    Inputs.MinimumSellingPrice.value,
                            Name:                   Inputs.Name.value,
                            Notes:                  Inputs.Notes.value,
                            Quantity:               Inputs.Quantity.value,
                        }
                        

                        AddUpdateRowInData(NewItemRow, "Items", "Id", state, setState)
                        
                        console.log(`save button was click in edit form on index`)
                        console.log(`data that have been saved`, NewItemRow)
                        setTableState({
                            ...TableState,
                            IdWithVisibleEditForm: null
                        })

                    }}
                >
                    Save Changes
                </button>,

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
        // Delete Confermation Form
        if (row.Id==TableState.IdWithVisibleDeleteConfermationForm){
            
            return (
                <Form
                    FormTitle={""}
                    Inputs={{}}
                    setInputs={()=>{}}
                    FormFooter={[
                        <button key="delete button" className="button DeleteConformationButton" onClick={()=>{
                        
                            let NewItemRow = GetRows(state.data, "Items", "Id", row.Id)[0]
                            NewItemRow.InTrash = 1
                            AddUpdateRowInData(NewItemRow, "Items", "Id", state, setState)
                            
                            console.log(`delete confermation button was click in delete form on index`)
                            console.log(`Item Id that will be deleted is: `, row.Id)
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
            )
        }

    }

    const [AddNewItemFormVisibility, setAddNewItemFormVisibility] = useState(false)
    
    const [Inputs, setInputs] = useState({
            Name:                   {
                                    label: "Item Name",  
                                    value: "", 
                                    ValueType: "string", 
                                    InputType: "search and select", 
                                    options: state.data.Items
                                                .filter(ItemsRow=>{return !ItemsRow.InTrash})
                                                .map(ItemsRow=><option key={ItemsRow.Id} value={ItemsRow.Name}></option>),
                                    DisableAndSetValueForOtherInput: {
                                        CategoryId: (Name)=> {return GetData("Items", "Name", Name, "CategoryId", state.data)},
                                        AssumedSellingPrice: (Name)=> {return GetData("Items", "Name", Name, "AssumedSellingPrice", state.data)},
                                        MinimumSellingPrice: (Name)=> {return GetData("Items", "Name", Name, "MinimumSellingPrice", state.data)},
                                        Notes: (Name)=> {return GetData("Items", "Name", Name, "Notes", state.data)},
                                    }                
                                    },
            Quantity:               {label: "Quantity",           value: 1, ValueType: "number", InputType: "number", MinimumValue: 1},    
            CategoryId:             {label: "Category",            value: 0, ValueType: "number", InputType: "select", options: state.data.Categories.filter(Row=>{return !Row.InTrash}).map(CategoryRow=>{return <option key={CategoryRow.Category} value={CategoryRow.Id}>{CategoryRow.Category}</option>})},    
            AssumedSellingPrice:    {label: "Assumed Selling Price",        value: 0, ValueType: "number", InputType: "number", MinimumValue: 0},    
            MinimumSellingPrice:    {label: "Minimum Selling Price",   value: 0, ValueType: "number", InputType: "number", MinimumValue: 0},    
            Notes:                  {label: "Item Notes",   value: "", ValueType: "string", InputType: "textarea"},    
            SupplierName:           {
                                    label: "Supplier Name",  
                                    value: "", 
                                    ValueType: "string", 
                                    InputType: "search and select", 
                                    options: state.data.People
                                                .filter(PeopleRow=>{return !PeopleRow.InTrash})
                                                .map(PeopleRow=><option key={PeopleRow.Id} value={PeopleRow.Name}></option>),
                                    DisableAndSetValueForOtherInput: {
                                        Info: (SupplierName)=> {return GetData("People", "Name", SupplierName, "Info", state.data)}
                                    }                
                                    },    
            Info:                   {label: "Supplier Info",     value: "",          ValueType: "string", InputType: "textarea"},
            PricePerUnit:           {label: "Buying Price Per Unit",     value: 0, ValueType: "number", InputType: "number", MinimumValue: 0},    
            Debt:                   {label: "Debt", value: 0, ValueType: "number", InputType: "number", MinimumValue: 0},    
            BillNotes:               {label: "Bill Notes",   value: "", ValueType: "string", InputType: "textarea"},    
            Date:                   {label: "Date",          value: Today(), ValueType: "string", InputType: "date"},    
        })

    function CustomComponentFunctionInSearchAndFilterSection() {
        
        function SaveButtonAddNewItemForm() {
            console.log("Save Button has been clicked")

            // 1. if new customer, add him to people sheet
            // 2. record the transactions and add a new bill
            // 3. add or create the quantities in the inventory
            // if (Inputs.SupplierName.value == ""){
            //     Inputs.SupplierName.value = `زبون رقم ${NewId("People", state.data)}`
            // }
            
            var ArrayOfRowsDetails = []
            var UpdateValuesRequests = []
            const PersonExist = state.data.People.filter(Row=>{return !Row.InTrash}).some(PeopleRow => PeopleRow.Name == Inputs.SupplierName.value)
            const PersonId = PersonExist? GetData("People", "Name", Inputs.SupplierName.value, "Id", state.data) : NewId("People", state.data)
            const sign = 1 // Inputs.BillTypeId.value == 0 ? 1 : -1
            const ItemExist = GetData("Items", "Name", Inputs.Name.value, "Id", state.data)
            const ItemId = ItemExist ? GetData("Items", "Name", Inputs.Name.value, "Id", state.data) : NewId("Items", state.data)
            const isService = Inputs.CategoryId.value == 2
            
            if (!isService){
                // 1
                if (!PersonExist){
                    ArrayOfRowsDetails = [
                        ...ArrayOfRowsDetails,
                        {TableName: "People", Rows: [
                            {
                                Debt: - sign * Inputs.Debt.value,
                                Id: PersonId,
                                InTrash: 0,
                                Info: Inputs.Info.value,
                                Name: Inputs.SupplierName.value
                            }
                        ]}
                    ]                
                }
                else {
                    UpdateValuesRequests = [
                        ...UpdateValuesRequests,
                        ["People", "Id", PersonId, "Debt", - sign * Inputs.Debt.value + GetData("People", "Id", PersonId, "Debt", state.data)]
                    ]
                }
                
                // 2
                // new Bill
                const NewBillId = NewId("Bills", state.data)
                ArrayOfRowsDetails = [
                    ...ArrayOfRowsDetails,
                    {TableName: "Bills", Rows: [
                        {
                            BillTypeId: 0, // Inputs.BillTypeId.value
                            Date: Inputs.Date.value,
                            Debt: Inputs.Debt.value,
                            Id: NewBillId,
                            InTrash: 0,
                            Notes: Inputs.BillNotes.value,
                            Payed: Inputs.Quantity.value * Inputs.PricePerUnit.value,
                            PersonId: PersonId
                        }
                    ]}
                ] 
                // new Transactions
                const NewTransactionId = NewId("Transactions", state.data)
                ArrayOfRowsDetails = [
                    ...ArrayOfRowsDetails,
                    {
                        TableName: "Transactions", 
                        Rows: [
                            {
                                BillId: NewBillId,
                                Id: NewTransactionId,
                                InTrash: 0,
                                ItemId: ItemId,
                                PricePerUnit: Inputs.PricePerUnit.value,
                                Quantity: Inputs.Quantity.value
                            }
                        ]
                    }
                ] 

            }

            // 3
            if (ItemExist){
                const QuantityInInventory = GetData("Items", "Id", ItemId, "Quantity", state.data)
                UpdateValuesRequests = [
                    ...UpdateValuesRequests,
                    ["Items", "Id", ItemId, "Quantity", QuantityInInventory + sign * Inputs.Quantity.value]
                ]
            } else {
                ArrayOfRowsDetails = [
                    ...ArrayOfRowsDetails,
                    {
                        TableName: "Items", 
                        Rows: [
                            {
                                AssumedSellingPrice: Inputs.AssumedSellingPrice.value,
                                CategoryId: Inputs.CategoryId.value,
                                Id: ItemId,
                                InTrash: 0,
                                MinimumSellingPrice: Inputs.MinimumSellingPrice.value,
                                Name: Inputs.Name.value,
                                Notes: Inputs.Notes.value,
                                Quantity: Inputs.Quantity.value                            
                            }
                        ]
                    }
                ] 
            }
            
                

            console.log("Rows that will be added", ArrayOfRowsDetails)
            console.log("Items that will be modefied", UpdateValuesRequests)
            
            // AddRows(ArrayOfRowsDetails, [state, setState])
            // UpdateValuesInData(UpdateValuesRequests, [state, setState])
            console.log("print some perametars")
            console.log("PersonExist", PersonExist) 
            console.log("PersonId", PersonId)
            console.log("sign ", sign )
            console.log("ItemExist ", ItemExist )
            console.log("ItemId", ItemId)
            console.log("isService ", isService )
            console.log("data that will be saved: ", ArrayOfRowsDetails, UpdateValuesRequests)
            AddRowsUpdateValuesDeleteTable( 
                ArrayOfRowsDetails, 
                UpdateValuesRequests, 
                null, 
                [state, setState]
            )

            setAddNewItemFormVisibility(false)
            // setState({...state, VisiblePage: "Bills"})
        }

        if (!AddNewItemFormVisibility) { 
            return <><button 
                className="button green-button"
                style={{margin: "25px"}}
                onClick={()=>{
                    setAddNewItemFormVisibility(true)
                }}
            >Add New Item Form</button>
            </>

        }
        return <Form 
                FormTitle = {"Add New Item Form"}
                Inputs = {Inputs}
                setInputs = {setInputs}
                FormFooter = {
                [
                    <button 
                        key="save AddNewItemForm" 
                        className="button EditSaveButton" 
                        onClick={() => {SaveButtonAddNewItemForm(
                            [state, setState],
                            [AddNewItemFormVisibility, setAddNewItemFormVisibility],
                            [Inputs, setInputs]
                        )}}
                    >
                        Save
                    </button>,
                    <button key="cancel AddNewItemForm" className="button CancelButton" onClick={()=>{
                        setAddNewItemFormVisibility(false)
                        console.log(`cencel button was click in AddNewItemForm`)
                    }}>Cancel</button>
                    ]
                }
            />
        }

    return (
        <div className="PageBody">
            <PageToolBar 
                Title="Inventory"
                HideSearchAndFilterSection = {HideSearchAndFilterSection}
                setHideSearchAndFilterSection = {setHideSearchAndFilterSection}
            />
            <Table 
                TableData = {TableDate} 
                TableColumns = {InventoryColumns}
                CustomRowFunction = {CustomRowFunction}
                CustomComponentFunctionInSearchAndFilterSection = {CustomComponentFunctionInSearchAndFilterSection}
                HideSearchAndFilterSection={HideSearchAndFilterSection}
            />
        </div>
    )
}
