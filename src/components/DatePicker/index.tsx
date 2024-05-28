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


const DatePicker = ({handleChangeEvent, defaultDate , minimumDate = "today", addMinDate}:DatePicker) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [date, setDate] = useState();
  const [minDate, setMinDate] = useState();
  const [givenDefaultDate, setGivenDefaultDate] = useState();
  const toggle = false;
  const todayStr = "today";
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [value, setValue] = useState(formattedDate);

  useEffect(() => {
    
    if(defaultDate){
      const utcDate = moment.utc(defaultDate, 'MMM DD YYYY').toDate();
      setDate(utcDate)
      setValue(defaultDate)
    }else{
      const utcDate = moment.utc(currentDate, 'MMM DD YYYY').toDate();
      const formattedDate = currentDate.toLocaleDateString("en-US", options);
      setValue(formattedDate)
      setDate(utcDate)
    }
    const givenDefaultDate = new Date(defaultDate)
    setGivenDefaultDate(givenDefaultDate)
  }, [defaultDate])
  
  useEffect(() => {
    if (toggle) {
      setOpenCalendar(false);
    }
  }, [toggle]);

  useEffect(() => {
    if(date){
      getDateString()
    }
  }, [date, defaultDate]);

  useEffect(() => {
    if(minimumDate === todayStr || !minimumDate){
      const today = new Date();
      setMinDate(today)
    }else {
      const givenDate = new Date(minimumDate)
      setMinDate(givenDate)
    }
  }, [minimumDate])

  const getDateString = () => {
    let stringDate:any = date
      ? `${moment(date).format("MMM DD YYYY")}`
      : value;

    setValue(stringDate);
    handleChangeEvent(stringDate)
  };

  const handleClose = () => {
    setOpenCalendar(false);
  };
  const handleMinDate = addMinDate ? (
    <Calendar id="date-picker" onChange={(d: any) => { setDate(d); handleClose(); }} minDate={minDate} date={givenDefaultDate} />
  ) : (
    <Calendar id="date-picker" onChange={(d: any) => { setDate(d); handleClose(); }} date={givenDefaultDate} />
  );
  
  return (
    <>
    <ClickAwayListener
        onClickAway={(e) => {
          handleClose();
        }}
      >
    <div className="calendar">
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
          {openCalendar && handleMinDate}
        </div>
    </div>
    </ClickAwayListener>
    </>
  );
};

export default DatePicker;