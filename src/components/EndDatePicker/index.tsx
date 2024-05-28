// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./index.sass";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import calenderIcon from "../../assets/CalenderIcon.svg";
import { Button } from "@attrybtech/attryb-ui";
import ClickAwayListener from "react-click-away-listener";


const EndDatePicker = ({handleChangeEvent, defaultDate , minimumDate = "today", disableDate, setDisableDate}:EndDatePicker) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [date, setDate] = useState(defaultDate);
  const [minDate, setMinDate] = useState();
  const todayStr = "today";
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [value, setValue] = useState(defaultDate || formattedDate); 
  
  useEffect(() => {
    if(defaultDate){
      const utcDate = moment.utc(defaultDate, 'MMM DD YYYY').toDate();
      setDate(utcDate)
      setValue(defaultDate)
      setDisableDate(false)
    }
  }, [defaultDate])

  useEffect(() => {
    if(date){
      setDate(date);
      getDateString();
    }
  }, [date,disableDate,defaultDate]);

  useEffect(() => {
    if(disableDate){
      setValue("No End Date")
      handleChangeEvent(null)
    }else{
      if(minimumDate === todayStr || minimumDate === '' ){
        const today = new Date();
        setMinDate(today)
      }else {
        const givenDate = new Date(minimumDate)
        if(givenDate.getTime() < currentDate.getTime()){
          setMinDate(currentDate)
          setValue(moment(currentDate).format("MMM DD YYYY"));
          handleChangeEvent(moment(currentDate).format("MMM DD YYYY"))
        }else{
          setMinDate(givenDate)
        }
      }
    }
  }, [minimumDate, disableDate])
  
  const getDateString = () => {
    let stringDate:any = date
      ? `${moment(date).format("MMM DD YYYY")}`
      : disableDate ? "" : `${moment(date).format("MMM DD YYYY")}`;

    setValue(stringDate);
    handleChangeEvent(stringDate)
  };



  const handleDisabledDate = (disabledState) => {
    if(disabledState){
      handleChangeEvent(null)
    }
  };
  const handleClose = () => {
    setOpenCalendar(false);
  };

  return (
    <>
    <ClickAwayListener
        onClickAway={(e) => {
          handleClose();
        }}
      >
    <div className="calendar-v2">
        <div
          id="datepicker"
          style={{ position: "relative" }}
        >
            <Button variant="solid" colorScheme="secondary" onClick={() => {
              setOpenCalendar(!openCalendar);
            }}>
              <img src={calenderIcon}></img>
              {value || "Select Date"}
            </Button>
          {openCalendar && (
            <div className="calendar-wrapper">
              <div className="no-end-date-wrapper">
                <p className="text-md--md">No End Date</p>
                <input type="checkbox" checked={disableDate} onClick={()=>{handleDisabledDate(!disableDate);setDisableDate(!disableDate)}} name="" id="" />
              </div>
              <div className={disableDate && "is-end-date"}>
                <Calendar
                  id="date-picker"
                  className={disableDate && "is-end-date"}
                  onChange={(d:any) => {
                    setDate(d);
                    handleClose();
                  }}
                  minDate={minDate}
                  date={defaultDate ? new Date(defaultDate) : currentDate}
                />
              </div>
            </div>
          )}
        </div>
    </div>
    </ClickAwayListener>
    </>
  );
};

export default EndDatePicker;