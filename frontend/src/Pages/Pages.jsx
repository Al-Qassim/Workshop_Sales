import Homepage from "./Homepage"
import Inventory from "./Inventory";
import People from "./People";
import Cart from "./Cart";
import Bills from "./Bills";
import TopBar from "../Components/TopBar";
import Categories from "./Categories";

import { StateContext } from "../App";
import { useContext } from "react"
import Statistics from "./Statistics";

export default function Pages() {
    
    const [state, _] = useContext(StateContext);
    
    const PagesTitles = {
        Homepage: "Homepage",
        Inventory: "Inventory",
        Cart: "Cart",
        Bills: "Bills",
        People: "Customars and Suppliers",
        // Categories: "Categories",
        Statistics: "Financial Statistics",
    }

    const PagesTags = {
        Homepage: <Homepage PagesTitles={PagesTitles}/>,
        Inventory: <Inventory />,
        Cart: <Cart />,
        Bills: <Bills/>,
        People: <People />,
        Statistics: <Statistics />,
        Categories: <Categories/>,
    } 

    return <>
        <TopBar />
        {PagesTags[state.VisiblePage]}
        </>
}
