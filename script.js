function calculateMood() {
    const pillDateInput = document.getElementById("pillDate").value;
    if (!pillDateInput) {
        document.getElementById("result").innerHTML = "Please enter a valid date.";
        return;
    }

    const pillDate = new Date(pillDateInput);
    const today = new Date();
    const cycleLength = 28;

    // Calculate the current day in the cycle
    const dayDifference = Math.floor((today - pillDate) / (1000 * 60 * 60 * 24));
    const currentDayInCycle = dayDifference % cycleLength;

    let moodMessage = "";
    let adviceMessage = "";
    let moodClass = "";
    let foodAdvice = "";
    let relationshipAdvice = "";
    let cyclePhase = "";

    // Cycle phases and their descriptions
    if (currentDayInCycle >= 0 && currentDayInCycle <= 5) {
        moodMessage = "You're on your period. Energy might be low, and you may feel more tired.";
        adviceMessage = "Rest when needed, stay hydrated, and opt for light exercise to reduce cramps.";
        moodClass = "period"; // Red
        foodAdvice = "Eat: Warm, comforting foods. Drink: Herbal teas, stay hydrated.";
        relationshipAdvice = "Communicate openly about your need for rest and self-care.";
        cyclePhase = "Period (Days 1-5)";
    } else if (currentDayInCycle > 5 && currentDayInCycle <= 14) {
        moodMessage = "This is your follicular phase. Estrogen is rising, so you might feel more energetic and upbeat.";
        adviceMessage = "It's a great time for high-energy activities, socializing, and productivity.";
        moodClass = "beforePMS"; // Light orange
        foodAdvice = "Eat: Fresh fruits, lean proteins. Drink: Plenty of water.";
        relationshipAdvice = "Plan fun activities with your partner, as energy and confidence are high.";
        cyclePhase = "Follicular Phase (Days 6-14)";
    } else if (currentDayInCycle > 14 && currentDayInCycle <= 21) {
        moodMessage = "You're in the ovulation phase. You might feel confident and energized, but hormonal fluctuations could also cause anxiety.";
        adviceMessage = "Stay active, but also be mindful of possible mood swings. This is a good time for physical activities.";
        moodClass = "beforePMS"; // Light orange
        foodAdvice = "Eat: Nutrient-rich foods like leafy greens. Drink: Smoothies, fresh juices.";
        relationshipAdvice = "This is a great time for deep conversations or intimacy as emotions are heightened.";
        cyclePhase = "Ovulation (Days 15-21)";
    } else if (currentDayInCycle > 21 && currentDayInCycle <= 28) {
        moodMessage = "This is the luteal phase. PMS symptoms such as mood swings, cravings, and fatigue could be showing up.";
        adviceMessage = "Reduce stress, eat well-balanced meals, and consider doing calming activities like yoga.";
        moodClass = "pms"; // Dark orange
        foodAdvice = "Eat: Magnesium-rich foods, avoid sugar. Drink: Water, herbal tea.";
        relationshipAdvice = "Patience is key. Plan relaxing activities with your partner to avoid conflicts.";
        cyclePhase = "PMS (Days 22-28)";
    }

    // Update the mood message and advice
    document.getElementById("result").innerHTML = `
        <div class="advice-box ${moodClass}">
            Today is day ${currentDayInCycle + 1} of your cycle. ${moodMessage}
            <br><br>
            <strong>Advice:</strong> ${adviceMessage}
            <div class="advice-section"><strong>What to Eat & Drink:</strong> ${foodAdvice}</div>
            <div class="advice-section"><strong>Relationship Advice:</strong> ${relationshipAdvice}</div>
            <div class="advice-section"><strong>Cycle Phase:</strong> ${cyclePhase}</div>
        </div>
    `;

    // Generate the calendar for the current month including previous and next month
    generateCalendar(pillDate, currentDayInCycle);
}

function generateCalendar(pillDate, currentDayInCycle) {
    const calendarDiv = document.getElementById("calendar");
    calendarDiv.innerHTML = ""; // Clear any previous calendar

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

    // Add days from the previous month if the first day doesn't start on Sunday
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

        // Calculate the cycle day for this specific day
        const dayInCycle = (dayDifference + day - 1) % cycleLength;

        // Correctly highlight the pill start date based on the actual month
        if (pillDate.getDate() === day && pillDate.getMonth() === month) {
            dayCell.classList.add('highlight-start');
        }

        // Highlight today's date
        if (day === currentDay) {
            dayCell.classList.add('highlight-today');
        }

        // Assign emoji and class based on the cycle phase
        const emoji = document.createElement('span');
        emoji.classList.add('emoji');
        if (dayInCycle >= 0 && dayInCycle <= 5) {
            emoji.innerText = "😢"; // Sad for period phase
            dayCell.classList.add('period'); // Red for Period
        } else if (dayInCycle > 5 && dayInCycle <= 14) {
            emoji.innerText = "😊"; // Happy for follicular phase
            dayCell.classList.add('beforePMS'); // Light Orange for Follicular Phase
        } else if (dayInCycle > 14 && dayInCycle <= 21) {
            emoji.innerText = "😊"; // Happy for ovulation
            dayCell.classList.add('beforePMS'); // Light Orange for Ovulation
        } else if (dayInCycle > 21 && dayInCycle <= 28) {
            emoji.innerText = "😐"; // Neutral for PMS phase
            dayCell.classList.add('pms'); // Dark Orange for PMS (Luteal)
        }
        dayCell.appendChild(emoji);

        // Show how many days are left until PMS or Ovulation
        if (dayInCycle > 5 && dayInCycle <= 14) {
            dayCell.title = `${14 - dayInCycle} days until Ovulation`;
        } else if (dayInCycle > 21 && dayInCycle <= 28) {
            dayCell.title = `${28 - dayInCycle} days until PMS`;
        }

        calendarGrid.appendChild(dayCell);
    }

    


    // Add days from the next month to fill the remaining empty cells in the last row
    const remainingCells = 7 - ((totalDays + startDayOfWeek) % 7);
    for (let i = 1; i <= remainingCells && remainingCells < 7; i++) {
        const nextMonthDay = document.createElement('div');
        nextMonthDay.classList.add('calendar-day', 'next-month');
        nextMonthDay.innerText = i;
        calendarGrid.appendChild(nextMonthDay);
    }

    // Append the calendar grid to the main calendar div
    calendarDiv.appendChild(calendarGrid);
}
