import { MultiLineStringToOneLine } from "../logic/helpers"

export function InputField(InputKey, InputValueDetails, [Inputs, setInputs]){
                    
    if (InputValueDetails.InputType == "select") {
        return  <select 
                className="input" 
                key={`select ${InputKey}`}
                disabled={InputValueDetails.disabled}
                value={InputValueDetails.value}
                onChange={(e)=>{
                    console.log(`input ${InputKey} changed from ${InputValueDetails.value} to ${e.target.value}`)
                    const NewInputs = {...Inputs}
                    NewInputs[InputKey].value = InputValueDetails.ValueType == "number" ? Number(e.target.value) : e.target.value
                    setInputs(NewInputs)
                }}
            >
                {InputValueDetails.options}
            </select>
    }

    
    if (InputValueDetails.InputType == "textarea") {
        return  <textarea 
                key={`textarea ${InputKey}`}
                disabled={InputValueDetails.disabled}
                value={InputValueDetails.value}
                onChange={(e)=>{
                    console.log(`input ${InputKey} changed from ${InputValueDetails.value} to ${e.target.value}`)
                    const NewInputs = {...Inputs}
                    NewInputs[InputKey].value = e.target.value
                    setInputs(NewInputs)
                }}
            >
            </textarea>
    }

    return <>
    {InputValueDetails.InputType == "search and select" &&
        <datalist key={`${InputKey} list`} id={`${InputKey} list`}>
            {InputValueDetails.options}
        </datalist>}

    <input 
        key={`input ${InputKey}`}
        type= {InputValueDetails.InputType}
        list={`${InputKey} list`}
        className="input"
        value={InputValueDetails.value}
        disabled={InputValueDetails.disabled}
        onChange={(e)=>{
            const NewInputs = {...Inputs}
            console.log(`input ${InputKey} changed from ${InputValueDetails.value} to ${e.target.value}`)
            
            // this code will set the value of other inputs and dicable them when appropriate 
            if (
                InputValueDetails.InputType == "search and select" 
                && 
                InputValueDetails.DisableAndSetValueForOtherInput != null
            ){
                if (
                    InputValueDetails.options
                    .map(optiontag => optiontag.props.value)
                    .some(option => option == e.target.value)
                ){  
                    Object.entries(InputValueDetails.DisableAndSetValueForOtherInput)
                    .forEach(([OtherInputKey, MapingFunction])=>{
                        NewInputs[OtherInputKey].value = MapingFunction(e.target.value)
                        NewInputs[OtherInputKey].disabled = true
                    })
                }
                else if (
                    InputValueDetails.options
                    .map(optiontag => optiontag.props.value)
                    .some(option => option == InputValueDetails.value)
                ){
                    console.log("you was choosing an existing option and then changed it")
                    Object.entries(InputValueDetails.DisableAndSetValueForOtherInput)
                    .forEach(([OtherInputKey, MapingFunction])=>{
                        NewInputs[OtherInputKey].value = Inputs[OtherInputKey].ValueType == "number" ? 0 : ""
                        NewInputs[OtherInputKey].disabled = false
                    })
                }
            }
            
            let new_input = e.target.value
            if (InputValueDetails.ValueType == "number"){
                new_input = Number(new_input) 
                new_input = ((new_input < InputValueDetails.MinimumValue) && (InputValueDetails.MinimumValue != null)) ? InputValueDetails.MinimumValue : new_input
                new_input = ((new_input > InputValueDetails.MaximumValue) && (InputValueDetails.MaximumValue != null)) ? InputValueDetails.MaximumValue : new_input
            }
            console.log(`input ${InputKey} changed from ${InputValueDetails.value} to ${new_input}`)
            NewInputs[InputKey].value = new_input 
            setInputs(NewInputs)
        }}
    />
    </> 
    }

export function Form({
    FormTitle,
    Inputs, 
    setInputs,
    FormFooter
    
}){
    return <div className="BackGroundBlurLayer"> 
                <div className="Form">      
                    <h3>{FormTitle}</h3>
                    {/* input fields */}
                    {Object.entries(Inputs).map(([InputKey, InputValueDetails]) => {
                        return <div key={`div ${InputKey}`}>
                            {InputKey=="SupplierName" && <><hr></hr><h3>Buying Info</h3></>}
                            <label className="label" key={`label ${InputKey}`}>
                                <span className="span" key={`span ${InputKey}`}>{InputValueDetails.label}</span>
                                {InputField(InputKey, InputValueDetails, [Inputs, setInputs])}
                            </label >
                            <br key={`br ${InputKey}`}></br>
                        </div>
                    })}
                    
                    {FormFooter}
                </div>         
            </div>
}