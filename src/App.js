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
  const [variants, setVariants] = useState([]);

  const addVariant = () => {
    const newVariant = {
      key: Date.now(),
      startDate: moment().format("MMM D YYYY"),
      endDate: moment().format("MMM D YYYY"),
      startTime: moment().format("hh:mm A"),
      endTime: moment().format("hh:mm A"),
      badge: "inactive",
      isResumeVisible: false,
      startJob: null,
      endJob: null
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (key, updatedProps) => {
    setVariants(prevVariants => 
      prevVariants.map(v => v.key === key ? { ...v, ...updatedProps } : v)
    );
  };

  const startCronJob = (variant) => {
    console.log('variant:', variant);

    const { key, startDate, startTime, endDate, endTime } = variant;
    const currentDate = new Date();
    const wholeStartTime = new Date(`${startDate} ${startTime}`);
    console.log('wholeStartTime:', wholeStartTime)
    const wholeEndTime = new Date(`${endDate} ${endTime}`);
    console.log('wholeEndTime:', wholeEndTime)

    // if (currentDate.getTime() < wholeStartTime.getTime() && wholeStartTime.getTime() < wholeEndTime.getTime()) {
    //   updateVariant(key, { badge: "scheduled" });
    // } else if (currentDate.getTime() >= wholeStartTime.getTime() && currentDate.getTime() < wholeEndTime.getTime()) {
    //   updateVariant(key, { badge: "active", isResumeVisible: true });
    // } else {
    //   updateVariant(key, { badge: "inactive", isResumeVisible: false });
    // }

    const startCron = dateToCron(wholeStartTime);
    const endCron = dateToCron(wholeEndTime);

    const startJob = Cron(startCron, () => {
      console.log(`Start Job for variant ${key}`);
      updateVariant(key, { badge: "active", isResumeVisible: true });
      startJob.stop();
    });

    const endJob = Cron(endCron, () => {
      console.log(`End Job for variant ${key}`);
      updateVariant(key, { badge: "inactive", isResumeVisible: false });
      endJob.stop();
    });

    startJob.schedule();
    endJob.schedule();

    updateVariant(key, { startJob, endJob });
  };

  // const updateEndTime = (variant) => {
  //   const { key, startDate, startTime } = variant;
  //   const currentTime = new Date();
  //   const wholeStartTime = new Date(`${startDate} ${startTime}`);

  //   if (currentTime < wholeStartTime) {
  //     updateVariant(key, { badge: "scheduled" });
  //   } else {
  //     updateVariant(key, { badge: "inactive" });
  //   }
  // };

  // const resumeJob = (variant) => {
  //   const { key } = variant;
  //   updateVariant(key, { badge: "active", isResumeVisible: true });
  // };

  return (
    <div className="App">
      <button onClick={addVariant} className="add-variant-button">Add Variant</button>
      {variants.map(variant => (
        <div key={variant.key} className="variant">
          <Scheduler
            startDate={variant.startDate}
            endDate={variant.endDate}
            selectStartDate={(str) => updateVariant(variant.key, { startDate: moment(str).format("MMM D YYYY") })}
            selectStartTime={(str) => updateVariant(variant.key, { startTime: str })}
            selectEndDate={(str) => updateVariant(variant.key, { endDate: moment(str).format("MMM D YYYY") })}
            selectEndTime={(str) => updateVariant(variant.key, { endTime: str })}
            startTime={variant.startTime}
            endTime={variant.endTime}
          />
          <button onClick={() => {startCronJob(variant);console.log(variant.key)}} className="start-button">Start</button>
          <div className="row">
            <div>variant{variant.key}</div>
            <div className="badge"><b>{variant.badge}</b></div>
            <div><b>startDate:</b> {formatDate(new Date(`${variant.startDate} ${variant.startTime}`).toString())}</div>
            <div><b>endDate:</b> {formatDate(new Date(`${variant.endDate} ${variant.endTime}`).toString())}</div>
            {/* {variant.badge === "active" && <button onClick={() => updateEndTime(variant)}>End</button>}
            {(variant.badge === "inactive" && variant.isResumeVisible) && <button onClick={() => resumeJob(variant)}>Resume</button>} */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
