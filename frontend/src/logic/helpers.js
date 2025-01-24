import Statistics from "../Pages/Statistics";
import { GetData } from "./InteractWithData";

export function FormatMoney(amount) {
    const sign = amount < 0 ? -1 : 1    // save the sign
    amount = amount * sign              // delete the sign from the amount
    const parts = Math.round(amount).toString().split(''); // make array of digits
    let result = parts.reverse().reduce((acc, digit, index) => { // rejoin the array of digits, and put (,) every 3 digits
        return digit + (index && index % 3 === 0 ? ',' : '') + acc;
    }, '');
    result = (sign == -1 ? "-" : "") + result // put the sign back
    return result
}

function formatDateAsYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  
export function Today() {return formatDateAsYYYYMMDD(new Date())}

// console.log("HI", Math.max(...[1, 1, 2, 2, null]))

export function NewId(TableName, data){
    return 1 + Math.max(...data[TableName].map(Row=>Row.Id))
}

export function GetYearMonth(dateString) {
    if (!dateString || typeof dateString !== "string") {
        console.log("Error: Invalid date string");
        return "2025-01"
    }
  
    // Split the date string by the "-" separator
    const parts = dateString.split("-");
  
    // Ensure the format is correct
    if (parts.length !== 3) {
        console.log("Error: Invalid date format. Expected format: yyyy-mm-dd");
        return "2025-01"
    }
  
    // Return the year and month
    return `${parts[0]}-${parts[1]}`;
}

export function CompareDates(date1, date2) {
    if (!date1 || !date2 || typeof date1 !== "string" || typeof date2 !== "string") {
        console.log("Error: Invalid date strings");
        return 0
    }
  
    // Convert date strings to Date objects
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    // Ensure valid Date objects
    if (isNaN(d1) || isNaN(d2)) {
        console.log("Error: Invalid date format. Expected format: yyyy-mm-dd");
        return 0
    }
  
    // Compare dates
    if (d1.getTime() === d2.getTime()) {
        return 0;
    } else if (d1.getTime() > d2.getTime()) {
        return 1;
    } else {
        return -1;
    }
}

export function Sum(Array){
    return Array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

export function CalculateStatisticsOfMonth(Month, data){
    let result = {
        Revenues: 0,
        Expenses: 0,
        NetProfit: 0
    }
    
    const PayedsAndSign = data.Bills
        .filter(BillRow => !BillRow.InTrash)        // don't count bills in trash
        .filter(BillRow => {return CompareDates(    // get only the bills in this month
                Month, 
                GetYearMonth(BillRow.Date)
            ) == 0
        })
        .map(BillRow => {return [                   // get payment and is Bill a revenue
            BillRow.Payed, 
            GetData("Billtypes", "Id", BillRow.BillTypeId, "RevenueOrExpense", data)
        ]})    
        
        result["Revenues"] = Sum(
            PayedsAndSign
                .filter(([Payed, RevenueOrExpense]) => RevenueOrExpense == 1)
                .map(([Payed, RevenueOrExpense]) => Payed)
        )
        result["Expenses"] = Sum(
            PayedsAndSign
                .filter(([Payed, RevenueOrExpense]) => RevenueOrExpense == -1)
                .map(([Payed, RevenueOrExpense]) => Payed)
        )
        result["NetProfit"] = result["Revenues"] - result["Expenses"]
        
        return result
    
}

export function MultiLineStringToOneLine(s){
    let a = s.split("\n")
    const A = a[a.length-1]
    a.pop()
    const result = a.reverse().reduce((acc, part) => { // rejoin the array of digits, and put (,) every 3 digits
        return part + "|linebrack|" + acc  
    }, A)
    return result
}
export function SingleLineStringToMultiLine(s){
    let a = s.split("|linebrack|")
    const A = a[a.length-1]
    a.pop()
    const result = a.reverse().reduce((acc, part) => { // rejoin the array of digits, and put (,) every 3 digits
        return part + "\n" + acc  
    }, A)
    return result
}

export function CalculateStatisticsOfBillsRows(BillsRows, data){
    let result = {
        Revenues: 0,
        Expenses: 0,
        NetProfit: 0
    }

    var data = data
    
    const PayedsAndSign = BillsRows
        .map(BillRow => {return [                   // get payment and is Bill a revenue
            BillRow.Payed, 
            GetData("Billtypes", "Id", BillRow.BillTypeId, "RevenueOrExpense", data)
        ]})    
        
        result["Revenues"] = Sum(
            PayedsAndSign
                .filter(([Payed, RevenueOrExpense]) => RevenueOrExpense == 1)
                .map(([Payed, RevenueOrExpense]) => Payed)
        )
        result["Expenses"] = Sum(
            PayedsAndSign
                .filter(([Payed, RevenueOrExpense]) => RevenueOrExpense == -1)
                .map(([Payed, RevenueOrExpense]) => Payed)
        )
        result["NetProfit"] = result["Revenues"] - result["Expenses"]
        
        return result
}

export function CategorizingDates(Interval, Date){
    
    if (Interval == "Day"){
        return Date
    }
    if (Interval == "Month"){
        return GetYearMonth(Date)
    }
    
    if (Interval == "Week"){
        return getWeekRange(Date)
    }
    
}

function getWeekRange(dateStr) {
    // Parse the input date
    const inputDate = new Date(dateStr);
    if (isNaN(inputDate)) {
        throw new Error("Invalid date format. Please use yyyy-mm-dd.");
    }

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = inputDate.getDay();

    // Calculate the difference to the previous Friday
    const diffToFriday = (dayOfWeek + 2) % 7;

    // Calculate the start (Friday) and end (Thursday) of the week
    const startOfWeek = new Date(inputDate);
    startOfWeek.setDate(inputDate.getDate() - diffToFriday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format the dates as yyyy-mm-dd
    const formatDate = (date) =>
        date.toISOString().split("T")[0];

    return `From Friday ${formatDate(startOfWeek)} to Thursday ${formatDate(endOfWeek)}`;
}
