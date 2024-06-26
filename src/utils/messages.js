import { USER_MESSAGES, NOTIFICATIONS, THEME } from "../config/localStorage";
import Avatar from 'react-avatar';
import { getUserIDByEmail, getUserImage } from "./users";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { checkInvites } from "./notifications";

export function inviteUser(currentUser, userToInviteEmail,source) {
    const allNotificationsStr = localStorage.getItem(NOTIFICATIONS)
    const allNotifications = allNotificationsStr ? JSON.parse(allNotificationsStr) : []
    const userToInviteID = getUserIDByEmail(userToInviteEmail)
    const themeStr = localStorage.getItem(THEME)
    const theme = JSON.parse(themeStr)
    if (currentUser.email !== userToInviteEmail) {
        if (checkInvites(currentUser, userToInviteID)) {
            if (!(userToInviteID === "No User Found")) {
                let modifiedNotifications
                let inviteNotification = {
                    owner: currentUser.id,
                    target: userToInviteID,
                    type: "invite",
                    id: "" + new Date().getTime() + "-invite",
                    dismissed: false
                }
                modifiedNotifications = [...allNotifications, inviteNotification]
                localStorage.setItem(NOTIFICATIONS, JSON.stringify(modifiedNotifications))
                if(source ==="message"){
                    window.dispatchEvent(new Event(source))
                } else if(source === "settings"){
                    window.dispatchEvent(new Event(source))
                }
                
            }
            else {
                toast("No User matched to email", { position: "bottom-right", theme: theme.toast })
            }
        }
    } else {
        toast("That is your email", { position: "bottom-right", theme: theme.toast })
    }
}

export function displayMessages(targetUser, currentUser) {
    const userMessagesStr = localStorage.getItem(USER_MESSAGES)
    const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
    const themeStr = localStorage.getItem(THEME)
    const theme = JSON.parse(themeStr)
    let messages = []
    userMessages.forEach(message => {
        if ((message.from === targetUser) && (message.to === currentUser)) {
            messages.push(message)
        } else if ((message.from === currentUser) && (message.to === targetUser)) {
            messages.push(message)
        }
    })
    let orderedMessages = messages
    return (
        <div>
            {
                orderedMessages.map((message, index) => {

                    let hideSeen = false
                    let hideDelete = false
                    const toStyle = { marginTop: 8, padding: 8, background: theme.to, marginLeft: 48 }
                    const fromStyle = { marginTop: 8, padding: 8, background: theme.from, marginRight: 48 }
                    let style = {}
                    if (message.from === currentUser) {
                        hideDelete = false
                        style = toStyle
                    } else {
                        hideDelete = true
                        style = fromStyle
                    }
                    if ((message.from === currentUser) || (message.seen)) {
                        hideSeen = true
                    }
                    return (
                        <div className="card" style={style} key={index}>
                            <span style={{ fontSize: 12 }}><Avatar style={{ marginRight: 8 }} size="24" round={true} color={Avatar.getRandomColor('sitebase', theme.avatar)} src={getUserImage(message.from)} name={message.from} textSizeRatio={2} />
                                {message.from}:</span>
                            <span style={{ marginLeft: 8, marginTop: 8, marginBottom: 8 }}>{message.contents}</span>
                            <form>
                                <span style={{ fontSize: 12 }} hidden={!(hideSeen) || (message.from === currentUser)}>Seen</span>
                                <button type="button" className={theme.button} style={{ float: "right", fontSize: 12 }} hidden={hideDelete} onClick={() => deleteMessage(currentUser, message.time)}>X</button>
                                <button type="button" className={theme.button} style={{ float: "right", fontSize: 12 }} hidden={hideSeen} onClick={() => markSeen(currentUser, message.time)}>S</button>
                            </form>
                        </div>
                    )
                })
            }
        </div>
    )
}

export function submitMessage(targetUser, currentUser, contents) {
    const themeStr = localStorage.getItem(THEME)
    const theme = JSON.parse(themeStr)
    if (targetUser !== "" && contents !== "") {
        console.log(targetUser)
        const userMessagesStr = localStorage.getItem(USER_MESSAGES)
        const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
        const time = new Date().getTime()
        const message = { from: currentUser, to: targetUser, contents: contents, time: time, seen: false }
        let messages = [...userMessages, message]
        localStorage.setItem(USER_MESSAGES, JSON.stringify(messages))
        window.dispatchEvent(new Event("message"))
    } else if (targetUser !== "") {
        toast("Please enter a message.", { position: "bottom-right", theme: theme.toast })
    } else if (contents !== "") {
        toast("Please select a user.", { position: "bottom-right", theme: theme.toast })
    }
    
}

export function deleteMessage(currentUser, time) {
    const userMessagesStr = localStorage.getItem(USER_MESSAGES)
    const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
    let tempMessages = []
    userMessages.forEach(message => {
        if (!((message.from === currentUser) && (message.time === time))) {
            tempMessages = [...tempMessages, message]
        }
    })
    localStorage.setItem(USER_MESSAGES, JSON.stringify(tempMessages))
    window.dispatchEvent(new Event("message"))
}

export function markSeen(currentUser, time) {
    const userMessagesStr = localStorage.getItem(USER_MESSAGES)
    const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
    let tempMessages = []
    userMessages.forEach(message => {
        if ((message.to === currentUser) && (message.time === time)) {
            message.seen = true
        }
        tempMessages = [...tempMessages, message]
    })
    localStorage.setItem(USER_MESSAGES, JSON.stringify(tempMessages))
    window.dispatchEvent(new Event("navbar"))
    window.dispatchEvent(new Event("message"))
}

export function newMessagesForUser(fromUser, currentUser) {
    const userMessagesStr = localStorage.getItem(USER_MESSAGES)
    const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
    let answer = false
    userMessages.every(message => {
        if ((message.to === currentUser) && (message.from === fromUser) && (message.seen === false)) {
            answer = true
            return false
        }
        return true
    })
    return answer
}

export function anyNewMessages(currentUser) {
    const userMessagesStr = localStorage.getItem(USER_MESSAGES)
    const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
    let answer = false
    userMessages.every(message => {
        if ((message.to === currentUser) && (message.seen === false)) {
            answer = true
            return false
        }
        return true
    })
    return answer
}

export function cleanUpMessages(targetUsername) {
    const userMessagesStr = localStorage.getItem(USER_MESSAGES)
    const userMessages = userMessagesStr ? JSON.parse(userMessagesStr) : []
    let tempMessages = []
    userMessages.forEach(message => {
        if (!((message.from === targetUsername) || (message.to === targetUsername))) {
            tempMessages = [...tempMessages, message]
        }
    })
    localStorage.setItem(USER_MESSAGES, JSON.stringify(tempMessages))
}


