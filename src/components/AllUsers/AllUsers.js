import React, { useState } from 'react'
import { useEffect } from 'react'
import { IoPersonCircleOutline } from "react-icons/io5";
import './AllUsers.css'

import personImage from './person.png'
import { FaHome } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";

import store from '../../store';
import { useNavigate } from 'react-router-dom';


function AllUsers() {
    const navigate = useNavigate()

    let [allUsers,updateAllUsers] = useState([])

    const [windowWidth,setWindowWidth] = useState(window.innerWidth)
    const [searchQuery,setSearchQuery] = useState()

    useEffect(()=>{
        function loadUsers()
        {
            let base_url = process.env.REACT_APP_SERVER_BASE_URL
            fetch(`${base_url}/users/getNonFriends`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"userName":store.getState().userName})
            }).then(data=>data.json()).then(data=>{updateAllUsers(data)})
            // console.log("fetching all users completed");
        }
        loadUsers();
        // console.log(allUsers)

        window.addEventListener('resize',()=>setWindowWidth(window.innerWidth))
    },[])

    async function followUser(event,userName)
    {
        event.preventDefault();
        let base_url = process.env.REACT_APP_SERVER_BASE_URL
        await fetch(`${base_url}/chats/addFriend`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                "userName":store.getState().userName,
                "friendUserName":userName
            })
        })
        await fetch(`${base_url}/users/getNonFriends`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"userName":store.getState().userName})
        }).then(data=>data.json()).then(data=>{updateAllUsers(data)})
 
    }

  return (
    <div>
        {
            windowWidth > 600 ?
            <div style={{paddingTop:"90px",display:"flex"}}>


                <div className='all-users-navbar-main'>
                    <center>
                        <b>Friends</b>
                    </center>
                    <div>
                        <div className='all-users-navbars'      onClick={()=>navigate('../people')}>
                            <FaHome size={30}/>
                            <label>Home</label>
                        </div>
                        <div  className='all-users-navbars'     onClick={()=>navigate('../Notifications/requests')}>
                            <MdPersonAdd size={30}/>
                            <label>requests</label>
                        </div>
                        <div className='all-users-navbars'>
                            <MdPersonAdd size={30}/>
                            <label>suggestions</label>
                        </div>
                        <div className='all-users-navbars'      onClick={()=>navigate('../Notifications/')}>
                            <IoMdNotifications size={30}/>
                            <label>Notifications</label>
                        </div>
                    </div>
                </div>


                <div>
                    <input 
                    onChange={(event)=>setSearchQuery(event.target.value)}
                    style={{width:"300px",height:"35px",marginLeft:"50px",borderRadius:"10px",border:"1px solid black",padding:"2px"}}
                    placeholder='search using user-name'
                    />
                    <div >
                        {
                            allUsers.length > 0 ?
                            <div className='AllUsersComponentParent'>
                                {
                                    searchQuery && allUsers.filter(x=>{
                                        return searchQuery.toLowerCase() === "" ? "" :
                                        x.userName.toLowerCase().includes(searchQuery)
                                    }).map(
                                        x=>
                                            {
                                                return <div className='AllUsersChildComponenent'>
                                                    {
                                                        x.profilePicture && 1 ?
                                                        <img 
                                                        className='allusers-person-image' src={x.profilePicture}
                                                        onClick={()=>navigate('../name',{state:x.userName})}
                                                        />
                                                        :
                                                        <img 
                                                        className='allusers-person-image' src={personImage}
                                                        onClick={()=>navigate('../name',{state:x.userName})}
                                                        />
                                                    }
                                                    <br/>
                                                    <label className='allusers-user-child-username' 
                                                    onClick={()=>navigate('../name',{state:x.userName})}
                                                    >{x.userName}</label><br/>
                                                    
                                                    <center>
                                                        <button className='allusers-user-child-button-add-friend' onClick={(event)=>{followUser(event,x.userName)}}>Add Friend</button><br/>
                                                        <button className='allusers-user-child-button-remove-friend'>Remove</button>
                                                    </center>
                                                </div>
                                            }
                                        )
                                }
                                {
                                    !searchQuery && allUsers.map(
                                        x=>
                                            {
                                                return <div className='AllUsersChildComponenent'>
                                                    {
                                                        x.profilePicture && 1 ?
                                                        <img
                                                         className='allusers-person-image' src={x.profilePicture}
                                                         onClick={()=>navigate('../name',{state:x.userName})}
                                                         />
                                                         :
                                                         <img 
                                                         className='allusers-person-image' src={personImage}
                                                         onClick={()=>navigate('../name',{state:x.userName})}
                                                         />
                                                    }
                                                    <br/>
                                                    <label className='allusers-user-child-username' 
                                                    onClick={()=>navigate('../name',{state:x.userName})}
                                                    >{x.userName}</label><br/>
                                                    
                                                    <center>
                                                        <button className='allusers-user-child-button-add-friend' onClick={(event)=>{followUser(event,x.userName)}}>Add Friend</button><br/>
                                                        <button className='allusers-user-child-button-remove-friend'>Remove</button>
                                                    </center>
                                                </div>
                                            }
                                        )
                                }
                            </div>
                            :
                            <p style={{margin:"50px",fontSize:"36px"}}>Error 500! <br/>Problem at server.</p>
                        }
                    </div>
                </div>
            </div>
            :
            <div style={{paddingTop:"90px",height:"100vh",overflowY:"scroll"}}>
                <input
                onChange={(event)=>setSearchQuery(event.target.value)}
                 style={{width:"300px",height:"35px",marginLeft:"50px",borderRadius:"10px",border:"1px solid black",padding:"2px"}}
                  placeholder='search using user-name'
                  />
                <div className='AllUsersComponentParent-mobile'>
                    {
                        allUsers.length > 0 ?

                        <div >
                            {
                                searchQuery && allUsers.filter(x=>{
                                    return searchQuery.toLowerCase() === "" ? "" :
                                    x.userName.toLowerCase().includes(searchQuery)
                                }).map(
                                    x=>
                                        {
                                            return <div className='AllUsersChildComponenent-mobile'>
                                                <div    onClick={()=>navigate('../name',{state:x.userName})}    >
                                                    {
                                                        x.profilePicture && 1 ?<img className='allusers-person-image' src={x.profilePicture}/>:<img  className='allusers-person-image' src={personImage}/>
                                                    } 
                                                </div>
                                                <div>
                                                    <label className='allusers-user-child-username' 
                                                    onClick={()=>navigate('../name',{state:x.userName})}
                                                    >{x.userName}</label>
                                                    <br/>
                                                    <sub>{x.Profession ? x.Profession :"new to facebook"}</sub><br/>

                                                    <button className='all-users-add-friend-mobile'  onClick={(event)=>{followUser(event,x.userName)}}>Add Friend</button>
                                                    
                                                    <button className='all-users-add-friend-mobile'  >Remove</button>
                                                </div> 
                                            </div>
                                        }
                                    )
                            }
                            {
                                !searchQuery&&allUsers.map(
                                    x=>
                                        {
                                            return <div className='AllUsersChildComponenent-mobile'>
                                                <div    onClick={()=>navigate('../name',{state:x.userName})}    >
                                                    {
                                                        x.profilePicture && 1 ?<img className='allusers-person-image' src={x.profilePicture}/>:<img  className='allusers-person-image' src={personImage}/>
                                                    } 
                                                </div>
                                                <div>
                                                    <label className='allusers-user-child-username' 
                                                    onClick={()=>navigate('../name',{state:x.userName})}
                                                    >{x.userName}</label>
                                                    <br/>
                                                    <sub>{x.Profession ? x.Profession :"new to facebook"}</sub><br/>

                                                    <button className='all-users-add-friend-mobile'  onClick={(event)=>{followUser(event,x.userName)}}>Add Friend</button>
                                                    
                                                    <button className='all-users-add-friend-mobile'  >Remove</button>
                                                </div> 
                                            </div>
                                        }
                                    )
                            }
                        </div>
                        :
                        <p style={{margin:"50px",fontSize:"36px"}}>Error 500! <br/>Problem at server.</p>
                    }
                </div>
            </div>
        }
    </div>
  )
}

export default AllUsers