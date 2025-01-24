import { StateContext } from "../App";
import { useContext, useState } from "react"
import { GetData, GetRows } from "../logic/InteractWithData";
import { FormatMoney } from "../logic/helpers";

export function MultiLineStringToHtml(s){
    return s.split("\n").map((part, index) => <div key={index}>{part}<br/></div>)
}

export function BillToBePrintedUI({ BillId }) {
    
    if (BillId == null){
        console.log("Can't print bill because Bill Id is null")
        return <></>
        // BillId = 0
    }

    let [state, setState] = useContext(StateContext);
    
    
    const BillRow = GetRows(state.data, "Bills", "Id", BillId)[0]
    let TransactionsRows = GetRows(state.data, "Transactions", "BillId", BillId)

    // for (let index = 0; index < 2; index++) {
    //     TransactionsRows = [
    //         ...TransactionsRows,
    //         ...TransactionsRows
    //     ];
    // }
    
    const TotalPrice = TransactionsRows
        .map(Row=> Row.Quantity * Row.PricePerUnit)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    const Discount = TotalPrice - BillRow.Payed - BillRow.Debt

    let PersonName = GetData("People", "Id", BillRow.PersonId, "Name", state.data)
    if (PersonName != null){
        PersonName = PersonName.trim()
    }
    return (<>
        <div className="BillToBePrintedUI">
            {/* <img className="TitleImage" src="\bussiness\Title.png"/> */}
            {TransactionsRows.length != 0 && <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price Per Unit</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {TransactionsRows.map((TransactionRow, index) => (
                    <tr key={index}>
                        <td>{GetData("Items", "Id", TransactionRow.ItemId, "Name", state.data)}</td>
                        <td>{TransactionRow.Quantity}</td>
                        <td>{FormatMoney(TransactionRow.PricePerUnit)}</td>
                        <td>{FormatMoney(TransactionRow.PricePerUnit*TransactionRow.Quantity)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>}
            <div className="BillNotes">

            </div>
            <div className="LogoAndBillInfo">
                <div className="BillInfo">
                    <div className="BillInfo-Labels">
                        <b>Bill Type: </b>
                        {TotalPrice > 0 && <b>Total: </b>}
                        {Discount > 0 && <b>Discount: </b>}
                        <b>Payed: </b>
                        {BillRow.Debt > 0 && <b>Debt: </b>}
                        <b>Name: </b>
                        <b>Date: </b>
                        <b>Bill Id: </b>
                        <b>Notes: </b>
                    </div>
                    <div className="BillInfo-Data">
                        <span>{GetData("Billtypes", "Id", BillRow.BillTypeId, "Type", state.data)}</span>
                        {TotalPrice > 0 && <span>{FormatMoney(TotalPrice)}</span>}
                        {Discount > 0 && <span>{FormatMoney(Discount)}</span>}
                        <span>{FormatMoney(BillRow.Payed)}</span>
                        {BillRow.Debt > 0 && <span>{FormatMoney(BillRow.Debt)}</span>}
                        <span>{PersonName != "" ? PersonName : <>&nbsp;</>}</span>
                        <span>{BillRow.Date}</span>
                        <span>{BillRow.Id}</span>
                        <span>{BillRow.Notes == "" ? <>&nbsp;</> : MultiLineStringToHtml(BillRow.Notes)}</span>
                    </div>
                </div>
                {/* <div className="LogoImageContainer">
                    <img className="LogoImage" src="\bussiness\logo.png"/>
                </div> */}
            </div>
            {/* <img className="BillFooter" src="\bussiness\basic footer.jpg"/> */}
        </div>
    </>)

}
