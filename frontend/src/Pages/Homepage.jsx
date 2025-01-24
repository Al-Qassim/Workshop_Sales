import { useContext, useState } from "react";
import { StateContext } from "../App";
// import axiosInstance from "../logic/axiosinstance";
import { CalculateStatisticsOfMonth, FormatMoney, GetYearMonth, NewId, Today } from "../logic/helpers";
import { Form } from "../Components/Form";
import { AddRows, GetData } from "../logic/InteractWithData";

export default function Homepage({ PagesTitles }) {

    let [state, setState] = useContext(StateContext);

    const StatisticsSoFar = CalculateStatisticsOfMonth(GetYearMonth(Today()), state.data)
    
    const [ShowCreateSpecialBillForm, setShowCreateSpecialBillForm] = useState(false)
    

    function SpacialPaymentForm(){
        const BillsTypesIds = [5, 6, 4, 7, 8, 9]
        const [Inputs, setInputs] = useState({
            BillTypeId: {
                            label: "Bill Type",  
                            value: 5, 
                            ValueType: "number", 
                            InputType: "select", 
                            options: BillsTypesIds
                            .map(Id=><option key={Id} value={Id}>{GetData("Billtypes", "Id", Id, "Type", state.data)}</option>)
                        },
            Name:       {
                            label: "Name",  
                            value: "", 
                            ValueType: "string", 
                            InputType: "search and select", 
                            options: state.data.People
                            .filter(PeopleRow=>{return !PeopleRow.InTrash})
                            .map(PeopleRow=><option key={PeopleRow.Id} value={PeopleRow.Name}></option>)
                        },
            Payed:      {label: "Peyed", value: 0, ValueType: "number", InputType: "number", MinimumValue: 0},    
            // Debt:       {label: "الدين", value: 0, ValueType: "number", InputType: "number", MinimumValue: 0},            
            Date:       {label: "Date",                  value: Today(), ValueType: "string", InputType: "date"},    
            Notes:      {label: "Notes",      value: "", ValueType: "string", InputType: "textarea"},    
            
        })
        
        if (!ShowCreateSpecialBillForm){
            return <></>
        }

        const HandleClick = () => {
            
            var ArrayOfRowsDetails = []
            const PersonExist = state.data.People
                                    .filter(PeopleRow=>{return !PeopleRow.InTrash})
                                    .some(PeopleRow => PeopleRow.Name == Inputs.Name.value)
            const PersonId = PersonExist ? GetData("People", "Name", Inputs.Name.value, "Id", state.data) : NewId("People", state.data)
            // const RevenueOrExpense = GetData("Billtypes", "Id", Inputs.BillTypeId.value, "Id", state.data)
            
           
            // 1
            if (!PersonExist){
                ArrayOfRowsDetails = [
                    ...ArrayOfRowsDetails,
                    {TableName: "People", Rows: [
                        {
                            Debt: 0,
                            Id: PersonId,
                            InTrash: 0,
                            Info: "",
                            Name: Inputs.Name.value
                        }
                    ]}
                ]                
            }
            
            // 2
            // new Bill
            const NewBillId = NewId("Bills", state.data)
            ArrayOfRowsDetails = [
                ...ArrayOfRowsDetails,
                {TableName: "Bills", Rows: [
                    {
                        BillTypeId: Inputs.BillTypeId.value,
                        Date: Inputs.Date.value,
                        Debt: 0,
                        Id: NewBillId,
                        InTrash: 0,
                        Notes: Inputs.Notes.value,
                        Payed: Inputs.Payed.value,
                        PersonId: PersonId
                    }
                ]}
            ] 
            
            console.log("Rows that will be added", ArrayOfRowsDetails)
            
            AddRows(ArrayOfRowsDetails, [state, setState])
            // UpdateValuesInData(UpdateValuesRequests, [state, setState])
            // AddRowsUpdateValuesDeleteTable(
            //     ArrayOfRowsDetails, 
            //     UpdateValuesRequests, 
            //     null, 
            //     [state, setState]
            // )

            setShowCreateSpecialBillForm(false)
        }
        
        return <Form
        FormTitle={"Create a Custom Bill Form"}
        Inputs={Inputs}
        setInputs={setInputs}
        FormFooter={[
            <button 
                key="save" 
                className="button green-button" 
                onClick={HandleClick}
            >
                Save
            </button>,
            <button key="cancel" className="button red-button" onClick={()=>{
                setShowCreateSpecialBillForm(false)
                console.log(`cencel button was click in SpacialPaymentForm`)
            }}>Cancel</button>
        ]}
        />
    }

    return (
    <div className="HomepageUI">
        <div className="HomepageIcons">
            {Object.entries(PagesTitles).map( // Pages
            ([PageKey, PageTitle]) =>
                PageKey!="Homepage" && 
            <div 
                className="HomepageIcon"
                key = {PageKey}
                onClick={() => {setState({...state, VisiblePage: PageKey})}}
            >
                <img src={`/Workshop_Sales/HomepageIcons/${PageKey}.png`}/>
                <button 
                    key={PageKey}
                >
                    {/* <img src="/Icons/home-black.png" style={{height: "50px"}}/> */}
                    {PageTitle}
                </button>
            </div>
            )}
            
            <div  // CreateSpecialBill button
                className="HomepageIcon"
                onClick={() => {setShowCreateSpecialBillForm(true)}}
                key="CreateSpecialBill"
            >
                <img src={`/HomepageIcons/CreateSpecialBill.png`}/>
                <button  
                    key="CreateSpecialBill"
                    >
                        Create a Custom Bill
                </button>
            </div>
            
            {/* <div  // SupportPage button
                className="HomepageIcon"
                onClick={() => {setShowSupportPage(true)}}
                key="Support"
            >
                <img src={`/HomepageIcons/Support.png`}/>
                <button  
                    key="CreateSpecialBill"
                    >
                        Support
                </button>
            </div> */}
            
            {/* <div // close button
                className="HomepageIcon"  
                key="Close"
                onClick={() => {
                    try {
                        axiosInstance
                        .post(
                            '/Close'
                        )
                        .then((response) => {
                            console.log('posted successfully: ', response.data);
                            window.close()
                        })
                        .catch((error) => {
                            console.error('Error posting: ', error);
                            window.close()
                        });
                    
                    } catch (error) {
                        console.log("Error while filtering for search", error)
                    }
                    
                }}
            >
                <img src={`/HomepageIcons/Close.png`}/>
                <button>
                    خروج
                </button>
            </div> */}

        </div>
        {/* <div className="Statistics">
            <h3>العوائد: {FormatMoney(StatisticsSoFar["Revenues"])}</h3>
            <h3>النفقات: {FormatMoney(StatisticsSoFar["Expenses"])}</h3>
            <h3>الارباح: {FormatMoney(StatisticsSoFar["NetProfit"])}</h3>
        </div> */}
            {SpacialPaymentForm()}
            
    </div>
    )
}
