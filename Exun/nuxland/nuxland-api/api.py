import flask,json,litedb,traceback,threading
from flask import Flask,request
nodes=litedb.get_conn("nodes")
app=Flask(__name__)

import asyncio
import websockets
working={}
i=0

async def ping(url):
    global working
    load=0
    try:
        async with websockets.connect(url, timeout=5, close_timeout=5) as websocket:
            await websocket.send("load")
            await websocket.send(nodes.get("admin_token"))
            while True:
                data=await websocket.recv()
                if "solve" not in data:
                    load=int(data)
                    working[url]=load
                    await websocket.close()
                    return True
    except:
        traceback.print_exc()
        return False

def chalu(x,y):
    global i
    asyncio.run(x(y))
    i+=1

def make_response(data):
    if type(data)!=str:
        data=json.dumps(data)
    resp=flask.Response(data)
    resp.headers["Access-Control-Allow-Origin"]="*"
    resp.headers["Content-Type"]="application/json"
    return resp

nodes.set("nodes",str([]))

@app.get("/")
def main():
    global i,working
    working={}
    i=0
    nodes_list=json.loads(nodes.get("nodes"))
    for x in nodes_list:
        threading.Thread(target=chalu,args=(ping,x)).start()
    while len(nodes_list)!=i:
        pass
    nodes.set("nodes",json.dumps(list(working.keys())))
    to_check=list(working.values())
    if to_check==[]:
        to_check.append(0)
    best_node=min(to_check)
    for x in working:
        if best_node==working[x]:
            return make_response(x)
    return make_response("")