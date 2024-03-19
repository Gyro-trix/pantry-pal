import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddItems from './AddItems';
import { CUR_STORAGE, ALL_STORAGES, CUR_ITEM_LIST, CUR_USER } from "../config/localStorage"
import { saveStorageToLocalStorage } from "../utils/storage"
import { notificationCleanUp } from "../utils/notifications";
import { checkUserLogin } from "../utils/users"

function EditStorage() {
    const allStorageData = JSON.parse(localStorage.getItem(ALL_STORAGES));
    const currentUserStr = localStorage.getItem(CUR_USER)
    const [currentStorage, setCurrentStorage] = useState(JSON.parse(localStorage.getItem(CUR_STORAGE)));
    const [itemlist, setItemList] = useState(JSON.parse(localStorage.getItem(CUR_ITEM_LIST)));
    const [notifyText, setNotifyText] = useState("Edit in progress")
    const [notifyColor, setNotifyColor] = useState("black")
    const [image, setImage] = useState("hello")
    const navigate = useNavigate()
    //updates currentStorage as the form changes. Applies to name, type and location

    const handleChange = e => {
        setCurrentStorage((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }
    //Check if users is logged in
    useEffect(() => {
        checkUserLogin(currentUserStr, navigate)
    }, [currentUserStr, navigate])

    useEffect(() => {
        setCurrentStorage((prev) => ({
            ...prev,
            items: itemlist,
        }))
    }, [itemlist])

    useEffect(() => {
        localStorage.setItem(CUR_STORAGE, JSON.stringify(currentStorage))
    }, [currentStorage])

    useEffect(() => {
        localStorage.setItem(ALL_STORAGES, JSON.stringify(allStorageData))
    }, [allStorageData])

    useEffect(() => {
        localStorage.setItem(CUR_ITEM_LIST, JSON.stringify(itemlist))
        setNotifyColor("red")
        setNotifyText("Please Save")
    }, [itemlist])

    const handleFile = e => {
        let file = e.target.files[0]
        
        if (file) {
            const reader = new FileReader()
            reader.onload = function (event) {
                console.log(event.target.result)
            localStorage.setItem("TEST",JSON.stringify(event.target.result))
            }
            reader.readAsDataURL(file)
            
        }
        setImage(JSON.parse(localStorage.getItem("TEST")))
    }




    return (
        <div className="card w-50 mb-3" style={{ padding: 16, margin: "auto", marginTop: 64, minWidth: 600 }}>
            {/*Edit Storage Form */}
            <div className="container flex row">
                <div className="container flex col">
                    <form className="flex row-auto"  >
                        <div className="input_group mb-3">
                            <label style={{ width: "100%" }}>Storage Name:
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={handleChange}
                                    name="name"
                                    style={{}}
                                    defaultValue={currentStorage.name}
                                ></input>
                            </label>
                        </div>
                        <div className="input_group mb-3">
                            <label style={{ width: "100%" }}>Storage Type:
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={handleChange}
                                    name="type"
                                    defaultValue={currentStorage.type}
                                ></input>
                            </label>
                        </div>
                        <div className="input_group mb-3">
                            <label style={{ width: "100%" }}>Storage Location:
                                <input
                                    className="form-control"
                                    type="text"
                                    onChange={handleChange}
                                    name="location"
                                    defaultValue={currentStorage.location}
                                ></input>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="container flex col">

                    <div>
                        <input
                            type="file"
                            name="image"
                            id="file"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleFile}
                        />

                        <p style ={{fontSize:2}}>base64 string: {image}</p>
                        <br />
                        {image != null && <img src={`${image}`} />}
                    </div>
<button onClick ={()=>{setImage(JSON.parse(localStorage.getItem("TEST")))}}>Test</button>
                </div>
            </div>
            <AddItems itemlist={itemlist} setItemList={setItemList} />
            {/*Notification text to appear above save button */}
            <div className="container" style={{ textAlign: "center" }}>
                <span style={{ color: notifyColor, marginTop: 16 }}>{notifyText}</span>
            </div>
            <button type="button" className="btn btn-primary" style={{ whiteSpace: "nowrap", marginTop: 16 }} onClick={() => {
                saveStorageToLocalStorage(currentStorage)
                notificationCleanUp()
                setNotifyColor("green")
                setNotifyText("Save Completed")
            }}>Save Storage</button>
        </div >
    )
}

export default EditStorage;