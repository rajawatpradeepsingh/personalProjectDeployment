import React, { useEffect, useState} from 'react';
import moment from "moment"
import axios from "axios";
import {config} from "../../../../src/config"
import SessionPopUp from "../../modal/SessionPopUp/sessionpopup.component";
import auth from "../../../../src/utils/AuthService"
import {getUser} from "../../../../src/API/users/user-apis"
let timeout=100000;


const IdleTimeOutHandler = (props)=>{
    const[showModal,setShowModal]=useState(false)
    const[isLogout,setLogout]=useState(false)
    let timer=undefined;
    const events= ['click','load','keydown','dblclick' , 'mouseup' , 'mousedown']
 const [parameterList, setParameterList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = config.ITEMS_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCurrentPage, setFilterCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [headers] = useState(auth.getHeaders());
  

     const getParameterValue =() =>
     {

         const user = JSON.parse(sessionStorage.getItem("userInfo"));
       getUser(headers, user.id)
        .then((res) => 
        {
           
          if (res.data.timeout !== (0||"0"))
          {
            //console.log("User value: ",res.data.timeout);
             timeout= res.data.timeout;
            
          }
          else
          {
            axios.put(
           `${config.serverURL}/parameter?dropdownFilter=true&pageNo=${
            filterCurrentPage - 1
            }&pageSize=${ITEMS_PER_PAGE}&param_type=STS&param_level=0`,
            filters,
            { headers })
            .then((res) => 
            {
               if (res.data) 
               {
                 setParameterList(res.data);
                 console.log("Admin value: ", res.data[0]["paramValue"]);
                timeout= res.data[0]["paramValue"];
               }
          
             })
          }
        })
         
        
    
    }
   
    const eventHandler =(eventType)=>{
       
        if(!isLogout){
            localStorage.setItem('lastInteractionTime',moment() )
            if(timer){
                props.onActive();
                startTimer();
            }
        }

        
    };
    
    useEffect(()=>{
        addEvents();
        
        return (()=>{
            
            removeEvents();
            clearTimeout(timer);
        })
    },[])
    
    const startTimer=()=>
    {
         getParameterValue();
          
        if(timer){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            
            let lastInteractionTime=localStorage.getItem('lastInteractionTime')
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            let timeOutInterval=props.timeOutInterval?props.timeOutInterval:timeout;
            //console.log("DIFF ", diff);
            //console.log("TIMEOUT: ",timeout);
            if(isLogout){
                clearTimeout(timer)
            }else{
                if(diff._milliseconds<timeOutInterval){
                    startTimer();
                    props.onActive();
                }else{
                    props.onIdle();
                    setShowModal(true)
                }
            }
            
        },props.timeOutInterval?props.timeOutInterval:timeout)
    
    }
    const addEvents=()=>{
        
        events.forEach(eventName=>{
            window.addEventListener(eventName,eventHandler)
        })
        
        startTimer();
    }
    
    const removeEvents=()=>{
        events.forEach(eventName=>{
            window.removeEventListener(eventName,eventHandler)
        })
    };
    
    const handleContinueSession = (event)=>{
       
        event.preventDefault();

       
        setShowModal(false)
        setLogout(false)
    }
    const handleLogout = ()=>{
        removeEvents();
        clearTimeout(timer);
        setLogout(true)
        //props.onLogout();
        auth.logout();
        setShowModal(false)
        
    }
     const closeModal = () => {
    
   setShowModal(false)
  };
    
    return(
        <div>
        <SessionPopUp
        openModal={showModal}
        closePopUp={closeModal}
        handleContinue={handleContinueSession}
        handleLogout={handleLogout}
        message={{
          title: "You Have Been Idle!",
          details:
            "Do you want to Continue?",
            
        }}
        
      ></SessionPopUp>
    
        </div>
        )
        
    }
    
    export default IdleTimeOutHandler;