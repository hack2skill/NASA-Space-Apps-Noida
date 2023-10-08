import axios from "axios"
import { useState } from "react"
var debug=true

var websocket=false
var last_message={"id":"","data":""}
export var [is_opened,set_is_opened]=[0,0]

function cookie_get(key) {
    try {
        var cookies={}
        for (var x in document.cookie.split("; ")) {
            var raw_data=document.cookie.split("; ")[x].split("=")
            cookies[raw_data[0]]=raw_data[1]
        }
        if (key in cookies) {
            return cookies[key]
        }
        return ""
    } catch {
        return ""
    }
}

function cookie_set(key,val) {
    try {
        document.cookie=`${key}=${val};expires=Thu, 01 Jan 2049 00:00:00 UTC`
    } catch {}
}

export async function connect_ws(is_opened_,set_is_opened_) {
    is_opened=is_opened_
    set_is_opened=set_is_opened_
    if (websocket==false) {
        if (debug) {
            var node_url="ws://127.0.0.1:8080"
        } else {
            var node_url=(await axios.get("https://nuxland-api.vercel.app")).data
        }
        if (websocket==false) {
            var x=new WebSocket(node_url)
            if (websocket==false) {
                websocket=x
            }
        }
        websocket.addEventListener("open",async ()=>{
            try {
                websocket.send("client")
                if (cookie_get("logged_in")=="true") {
                    websocket.send("login/"+cookie_get("username")+"/"+cookie_get("password"))
                    if (await recv()=="false") {
                        set_is_opened({"opened":true,"auth":false})
                        cookie_set("logged_in","")
                    } else {
                        console.log("areee")
                        set_is_opened({"opened":true,"auth":true})
                    }
                }
            } catch {
                return
            }
        })
        websocket.addEventListener("message",(event)=>{
            last_message["data"]=event.data
            last_message["id"]=crypto.randomUUID()
        })
        websocket.addEventListener("close",()=>{
            set_is_opened({"opened":false,"auth":false})
            websocket=false
        })
        return websocket
    } else {
        return websocket
    }
}

export async function recv() {
    var initial_uuid=last_message.id
    while (initial_uuid==last_message.id) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    return last_message.data
}

export async function send(data) {
    while (true) {
        try {
            websocket.send(data)
            break
        } catch {
            await connect_ws()
            await await new Promise(r => setTimeout(r, 100))
        }
    }
}

export async function get_websocket() {
    return connect_ws()
}