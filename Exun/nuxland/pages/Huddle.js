import { useEffect, useRef, useState } from "react";

import { HuddleIframe, useEventListner, iframeApi } from "@huddle01/iframe";
import axios from "axios";
import { connect_ws, is_opened, recv, send, set_is_opened  } from "../ws"

import { Text } from "@nextui-org/react";

import bg from "../public/bg.png"

export default function Huddle(props) {
    var [is_opened__,set_is_opened__]=useState({"opened":false,"auth":false})
    connect_ws(is_opened__,set_is_opened__)
    const [roomId, setRoomId] = useState();
    const roomIdRef = useRef(roomId);
    const [isLoading, setIsLoading] = useState(true);
    const [loadMsg, setLoadMsg] = useState("Loading meet...");
    roomIdRef.current = roomId;

    async function CreateIframe() {
        try {

            const response = await axios.post(
                "https://api.huddle01.com/api/v1/create-iframe-room",
                {
                    title: "nuxland",
                    roomType: "VIDEO",
                    muteOnEntry: true,
                    videoOnEntry: true,
                    roomLocked: false,
                    // tokenType: "ERC20",
                    // chain: "POLYGON",
                    // contractAddress: ["0xADC327CC02d3230af723C47eCd91a73F600d7E3A"]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "OxC_j5lHrItXsoklp2mGSpSJ14tvTBE0",
                    },
                }
            );

            setLoadMsg("Setting up meeting link")
            setRoomId(response.data.data.roomId);
            await send("meeting/"+props.project+"/"+response.data.data.roomId)

            setIsLoading(false);
            setLoadMsg(null)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
            if (props.id=="") {
                await CreateIframe();
            } else {
                setRoomId(props.id)
                setIsLoading(false)
                setLoadMsg(null)
            }
        })();
    }, [props.id]);

    useEventListner("lobby:initialized", (data) => {
        iframeApi.initialize({
            redirectUrlOnLeave: window.location.href,
            background: window.location.origin + bg.src,
            logoUrl: "https://www.rainbowkit.com/rainbow.svg",
            wallets: ["lens", "metamask", "phantom", "walletconnect"],
            isCopyMeetingVisible: false
        });
    });

    return (
        <div className="iFrameWrapper">
            {
                isLoading
                    ? <Text>{loadMsg}</Text>
                    : <HuddleIframe
                        className="huddleIframe"
                        roomUrl={"https://iframe.huddle01.com/" + roomIdRef.current}
                        height="700px"
                        width="100%"
                    />
            }
        </div>
    );
}