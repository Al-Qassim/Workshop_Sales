import { useContext, useState } from "react"
import { StateContext } from "../App"
import { CalculateStatisticsOfBillsRows, CalculateStatisticsOfMonth, CategorizingDates, CompareDates, FormatMoney, GetYearMonth, NewId, Sum } from "../logic/helpers";
import { AddUpdateRowInData, GetData, UpdateValueInData } from "../logic/InteractWithData";
import Table from "../Components/Table/Table";
import PageToolBar from "../Components/PageToolBar";
import { Form, InputField } from "../Components/Form";

export default function Statistics() {

    let [state, setState] = useContext(StateContext);
    const [Interval, setInterval] = useState("Day")
    
    const [HideSearchAndFilterSection, setHideSearchAndFilterSection] = useState(true)
    
    
    // get the from and to Intervals
    // number of miliseconds in a day
    const DayInMS = 86400000
    const ReferanceDate = null
    

    const TableData = [...new Set(
            state.data.Bills
            .filter(BillRow => !BillRow.InTrash)        // don't count bills in trash
            .map(BillRow => {return BillRow.Date})      // get the date only
            .map(Date => {return CategorizingDates(Interval, Date)})   // take the year and month only
        )]
        .map(Date => {return {Period : Date}})            // make Rows Objects to the Table
    
    // calculate the statistics of each Period 
    const StatisticsOfEachPeriod  = Object.fromEntries(
            TableData.map(Row => {
            return [
                Row.Period, 
                CalculateStatisticsOfBillsRows(
                    state.data.Bills
                    .filter(BillRow => !BillRow.InTrash)
                    .filter(BillRow => CategorizingDates(Interval, BillRow.Date) == Row.Period )
                    ,
                    state.data
                )
            ]
        })
    )
    const TableColumns = {
        // Id:             {hide: true},
        Period:         {header: "Date", SortFunction: ((a, b) => {return Interval == "Week" ?   CompareDates(
                                                                                                                    b.split("Friday ")[1].split("to")[0], 
                                                                                                                    a.split("Fryday ")[1].split("to")[0]
                                                                                                                ) 
                                                                                                                : 
                                                                                                    CompareDates(b, a)})}, 
        Revenues:       {header: "Revenuse", Format: FormatMoney, Function: (row, key, value) => {
                                                return StatisticsOfEachPeriod[row.Period]["Revenues"]
                                            }},
        Expenses:       {header: "Expenses",   Format: FormatMoney, Function: (row, key, value) => {
                                                return StatisticsOfEachPeriod[row.Period]["Expenses"]
                                            }},
        NetProfit:       {header: "Profits", Format: FormatMoney, Function: (row, key, value) => {
                                                return row.Revenues - row.Expenses
                                            }},

        };
           
    return (
        <div className="PageBody">
        <PageToolBar 
            Title="Financial Statistics"
            HideSearchAndFilterSection = {HideSearchAndFilterSection}
            setHideSearchAndFilterSection = {setHideSearchAndFilterSection}
        />
        <Table
            TableData = {TableData} 
            TableColumns = {TableColumns}
            HideSearchAndFilterSection={HideSearchAndFilterSection}
            CustomComponentFunctionInSearchAndFilterSection={()=>{
                return <>
                <select
                    onChange={(e)=>{
                        // console.log("hi", e.target.value)
                        setInterval(e.target.value)
                    }}
                    className="button"
                    // style={{margin: "25px"}}
                    value={Interval}
                >
                    <option value="Day">Day</option>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                </select>
                </>
            }}
        />
        {/* {AddNewCategoryForm} */}
        </div>
    )
}
  