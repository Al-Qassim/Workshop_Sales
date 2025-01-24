import { useContext, useState } from "react";
import { StateContext } from "../App";

export default function TopBar() {

    const [optionsVisible , setOptionsVisible] = useState(false)   
    const [state, setState] = useContext(StateContext) 

    const [ShowSupportPage, setShowSupportPage] = useState(false)

    function SupportPage(){
                
        if (!ShowSupportPage){
            return <></>
        }

        return (
        <div className="BackGroundBlurLayer">
            <div className="Form" style={{textAlign: "center"}}>
                <p>Copy Rights</p>
                <p>WorkShot ©2025</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>To contact with the Technical teem</p>
                <p>&nbsp;</p>
                Mohammed Hasan
                <p>Whatsapp: (+964) 770 797 9750</p>
                <p>Email: Clashmastercr7@gmail.com</p>
                <p>&nbsp;</p>
                Alqassim Ali
                <p>Whatsapp: (+964) 787 177 1726</p>
                <p>Email: qassimali624@gmail.com</p>
                <p>&nbsp;</p>
                <button key="cancel" className="button red-button" onClick={()=>{
                    setShowSupportPage(false)
                    console.log(`cencel button was click in SpacialPaymentForm`)
                }}>Cancel</button>
            </div>
        </div>
        )
    }


    return <div className="TopBar">
        <h1>Workshot</h1>
        {/* <img className="TitleImage" src="/bussiness/Title.png" alt="Title Image"/> */}
        {state.VisiblePage == "Homepage" && <>
        <img 
            className="TobBarImage" 
            src="/Workshop_Sales/Icons/list-green.png" 
            alt="Options Image"
            style={{cursor: "pointer"}}
            onClick={()=>{
                setOptionsVisible(!optionsVisible)
            }}       
        />
        {
            optionsVisible &&
            <div className="HomePageOptions">
                <ul>
                    <li onClick={()=>{
                        setState({
                            ...state,
                            VisiblePage: "Categories"
                        })
                        setOptionsVisible(!optionsVisible)
                    }}>Categories</li>
                    <li onClick={()=>{
                        setShowSupportPage(true)
                        setOptionsVisible(!optionsVisible)
                    }}>Contact & Support</li>
                </ul>
            </div>
        }
        {SupportPage()}
        </>}
        </div>
}
