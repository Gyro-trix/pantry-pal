import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function AddItems(props) {
    const [startDate,setStartDate] = useState(new Date())

    const [item, setItem] = useState({
        quantity: "",
        name: "",
        size: "",
        expiry: "",
    })
    const {itemlist, setItemList} = props;

    useEffect(() => {
        localStorage.setItem("CUR_ITEM_LIST", JSON.stringify(itemlist))
    }, [itemlist])


    const handleChange = e => {
        setItem((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    function addExpiryDate(date){
        setStartDate(date)
        console.log(date)
        const day = date.getUTCDate()
        const month = date.getUTCMonth() + 1
        const year = date.getUTCFullYear()
        item.expiry = "" + month +"/"+day+"/"+year+""
    }

    function addItem() {
        if (item.quantity && item.name && item.size && item.expiry) {
            setItemList([...itemlist, item])
        } else {
            window.alert("Missing Info")
        }

    }
    //Delete item based on index in itemlist
    function deleteItem(indextodelete) {
        setItemList(oldItemList => {
            return oldItemList.filter((_, i) => i !== indextodelete)
        })

    }
//displays items in current storage
    function displayItems() {
        if ((itemlist === null) === false) {
            return itemlist.map((item, index) => {
                return (
                    <div key={item.name+index} className="card" style={{ marginTop: 10 }}>
                        <div className="card-body">
                            <p className="card-text">Item Name: {item.name} Quantity:{item.quantity} Size:{item.size} Expiry:{item.expiry}</p>
                            <button onClick={() => deleteItem(index)}>Delete Item</button>
                        </div>
                    </div>
                )
            })
        }
    }

    return (
        <div>
            <div className="container">
                {displayItems()}
                <form className="col" style = {{marginTop: 10  }}>
                    <input
                        style={{ width: 75}}
                        type="text"
                        onChange={handleChange}
                        name="quantity"
                        placeholder="Quantity"
                    ></input>
                    <input
                        style = {{marginLeft: 5  }}
                        type="text"
                        onChange={handleChange}
                        name="name"
                        placeholder="Name"
                    ></input>
                    <input
                        style={{ width: 100 ,marginLeft: 5  }}
                        type="text"
                        onChange={handleChange}
                        name="size"
                        placeholder="Size"
                    ></input>
                    {/*<input
                        style = {{marginLeft: 5  }}
                        type="text"
                        onChange={handleChange}
                        name="expiry"
                        placeholder="Expiry"
    ></input>*/}
                    <DatePicker 
                    selected={startDate}
                    name = "expiry" 
                    onChange={(date) => addExpiryDate(date)} 
                    />
                </form>
                <button style = {{marginTop: 10}} onClick={addItem}>Add Item</button>
            </div>
        </div>
    )

}
export default AddItems;