import Grid from '@mui/material/Unstable_Grid2';
import React from "react";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import moment from "moment";
import axios from "axios";
import { useState,useEffect } from 'react';
import "moment/dist/locale/ar";
moment.locale("ar")
export default function MainContent()
{
  const getTimings =async ()=>{
    const responce= await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SY&city=${selectedCity.apiName}`);
   setTimings(responce.data.data.timings);
  }

  const [selectedCity,setSelectedCity]=useState({
    displayName:"دمشق",
    apiName:"Damascus",
  })
 const avilabelCities=[{
  displayName:"دمشق",
  apiName:"Damascus",
 },
 {
 displayName:"حلب",
 apiName:"Aleppo",
},
{
  displayName:"حمص",
  apiName:"Homs",
 }];

const prayersArray=[
  {key:"Fajr" , displayName:"الفجر"},
  {key:"Dhuhr" , displayName:"الظهر"},
  {key:"Asr" , displayName:"العصر"},
  {key:"Sunset" , displayName:"المغرب"},
  {key:"Isha" , displayName:"العشاء"},
];
const [timings,setTimings]=useState({
  Fajr:"04:20",
  Dhuhr:"11:20",
  Asr:"15:20",
  Sunset:"18:30",
  Isha:"19:33",
 });

useEffect(() =>{
  getTimings()

}, [selectedCity]);

useEffect(()=>{
  let interval= setInterval(() => {
   setupCountdownTimer()
  }, 1000);
  
  const t=moment();
  setToday(t.format("MMM Do YYYY | h:mm"));

  return()=>{
    clearInterval(interval);
  };
},[timings]);

   const setupCountdownTimer=()=>{
    const momentNow =moment()

    let prayerIndex=2;

    if(momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))){
    prayerIndex=1
    }else if (
      momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) && momentNow.isBefore(moment(timings["Asr"],"hh:mm"))
    ){
      prayerIndex=2
    }else if (
      momentNow.isAfter(moment(timings["Asr"],"hh:mm")) && momentNow.isBefore(moment(timings["Sunset"],"hh:mm"))
    ){
      prayerIndex=3
    }else if (
      momentNow.isAfter(moment(timings["Sunset"],"hh:mm")) && momentNow.isBefore(moment(timings["Isha"],"hh:mm"))
    ){
      prayerIndex=4
    }else 
    {
      prayerIndex=0
    }
   setNextPrayerIndex(prayerIndex);

   const nextPrayerObject=prayersArray[prayerIndex];
   const nextPrayerTime=timings[nextPrayerObject.key];
   const nextPrayerTimeMoment=moment(nextPrayerTime,"hh:mm");

  let remainingTime= moment(nextPrayerTime,"hh:mm").diff(momentNow);
   if(remainingTime<0){
    const midnightDiff=moment("23:59:59","hh:mm:ss").diff(momentNow);
    const fajrMidnightDiff=nextPrayerTimeMoment.diff(moment("00:00:00","hh:mm:ss"))
    const totalDiffernce=midnightDiff+fajrMidnightDiff;

    remainingTime=totalDiffernce;
   }
   console.log(remainingTime);






  const durationRemainingTime=moment.duration(remainingTime);
  setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`);
  

   console.log("next prayer time is",nextPrayerTime)
    const Isha=timings["Isha"];
    const IshaMoment=moment(Isha , "hh:mm");
    console.log(momentNow.isBefore(IshaMoment));
   };
  const [nextPrayerIndex,setNextPrayerIndex]=useState(2);
  
   
   const [remainingTime,setRemainingTime]=useState("");
  
const [today,setToday]=useState("");



   const handleCityChange = (event) => {
    const cityObject=avilabelCities.find((city)=>{
      return city.apiName === event.target.value
    })
     console.log (event.target.value)
     setSelectedCity(cityObject)
    };

    return(<>
    <Grid container style={{color:"white"}}>
       <Grid xs={6}>
         <div>
            {/* <h2>سيبتمبر 9 2024 | 4:20  </h2> */}
            <h2>{today}</h2>
            <h1>{selectedCity.displayName}</h1>
            
         </div>
       </Grid>

       <Grid xs={6}>
         <div>
            <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
            <h1>{remainingTime}</h1>
         </div>
       </Grid>
    </Grid>
    <Divider style={{borderColor:"white",opacity:"0.1"}}/>
    <Stack direction="row" justifyContent={"space-around"} style={{marginTop:"50px"}} >
      <Prayer name="الفجر" time={timings.Fajr} image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"/>
      <Prayer name="الظهر" time={timings.Dhuhr} image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"/>
      <Prayer name="العصر" time={timings.Asr} image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"/>
      <Prayer name="المغرب" time={timings.Sunset} image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"/>
      <Prayer name="العشاء" time={timings.Isha} image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"/>
    </Stack>
    <Stack direction="row" justifyContent={"center"} style={{marginTop:"40px"}}>
    <FormControl style={{width:"20%" }}>
        <InputLabel id="demo-simple-select-label">
         <span  style={{color:"white"}}>
         المدينة
         </span>
         </InputLabel>
        <Select
        style={{color:"white"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
         //  value={age}
          label="Age"
          onChange={handleCityChange}
        >
          {avilabelCities.map((city) => {
           return(
            <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>
           )
          })}
        </Select>
      </FormControl>
    </Stack>
    </>);
}