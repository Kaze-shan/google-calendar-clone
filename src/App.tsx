import { useState } from "react";
import "./App.css";
import { addMonths, subMonths, format } from "date-fns";
import CalendarHeader from "./components/Calendar/CalendarHeader";
import CalendarDays from "./components/Calendar/Days/CalendarDays";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const nextMonth = () => {
    setCurrentTime((prev) => addMonths(prev, 1));
  };

  const prevMonth = () => {
    setCurrentTime((prev) => subMonths(prev, 1));
  };

  const resetToday = () => {
    setCurrentTime(new Date());
  };

  return (
    <>
    <div className="calendar">
      <CalendarHeader
        currentMonth={format(currentTime, "LLLL")}
        currentYear={format(currentTime, "yyyy")}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        resetToday={resetToday}
      />
      <CalendarDays currentTime={currentTime} />
    </div>
    <div id="modal-wrapper"></div>
    </>
  );
}

export default App;
