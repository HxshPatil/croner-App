import React from "react";
import "./index.css"
import { TimePicker, DatePicker } from "@attrybtech/attryb-ui";

function Scheduler({ startDate, endDate, selectStartDate, selectStartTime, selectEndDate, selectEndTime, startTime, endTime }) {
  return (
    <div className="schedule-container">
    Start Date:
      <div className="date-container">
        <div className="schedule-start-date">
          <DatePicker
            handleChangeEvent={selectStartDate}
            defaultDate={startDate}
            isNoEndDateSelected={true}
            minimumDate={""}
            maximumDate={""}
            disableDate={false}
          />
        </div>
        <div className="schedule-start-time">
          <TimePicker handleChangeEvent={selectStartTime} defaultTime={startTime} />
        </div>
      </div>
        End Date:
      <div className="date-container">
        <div className="schedule-end-date">
          <DatePicker
            handleChangeEvent={selectEndDate}
            defaultDate={endDate}
            isNoEndDateSelected={true}
            minimumDate={startDate}
            maximumDate={""}
            disableDate={false}
          />
        </div>
        <div>
          <TimePicker handleChangeEvent={selectEndTime} defaultTime={endTime} />
        </div>
      </div>
    </div>
  );
}

export default Scheduler;
