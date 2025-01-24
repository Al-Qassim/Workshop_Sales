import { StateContext } from "../App";
import { useContext, useState } from "react"
import { PostRowToTable } from "../logic/GetPostData";
import { AddRows, DeleteRowInData, GetData, UpdateValueInData } from "../logic/InteractWithData";

export function QuantityInCart({ InventoryRow }) {
    // TODO: prevent the user from giving a quantity input that is > quantity in inventory - quantity in cart 
    // and give him a message
    
    let [state, setState] = useContext(StateContext);
    
    const [Quantity, setQuantity] = useState(0)
    const ItemExistInCart = state.data.Cart.some(CartRow => {
        return CartRow.ItemId == InventoryRow.Id
    }) 
    if (ItemExistInCart){
        const QuantityAlreadyInCart = GetData("Cart", "ItemId", InventoryRow.Id, "Quantity", state.data)
        if (Quantity != QuantityAlreadyInCart){
            setQuantity(QuantityAlreadyInCart)
        }
    }

    function HandleChange(e) {
        let QuantityInput = Number(e.target.value)
        QuantityInput = QuantityInput > InventoryRow.Quantity ? // prevent quantity input that is more than what is available in inventory
            InventoryRow.Quantity 
            : 
                QuantityInput < 0 ?// prevent quantity input less than 1
                0
                :
                QuantityInput
        setQuantity(
            QuantityInput
        )
        console.log("QuantityInCart Input is: ", QuantityInput)
        if (QuantityInput != 0 && !ItemExistInCart) {
            const NewCartRow = {
                ItemId: InventoryRow.Id,
                Quantity: QuantityInput, 
                PricePerUnit: InventoryRow.AssumedSellingPrice,
            }
            AddRows(
                [{TableName: "Cart", Rows: [NewCartRow]}],
                [state, setState]
            )
        }
        else if (QuantityInput != 0 && ItemExistInCart) {
            UpdateValueInData("Cart", "ItemId", InventoryRow.Id, "Quantity", QuantityInput, state, setState)
        }
        else if (QuantityInput == 0 && ItemExistInCart) {
            DeleteRowInData("Cart", "ItemId", InventoryRow.Id, state, setState)
        }
    }

    return (
        <div className="QuantityInCart">
            <img 
                src="/Workshop_Sales/Icons/shopping-cart-black.png"
                key={`cart ${InventoryRow.Id}`}
                className="IconButton border-none"
            />
            <input 
                className="QuantityInCart-input"
                type="number"
                value={Quantity}
                onChange={HandleChange}
                />
        </div>
    )

}
