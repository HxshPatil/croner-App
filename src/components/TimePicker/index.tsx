// @ts-nocheck
import "./index.sass"
import React, { useEffect, useState } from 'react'
import clockIcon from "../../../src/assets/clock.svg";
import plusIcon from "../../../src/assets/images/plus.svg";
import minusIcon from "../../../src/assets/images/minus.svg";
import { Button } from '@attrybtech/attryb-ui';
import ClickAwayListener from "react-click-away-listener";
import { setAlertVisible } from "../../features/globalConfigs/global-slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setValidateButtons } from "../../features/templates/template-slice";
type Props = {
  handleChangeEvent: (str:string) => void , 
  defaultTime: string,
  dateTimeDifference?: any
}
const TimePicker = ({handleChangeEvent , defaultTime, dateTimeDifference}:Props) => {
  const [openTime, setOpenTime] = useState(false);
  const [hrs, setHrs] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [schedule, setSchedule] = useState("");
  const dispatch = useAppDispatch()

  const formatTimeOptions:any = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  let currentRealTime = new Date().toLocaleTimeString('en-US', formatTimeOptions);
  const [value, setValue] = useState(currentRealTime);

  useEffect(() => {
    const [hour, minute, amPm] = defaultTime ? defaultTime.split(/:| /) : currentRealTime.split(/:| /);
    setHrs(hour)
    setMinutes(minute);
    setSchedule(amPm)
    getDateString(hour, minute, amPm)
  }, [])


  const getDateString = (hrs:string, minutes:string, schedule:string) => {
    let stringTime:string = `${hrs}:${minutes} ${schedule}`
    handleChangeEvent(stringTime)
    setValue(stringTime);
  };

  useEffect(() => {
    if(hrs && minutes && schedule){
      checkHrs(Number(hrs));
      checkMinutes(Number(minutes));
      getDateString(hrs, minutes, schedule);
    }
  }, [hrs, minutes, schedule,defaultTime, dateTimeDifference]);
  
  
  const changeHrs=(value:any)=>{
      setHrs((prev)=> setZero(Number(prev) + Number(value)))
  }
  
  const changeMinutes=(value:any)=>{
      setMinutes((prev)=> setZero(Number(prev) + Number(value)))
  }
  
  const handleClose = () => {
    setOpenTime(false);
    if(dateTimeDifference <= 0) {
        dispatch(setValidateButtons(true))
    }else if(dateTimeDifference > 0){
      dispatch(setValidateButtons(false))
    }
    
  };
  
  const setZero = (num:number) => {
    return (num < 10 ? '0' : '') + num;
  }
  
  const checkHrs = (num:number) => {
    if(num == null){
      return
    }
    if(num > 12){
      setHrs("01")
    }else if(num < 1){
      setHrs("12")
    }
  }
  
  const checkMinutes = (num:number) => {
    if(num == null){
      return
    }
    if(num > 59){
      setMinutes("00")
    }else if(num > 60){
      setMinutes("01")
    }else if(num < 1){
      if(num ==0) return
      setMinutes("00")
    }else if(minutes == "0-1"){
      setMinutes("59")
    }else{
      setMinutes(minutes)
    }
  }
  return (
    <>
    <ClickAwayListener
        onClickAway={(e) => {
          handleClose();
        }}
      >
    <div className="time-picker-wrapper">
      <Button variant="solid" colorScheme="secondary" additionalClassName="time-component-btn" onClick={() => {
          setOpenTime(!openTime);
        }}>
        <img src={clockIcon}></img>
        {value}
      </Button>
      {openTime && (
        <div className="time-picker-card">
          <div className="time-picker-screen">
            <div className="time-picker-hrs">
              <div className="hrs-increase" onClick={()=>changeHrs(+1)}>
                <img src={plusIcon} alt="" />
              </div>
              <div className="text-sm--sb hrs-time">{hrs}</div>
              <div className={`hrs-decrease ${dateTimeDifference <= 0 ? 'disable' : ''}`} onClick={()=>changeHrs(-1)}>
                <img src={minusIcon} alt="" />
              </div>
            </div>
            <div className="time-picker-divider">:</div>
            <div className="time-picker-minutes">
              <div className="minutes-increase" onClick={()=>changeMinutes(+1)}>
                <img src={plusIcon} alt="" />
              </div>
              <div className="text-sm--sb minutes-time">{minutes}</div>
              <div className={`minutes-decrease ${dateTimeDifference <= 0 ? 'disable' : ''}`} onClick={()=>changeMinutes(-1)}>
                <img src={minusIcon} alt="" />
              </div>
            </div>
            <div className="time-picker-schedule">
              <button className={`${schedule=="AM" ? "schedule-btn-am": "schedule-btn-am active"}`} onClick={()=>setSchedule("AM")}>AM</button>
              <button className={`${schedule=="PM" ? "schedule-btn-pm": "schedule-btn-pm active"}`} onClick={()=>setSchedule("PM")}>PM</button>
            </div>
          </div>
          <div className="time-picker-submit">
            <Button onClick={()=>{dispatch(setAlertVisible({content:"End time should be greater than Start time",theme:"danger",visible:true})); handleClose();}} additionalClassName="time-submit-btn">Apply</Button>

          </div>
        </div>
      )}
    </div>
    </ClickAwayListener>
    </>
  )
}

export default TimePicker