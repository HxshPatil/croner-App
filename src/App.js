import React, { useState } from "react";
import './App.css';
import moment from "moment";
import Scheduler from "./components/Scheduler/scheduler";
import { Cron } from "croner";

const dateToCron = (date) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = "*";

  return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

const formatDate = function (date, displayDate = true, displayMonth = true, displayYear = true, displayTime = true) {
  const dateFormat = (displayMonth ? 'MMM' : '') + (displayDate ? ' DD' : '') + (displayYear ? ', YYYY' : '') + (displayTime ? ' hh:mm A' : '');

  if (date) {
      const formattedDate = moment(date).format(dateFormat);
      return formattedDate;
  } else {
      return "-";
  }
};

function App() {
  const [startDate, setStartDate] = useState(moment().format("MMM D YYYY"));
  const [endDate, setEndDate] = useState(startDate);
  const [startTime, setStartTime] = useState(moment().format("hh:mm A"));
  const [endTime, setEndTime] = useState(moment().format("hh:mm A"));  
  const [badge, setBadge] = useState("inactive");
  const[isResumeVisible,setIsResumeVisible]= useState(false)

  const wholeStartDate = new Date(`${startDate} ${startTime}`);
  const wholeEndDate = new Date(`${endDate} ${endTime}`);

  const selectStartDate = (str) => {
    const momentDate = moment(str);
    const formattedDate = momentDate.format("MMM D YYYY");
    setStartDate(formattedDate);
  };

  const selectEndDate = (str) => {
    const momentDate = moment(str);
    const formattedDate = momentDate.format("MMM D YYYY");
    setEndDate(formattedDate);
  };

  const selectStartTime = (str) => {
    setStartTime(str);
  };

  const selectEndTime = (str) => {
    setEndTime(str);
  };

  const startCronJob = () => {
    const currentDate = new Date();
    const wholeStartTime = new Date(`${startDate} ${startTime}`);
    const wholeEndTime = new Date(`${endDate} ${endTime}`);
  
    if (currentDate.getTime() < wholeStartTime.getTime()) {
      setBadge("scheduled");
    } else if (currentDate.getTime() >= wholeStartTime.getTime() && currentDate.getTime() < wholeEndTime.getTime()) {
      setBadge("active");
      setIsResumeVisible(true);
    } else {
      setBadge("inactive");
      setIsResumeVisible(false);
    }
  
    const startCron = dateToCron(wholeStartTime);
    const endCron = dateToCron(wholeEndTime);
  
    const startJob = Cron(startCron, () => {
      console.log('Start Job');
      setBadge("active");
      setIsResumeVisible(true);
      startJob.stop();
    });
  
    const endJob = Cron(endCron, () => {
      console.log('End Job');
      setBadge("inactive");
      setIsResumeVisible(false);
      endJob.stop();
    });
  
    startJob.schedule();
    endJob.schedule();
  };
  

  const updateEndTime = () => {
    const currentTime = new Date();
    const wholeStartTime = new Date(`${startDate} ${startTime}`);
    
    if (currentTime < wholeStartTime) {
      setBadge("scheduled");
    } else {
      setBadge("inactive");
    }
  };

  const resumeJob = () => {
    setBadge("active");
    setIsResumeVisible(true);
  };
  
  return (
    <div className="App">
      <Scheduler
        startDate={startDate}
        endDate={endDate}
        selectStartDate={selectStartDate}
        selectStartTime={selectStartTime}
        selectEndDate={selectEndDate}
        selectEndTime={selectEndTime}
        startTime={startTime}
        endTime={endTime}
      />
      <button onClick={startCronJob} className="start-button">Start</button>
      <div className="row">
        <div>variant1</div>
        <div className="badge">{badge}</div>
        <div>startDate: {formatDate(wholeStartDate.toString())}</div>
        <div>endDate: {formatDate(wholeEndDate.toString())}</div>
        {badge==="active" && <button onClick={updateEndTime}>End</button>}
        {(badge === "inactive" && isResumeVisible) && <button onClick={resumeJob}>Resume</button>}
      </div>
    </div>
  );
}

export default App;

