import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddItems from './AddItems';
import { CUR_STORAGE, ALL_STORAGES, CUR_ITEM_LIST, CUR_USER, THEME } from "../config/localStorage"
import { saveStorageToLocalStorage } from "../utils/storage"
import { notificationCleanUp } from "../utils/notifications";
import { checkUserLogin } from "../utils/users"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function EditStorage() {
    const themeStr = localStorage.getItem(THEME)
    const [theme, setTheme] = useState(JSON.parse(themeStr))
    const allStorageData = JSON.parse(localStorage.getItem(ALL_STORAGES))
    const currentUserStr = localStorage.getItem(CUR_USER)
    const [currentStorage, setCurrentStorage] = useState(JSON.parse(localStorage.getItem(CUR_STORAGE)))
    const [itemlist, setItemList] = useState(JSON.parse(localStorage.getItem(CUR_ITEM_LIST)))
    const [notifyText, setNotifyText] = useState("Edit in progress")
    const [notifyColor, setNotifyColor] = useState("black")
    const [storageImage, setStorageImage] = useState(currentStorage.image ? currentStorage.image : null)
    const navigate = useNavigate()
    //updates currentStorage as the form changes. Applies to name, type and location


    //Check if users is logged in
    useEffect(() => {
        checkUserLogin(currentUserStr, navigate)
    }, [currentUserStr, navigate])

    useEffect(() => {
        function handleUpdate() {
            setTheme(JSON.parse(localStorage.getItem(THEME)))
        }

        window.addEventListener('item', handleUpdate);
        return () => window.removeEventListener('item', handleUpdate);
    }, []);

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

    const handleChange = e => {
        setCurrentStorage((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const reader = (file) =>
        new Promise((resolve, reject) => {
            const fr = new FileReader()
            fr.onload = () => resolve(fr)
            fr.onerror = (err) => reject(err)
            fr.readAsDataURL(file)
        })


    const handleFile = async (e) => {
        const file = e.target.files[0]
        if (file.size <= 512000) {
            const image = await reader(file)
            setStorageImage(image.result)
            setCurrentStorage((prev) => ({
                ...prev,
                image: image.result,
            }))
        } else {
            toast("Please choose an image that is less tham 500 KB in size", { position: "bottom-right", theme: theme.toast })
        }

    }

    return (
        <div className="card w-50 mb-3" style={{ padding: 16, margin: "auto", marginTop: 32, minWidth: 600 }}>
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
                <div className="container flex col" >
                    <br />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{storageImage != null && <img alt="" width={200} height={200} src={`${storageImage}`} />}</div>
                    <div className="input-group mb-3">
                        <input
                            type="file"
                            className="form-control"
                            style={{ marginTop: 16 }}
                            name="image"
                            id="file"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleFile}
                        />
                    </div>
                </div>
            </div>
            <AddItems itemlist={itemlist} setItemList={setItemList} />
            {/*Notification text to appear above save button */}
            <div className="container" style={{ textAlign: "center" }}>
                <span style={{ color: notifyColor, marginTop: 16 }}>{notifyText}</span>
            </div>
            <button type="button" className={theme.button} style={{ whiteSpace: "nowrap", marginTop: 16 }} onClick={() => {
                saveStorageToLocalStorage(currentStorage)
                notificationCleanUp()
                setNotifyColor("green")
                setNotifyText("Save Completed")
            }}>Save Storage</button>
        </div >
    )
}

export default EditStorage;