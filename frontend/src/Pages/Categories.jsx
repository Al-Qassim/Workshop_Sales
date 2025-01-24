import { useContext, useState } from "react"
import { StateContext } from "../App"
import { NewId } from "../logic/helpers";
import { AddUpdateRowInData, UpdateValueInData } from "../logic/InteractWithData";
import Table from "../Components/Table/Table";
import PageToolBar from "../Components/PageToolBar";
import { Form, InputField } from "../Components/Form";

export default function Categories() {

    let [state, setState] = useContext(StateContext);
    const [HideSearchAndFilterSection, setHideSearchAndFilterSection] = useState(true)
    
    const TableData = state.data.Categories.filter(Row=>{return !Row.InTrash})
    const TableColumns = {
        Id:             {hide: true},
        Category:       {header: "Category", SortFunction: ((a, b) => {return a.localeCompare(b)})},              
        Buttons:        {HideWhenMouseNotOnRow: true, Function: (row, key, value, TableState, setTableState) => {
                            return  <div className="buttons-container-in-rows"> 
                                        <img // edit-button
                                            src="/Workshop_Sales/Icons/pencil-black.png"
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
                                            src="/Workshop_Sales/Icons/trash-black.png"
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
        InTrash:        {hide: true}
        };
    
    const CustomRowFunction = (row, index, TableState, setTableState) => {
        
        if (row.Id==TableState.IdWithVisibleEditForm){
            var [Inputs, setInputs] = useState({
                Category: {label: "Category",      value: row.Category, ValueType: "string", InputType: "string"},
                })
        }

        
        return <>
        
        {/* // Edit Form */}
        {row.Id==TableState.IdWithVisibleEditForm &&
                <Form
                    FormTitle={"Edit Category Info"}
                    Inputs={Inputs}
                    setInputs={setInputs}
                    FormFooter={[
                        <button key="save" className="button EditSaveButton" onClick={()=>{
                            const NewCategoriesRow = {
                                ...state.data.Categories.filter(Row=>{return !Row.InTrash}).filter(Row => Row.Id == row.Id)[0],
                                ...Object.fromEntries(
                                    Object.entries(Inputs)
                                    //.filter(([k, v]) => k != "PersonName")
                                    .map(([k, v]) => [k, v.value])
                                )
                            }
                            // NewCategoriesRow.PersonId = GetData("Categories", "Name", Inputs.PersonName, "Id", state.data)
                            AddUpdateRowInData(NewCategoriesRow, "Categories", "Id", state, setState)
                            
                            console.log(`save button was click in edit form on index`)
                            console.log(`data that have been saved`, NewCategoriesRow)
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
                FormTitle={""}
                Inputs={{}}
                setInputs={()=>{}}
                FormFooter={[
                    <button key="delete button" className="button DeleteConformationButton" onClick={()=>{
                        
                        // let NewBillsRow = GetRows(state.data, "Bills", "Id", row.Id)[0]
                        // NewBillsRow.InTrash = 1
                        // AddUpdateRowInData(NewBillsRow, "Bills", "Id", state, setState)
                        UpdateValueInData("Categories", "Id", row.Id, "InTrash", 1, state, setState)
                        // UpdateValueInData("Transactions", "BillId", row.Id, "InTrash", 1, state, setState)

                        console.log(`delete confermation button was click in delete form on index`)
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
                        console.log(`cencel button was click in edit form on index`)
                    }}>Cancel</button>
                ]}
            />      
        }
        </>

    }

    const AddNewCategoryForm = (() => {
        let [state, setState] = useContext(StateContext);
            
        const [AddNewItemFormVisibility, setAddNewItemFormVisibility] = useState(false)
        const [Inputs, setInputs] = useState({
                Category:               {label: "Category",       value: "", ValueType: "string", InputType: "string"},
            })
                
                // AddNewItemForm
                if (!AddNewItemFormVisibility) { 
                    return <button 
                        style={{margin: "20px"}}
                        className="button green-button"
                        onClick={()=>{
                            setAddNewItemFormVisibility(true)
                        }}
                    >Add New Category</button>
                } else {
                
                    return <Form
                    FormTitle={"Add New Category Form"}
                    Inputs={Inputs}
                    setInputs={setInputs}
                    FormFooter={[
                        <button 
                            key="save AddNewItemForm" 
                            className="button EditSaveButton" 
                            onClick={() => {
                                console.log(Inputs)
                                const NewCategoriesRow = {
                                    Id: NewId("Categories", state.data),
                                    InTrash: 0,
                                    Category: Inputs.Category.value
                                }
                                AddUpdateRowInData(NewCategoriesRow, "Categories", "Id", state, setState)
                                setAddNewItemFormVisibility(false)
                            }}
                        >
                            Save
                        </button>,

                        <button key="cancel AddNewItemForm" className="button CancelButton" onClick={()=>{
                            setAddNewItemFormVisibility(false)
                            console.log(`cencel button was click in AddNewItemForm`)
                        }}>Cancel</button>
                    ]}
                />      
                }
        })()
                
    return (
        <div className="PageBody">
        <PageToolBar 
            Title="Categories"
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
            setHideSearchAndFilterSection = {setHideSearchAndFilterSection}
            />
        <Table
            TableData = {TableData} 
            TableColumns = {TableColumns}
            CustomRowFunction = {CustomRowFunction}
            // CustomComponentFunctionInSearchAndFilterSection = {CustomComponentFunctionInSearchAndFilterSection}
            // HideSearchAndFilterSection = {false}
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
        />
        {AddNewCategoryForm}
        </div>
    )
}
  