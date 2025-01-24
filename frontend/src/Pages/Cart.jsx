import { useContext, useState } from "react"
import { setBillIdToBePrintedContext, StateContext } from "../App"
import PageToolBar from "../Components/PageToolBar";
import Table from "../Components/Table/Table";
import { FormatMoney, NewId, Today } from "../logic/helpers";
import { AddRowsUpdateValuesDeleteTable, DeleteRowInData, GetData, UpdateValueInData } from "../logic/InteractWithData";
import { Form } from "../Components/Form";

export default function Cart() {
    
    let [state, setState] = useContext(StateContext);
    const setBillIdToBePrinted = useContext(setBillIdToBePrintedContext);
    
    const TableData = state.data.Cart
    

    const CartColumns = {
        ItemId:                 {hide: true},
        ItemName:               {header: "Item Name", Function: (row, key, value) => {return GetData("Items", "Id", row.ItemId, "Name", state.data)}},
        PricePerUnit:           {
                                    header: "Price Per Unit",
                                    Function: (row, key, value) => {
                                        if (typeof value == "object") {
                                            return value
                                        } 
                                        return <input 
                                        className="EditableInputField"
                                        type="number"
                                        value={value} 
                                        onChange={(e) => {
                                            CartInputHandleChange(
                                                e, row, key, 
                                                [0, null], 
                                                [state, setState]
                                            )
                                        }}/>
                                    }
                                },
        Quantity:               {
                                    header: "Quantity to be Sold",
                                    Function: (row, key, value) => {
                                        if (typeof value == "object") {
                                            return value
                                        } 
                                        return <input 
                                        className="EditableInputField"
                                        type="number"
                                        value={value} 
                                        onChange={(e) => {
                                            CartInputHandleChange(
                                                e, row, key, 
                                                [1, GetData("Items", "Id", row.ItemId, "Quantity", state.data)], 
                                                [state, setState]
                                            )
                                        }}/>
                                    }
                                },
        ItemTotalPrice:         {
                                    header: "Total", 
                                    Function: (row, key, value) => {return row.Quantity.props.value * row.PricePerUnit.props.value},
                                    Format: FormatMoney
                                },
        Notes:                   {
                                    header: "Notes (doesn't appear in bill)",  
                                    Function: (row, key, value) => {
                                        return <div className="CartItemsNotes">
                                            <p>Assumed Selling Price Per Unit: {FormatMoney(GetData("Items", "Id", row.ItemId, "AssumedSellingPrice", state.data))}</p>
                                            <p>Minimum Selling Price Per Unit: {FormatMoney(GetData("Items", "Id", row.ItemId, "MinimumSellingPrice", state.data))}</p>
                                        </div>
                                    }
                                },
        DeleteButton:                   {
                                    header: "",  
                                    Function: (row, key, value) => {
                                        return (
                                            <img // delete-button
                                            src="/Workshop_Sales/Icons/trash-black.png"
                                            key={`Delete-button`}
                                            className="IconButton IconButtonDelete"
                                            onClick={()=>{
                                                console.log(`Item in Cart will be deleted`)
                                                DeleteRowInData("Cart", "ItemId", row.ItemId, state, setState)
                                            }}
                                        />
                                        )
                                    }
                                },
    }

    function CartInputHandleChange(e, row, key, [lower, upper], [state, setState]) {

        let QuantityFromCart = Number(e.target.value)

        if (QuantityFromCart > upper && upper != null){
            QuantityFromCart = upper
        }
        if (QuantityFromCart < lower  && lower != null) {
            QuantityFromCart = lower
        }
    
        console.log(`Cart quantity has changed to ${QuantityFromCart}`)
        UpdateValueInData("Cart", "ItemId", row.ItemId, key, QuantityFromCart, state, setState)
        setInputs({
            ...Inputs,
            Payed: {label: "المبلغ الواصل",     value: TotalCost(),   ValueType: "number", InputType: "number", MinimumValue: 0, MaximumValue: TotalCost()},
        })
    }

    var TotalCost = () => {return state.data.Cart
                        .map(Row=> Row.Quantity * Row.PricePerUnit)
                        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                    }

    var [Inputs, setInputs] = useState({
                CustomarName: {
                                label: "Customer/Supplier Name",  
                                value: "", 
                                ValueType: "string", 
                                InputType: "search and select", 
                                options: state.data.People
                                            .filter(PeopleRow=>{return !PeopleRow.InTrash})
                                            .map(PeopleRow=><option key={PeopleRow.Id} value={PeopleRow.Name}></option>),
                                DisableAndSetValueForOtherInput: {
                                    Info: (CustomarName)=> {return GetData("People", "Name", CustomarName, "Info", state.data)}
                                }                
                                },
                Info: {label: "Supplier Info",     value: "",          ValueType: "string", InputType: "textarea"},
                //BillTypeId: {label: "Bill Type",     value: 1,          ValueType: "number", InputType: "select", options: [<option key="sell" value={1}>بيع</option>, <option key="Buy" value={0}>شراء</option>]},
                Date: {label: "Date",            value: Today(),     ValueType: "string", InputType: "date"},
                Payed: {label: "Payed",     value: TotalCost(),   ValueType: "number", InputType: "number", MinimumValue: 0, MaximumValue: TotalCost()},
                Debt: {label: "Debt",              value: 0,           ValueType: "number", InputType: "number"},
                Notes: {label: "Notes",     value: "",          ValueType: "string", InputType: "textarea"},
            })
        
    function FinishSellForm() {
       
        const EmptyCart = () => {
            console.log("Cart is Empty now")
            AddRowsUpdateValuesDeleteTable(
                [], 
                [], 
                "Cart", 
                [state, setState]
            )
        }
        
        const FinishSellButtonOnClickHandle = () => {
            console.log("Finish Sell Button has been clicked")

            // 1. if new customer, add him to people sheet
            // 2. record the transactions and add a new bill
            // 3. add or subtract the quantities from the inventory
            // if (Inputs.CustomarName.value == ""){
            //     Inputs.CustomarName.value = `زبون رقم ${NewId("People", state.data)}`
            // }
            
            var ArrayOfRowsDetails = []
            var UpdateValuesRequests = []
            // 1
            const PersonExist = state.data.People.filter(Row=>{return !Row.InTrash}).some(PeopleRow => PeopleRow.Name == Inputs.CustomarName.value)
            const PersonId = PersonExist? GetData("People", "Name", Inputs.CustomarName.value, "Id", state.data) : NewId("People", state.data)
            const sign = 1 // Inputs.BillTypeId.value == 1 ? 1 : -1

            if (!PersonExist){
                ArrayOfRowsDetails = [
                    ...ArrayOfRowsDetails,
                    {TableName: "People", Rows: [
                        {
                            Debt: sign * Inputs.Debt.value,
                            Id: PersonId,
                            InTrash: 0,
                            Info: Inputs.Info.value,
                            Name: Inputs.CustomarName.value
                        }
                    ]}
                ]                
            }
            else {
                UpdateValuesRequests = [
                    ...UpdateValuesRequests,
                    ["People", "Id", PersonId, "Debt", sign * Inputs.Debt.value + GetData("People", "Id", PersonId, "Debt", state.data)]
                ]
            }
            
            // 2
            // new Bill
            const NewBillId = NewId("Bills", state.data)
            ArrayOfRowsDetails = [
                ...ArrayOfRowsDetails,
                {TableName: "Bills", Rows: [
                    {
                        BillTypeId: 1,
                        Date: Inputs.Date.value,
                        Debt: Inputs.Debt.value,
                        Id: NewBillId,
                        InTrash: 0,
                        Notes: Inputs.Notes.value,
                        Payed: Inputs.Payed.value,
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
                    Rows: state.data.Cart.map((CartRow, index) => {
                        return {
                            BillId: NewBillId,
                            Id: NewTransactionId + index,
                            InTrash: 0,
                            ItemId: CartRow.ItemId,
                            PricePerUnit: CartRow.PricePerUnit,
                            Quantity: CartRow.Quantity
                        }
                    })
                }
            ] 

            // 3
            
            UpdateValuesRequests = [
                ...UpdateValuesRequests,
                ...state.data.Cart
                .map(CartRow => {
                    return [CartRow.ItemId, CartRow.Quantity, GetData("Items", "Id", CartRow.ItemId, "Quantity", state.data)]
                })
                .map(([ItemId, QuantityFromCart, QuantityInInventory]) => {
                    return ["Items", "Id", ItemId, "Quantity", QuantityInInventory - sign * QuantityFromCart]
                })
            ]
                

            console.log("Rows that will be added", ArrayOfRowsDetails)
            console.log("Items that will be modefied", UpdateValuesRequests)
            
            // AddRows(ArrayOfRowsDetails, [state, setState])
            // UpdateValuesInData(UpdateValuesRequests, [state, setState])
            AddRowsUpdateValuesDeleteTable(
                ArrayOfRowsDetails, 
                UpdateValuesRequests, 
                "Cart", 
                [state, setState]
            )
            // setBillIdToBePrinted(NewBillId)

            // Empty the Cart
            // EmptyCart()
            // go to Bills sheet
            // setState({...state, VisiblePage: "Bills"})
            // Make a Bill

            setShowFinishSellForm(false)
            
        }

        const [ShowFinishSellForm, setShowFinishSellForm] = useState(false)

        return <div className="FinishSellForm">
            <h2 style={{marginLeft: "20px"}}>{/* Total */}
                Total Cost:&nbsp; 
                {FormatMoney(TotalCost())}
            </h2>
            
            <button style={{marginLeft: "20px"}} key="FinishSellButton" className="button green-button" onClick={()=>{setShowFinishSellForm(true)}}>Finish Selling</button>
            <button style={{marginLeft: "20px"}} key="CartEmptyButton" className="button red-button" onClick={EmptyCart}>Empty Cart</button>
            {ShowFinishSellForm && <>
            <Form      
                FormTitle={"Finish Selling Form"}
                Inputs={Inputs}
                setInputs={setInputs}
                FormFooter={[
                    <button key="Cancel" className="button red-button" onClick={()=>{setShowFinishSellForm(false)}}>Cancel</button>,
                    //<button className="button">انشاء الوصل</button>,
                    <button 
                        key="FinishSellButton" 
                        className="button green-button" 
                        onClick={FinishSellButtonOnClickHandle}
                    >Finish Selling</button>,
                    ]}
            />
            </>
            }
        </div>
    }
    
    return (
        <div className="PageBody">
            <PageToolBar Title="Cart"/>
            {/* {} */}
            <Table 
                TableData = {TableData} 
                TableColumns = {CartColumns}
                HideSearchAndFilterSection = {false}
                CustomComponentFunctionInSearchAndFilterSection={FinishSellForm}
            />
        </div>
    )
}