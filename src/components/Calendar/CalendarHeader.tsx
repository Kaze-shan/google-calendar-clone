type CalendarHeaderProps = {
    currentMonth: string
    currentYear: string
    nextMonth: () => void
    prevMonth: () => void
    resetToday: () => void
}

export default function CalendarHeader({currentMonth, currentYear, nextMonth, prevMonth, resetToday}: CalendarHeaderProps) {

  return (
    <div className="header">
      <button className="btn" onClick={resetToday}>Today</button>
      <div>
        <button className="month-change-btn" onClick={prevMonth}>&lt;</button>
        <button className="month-change-btn" onClick={nextMonth}>&gt;</button>
      </div>
      <span className="month-title">{currentMonth} {currentYear}</span>
    </div>
  );
}
