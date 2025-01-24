import { useContext } from "react";
import { StateContext } from "../App";

export default function PageToolBar({Title, HideSearchAndFilterSection, setHideSearchAndFilterSection}) {
    
    let [state, setState] = useContext(StateContext);

    return <div className="PageToolBar">
        {/* <img className="IconButton" src="/Icons/shopping-cart-black.png" onClick={() => {setState({...state, VisiblePage: "Cart"})}}/> */}
        <img className="IconButton" src="/Workshop_Sales/Icons/home-black.png" onClick={() => {setState({...state, VisiblePage: "Homepage"})}}/>
        {typeof HideSearchAndFilterSection == "boolean" && <img className="IconButton" src="/Workshop_Sales/Icons/settings-sliders.png" onClick={() => {
            if (HideSearchAndFilterSection){
                setHideSearchAndFilterSection(false)
            } else {
                setHideSearchAndFilterSection(true)
            }
        }}/>}
        <h1 className="PageTitle">{Title}</h1>
        </div>
}
