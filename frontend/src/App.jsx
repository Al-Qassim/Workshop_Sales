import { useState, createContext, useEffect } from "react"
import { FetchDataToState } from './logic/GetPostData'

import Pages from "./Pages/Pages"
import { BillToBePrintedUI } from "./Components/PrintBill";

export var StateContext = createContext();
export var setBillIdToBePrintedContext = createContext();


function App() {
    // setup state
    const [state, setState] = useState({
        VisiblePage: "Homepage", // default "Homepage",
        data: {},
    })
    const [BillIdToBePrinted, setBillIdToBePrinted] = useState(null)
    const [Print, setPrint] = useState(null)

    useEffect(() => {
        if (BillIdToBePrinted != null){
            setPrint(true)
        }
    }, [BillIdToBePrinted])

    useEffect(() => {
        if (Print != null){
            window.print();
            setPrint(null)
            setBillIdToBePrinted(null)
        }
    }, [Print])


    // fetch data
    useEffect(() => {
        // FetchDataToState([state, setState]);
        setState({
            ...state,
            data: {
                Bills:  [
                    {
                        Id:         0,
                        PersonId:   0,
                        Payed:      300,
                        Debt:       0,
                        Notes:      "6 Months Guarantee",
                        Date:       "2025-01-20",
                        BillTypeId: 1,
                        InTrash:    0
                    }
                ],
                Billtypes:  [
                    {Id:0,  Type:"Buy",                       "InTrash":0,    "RevenueOrExpense":-1   },
                    {Id:1,  Type:"Sell",                      "InTrash":0,    "RevenueOrExpense":1    },
                    {Id:2,  Type:"Receiving Debt",            "InTrash":0,    "RevenueOrExpense":1    },
                    {Id:3,  Type:"Paying Debt",               "InTrash":0,    "RevenueOrExpense":-1   },
                    {Id:4,  Type:"Salary",                    "InTrash":0,    "RevenueOrExpense":-1   },
                    {Id:5,  Type:"Special Expenses",          "InTrash":0,    "RevenueOrExpense":-1   },
                    {Id:6,  Type:"Special Revenuse",          "InTrash":0,    "RevenueOrExpense":1    },
                    {Id:7,  Type:"Taxes",                     "InTrash":0,    "RevenueOrExpense":-1   },
                    {Id:8,  Type:"Expansion and Renovation",  "InTrash":0,    "RevenueOrExpense":-1   },
                    {Id:9,  Type:"Rent",                      "InTrash":0,    "RevenueOrExpense":-1   }
                ],
                Cart: [],
                Categories:  [
                    {Id: 0, Category: "N/A"},
                    {Id: 1, Category: "Laptop"},
                ],
                Items:  [
                    {
                        Id: 0,
                        Name: "Lenovo ThinkPad T480s",
                        Quantity: 4,
                        Notes: "6 Months Guarantee",
                        AssumedSellingPrice: 300,
                        MinimumSellingPrice: 275,
                        CategoryId: 1,
                        InTrash: 0,
                    },
                    {
                        Id: 1,
                        Name: "Lenovo ThinkPad T470p",
                        Quantity: 5,
                        Notes: "6 Months Guarantee",
                        AssumedSellingPrice: 290,
                        MinimumSellingPrice: 270,
                        CategoryId: 1,
                        InTrash: 0,
                    },
                ],
                People:  [
                    {"Id":0,"Name":"N/A","Info":"","Debt":0,"InTrash":0}
                ],
                Transactions:  [
                    {
                        "Id":0,
                        "ItemId":1,
                        "Quantity":1,
                        "PricePerUnit":300,
                        "BillId":0,
                        "InTrash":0
                    }
                ]
            }
        })
    }, [])  
        
    if (Object.keys(state.data).length === 0) {
        console.log("wait for fetching")
        return <></>
    }


    return (
        <StateContext.Provider value={[state, setState]}>
            <setBillIdToBePrintedContext.Provider value={setBillIdToBePrinted}>
                <Pages/>
                {/* <button onClick={()=>{console.log("here is the state", state)}}>print state</button>
                <button onClick={()=>{
                        console.log("you clicked print window", state)
                        window.print()
                        
                    }}>print window</button> */}
                {<BillToBePrintedUI BillId={BillIdToBePrinted}/>}
                {/* {<BillToBePrintedUI BillId={0}/>} */}
            </setBillIdToBePrintedContext.Provider>
        </StateContext.Provider>
    )
}

export default App 