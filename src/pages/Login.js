import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { logIn } from "../utils/users"
import { REGISTER } from "../config/routes"
import { CUR_USER,ALL_USERS } from "../config/localStorage"
import { createDemoStorage } from "../utils/storage"
import { createDemoRecipe } from "../utils/recipes"


function Login() {
    //Treats navigating to Log In as logging out
    localStorage.setItem(CUR_USER, "")
    const navigate = useNavigate()

    const allUserDataStr = [localStorage.getItem(ALL_USERS)]
    const [attemptingUser, setAttemptingUser] = useState({ id: " ", username: " ", email: " ", password: " ", notify: " ", itemlimit: " ", expirylimit: " " })
    //Creates admin and demo users
    if (allUserDataStr[0] === null) {
        const demoUsers = [
            { id: "TrueAdmin", username: "Admin", email: "Admin",password: "Admin", notify: true, expirylimit: 99, itemlimit: 99 ,adminlevel: 3, manager: null },
            { id: "DemoLevel2", username: "Demo2", email: "Demo2",password: "Demo2", notify: true, expirylimit: 99, itemlimit: 99 ,adminlevel: 2, manager:"TrueAdmin" },
            { id: "DemoLevel1", username: "Demo1", email: "Demo1",password: "Demo1", notify: true, expirylimit: 99, itemlimit: 99 ,adminlevel: 1, manager:"DemoLevel2" }
        ]
        localStorage.setItem(ALL_USERS, JSON.stringify(demoUsers))
    }
    createDemoStorage()
    createDemoRecipe()
    const handleChange = e => {
        setAttemptingUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    function goRegister() {
        navigate(REGISTER)
    }

    return (
        <div>
            <div className="card w-50 mb-3" style={{padding: 32, margin:"auto", marginTop:64, minWidth:400, maxWidth:400,animation:"fadeIn 3s" }}>
                <form>
                <div className="input_group mb-3" style = {{animation:"fadeIn2 2s"}}>
                    <input className="form-control"
                    
                        placeholder="Username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        onChange={handleChange} />
                </div>
                <div className="input_group mb-3 " style = {{animation:"fadeIn2 2s"}}>
                    <input className="form-control"
                        placeholder="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        onChange={handleChange} />
                </div>
                </form>
                <div style = {{animation:"fadeIn2 2s"}} className = "col d-flex justify-content-between">
                    <button type="button" className="btn btn-primary" style={{ width: 96, marginRight: 32 }} onClick={goRegister}>Register</button>
                    <button type="button" className="btn btn-primary" style={{ width: 96, whiteSpace: "nowrap" }} onClick={() => logIn(attemptingUser, navigate)}>Log In</button>
                </div>
            </div>
        </div>
    );
}

export default Login;