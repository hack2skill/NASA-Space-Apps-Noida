import Head from "next/head";
import { Text, Link, Navbar, Spacer, Divider, Button, Input, Card, Row, Grid, Modal, Checkbox } from "@nextui-org/react";
import { connect_ws, is_opened, recv, send, set_is_opened  } from "../ws"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

export default function Home() {
    const [project_create_modal,setProjectCreateModalVisibility]=useState(false)
    var [is_opened__,set_is_opened__]=useState({"opened":false,"auth":false})
    connect_ws(is_opened__,set_is_opened__)
    const [auth_type,setAuthType]=useState("login")
    const [first,setFirst]=useState(true)
    const [selected_feature,setSelected_Feature]=useState("Projects")
    var profile_base={
        "name":"",
        "id":"",
        "address":"",
        "skills":[],
        "projects":{},
        "respect":0,
        "image":base_img,
        "date_joined":"",
        "invites":[]
    }
    const [personal_user_data,set_personal_user_data]=useState(profile_base)
    const [profile,setProfile]=useState(profile_base)
    const router=useRouter()
    useEffect(()=>{
        var timeout=setTimeout(async ()=>{
            clearTimeout(timeout)
            while (is_opened==0 || is_opened["opened"]==false) {
                await new Promise(r => setTimeout(r, 100))
            }
            if (router.query.username==undefined) {
                await send("profile"+"/"+cookie_get("username"))
            } else {
                await send("profile"+"/"+router.query.username)
            }
            
            console.log(router.query.username,"!!!",router.query)
            
            var data=await recv()
            var parsed_data=JSON.parse(data)
            if (JSON.stringify(parsed_data)!="{}") {
                console.log(parsed_data)
                setProfile(parsed_data)
            }

            await send(((selected_feature=="Open Projects") ? "open_projects" : "profile") +"/"+cookie_get("username"))
            var data=await recv()
            var parsed_data=JSON.parse(data)
            if (JSON.stringify(parsed_data)!="{}") {
                console.log(parsed_data,selected_feature)
                set_personal_user_data(parsed_data)
            }
        },400)
        return ()=>{clearTimeout(timeout)}
    },[is_opened["auth"],is_opened["connected"],selected_feature])
    function get_feature_ui() {
        if (selected_feature=="Projects" || selected_feature=="Open Projects") {
            return (
                <>
                <Spacer y={.5}></Spacer>
                <div style={{"marginRight":"2vw"}}>
                    <Button css={{float:"right"}} onClick={()=>{
                        setProjectCreateModalVisibility(true)
                    }}>Create Project</Button>
                </div>
                <Spacer y={3}></Spacer>
                <div>
                    {Object.keys(personal_user_data.projects).map((x)=>{
                        x=personal_user_data["projects"][x]
                        return (
                            <>
                            <Card isPressable css={{}}>
                                <Card.Header css={{width:"100%"}}>
                                    <div style={{width:"5vw"}}>
                                        <img src={base_img} height={"40vw"}></img>
                                    </div>
                                    <Spacer></Spacer>
                                    <div style={{width:"10vw"}}>
                                    <Text h3>{x.name}</Text>
                                    </div>
                                    <div style={{width:"20vw",marginLeft:"25vw"}}>
                                        <Button css={{width:"20%",float:"right"}} onClick={async ()=>{
                                            if (!((selected_feature=="Open Projects"))) {
                                                window.location=window.location+("/chat?id="+x.name)
                                            } else {
                                                await send("send_invite/"+x.name)
                                                console.log(await recv(),"send_invite")
                                            }
                                        }}>{(selected_feature=="Open Projects") ? "Join" : "Open"}</Button>
                                    </div>
                                    {(()=>{
                                        if (!((selected_feature=="Open Projects"))) {
                                            return (
                                                <>
                                                <Spacer x={.5}></Spacer>
                                                <div style={{width:"20vw"}}>
                                                    <Button css={{width:"20%",float:"right"}} color={"error"}>Leave</Button>
                                                </div>
                                                </>
                                            )
                                        }
                                    })()}
                                </Card.Header>
                                <Card.Body>
                                    {x["description"]}
                                </Card.Body>
                            </Card>
                            <Spacer></Spacer>
                            </>
                        )
                    })}
                </div>
                </>
            )
        } else if (selected_feature=="Invites") {
            return (
                <>
                <div>
                    {profile.invites.map((x)=>{
                        return (
                            <>
                            <Card isPressable css={{}}>
                                <Card.Header css={{width:"100%"}}>
                                    <div style={{width:"5vw"}}>
                                        <img src={base_img} height={"40vw"}></img>
                                    </div>
                                    <Spacer></Spacer>
                                    <div style={{width:"10vw"}}>
                                    <Text h3>{x.project_id}</Text>
                                    </div>
                                    <div style={{width:"20vw",marginLeft:"25vw"}}>
                                        <Button css={{width:"20%",float:"right"}} onClick={async ()=>{
                                            await send("accept_invite/"+x.project_id+"/"+x.username)
                                            console.log(await recv())
                                        }}>Accept</Button>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Text h3 color="primary">{x.username}</Text>
                                </Card.Body>
                            </Card>
                            <Spacer></Spacer>
                            </>
                        )
                    })}
                </div>
                </>
            )
        }
    }
    if (!is_opened.auth) {
        return (
            <>
                <Head>
                    <title>Nuxland {is_opened["auth"]}</title>
                </Head>
                <div style={{height:"100vh",width:"100vw"}} className="wrapper">
                    <div style={{padding:"4vw",width:"62.5vw",backdropFilter:"blur(0.55vh)",border:"solid 1px #222",borderRadius:"20px"}}>
                        <div>
                            <Row css={{width:"100%"}}>
                            <Text h1 color="primary" css={{width:"80%",marginLeft:"10%"}} className="vertical">Nuxland</Text>
                            <div className="wrapper" style={{width:"10%"}}>
                            <img src="whiteVector.svg" height={"50px"} width={"100%"} style={{float:"right"}}></img>
                            </div>
                            </Row>
                        </div>
                        <Spacer y={.5}></Spacer>
                        <div css={{marginTop:"-2.5vh"}}>
                            <Text h2 className="vertical">{(auth_type=="login") ? "Login" : "Register"}</Text>
                            <div className="wrapper">
                                <Input underlined id="username" placeholder="Username" width="75%" bordered></Input>
                            </div>
                            <Spacer></Spacer>
                            <div className="wrapper">
                                <Input underlined id="password" placeholder="Password" type="password" width="75%" bordered></Input>
                            </div>
                        </div>
                        <Spacer y={1.5}></Spacer>
                        <div className="wrapper">
                            <Button onClick={async ()=>{
                                var username=document.getElementById("username").value
                                var password=document.getElementById("password").value
                                send(auth_type+"/"+username+"/"+password+"/"+base_img)
                                if (await recv()=="true") {
                                    cookie_set("username",username)
                                    cookie_set("password",password)
                                    cookie_set("logged_in","true")
                                    set_is_opened({"opened":is_opened["opened"],"auth":true})
                                } else {
                                    cookie_set("logged_in","")
                                    set_is_opened({"opened":is_opened["opened"],"auth":false})
                                }
                            }}>{(auth_type=="login") ? "Login" : "Register"}</Button>
                        </div>
                        <Spacer></Spacer>
                        <div className="wrapper">
                            <a onClick={()=>{
                                setAuthType((auth_type=="login") ? "register" : "login")
                            }}><Text color="$accents5">{(auth_type=="login") ? "Register" : "Login"} Instead?</Text></a>
                        </div>
                    </div>
                </div>
            </> 
        )
    } else {
        return (
            <>
                <Row css={{height:"100vh",width:"100vw"}}>
                    <div style={{height:"100vh",width:"31vw",backgroundColor:"#000",padding:"1vw",borderRight:"#111 solid 0.1vw"}}>
                        <Spacer y={2}></Spacer>
                        <div className="wrapper">
                            <div style={{borderRadius:"50%",border:"1px solid #fff",padding:"4vw",width:"15vw",height:"15vw"}}>
                            <img src={base_img} width={"100%"} height={"100%"}></img>
                            </div>
                        </div>
                        <Spacer></Spacer>
                        <div className="wrapper">
                            <Text h2 css={{letterSpacing:"$wide"}}>{profile["name"]}</Text>
                        </div>
                        <Row>
                            <Card css={{padding:"$2"}}>
                                <Card.Header>
                                    <Text h3 css={{fontWeight:400}} className="vertical">Date Joined</Text>
                                </Card.Header>
                                <Card.Body css={{"marginTop":"-4vh"}}>
                                    <Text h3 color="primary">{profile["date_joined"].slice(0,"2023-10-08".length)}</Text>
                                </Card.Body>
                            </Card>
                            <Spacer y={.5} x={0.5}></Spacer>
                            <Card css={{padding:"$2"}}>
                                <Card.Header>
                                    <Text h3 css={{fontWeight:400}} className="vertical">Respect</Text>
                                </Card.Header>
                                <Card.Body css={{"marginTop":"-4vh"}}>
                                    <Text h3 color="primary">{profile["respect"]}</Text>
                                </Card.Body>
                            </Card>
                        </Row>
                        <Spacer></Spacer>
                    </div>
                    <div style={{height:"100vh",width:"69vw",backdropFilter:"blur(2.5px)",padding:"1vw"}}>
                        <div style={{height:"7.5vh",width:"100%",backgroundColor:"#000"}} className="wrapper">
                            {["Open Projects","Projects","Invites"].map((x)=>{
                                return <a style={{marginRight:"2.5vw"}} onClick={()=>{
                                    setSelected_Feature(x)
                                }}>
                                    <Text h2 size={30} css={{fontWeight:600}} color={(selected_feature==x) ? "primary" : "white"}>{x}</Text>
                                    </a>
                            })}
                        </div>
                        {get_feature_ui()}
                    </div>
                </Row>
                <Modal
                open={project_create_modal}
                onClose={()=>{
                    
                }}
                width="50vw"
                >
                    <Modal.Header css={{margin:"1vw"}}>
                        <img src={base_img} height={"50vw"} width={"50vw"}>
                        </img>
                        <Spacer></Spacer>
                        <Text h2 className="vertical">Create Project</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="wrapper">
                            <Input underlined 
                                bordered 
                                placeholder="Project Name" 
                                width="70%" 
                                id="project_name"
                            ></Input>
                        </div>
                        <div className="wrapper">
                            <Input underlined 
                                bordered 
                                placeholder="Description" 
                                width="70%" 
                                id="description"
                            ></Input>
                        </div>
                        <Spacer></Spacer>
                        <div className="wrapper">
                            <Button css={{width:"50%"}} onClick={()=>{
                                send("create_project/"+document.getElementById("project_name").value+"/"+document.getElementById("description").value)
                                setInterval(()=>{
                                    (()=>{
                                        window.location=window.location
                                    })()
                                },100)
                            }}>Create Project</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}























var base_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAF+CAYAAADKh3IsAAAABmJLR0QA/wD/AP+gvaeTAAAp2UlEQVR42u2dB7gcVdnHB0GKIE1AEAEVRVERRUGkCZ+fqIDCh8SCgBE0mLKzs0kkoghRUKr0jnQp0nsngPROaKEHEghJ7s6ZvbmkEJLc75wzN+EmuWX37uycd2Z+v+d5n+ijkNk97/nvmfe8xfPSZmhtDWuV9jW94dFG3uCJK3oAAJAAo6eu7PlqF6+sjvLK4dX6z2e1zdbW2YNVtT2n//836D//pG07r9S5Al8iAEA9p1k/KmuhvUuL55xeRLZe69D/rnM9P9yGLxYAYEnK1S212J6nxXJWk2Lbmz2tbTe+aACAkW2baEG8vkVi25M96AW1LfjiAaB4lMJV9Qn3BC2Ec1MU3YX2gY4FH0EMGACKQ6X2LS1+rzkQ3MUtUM94pdrGLAgA5JjOZeKLs6YvzZK0SAvwrqwNAORTdMvqFEGC290W6LDHKNYIAPLDoM5ltbhdLFR0u9vfWSwAyInoRldkQHQXxn2PZtEAINvYqrOMiO6H4nssCwcA2SSI9ozjpxkTXmN+dBgLCADZolJdXwvYjEyK7iLjwg0AshViuCzborsw20Htw2ICQBZCDDvmQHQXms45jnZgUQFA+ml3XI6E11jNq6jNWFgAEHra1Q1o8iW6CzMd3vRGd6zDAgOAxNPuhbkU3tju98Z2Ls8iA4AczAiesmrPsfDqk294AQsNAILCDDZvtzP3Zhr9AAAQZki5n28p3JkFBwAJwjupIMJrTNHLFwDcYkSoOKK70MbbScgAAE4I1K8KKLzGLmXxAcBVmOGoggqvtsjHAQDAhfDeXFzhtQM7t8MJACBt4Z1QYOE1p96ptiMbAECKwttRbOG19jCVbQCQDkNrayC6i+wUHAIA0jjtfg3BXayy7Tc4BQC0Fl/t4kjkboz75YoT31m6fPrrOAYAtPDEG+3nqGHNXp4f/lCk+Jo2kqNmrIVzAECrQg0jnIhbKdza/v1xc575Ak++t+rLto/gIADQihPvIU6EbXi0Ubdn8IUOzPwrDgIArRDe45yI2hi12hLPcbzIgZlBtAdOAgDJ4kfnOBG0JV/jzX/3oytFdjKr1D6HowBAgideJ6Pcaz0+y5ApH9P/21MCxfcprzJ5JZwFABIS3vAaB0I2qdfnGRluYEt45cV7z8dZACCpE+8tDkTslT6fKQi/IzTH90AcBgCSOPHe5UDAnuv3uUwFmTzh1T8G1S1xGgBo9sT7gAMBe6KuZ/PVqQLFd5JX6lgbxwGAZk68jzsQr4fqerYhnR/V4vtfgfHeu71BncviPAAw0BPv0w7E6566n29E26f0//9dec101BE4DwAMVHifddAB7M6GntEPt9H/3PsCiyv2xIEAYCDC+5yDiQ93NPycQRQIjPfO8EZUv4QTAUCjwvu8g+5ftw/oWYPwAoHi+6wt/AAAaEB4X3AgVrcN6FlN9ZjMyrZLcCQAaER4JzhpuThQgugz+p+vChTfYTgTANQrvC85EKmbm3zm3QT28J2rQyjb4lAA0D9+9LIDkbqp+R8M3StX3ql3ihe0rYdTAUB/p8dXncxbaxbTRtKcnOWJ7zj9bMvhWAAgS3h9dUMiz15pX1P/+94QKL5H4lgA0Jfwvu5AmK5P8PnNePqZ4ooryuFPcS4A6E24JjoQpmsT/gz7iCyuCKqb4mAAsDRmlHn6TWauacHnOEug+D7njZ66Mk4GAEueFt9yILxXJ/45Sp0r6FLkxwSK72U4GQAsKbyTHPRquKoln8WMjC+rNnmdzKISjgYAboXXTBNuFaVwZ/13zBNXXGE6rAEAdAnvZAcn3ita+5miQwSGHN61vYUBAHIpvF7nMo6mJ/ffAJ7iCgDIp/B6ppnO6o6q8vqzY3A6AIQ3n8JrqKjNhBZXDMLxABDefApv/Pn2Fnjq7dCXgF/G+QAQ3nwKb/wZTxcovi9p8V0VBwRAePMpvLa4Qj0iUHwvxwEBHGE7HE77pG7a9VXPr33TWina3Bs2fV2ENylGhhvov3u6OPE1QzwBoHWMmrGW3mc7aoH9vb5fOckO240rdvvK958TNxDTWhWoockPtS2K8Br82vdEFleU1XbsDoAEMNlM8T4fYwu1ku1F84b+d/5Fhwg/nYTwvu1gyvB/3C2MOlheyCGaSnEFQIMM6fyoVwm/ok+yQ/S+vqhrcO/8VA5L5u8b2bZJtoTX1YnXoosrAnWdwHjvfRRXAPTCoM5lbSw2CPfXe+UMbU92vS263LMfaC07TseEV+HEWw9j1Go61vOKwJPv8ewwAC+eJu6HP9Nacaw9lJgUTHmHpYU2SYcgdkJ460FqcYVxNoAiYS6/fLWLFq/D7CBciZfg/ds8+/wmUwLh7Tfe+0uRxRUmbgWQR8xgAHOZ7EflbnHZBRkU2t57jQ+euCLC2//nP0XgAk7wDmr7OLsUMo25syhF39D+fKAOo/1L/zleYFZRK8T3bq8yeaX+hOedQhcOmJvRsrpfXn6vvgA0F4EAWcFk5lTUj7X/HqXtAYGhvDTva+6whVucePuK91bX179S0wT+co5iN4NIgrb1tLj8RPvo4Xo/3679VRVXZHvdv+dx4u3XkXRli00PEbV4H+hXte+yy8EpJl1q6bgswlrXtB1dLSdGeKWdeBfiq4OYXAEFj8sur98At9J7dLjOmb1A+9+LKRUl5NXm9NyJkBNvN3RM1ZQZylu8h+2GAEg8zFb7nA4Z7Bf3MLBx2dmIZeL2iC0AQXj7wLRqNC0b5cWLTkIloClMo6gg2rPr8muctnZEMa23fF1xt4TwTkF4l3wLaPuiTKfUJxOA+g8Q3eOyExFAp/ba4i0BEN5exDf8ucDFe8/WqwN0x12zGKwx24dQQz0E4Ynybkmjl5lcUWBMrLCsvqYPBgfoP8/U9pTAbBysZxvv+sR7WUZueJfTp4j/ClzA6ymuKAgLixKCcKxe9xu1RQhYhm1RQ3WEt2/MGBA3bwX95QcehCrlDNs1T8dlTRNvK7ISi3qwJu1PxHjrvqjQRQwSiysabkUHgn7QdVFCtIPuRjfa5rVz+VWQgoroUU68jV22jRKYYjYtmTEk0PKQlbn8Wjxf9n2EqJA2N26gg/A2cNlmTybykrP7bMYBzuKyHzaLmYXgYB9a9dsIbyOYVo1xCaW0eO+pqJ1DkfWj3fUaHNE1vZbLL6yO/g2mFwDC20DIQWhxRRANRgVT+eGlWQzWrB3lSngvzfQGDKI9BHbNn22bTkPycdlAnUVRApas/hFqGBh+9E+Bl22v2JQkaFRkP2I7SJm3hrI6TYvtYwIm2GK57dug7uXE28yJyHyB8uJHN1BcUefl14dFCSGCgKVoTyC8TcV7p33SyQSP/n9RD0Zdu+jeLKYcXeHI3zFs8ZmKCG+z8d7wOwJzMnUsMvxB4UTWNIvxa9/M7wRbLCc2CeFN5rItELi4023/1TxffpWizfUP32/1Zz1bC+0zNIvBGrS3HLUDCBHexMIOugxaYnliXoorSrWNdfz6FzpccLwXT4WeiXBgDZ0yy+pa7T+H6B/pH3mjO9bp2rdnOslAQngTIh4IKDGv84yMxs530+GSv+o/b9VWRTiwBqxq/SYI/xb7kfan3g9MZzh4vvf1XxxNdfAXX5LL19+RbZvoz1YTePL9jfAfrO2Iy2ID7n1gsgRsDwydc21yrxvJ6imr0508M8KbeH7v7iKLK4LaFqKKEuJmMXrDqHmIB1anzbM/zOYH2map6B/sZofAmnJ7F50FEd6WxHuPEZhi9qY3fMYnUs+XLYeDunXkolkM1ohNsXnWJt+6Uv1fb8iUj7Vgr57i5AcE4W0BdjyLbZgizZFvslVa6RQlEJfFGrFIn2LvjEVW+1GpY+10Dkn2UJB+uifCW7DiCnOr23z63Or2BGK66dubYoETOjDJNkPbPfbNMAj30n9u6DAP38VcxQWeo/Ei+RfeuGpqa5HFFSadppGiBCbYYs3EM7vHZU2Bi3kjlFMAdaKjEy/C2+LLtpLAzRB6I2qf7TFEsvSkhNmIB9ZYXFaXZi+8/LLTFiS/mToJNRDjTemy7RKBncwe9/z2L9jLr0Ad29XwpwPhwBowHUoLr7G9Qfza9zLZGc+d8Do48frq34USXvOrX1ZPsVGxjMdlH1iUL9vTG1M2D0WnOAm/ILxphRzM6VJgcQWG9VyU8ELcAL6rKKFV2TDFFN65CG+qJ187AJGqLEx2UcLgiSsW50DkpIDifYQ3/V/YI9nsmIyiBH0QGFpbwysyduIIwpt/zCtboG5HALAUrNaVmXJU/LbVR7MYhDdNm+PZvq0Ib7qY0t2ymogwYAnae4tdfjXaLKa4wuuiSc5shNdZvLe6lf3lQzCwZosSkmgWU1zhPaM4wltWF7PidtGHISJY3XHZshpjRbYVzWIQ3jRtFsLrfOHD8xEWzHmzmOIKr4sJFDMRXteY1J2yehLBKaR1LB2XhVSxucoIb0EXP/oMbRQL2Cwmr0UJCG//F6EIr5hXnt3o+kWzGEh9353t5E0H4RWEr45AsHJQlJD2pA9oYs9F57gS3jaEVwjm1TOeqouYybX2XDaLQXjTbTiE8Aqj0r6m/n7eQOBoFgNphBqifzn58XYivOaCAfq6bPu6x2BI981iSp0r4Iy5P/Gei/BC96D/gYghzWKg1fssPM9JDw1CDaLF9yEEMhEzF8g369PNYfoCcxeKEsCx8EaceMXGes3sM5v7iXDSLAZaJ7wuKkcVwiv3tHsPIkqzGGj1fUp4AcILC3+FByGqNIuB3Apv6DkpVUV4+wgx2MGY9Opd8vJr1Iy1cA5owZvlhQ58u+pGeM2HhV4cITq08BNsaRYDqZ149SEQ4S36abe6ftflUEHismoIRQlQQOFtQ3hlvfZcmkOhfb2wE2whC3vuYifpjcR4heCH2+Rg9Pu7OlRwlT7JHqSFdifvoLaPs7CA8EoRXk68i2Ob40SP5eB0+yyZBpCtA4+e/5j6PtGT3RFeCb+64QE5Ci1cwoJChk68l6S/R6Kpns0pQ3jdYV7H49Sp/MR1AzWUhYWMCO+lCG8RCdSxuWynGKhtWVxAeHu5C3EivKZaBDyvVNtYfx9zcpo2NolmNJAB4b3MSXEQwut00W/Kd85ueLc3qHNZFhoE78HLEd4iUan+byGq0nz1D3Y3CA71/cfBvngH4XXB2M7l9PfwfEHKgRfoiRp7ssMB4V1kbyO8Tl5vwkrhejGMqH6JXQ7y9mJ0hYP9MBnhTRtz4WQ60BevEc6z3uipK7PTQRR+dKUr4VUIb6qvNmcVuNXjpex0QHh1xg/Cm6bo2unB8wreZ3cYux0EhRqucrAH3nIjvGbOUTFPu/fS4FwXV5guZQAihDe8GuHN9wL/HNHtlscYtK3HrodCCm+g3kR404BxPj3ZOJtWB+BWeK9x4PsTEd50AviHIbQ92pHsfHArvOpahDePjAw30J95pgCRm9Vl0oor9mD3Q8GE9w2Et/ULe5kIkTPTegP1K5HFFUF1UxQAnBCo65yMw3KTzF8Q4ZUzzmfyouKFsjpToPg+R3EFODoYXV8k4T0v9wsqaZyPr36x6LmGdH40HqUuTnwvQwWgIML7GsLbsleY8LdCBO1Bz+tcpoe483SB4jsCJYB030rVDQ78/FWEtxXE43zeFSBk871ydcuefxhq/yOwim6uV1HbowaQ4on3Rgf69wrC25LFjI6TEWKIzunnYuHPIkfEU1wB6QnvTQhvHqi0f17IOJ8Z3rDp6/b9sDoE4aZksj+7h+IKyK3w+tHLCG/yC3mzkLE7oxoIi0wQOKn4aFQBcrpfXzJ/cQ3hTWoRw+8LEa5XvVLnCvWf0tVmQoo8liiuCPdCGaDFwnsLwptl4jStl4Skj+0yAAfcW2DIoYPiCsih8E5wI7x+dG7uFjAIR8oQq+iOJpzwdIHi+5JXCldFIaBFwnurA59+EeFNgtEd6wgZ56N73bZ9sclTu8TiistRCGiR8N6G8GZ38c4Wkj72z6Y/Syn8tMziishHJSAnwvsCwtu0UEXfkFGIEE7Tnb5WT+Qz+dFOFFdAIQjU7Q58+XmEt/lfzPuEpI/9LmGHPFhkccWItk+hFpDc/tV3IghvxjDNZ2QI0lPeoM5lk/1wprjCySDA/ntPmFg0QHaF9zkjvO0I7wAw43zM7CQZ8c8dWvIZ5RZXHItiQEJhtTsd+PCzCO+AX8V1Y/EitFOMiyveE1dcUQ4HoRrQ/Ik3vKs4wluO/pXpxYpv/iWI0SxveLRRChcQvxRZXFEKv4xyQAaFdzzCO6DF0nmlMtLHDksxnn0qxRWQQ+G920Go7BmEt2EBEjjOJw3i4or7Ka6AfAmvGufAZ59GeBvBjvMJHxeSPvbz9OPauk9uWU2Rd9kWBSgIDFB470F4xZ921RAhYvPAUuN8UvsObHHFB8LE94OWZXYAwtuK9E+Et05MLFHKOJ9K7VuOnXWMwJLiqRRXQONvcepeB/76pGcnFSC8dYhNdLyQHNaz3H8Z+rTtR1cKjPc+pMNBy6Mm0MAh4r7iCG9/s8CkEY/zeV+AsLT3P84nJeLiihfFiW8SjYIA4W2tPYHw1rc4twi5UKuI+l5GVL/k5o2pP/8Kf4aiQH13Fuq/Dvbx4whv/zGgXcWM85H4Gi2nX8XixRWV8CuoCtRxqLof4ZWGETop43wC9SPBP04nCww5vExxBcgU3ugxhLfP01w4WoiQ3CT6ezLFFU5e2fq1a52l3UFWhPcBB/r3KMLbG/E4n5oA8Xi/qXE+aWEu/UQWV+hZeAC9C++DCK+oBdEpb7RAbDDkEO0osriiFH0XhQExwltWj3j2IgLhXZx4nM98EeN8xqjVMubIfxBZXFGpro/KQA/++pADn3zYjfCa4ZCyF0PKOJ8DsufJdnLFFRRXQEaE92GEV8Trspjes0/ZpjxZZNj0VewkVXHiG56A0oAA4X0I4e1OEcb5pObQ+kLQSR+QfsNc+6I20E14H3EyNxDh7b4I4V+FCMSl+XBq3bqS4gqQjMkwcNJdEOGNGRluoJ9rZmHG+aQWuglPFFlckbVLS2jR4UAXMyC8TmO7/xESYjg0V449tnM5kcUVgbqO4gpwJLz3e46GNp4tTHS3FTLOZ5I3ZMrHcufccXHFOwKb6YxGeYouvA4mypiDSOGF147z0W3aZNy653dkeTyrbq4w8Z2nv/Pvoz5FFl4He9+Z8Ipo5r3oiz+w8ON80jtdjKK4AgovvKZOoNDCK2mcj1/7Zv69XP+wiImlL5HQTnFFUYX3SQf6d2+xhdck1MvY+GcWxtHlFlechAoVUnifQnjTJJ6eICHmGHmljrWL5exCiyvK0X4oEcKbgt1TXOGVMs4niIJCOnwQ7SEkk6S7vacvPr6KGhVKeJ924Gfjiim8ZbWbkI0+wTYRL6zTC5ncvHjI4RWKK4p0AFDPuBLemYUSXnOJYiqXGOfjHlNcIaYT3GJ2PcUVCG8Lf9zvLp7wSukX66sb8HqzHtM+KbO4Qh3E4hQi1DDegfDe5UZ4Xd3iSxrnM7JtE7x+4akj/E484ojiCkhdeJ9FeFuNH50rZFMfg8cvuQHCisB47zSd6/1pFgfhTbhJ053FEV7G+WQh3kZxBaQtvM85SFu8oyDCqy9KpHTICsL98fZeiIsrnhfYyexkFie3wvu8A3+6vRjCW1Z7M84nI5jYt8zJFb9mcXIpvC8gvK3AjPMpq7cEbN4FXkVtj6fXFYvfXWBxxSwbrgKEt3m7zbMOlWfhDcK/CUlP+jde3siGiI6juAJSEN4XHfjSra6E94x0XlsFjfMpqw3x8gYwxRWmmYi8/N4bKK7IlfBOQHiTf2W9Ukh88C94+EA2hS2ueFtgpsMYFgfhbcJuya/wltV2jPPJATKLK+br/N6dWZxcCO9LDvzn5nwK76DOZR01v+gpfWwvvLvpN5eywFNvVXdY+wyLk3nfehnhTezLVL8XsjnvJx6Y1MlXXSRQfB/xSp0rsDgIb4N2U/6Ed2htDf3vbxNR61+KNsezE2L01JVFFlf46lQWJ8uhBp2pkr7f3GiEd3auhDcITxSyKc/Aq5M+nbR/QUiToyWb2Q9mcTIb430V4W1adKubChnno7xRM9bCq1vyaiixuGI2xRUIb2MpiW6E9/QWfYm3CkkfK+PRLd0sxwiM976qT76rsziZ86XX3DTaz4vwlqOfCNmALxZ6nE8amKwV0+FJnvjeyGVq5oT3dYR3oEga5+OHP8SbUyBuai+vuCJQB7M4CG8/PnJdPoTXjGkRM6sLUqMUbi2yuKIc/oDFyYzwvuHAR67NvvDGZaWM8ykqflQSGHIIKa7IjPBOdNBs6ZocCG94npBXzKPxYmeb50KB/XsfpbgiAwTqTVfCOyezwhvUtpAxzieaSrtAh8Q9l58SePI9ncVBeHsQ3qszLLyCxvn40W/wYNchB6HFFfiG9LclB0MSoqtcCe9pCXxh+wjZXE8yzkfKJrIphfKKK8ybGUgV3kkIb72YNotSxvmY9pMgaSMdJTDkMNEbPuMTLA7C2/UWdGU2hddXRwjZUBfjucIwbx9mmKDE4grejCQK72QHJ94rsie8ZoSOjHE+MxnnI5S4uGKyOPEN1J9ZHHHC+zbCW18c7yo2EfTvJ9VvO/LtvosrqGxEeAP1n2wJrx/tJGQDvcU4nwwQqOEiiytG1D7L4ogR3ncc+MDlnqOSy8aFV9I4n3L4Uzw2K+IbXiBQfJ+2uccgQXinFEd4B9K1v6yGCdk04/DWDCG3uOJMFqewwntZNoRX0jifsvoa3po18W3/vF63SN5lW7g/i+NceN91sPaXZkN4y+FJQjbLaXhqVsVX/VhkcYVf+yaL41J4dbk/wttTjI5xPpDY6eZIgSlmb1JcUTjhvUS+8JbVbUJq7kt4acYxBQxS/GnJcd8UVzgS3nCaA/37t2zhjQcbMs4Hkoz3rummB2u/P+x/YXGcvAVNd1PxKlV4JY3zYaJAzsS3upXI4opA/YjFSV1421wJ71yRwltWfxQSg7sO78zlhhsmMORAcUURhDdQF3mOLq5O6fvLsON82kWM8zF9XiGv8b3zKa4ovPBWHazxhUKFV8yGOBLPzDGDJ65o+ynLE9+zWZzUhDdEeA0mr1HKOJ9SuCqemXPMUEo3px6KK4oqvKaMXZbw6nE+ZXW/kFvmX+OVhdl8u8n4sae4wsHaKweX9efLEl4/2leI0z9BXmXhNuDfRRZXULTT6nWPii28jPMBl8TFFbfKi/dGd9jOfJAn4T3P/MUfiBBeKScOm+oBhSQurnhDYHHFYSxOy4S35mA9z5UhvCZ30cS0GOcDzsWX4oqCCW97cYQ3UCcv/uHDq4U4+J/wRNAFPr8XmGKmvErtcyxODoS3HP3LvfAGtf8R4thv2LxOgPgwcJ7Ay7ZnKK5IXHhnODjxnuNWeM2lQVmNFxJH+z+8EBYhtbiCO4ikhbejeMIrZhhheDceCEsxPNpIZHFFOTyAxcmw8NrKRFfCyzgfyAKB2lVkcUWl9i0WJxHhfc+B/p3lTnhNZoOIEMMABm9C0eK9hwu8bHuL4opEhHemm0GnTtLJ9Ku9mzS2pdvwMXYF+sMUVwTqdoHieysVlghv9oxxPtAXw6avolN/dvD8cLStIJPow0E4loXKpvDOK6jwvsA4H1iEybCphF/RArtf11TrB5xMZxlIcYWvdmEBByy8Lgq3Ti+w8DLOp9CMaPuUHfluTox+dKejk09yxRWl2sYs6oCEdw7Cm57oXoPHFYgxajXb+Kisxmi70clk2dbbeNtoCrIgvKcVUXgZ55NnRk9d2YqsH5VtsYEJKcUd5wpwZ2HGhkODwuto2G/RhNdX/8DbiMvm2A7EMRoS3rkIL+N8oLG47HsFF9mebK4+6W+LswgWXtudUV5VTiuFdz88jbhsAWySV+pYGyeqS3gdtUwojvAyzkcqJq3PzBcrYly2lUVKTK6oR3jnIbwtHedT/TZeJjYuOweh5D6jMMJr/L4QwmvHKYPzuKwNGbiY6lpY0weO8Kc4YZ/CO9+BHp1YBOHtsJsfWo+5uFyYylWOrrCXmYifa5vhBdVNcc5ehXcBwtuaeMrBeFeL4rImZOCrIcRlxdtzNr8ZZAhvOTwh78L7OuN8EsLM+yIum2W7DCfuUXhdZFcd7+X6lBJEe+BZxGUxuvGJEl4/+meOhZdxPgOLy6p3EakcF1dU1PY4/UI6l0F4kx7nU1Gb4Vh1xWXnI0iFsne5bO7C5PW7CTUcl0/h7T4+nrhs97jsbIQH0/YgvagdCm+gjs2j8KpCjvNZOi4bIjBY36eugmOKeRDexD7U8Nw7zEFtH1+i9eEbCAnWcHGFH/6s4Cfe5Rx998fkTXhfsF9m3pxjYYmtGQtNXBZLsrjI+BbCm/bh8Oh8CW8p3DkXIYNyOIi4LJbSDfvLhW2VauLcDoU3L+ljV+cgLltFDDAHQnCdTa0q3ol3eUff+VF5EV7543yWjsu+wKbHBB1cRiG8qdmReRHevxOXxbCm7AOvFH23UMJb6lwB4W0mIdx1jGrpuOwsNjKWydFYler6hRFe08fFWZ/krF+u+dG+qS5W0Lae/jt311/eEdpR79DPELFhsbpbNJbVOBvjC6I99Z/XC3zGBwpTXOFYeLPsyA+39FJg2PRViMtiA351N/5i/Mb4jxlttOToqTjuP0FgvPekQghvZfJK7kKjWU4Ar1S3aklcNg4ZPEFcFmvApnRlpoyxP9ZmU9e1+XVPEYnTkv3o1/lPJ5vyMUcn3iMyLLzh+YmkcpnXPuKyWGMW2fHyJg3Q+FCzE30D9UuBn3GWvmz7BsLbEu063MtsrMzEWusPGawbi6z+wGV1G/1lsYaquwJ1ry3zDMK99J8btkQEyuoUgYebV7wxarXcCq+ZyoHwNmRjiMtiLY/LGj9K66LJjrhX/5UXclA35La4ItYKBwUr4d+yOPrndZt/13Nc9gHb7BkBwQYSlzWvnm6FYN2uZ5JW2XYwwpvoifevXtevfJbKGy+yw+JMT1Hislj9zj4tFtnoUN2V64depX1NkWIQRDsK3JPzdFbG93InvHFWCcKLYQnZe/Hbj3kL0m9DtgNXhl6Xy+oPAr/TUP8ofCZflWt27JWLUMNYj1dzLOM2b6m4rKnBzzRmFpidfyctxezRRWG+PGAuDt18j4d59taWzYtlKcZvRpWXw4qIuGxrX4MFFleoMxDeZISXqbKYVKt1XZgeZdMBR3es4xWJctsX9Wdvl3fPEu6fi+83iFZ31BPjUCO8r7LBMQE2N64WzGhctnXisIfAfiqzbQl01hlaW8PRifcvRnifZtNjxGUF40f/FJhd9Gbmh8o6FV6JSdtYPvNlF5bYmlc8qB+Trx5Xz0lrI3mHndSbVUxKoZvv7RBPaGs6LLtmxhfdYnMVA7Vr030MoHtxxTsCxfdQhHdgwnsKYoERl81E3unWnhlzJcsH5usf2B9l8vs0oRI339mfpCZrYzLjss/q+NS5+s8Ddbjg6/YVGFLOdIh8iisSYtSMtdwJr692QVSwfuOy5iIChIivulDgZdszmcupNmEwZ70vXP3lmCRr/7DEVs+OM/FEkEvczvA5gX50McJbl/1x4S/oW4hPYWy2tof0SfZE/cv7K89v/wJKlkFGtm0isriiHP4uOz9guiDHqfD60TkIUo5LbLvny+ap1p54708EFlfM8crVLbPx/U37pNt+4qZNHgKVv7is1NaHkGS890iBfjgpE2mEroTXVwfFD2C635ubSYQrSzZjsdaHeWvZB/VhJhfH46ykhRzuEl9cEedGOxReg4n5IWZSTb++6VH2gTpZ/7mPbZ5Cviwsfkk0SeDYoCNEf29mbqN74bUPwUQHiXHZwRNXRF2gTyrVrbp+oCX58QL9Jran2O/MTBp3Irzh6MUfxFenInrEZSGjBGqoyJDYiOqXEN6+hDd+kOmIYQv7y/rRnfrPv+s/d7ffN0Cyl20XCvT78SKLKyrV9R3Fv0ct/TB+tBNz2BKxbqPC1RDbx8BchAC0EhOWKqsnBe6HS+XFxsNPO2okP7K3X80xCOdAQgZ6ThZxWXDN8Gijri5x0sqKhyO8fQmv1GF7UuOyWW8IDXmM9+5qO4fJ62a3nZjvaGS4gaNQQ6X3hxo2fRX7qozIdnhLjQoHyEK8V/dElref3rUZVDLi4Ru6OfFGQT8PJnTYXipxWR0yMHOliMtCVomLK24RuM/uEdFS1JXwGm3p/+Gq39a/nNMKEZetTF6J3Qq5Ip4r9rrAeO/RQmLhQoXXUKl9Tv8DL+UqLmuaIAMUgVK0ucDiqAW2BanTOLgus3cz+sdvYPHCVfWv1FnEZQEyiB/tK3KflsIvF054/ag0gAUMfyasyKJr7pc6XX+Rg8mXBehVfCW2f33BXuS7YETts9kRXkPcAX+Mo4u3OGQQ//3EZQHqfmvVvZjL0WMCxfdaJ02f4hCqi887orkHN/0s/egw/S+a3KIHfFuHN66z45DL4Q+Y+wXQJFKLK/rMbUV4e8b03Syr3bSdMcBLOBMumKC//GsWXX5JyfUDyN3JN9xZZHFFRW2f7vdQ2zhfFXxxs53dbLckX/3DXsotNCvO4eE2iTiI9rC5wqYROwCkh32LFJh5lOaBq9L+eUqnASBFTFsA/YYpT3wf0pfjy6fyFZhBr26Edyj+B1BUgmh1LQSvCoz3noDwAkB+qajNtBjMlCe+Ov++1Yxs28TR6J/f43gARaes9hYYcnhPC9RXW/u5bS8aF5/tQJwOAIz4niYw5PCKN0athvACQD4xF1pmkrU88b2mZcUVZhacm1DDEBwOAGLsRAaRnQjHtOTzBtVNHf2Y/A5nA4APkTlzcb4t+kj8s+oYspvRP7/F0QBgSUE6SOCpt2q7iSVJnNHhQnj3x8kAYAl0TNWPrhQovo/YRj+JhVZsn2IXo38G42MAsDRyZy6elqDwfiO3OcoAkFFMb+t4qIAs8TVN3ZMgqG3h6DPsg3MBQO+Uw58LPPXOtoNom/5s1S0dPf/eOBYA9Ce+Jwgclvlm03MTK9WtHOXx/gKnAoC+MaPYy+o+gSGHO20v8IFSCrd289x6fBoAQP+nXj1txkyEEXfyDf824M/kh9s4eua9cCgAqI8g/I4WjvfFjYkPoj0H9mOiZza6SSfbE2cCgAbESs9Gk3fZNsOW/zb8WaIdHAnvHjgSADR48lUXCRTfCTpmu2pjnyPa0VEe709wIgBojNFTV9YC8nzmO5nFfSlcPOtuOBEADCDkYHvZtgu8bBvZQNjk+47SyXbBgQBgYPjR7vZyS5b4zrOCWg8V9WNHJ/Pv4zwAMHACdbTAkMM021u432fXaV0unq+itsdxAGDgxMUV4wQWVzzqDZ64Yj8/Gr9yI7y6Yg4AoClGd6yjBWWywEyHi/t87nJ4gKMT72Y4DQAkEHIQWVzR99igQA138kxmrDwAQDLi60jI+hsbZC7Ren7ePzt6pg1xFgBIUnwlFle09/h67+picPiMT+AoAJAc5kKrrJ4UKL7vLHXSDNRZTnpLNNNRDQCgRyrtn9cCEwkU3/GLlRWX1eVO+koAALRGfG1xwgKBaWZ3LhqYGah7HTzDJJwDAFqH6ZUr79Rr7BYrvmU10cmpGwCgZYzt/IgVOZnie622uQ7+3vtwDABoLUNra2ixeU2o+Mor6gAASISy+pq2mYiu7Ux2BA4BAGmJ794Ir7UDcQYASFF8w5M48YY/xBEAID2GdH5Ui8/9xRZf3UAeACDdU6/QMfHp2Eyq1gDADaVwa6GdzFptj7D4AOAOmZ3MWjwPTp3MwgOA47BDeF6xhDfak0UHALdUJq9kR/QUQ3jne6NmrMWiA4CAkEPbekLHBiUdZriXxQYAQeJb2yL3lW2BGspCA4Aw8VW/FNlGMhl73w4EBQAQh+ljkMvTbngBiwsAQulcRgvVhbkT3lK0OWsLAHIZ27m8Fqtx+RHe8BoWFQDkY+aiBeqZHAjvLG9E7bMsKABkg5HhBtlPM4sOYSEBIFv47V/oGsueReF9wIZNAACyd/Jt20SL2JSMie4k0scAINtUwq9oMZueEdFVtiAEACD74qs2kx92CKeROgYA+WJE26e0wI0XKrxT7MkcACB3xOPibxEmuuNssx8AgNwytvMjugx3rG216FZw5+m2locxzgcAikOgttXi95KjeO7jemLwNiwCABSPwRNX1CJ4uBbD91ISXV3UEe1nT90AAIVm2PR1dXezU7UwzmnZCTcI97dTMwAAoBvDZ3xCx13LyWQ/hK/EYl7dki8WAKAuEY420iK8rxbRs7U9qGPCb/ZyIl5g/zc/ulP/59O12A6huQ0AQJKUOta2aWkLzfQBTpn/BxgaiUiP9XqSAAAAAElFTkSuQmCC"