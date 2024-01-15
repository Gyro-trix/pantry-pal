import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const name = useRef()
    const email = useRef()
    const password = useRef()
    const passwordchk = useRef()
    const allUserDataStr = localStorage.getItem("ALL_USERS")
    
    const navigate = useNavigate()

    function addUser() {
        //Checks if all text fields are full
        if(name.current.value&&email.current.value&&password.current.value&&passwordchk.current.value){
            //Checks that both passwords and passwordchk are the same 
            if(password.current.value === passwordchk.current.value){
                const nm = name.current.value
                const em = email.current.value
                const pw = password.current.value
                const newUser = {id:"1",username:nm,email:em,password:pw}
                const allUserData = JSON.parse(allUserDataStr)
                allUserData.push(newUser)

                localStorage.setItem("ALL_USER",JSON.stringify(allUserData))
                console.log(newUser.toString())
            }
        }

    }

    function grabUser(){
        console.log(localStorage.getItem("user"))
    }

    function checkRegister(){
        const allUserDataStr = localStorage.getItem("ALL_USERS")

    }

    return (
        <div>
            <div className="container">
                <div className="input_space">
                    <input placeholder="Name" type="text" ref={name} />
                </div>
                <div className="input_space">
                    <input placeholder="Email" type="text" ref={email} />
                </div>
                <div className="input_space">
                    <input placeholder="Password" type="password" ref={password} />
                </div>
                <div className="input_space">
                    <input placeholder="Re-Type Password" type="password" ref={passwordchk} />
                </div>
                <button onClick={addUser}>Register</button>
                <button onClick={grabUser}>Grab</button>
            </div>
        </div>
    );
}

export default Register;