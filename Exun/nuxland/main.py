import asyncio,time,json,websockets,litedb,hashlib,random,threading,ngrok,uuid,requests
ngrok.set_auth_token(open("ngrok_token").read().split("=")[1])
from websockets.server import serve
from websockets.sync import client as wsclient
from datetime import datetime

tunnel=ngrok.connect(8080)

nodes=litedb.get_conn("nodes")
users=litedb.get_conn("users")
projects=litedb.get_conn("projects")
channels=litedb.get_conn("channels")
invites=litedb.get_conn("invites")

class Message:
    def __init__(self,sender,content,timestamp) -> None:
        self.sender=sender
        self.content=content
        self.timestamp=timestamp
    def json(self):
        return {"sender":self.sender,"content":self.content,"timestamp":self.timestamp}

class Channel:
    def __init__(self,name,messages=[]) -> None:
        self.id=uuid.uuid4().__str__()
        self.name=name
        self.messages=messages
    def json(self):
        messages_json=[x.json() for x in self.messages]
        return {"id":self.id,"name":self.name,"messages":messages_json}

class Project:
    def __init__(self,owner,name,visibility,description):
        self.name=name
        self.owner=owner
        self.collaborators=[owner]
        self.files={}
        self.live=""
        new_channels=[Channel("general")]
        self.channels=[x.name+"|"+x.id for x in new_channels]
        self.description=description
        for x in new_channels:
            channels.set(x.name+"|"+x.id,x.json())
        self.fund_target=0
        self.fund_done=0
        self.meeting_id=""
        self.versions={}
        self.votes=0
        self.roles={}
        self.visibility=visibility
    def json(self):
        return {"name":self.name,"owner":self.owner,"collaborators":self.collaborators,"files":self.files,
                "live":self.live,"channels":self.channels,"fund_target":self.fund_target,"fund_done":self.fund_done,
                "meeting_id":self.meeting_id,"versions":self.versions,"votes":self.votes,"roles":self.roles,
                "visibility":self.visibility,"description":self.description}

class User:
    def __init__(self,name,password,skills=[],image="",address="",date_joined="") -> None:
        self.name=name
        self.password=password
        self.id=uuid.uuid4().__str__()
        self.address=address
        self.skills=skills
        self.projects=[]
        self.respect=0
        self.invites=[]
        if date_joined=="":
            self.joined_on=datetime.now().__str__()
        else:
            self.joined_on=date_joined
        if image=="":
            self.image="https://api.dicebear.com/6.x/adventurer/svg?seed="
        else:
            self.image=image
    def json(self):
        return {
            "name":self.name,
            "password":self.password,
            "id":self.id,
            "address":self.address,
            "skills":self.skills,
            "projects":self.projects,
            "respect":self.respect,
            "image":self.image,
            "date_joined":self.joined_on,
            "invites":self.invites
        }

def hash(x):
    return hashlib.sha256(x.encode()).hexdigest()

connections={}

async def recv(id):
    while True:
        try:
            data=await connections[id]["object"].recv()
        except:
            if id in connections:
                del connections[id]
            return
        return data

async def client_thread(websocket: wsclient.ClientConnection):
    try:
        websocket.solution=False
        global connections
        admin=False
        id=str([websocket.id,websocket.remote_address])
        uid=websocket.id
        print("Client Connected",websocket.id,websocket.remote_address)
        connections[id]={"status":"unchecked","authority":"","data":{},"solution":False,"object":websocket,"auth":False}
        connection_type=await recv(id)
        print(connection_type)
        if connection_type=="load":
            node_token=await recv(id)
            if node_token!=nodes.get("admin_token"):
                await websocket.close()
                return
            else:
                await websocket.send(str(len(connections.keys())))
                return
        if connection_type=="admin":
            node_token=await recv(id)
            if node_token!=nodes.get("admin_token"):
                await websocket.close()
                return
            else:
                admin=True
                connections[id]["status"]="checked"
                connections[id]["authority"]="admin"
        elif connection_type=="client":
            connections[id]["status"]="checked"
            connections[id]["authority"]="client"
        else:
            await websocket.close()
            return
        user_details=None
        while id in connections:
            message=(await recv(id))
            if message==None:
                raise Exception("")
            else:
                message=message.split("/")
            if message[0]=="register":
                user_name=message[1]
                password=hash(message[2])
                image=message[3]
                users_list=users.get("users")
                if user_name not in users_list:
                    users.set(user_name,User(user_name,password,image=image).json())
                    users.set("users",users_list+[user_name])
                    invites.set(user_name,[])
                    user_details=User(user_name,password)
                    await websocket.send("true")
                    connections[id]["auth"]=True
                else:
                    await websocket.send("false")
            elif message[0]=="login":
                user_name=message[1]
                password=message[2]
                users_list=users.get("users")
                if user_name not in users_list:
                    await websocket.send("false")
                    continue
                users_data=users.get(user_name)
                if users_data!=None and users_data["password"]==hash(password):
                    user_details=User(users_data["name"],users_data["password"])
                    await websocket.send("true")
                    connections[id]["auth"]=True
                else:
                    await websocket.send("false")
            elif message[0]=="profile":
                if connections[id]["auth"]==True:
                    username_=message[1]
                    user_data=users.get(username_)
                    new_projects={}
                    for x in user_data["projects"].copy():
                        new_projects[x]={"name":x,"description":projects.get(x)["description"]}
                    user_data["projects"]=new_projects
                    user_data["invites"]=invites.get(username_)
                    time.sleep(0.01)
                    try:
                        await websocket.send(json.dumps(user_data))
                    except Exception as e:
                        await websocket.send("{}")
                else:
                    await websocket.send("{}")
            elif message[0]=="send_invite":
                if connections[id]["auth"]==True:
                    project_id=message[1]
                    user_account_id=projects.get(project_id)["owner"]
                    user_account=invites.get(user_account_id)
                    user_account.append({"username":user_name,"project_id":project_id})
                    invites.set(user_account_id,user_account)
                    await websocket.send("true")
                else:
                    await websocket.send("{}")
            elif message[0]=="accept_invite":
                if connections[id]["auth"]==True:
                    project_id=message[1]
                    user_account_id=message[2]
                    project_data=projects.get(project_id)
                    project_data["collaborators"].append(user_account_id)
                    user_account=users.get(user_account_id)
                    pending_invites=[]
                    your_data=invites.get(project_data["owner"])
                    for x in your_data.copy():
                        if x["project_id"]==project_id and x["username"]==user_account_id:
                            pass
                        else:
                            pending_invites.append(x)
                    your_data=pending_invites
                    print(your_data)
                    invites.set(project_data["owner"],your_data)
                    print(users.get(project_data["owner"]))
                    user_account["projects"].append(project_id)
                    projects.set(project_id,project_data)
                    users.set(user_account_id,user_account)
                    await websocket.send("true")
                else:
                    await websocket.send("{}")
            elif message[0]=="reject_invite":
                if connections[id]["auth"]==True:
                    project_id=message[1]
                    project_data=projects.get(project_id)
                    user_account_id=message[2]
                    your_data=users.get(project_data["owner"])
                    pending_invites=[]
                    for x in your_data["invites"].copy():
                        if x["project_id"]==project_id and x["username"]==user_account_id:
                            pass
                        else:
                            pending_invites.append(x)
                    your_data["invites"]=pending_invites
                    users.set(project_data["owner"],your_data)
                    await websocket.send("true")
                else:
                    await websocket.send("{}")
            elif message[0]=="open_projects":
                if connections[id]["auth"]==True:
                    username_=message[1]
                    user_data=users.get(username_)
                    new_projects={}
                    for x in projects.get("projects_list"):
                        project_data=projects.get(x)
                        new_projects[x]={"name":x,"description":project_data["description"]}
                    user_data["projects"]=new_projects
                    user_data["invites"]=invites.get(username_)
                    time.sleep(0.01)
                    try:
                        print(user_data["projects"])
                        await websocket.send(json.dumps(user_data))
                    except Exception as e:
                        await websocket.send("{}")
                else:
                    await websocket.send("{}")
            elif message[0]=="create_project":
                print(message)
                if connections[id]["auth"]==True:
                    project_name=message[1]
                    user_data=users.get(user_name)
                    if projects.get("projects_list") in [None,False]:
                        projects.set("projects_list",[])
                    projects_list=projects.get("projects_list")
                    if project_name in projects_list:
                        await websocket.send("false")
                    else:
                        projects_list.append(project_name)
                        projects.set("projects_list",projects_list)
                        user_data["projects"].append(project_name)
                        users.set(user_name,user_data)
                        projects.set(project_name,Project(user_name,project_name,True,message[2]).json())
                        await websocket.send("true")
                else:
                    await websocket.send("false")
            elif message[0]=="project_details":
                if connections[id]["auth"]==True:
                    project_name=message[1]
                    user_data=users.get(user_name)
                    if project_name in user_data["projects"]:
                        await websocket.send(json.dumps(projects.get(project_name)))
                    else:
                        await websocket.send("false")
                else:
                    await websocket.send("false")
            elif message[0]=="channel_messages":
                if connections[id]["auth"]==True:
                    project_name=message[1]
                    channel_id=message[2]
                    user_data=users.get(user_name)
                    print(user_data["projects"],project_name)
                    if project_name in user_data["projects"]:
                        print(channel_id,projects.get(project_name)["channels"])
                        if channel_id in projects.get(project_name)["channels"]:
                            formatted_messages=[]
                            for x in channels.get(channel_id)["messages"][-100:]:
                                if x["sender"]==user_name:
                                    x["sender"]+="__owner"
                                formatted_messages.append(x)
                            await websocket.send(json.dumps(formatted_messages))
                        else:
                            await websocket.send("false")
                    else:
                        await websocket.send("false")
                else:
                    await websocket.send("false")
            elif message[0]=="meeting":
                project_id=message[1]
                project_data=projects.get(project_id)
                project_data["meeting_id"]=message[2]
                projects.set(project_id,project_data)
            elif message[0]=="send_message":
                if connections[id]["auth"]==True:
                    print(1)
                    project_name=message[1]
                    channel_id=message[2]
                    data=message[3]
                    user_data=users.get(user_name)
                    if project_name in user_data["projects"]:
                        print(2,channel_id,projects.get(project_name)["channels"])
                        if channel_id in projects.get(project_name)["channels"]:
                            print(3)
                            channel=channels.get(channel_id)
                            now=datetime.now()
                            channel["messages"].append(Message(user_name,data,now.__str__()).json())
                            channels.set(channel_id,channel)
                            await websocket.send("true")
                        else:
                            await websocket.send("false")
                    else:
                        await websocket.send("false")
                else:
                    await websocket.send("false")
            elif message[0]=="text":
                print(await recv(id))
            elif message[0]=="load" and admin:
                await websocket.send(str(len(connections.keys())))
            else:
                return
    except Exception as e:
        print(e,"\n",id)
        import traceback
        traceback.print_exc()
        if id in connections:
            del connections[id]

print("Tunnel on",tunnel.url())

def adder():
    while True:
        prev=nodes.get("nodes")
        requests.get(tunnel.url(),headers={"ngrok-skip-browser-warning":"true"})
        if tunnel.url().replace("https","wss") not in prev:
            prev+=[tunnel.url().replace("https","wss")]
            nodes.set("nodes",prev)
        time.sleep(5)

async def x(w):
    print(w.id)

async def main():
    async with serve(client_thread, "0.0.0.0", 8080):
        await asyncio.Future()

def commands():
    while True:
        command=input(">> ")
        if command=="connections":
            for x in connections:
                copy=connections[x].copy()
                del copy["object"]
                print(copy)

threading.Thread(target=commands).start()
threading.Thread(target=adder).start()
asyncio.run(main())