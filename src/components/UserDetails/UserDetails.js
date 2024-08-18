import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './UserDetails.css'

import profileIcon from '../AllUsers/person.png'
import { CiBookmark } from 'react-icons/ci'
import likedIcon from '../AllPosts/assets/liked.png'
import likeIcon from '../AllPosts/assets/like.png'
import commentIcon from '../AllPosts/assets/comment.png'
import viewsIcon from '../AllPosts/assets/views.png'

import {followUser,ShowCommentBox,IncrementLike} from './controller'

function UserDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    // console.log(location.state)

    const [userData,setUserData] = useState({});

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/getPersonalData`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({user_name:location.state})
        }).then(data=>data.json()).then(data=>{setUserData(data)}).catch(err=>console.log(err))

    },[])
  return (
    <div style={{paddingTop:"80px",height:"100vh"}}>
        <div style={{padding:"10px"}}>
            <button className='userDetails-back-button' onClick={()=>navigate('../')}>&lt; back</button><br/>

            <div className='userDetails-child'>
                <img src={userData&&userData.personalData&&userData.personalData.profilePicture ?userData.personalData.profilePicture : profileIcon} width="150px" style={{borderRadius:"50px"}}/>
                <div>
                <b><b>{location.state}</b></b>
                </div>
                <div>
                    <button className='allusers-user-child-button-add-friend' onClick={(event)=>{followUser(event,location.state)}}>Add Friend</button><br/>
                    <button className='allusers-user-child-button-remove-friend'>Remove</button>
                </div>
            </div>

            <div className='userDetails-child'>
                <div>
                    <b>education</b><br/>
                    {
                        userData&&userData.personalData&&userData.personalData.EducationalQualifications?
                        <p>{JSON.stringify(userData.personalData.EducationalQualifications)}</p>
                        :
                        <p>no data to show</p>
                    }
                </div>
                <div>
                    <b>general</b><br/>
                    <label>{userData&&userData.personalData&&userData.personalData.city},</label>
                    <label>{userData&&userData.personalData&&userData.personalData.state}</label><br/>
                    <label>{userData&&userData.personalData&&userData.personalData.Profession}</label><br/>
                    <label>{userData&&userData.personalData&&userData.personalData.gender}</label><br/>
                    <label>Born on : {userData&&userData.personalData&&userData.personalData.DateOfBirth}</label>
                </div>
                <div>
                    <b>Interests</b><br/>
                    <p>{JSON.stringify(userData&&userData.personalData&&userData.personalData.interests)}</p>
                </div>
            </div>

            <div className='userDetails-child'>
                <div>
                    <b>friends</b>
                    <div className='userDetails-child-friends'>
                        {
                            userData&&userData.personalData&&userData.personalData.friends ?
                            userData.personalData.friends.map(x=>
                            <div 
                            style={{backgroundColor:"#f0f2f5",color:"black",borderRadius:"5px",padding:"5px",marginBottom:"5px",width:"300px"}}
                            >
                                <img style={{margin:"5px"}} src={x.profilePic?x.profilePic:profileIcon} width="50px" />
                                <a href='' onClick={()=>navigate('../name',{state:x.userName})}>{x.userName}</a>
                            </div>
                            )
                            :
                            <label>no friends yet !</label>
                        }
                    </div>
                </div>
            </div>

            <div className='userDetails-child'>
                <div>
                    <b>Posts</b><br/>
                    {
                        userData&&userData.postsData&&userData.postsData&&userData.postsData.length > 0 ?
                        userData.postsData.map(x=>
                            <div style={{backgroundColor:"#cccccc"}} className='AllPostsChildWindow-mobile'>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <a
                               style={{textDecoration:"none"}}  href=''  
                               onClick={()=>navigate('name',{"state":x.author})} 
                               >{x.author}
                               </a>
                              <CiBookmark size={25}  
                               onClick={()=>{alert('post saved')}} 
                               />
                            </div>
                            {/* <br/> */}
                            {/* <label>posted on : {x.DatePosted}</label> */}
                            {/* <label>modified on : {x.DareModified}</label> */}
                            <br/>
                            <div>
                              {
                                (x.content && 1)?
                                <div>
                                  {
                                  x.content.map(
                                    (element,index)=>
                                    {
                                      if(element.type == 'p')
                                        {
                                            return <p className='NewPostTextOverFlow'
                                                key={index}
                                                style={{
                                                    color:element.textColor,
                                                    fontSize:`${element.fontSize}px`,
                                                    textAlign:element.textAlign
                                                    }}
                                            >
                                                {element.value}
                                            </p>
                                        }
                            
                            
                                        else if(element.type == 'b')
                                        {
                            
                                            return <div>
                                                <b key={index}
                                                style={{
                                                    color:element.textColor,
                                                    fontSize:`${element.fontSize}px`,
                                                    textAlign:element.textAlign
                                                }}
                                            >
                                                {element.value}
                                            </b>
                                            <br/>
                                            </div>
                                        }
                                        
                                        
                                        else if(element.type == 'link')
                                        {
                                            return <div>
                                                <br/>
                                                <a key={index}
                                                target='_blank'
                                                href={element.linkTo}
                                            >
                                                {element.value}
                                            </a>
                                            <br/>
                                            </div>
                                        }
                            
                                        else if(element.type == 'img')
                                        {
                                            return <div>
                                              <center><img style={{borderRadius:"10px",maxWidth:"300px"}} src={element.src}/></center>
                                              <br/>
                                            </div>
                                        }
                            
                                        else if(element.type == 'video')
                                        {
                                            return <div>
                                              <center><video style={{borderRadius:"20px"}} src={element.src} width="400px" height="300px" controls loop/></center>
                                              <br/>
                                            </div>
                                        }
                            
                                        else if(element.type == 'audio')
                                        {
                                            return <center><audio src={element.src} controls /></center>
                                        }
                                        
                                        else if(element.type == 'document')
                                        {
                                            return <div>
                                                <a href={element.src}>{element.name}</a>
                                                <p>size :- {String((element.size)/1024).split('.')[0]}KB</p>
                                            </div>
                                        }
                                        else if(element.type == 'none')
                                        {
                                          return <p>data not fetched</p>
                                        }
                                    }
                                  )
                                }
                                </div>
                                :
                                <p>Error 500!</p>
                              }
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <label> 
                                  <img className={`like${x._id}liked`} src={likedIcon} width="17px"
                                    style={{display:"none"}}
                                   onClick={(event)=>{
                                    IncrementLike(event,x._id,"unlike");
                                    document.querySelector(`.like${x._id}liked`).style.display='none';
                                    document.querySelector(`.like${x._id}notliked`).style.display='inline';
                                    }}/> 
          
                                  <img className={`like${x._id}notliked`}  src={likeIcon} width="15px"
                                   onClick={(event)=>{
                                    IncrementLike(event,x._id,"like");
                                    document.querySelector(`.like${x._id}notliked`).style.display='none'
                                    document.querySelector(`.like${x._id}liked`).style.display='inline';
                                    }}/>  
                                
                                  {/* <img className={`like${x._id}`} width="15px" src={likeIcon} onClick={(event)=>{IncrementLike(event,x._id)}}/> */}
                              {x.likes}</label>
                              <label>
                                <img className='btn' width="45px" src={commentIcon} onClick={(event)=>{ShowCommentBox(event,x._id,x.comments,x)}}/>
                              {x.comments?x.comments.length:0}</label>
                              <label>
                                <img width="20px" src={viewsIcon}/>
                              {x.views ? x.views :1}</label>
                            </div>
                            </div>
                        )
                        :
                        <label>no posts to show</label>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserDetails