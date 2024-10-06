// Function to calculate mood and generate calendar
function calculateMood() {
    const pillDateInput = document.getElementById("pillDate").value;
    const lastPeriodInput = document.getElementById("lastPeriodDate").value;

    if (!pillDateInput || !lastPeriodInput) {
        document.getElementById("result").innerHTML = "Please enter valid dates.";
        return;
    }

    // Use more reliable date parsing
    const pillDate = new Date(pillDateInput + "T00:00"); // Ensures midnight UTC parsing
    const lastPeriodDate = new Date(lastPeriodInput + "T00:00"); 
    const today = new Date();
    const cycleLength = 28;

    // Calculate the day difference for the current cycle based on the last period
    const lastPeriodEnd = new Date(lastPeriodDate);
    lastPeriodEnd.setDate(lastPeriodEnd.getDate() + 5); // Assuming a 5-day period
    const dayDifference = Math.floor((today - lastPeriodEnd) / (1000 * 60 * 60 * 24));
    const currentDayInCycle = (dayDifference % cycleLength + cycleLength) % cycleLength; // Modulus fix for negative days

    // Rest of your existing logic here

    generateCalendar(lastPeriodEnd, currentDayInCycle);
}

// Function to generate the calendar
function generateCalendar(pillDate, currentDayInCycle) {
    const calendarDiv = document.getElementById("calendar");
    calendarDiv.innerHTML = ""; // Clear previous calendar

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const currentDay = today.getDate();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const cycleLength = 28;
    const dayDifference = Math.floor((today - pillDate) / (1000 * 60 * 60 * 24));

    // Add month title
    const monthTitle = document.createElement('h3');
    monthTitle.innerText = today.toLocaleString('default', { month: 'long' }) + " " + year;
    calendarDiv.appendChild(monthTitle);

    // Create the grid structure for the calendar
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    // Add days from the previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        const prevMonthDay = prevMonthLastDay - startDayOfWeek + i + 1;
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'prev-month');
        emptyCell.innerText = prevMonthDay;
        calendarGrid.appendChild(emptyCell);
    }

    // Add days of the current month
    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.innerText = day;

        const dayInCycle = (dayDifference + day - 1) % cycleLength;

        // Highlight the pill start date if it's in this month
        if (pillDate.getDate() === day && pillDate.getMonth() === month) {
            dayCell.classList.add('highlight-start');
        }

        // Highlight today's date
        if (day === currentDay) {
            dayCell.classList.add('highlight-today');
        }

        // Cycle emoji and class
        const emoji = document.createElement('span');
        emoji.classList.add('emoji');
        if (dayInCycle >= 0 && dayInCycle <= 5) {
            emoji.innerText = "😢"; 
            dayCell.classList.add('period'); 
        } else if (dayInCycle > 5 && dayInCycle <= 14) {
            emoji.innerText = "😊"; 
            dayCell.classList.add('beforePMS');
        } else if (dayInCycle > 14 && dayInCycle <= 21) {
            emoji.innerText = "😊";
            dayCell.classList.add('beforePMS'); 
        } else if (dayInCycle > 21 && dayInCycle <= 28) {
            emoji.innerText = "😐";
            dayCell.classList.add('pms');
        }
        dayCell.appendChild(emoji);

        if (dayInCycle > 5 && dayInCycle <= 14) {
            dayCell.title = `${14 - dayInCycle} days until Ovulation`;
        } else if (dayInCycle > 21 && dayInCycle <= 28) {
            dayCell.title = `${28 - dayInCycle} days until PMS`;
        } else {
            dayCell.title = "Normal Cycle Day"; // Default message
        }

        dayCell.onclick = () => {
            alert(`Selected date: ${day}/${month + 1}/${year} - Cycle Day: ${dayInCycle + 1}`);
        };

        calendarGrid.appendChild(dayCell);
    }

    // Add days from the next month only if necessary (when total days + previous month spillover is < 42)
    const remainingCells = 42 - (totalDays + startDayOfWeek);
    for (let j = 1; j <= remainingCells && remainingCells < 42; j++) {
        const nextMonthCell = document.createElement('div');
        nextMonthCell.classList.add('calendar-day', 'next-month');
        nextMonthCell.innerText = j;
        calendarGrid.appendChild(nextMonthCell);
    }

    calendarDiv.appendChild(calendarGrid);
}
document.getElementById("calculateBtn").addEventListener("click", calculateMood);
