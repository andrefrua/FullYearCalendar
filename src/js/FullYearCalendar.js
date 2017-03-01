/**
* Full year calendar - Used to highlight important events for specific days during the year
* @author André Rua
* @attribute {String} CalendarElementId - Id of the Html element where the calendar is created
* @attribute {String} InitialYear - Year which the calendar will be started with
* @attribute {Number} DayWidth - Width in pixels that should be applied to each day cell
* @attribute {String} CssClassMonthRow - Name of the Css Class to be applied to the row of the month (With the days numbers)
* @attribute {String} CssClassMonthName - Name of the Css Class to be applied to the cell of the Month name
* @attribute {String} CssClassWeekDayName - Name of the Css Class to be applied to the Week day name
* @attribute {String} CssClassDefaultDay - Name of the Css Class to be applied to all the days as a default
* @attribute {Boolean} ShowWeekDaysNameEachMonth - Shows the Week days names on each month. If false only shows one row at the top with the days names
* @attribute {Array} MonthNames - Array of string with the names to give to the Months (Ex: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
* @attribute {Array} WeekDayNames - Array of string with the names to give to the week days (Ex: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
* @attribute {String} WeekStartDay - Name of the day to start the week with. Possibilities 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'. If not provided it will start on Sunday
* @attribute {String} AlignInContainer - Aligns the calendar in the container according to the attribute. ('left', 'center', 'right')
* @attribute {Boolean} ShowLegend - Show a legend with all the attributes defined on the CustomDates object
* @attribute {String} LegendStyle - Changes the style of the legend between inline or listed ('Inline' / 'Block')
* @attribute {Boolean} ShowNavigationToolBar - Show the toolbar with built in navigation between year and currently selected year as well
* @attribute {Array} CustomDates - Array of Objects TODO: Add documentation for this property
* @attribute {Array} CustomDatesCaption - Array of Objects TODO: Add documentation for this property
*/
var FullYearCalendar = {
    TotalNumberOfDays: 41, //Total number of days. It's set to 37 + 4 (To fill gap on mobile view) because it's the maximum possible value to attain with the gap between starting and end of days in the month
    DayWidth: 30,
    ShowWeekDaysNameEachMonth: false,
    MonthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    WeekDayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    AlignInContainer: 'center',
    WeekStartDay: 'Sun',
    ShowLegend: false,
    LegendStyle: 'Inline', //Inline / Block
    ShowNavigationToolBar: false,
    CssClassMonthRow: 'fyc_MonthRow',
    CssClassMonthName: 'fyc_MonthName',
    CssClassWeekDayName: 'fyc_WeekDayName',
    CssClassDefaultDay: 'fyc_DefaultDay',
    CssClassSelectedDay: 'fyc_SelectedDay',
    /**
     * Navigates to the next year according to the current selected year
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     */
    GoToNextYear: function (calendarElementId) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];
        calendar ? this._setSelectedYear(calendar, calendar.year + 1) : null;
    },
    /**
     * Navigates to the previous year according to the current selected year
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     */
    GoToPreviousYear: function (calendarElementId) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];
        calendar ? this._setSelectedYear(calendar, calendar.year - 1) : null;
    },
    /**
     * Navigates to the received year as long as it is above 1970
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     * @param {Number} yearToShow - Year to navigate to
     */
    GoToYear: function (calendarElementId, yearToShow) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];
        yearToShow = typeof yearToShow === 'number' && yearToShow > 1970 ? yearToShow : false;

        yearToShow && calendar ? this._setSelectedYear(calendar, yearToShow) : null;
    },
    /**
     * Refreshes the calendar with the new custom dates received
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     * @param {Array} customDatesToAdd - New array of Custom dates to be added to the calendar
     */
    RefreshCustomDates: function (calendarElementId, customDatesToAdd) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];

        customDatesToAdd && calendar ? calendar.CustomDates = customDatesToAdd : calendar.CustomDates = calendar.CustomDates;
        calendar ? this._setSelectedYear(calendar, calendar.year) : null;
    },
    /**
     * Refits the CAlendar to the container in case the container isn't visible at page load
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     */
    FitToContainer: function (calendarElementId) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];
        calendar ? this._fitToContainer(calendar, this._calcTotalCalendarWidth(calendar)) : null;
    },
    /**
     * Initializes the plugin
     * @param {Object} calendar - Object of the representing the calendar
     */
    Init: function (calendar) {
        var divCalendarContainer = document.createElement('div');
        //Let's check if JQUERY is available, if not the plugin won't start
        if (!window.jQuery) {
            document.write('<p style="color:#FF0000;">*** JQuery is needed to use FullYearCalendar ***</p>');
            return;
        }

        this._setDefaultValues(calendar);

        //Creates a main container for the calendar content. This was created in order to be able to center the calendar relative to the container supplied when initializing the plugin
        divCalendarContainer.id = 'fyc_' + calendar.ContainerElementId;
        divCalendarContainer.style.display = 'inline-block';
        document.getElementById(calendar.ContainerElementId).appendChild(divCalendarContainer);
        document.getElementById(calendar.ContainerElementId).style.textAlign = this.AlignInContainer;

        calendar.ContainerElement = document.getElementById(divCalendarContainer.id);
        calendar.MonthDaysArray = [];

        //calendar.over = typeof (calendar.MouseOver) == 'function' ? calendar.OnClick : false;

        for (var iMonth = 0; iMonth < 12; iMonth++) {
            calendar.MonthDaysArray[iMonth] = [];
            this.CreateCalendar(calendar, iMonth);
        }

        this._addWeekDayNamesRow(calendar);

        if (calendar.ShowNavigationToolBar === true) this._addNavigationToolBar(calendar);

        FullYearCalendar['fyc' + calendar.ContainerElementId] = calendar; //Stores the current calendar so we don'eventType have to recreate everything when changing the year
        this._setSelectedYear(calendar, calendar.InitialYear);

        this._initEventHandlers(calendar); //Inits the needed handlers for resize

        this._addLegend(calendar); //Adds the legend

        this._fitToContainer(calendar, this._calcTotalCalendarWidth(calendar)); //Fits the calendar to the container
    },
    /**
     * Gets an array of all selected days
     * @param {String} calendarElementId - Id of the Html element where the calendar is created
     * @returns {Array} Selected days
     */
    GetSelectedDays: function (calendarElementId) {
        var calendar = FullYearCalendar['fyc' + calendarElementId];
        return calendar._selectedDaysList ? calendar._selectedDaysList : new Array();
    },
    /**
     * Creates the row for the received month
     * @param {Object} calendar - Object of the representing the calendar
     * @param {Object} currentMonth - Month to create the row for. The value starts at 0 to 11
     */
    CreateCalendar: function (calendar, currentMonth) {
        //Creation of the containers
        var divMonthInformation = document.createElement('div'); //Container where the number of days will be added
        var divDaysNumbers = document.createElement('div'); //Container for the numbers for the days
        var divMonthName = document.createElement('div'); //Container for the Name of the month


        //Container for the month name to be able to have the vertical align = middle
        var divMonthNameContainer = document.createElement('div');
        divMonthNameContainer.style.float = 'left';

        //Month name column
        divMonthName.className = calendar.CssClassMonthName;
        divMonthName.setAttribute('fyc_monthname', 'true');
        divMonthName.style.display = 'table-cell';
        divMonthName.style.verticalAlign = 'middle';
        divMonthName.innerHTML = this.MonthNames[currentMonth];
        divMonthName.style.fontSize = parseInt(calendar.DayWidth / 2) + 'px';
        divMonthName.style.height = calendar.DayWidth + 'px';
        divMonthName.style.minWidth = 80 + 'px';

        divMonthNameContainer.appendChild(divMonthName);
        calendar.ContainerElement.appendChild(divMonthNameContainer);

        //Month days information
        divMonthInformation.style.position = 'relative';
        divMonthInformation.className = calendar.CssClassMonthRow;
        divMonthInformation.setAttribute('fyc_monthrow', 'true');
        divMonthInformation.style.float = 'left';

        calendar.ContainerElement.appendChild(divMonthInformation);

        //Adds a clear div so the next month shows under the previous one
        var divClearFix = document.createElement('div');
        divClearFix.style.clear = 'both';
        calendar.ContainerElement.appendChild(divClearFix);

        divMonthInformation.appendChild(divDaysNumbers);

        var divWeekRow; //Container representing the weeks, applied so the pluging could be somewhat responsive
        var divDayNumber; //Container for the number of the day

        //Creates the containers for the days of the actual days
        for (var iDay = 0; iDay <= this.TotalNumberOfDays; iDay++) {
            //Creates a new container at the start of each week
            if (iDay % 7 === 0) {
                divWeekRow = document.createElement('div');
                divWeekRow.className = 'weekContainer';
                divWeekRow.style.float = 'left';
            }

            //Number of the days container
            divDayNumber = document.createElement('div'); //Created new div for the days
            divDayNumber.setAttribute('fyc_defaultday', 'true');
            divDayNumber.style.height = calendar.DayWidth + 'px';
            divDayNumber.style.minWidth = calendar.DayWidth + 'px';
            divDayNumber.style.fontSize = parseInt(calendar.DayWidth / 2.1) + 'px';
            divDayNumber.style.display = 'table-cell';
            divDayNumber.style.textAlign = 'center';
            divDayNumber.style.verticalAlign = 'middle';

            if (iDay > 37) {
                divDayNumber.setAttribute('isdummyday', true);
                divDayNumber.style.display = 'none';
            }

            divDayNumber.innerHTML = iDay;

            divWeekRow.appendChild(divDayNumber);

            divDaysNumbers.appendChild(divWeekRow);

            divDayNumber = [divDayNumber];

            //Creates the events for the days
            typeof calendar.OnDayClick === 'function' ? this._addDayEvent(divDayNumber[0], 'click', '_dayClick', calendar, divDayNumber) : null;

            calendar.MonthDaysArray[currentMonth].push(divDayNumber);
        }
        divDaysNumbers.style.height = divDayNumber[0].offsetHeight + 'px'; //Set the height of the row for the days numbers
    },
    /**
     * Sets the default values needed for the plug in to work in case they aren'eventType supplied by the on the initialization
     * @param {Object} calendar - Object of the representing the calendar
     */
    _setDefaultValues: function (calendar) {
        this.ShowWeekDaysNameEachMonth = typeof calendar.ShowWeekDaysNameEachMonth === 'undefined' ? this.ShowWeekDaysNameEachMonth : calendar.ShowWeekDaysNameEachMonth;
        this.MonthNames = typeof calendar.MonthNames === 'undefined' ? this.MonthNames : calendar.MonthNames;
        this.WeekDayNames = typeof calendar.WeekDayNames === 'undefined' ? this.WeekDayNames : calendar.WeekDayNames;
        this.AlignInContainer = typeof calendar.AlignInContainer === 'undefined' ? this.AlignInContainer : calendar.AlignInContainer;
        this.WeekStartDay = typeof calendar.WeekStartDay === 'undefined' ? this.WeekStartDay : calendar.WeekStartDay;

        //Default values for current instance
        calendar.InitialYear = typeof calendar.InitialYear === 'undefined' ? new Date().getFullYear() : calendar.InitialYear;
        calendar.WeekStartDayNumber = this._getWeekDayNumberFromName(this.WeekStartDay);
        calendar.DayWidth = typeof calendar.DayWidth === 'undefined' ? this.DayWidth : calendar.DayWidth;
        calendar.ShowLegend = typeof calendar.ShowLegend === 'undefined' ? this.ShowLegend : calendar.ShowLegend;
        calendar.LegendStyle = typeof calendar.LegendStyle === 'undefined' ? this.LegendStyle : calendar.LegendStyle;
        calendar.TotalCalendarWidth = typeof calendar.TotalCalendarWidth === 'undefined' ? this._calcTotalCalendarWidth(calendar) : 0;
        calendar.ShowNavigationToolBar = typeof calendar.ShowNavigationToolBar === 'undefined' ? this.ShowNavigationToolBar : calendar.ShowNavigationToolBar;        

        //Default class names if they are not supplied
        calendar.CssClassMonthRow = typeof calendar.CssClassMonthRow === 'undefined' ? this.CssClassMonthRow : calendar.CssClassMonthRow;
        calendar.CssClassMonthName = typeof calendar.CssClassMonthName === 'undefined' ? this.CssClassMonthName : calendar.CssClassMonthName;
        calendar.CssClassWeekDayName = typeof calendar.CssClassWeekDayName === 'undefined' ? this.CssClassWeekDayName : calendar.CssClassWeekDayName;
        calendar.CssClassDefaultDay = typeof calendar.CssClassDefaultDay === 'undefined' ? this.CssClassDefaultDay : calendar.CssClassDefaultDay;
        calendar.CssClassSelectedDay = typeof calendar.CssClassSelectedDay === 'undefined' ? this.CssClassSelectedDay : calendar.CssClassSelectedDay;
    },
    /**
     * Changes the calendar to reflect the year that was actually selected
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Number} currentYear - Value of the year to be used
     */
    _setSelectedYear: function (calendar, currentYear) {
        calendar.year = currentYear;
        for (var iMonth = 0; iMonth < 12; iMonth++) {
            this._setMonth(calendar, calendar.year, iMonth);
        }
        typeof calendar.OnYearChanged === 'function' ? calendar.OnYearChanged(calendar.year) : null;
    },
    /**
     * Changes the layout of the calendar to reflect the actual month of the selected year
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Number} currentYear - Value of the year that will be used
     * @param {Number} currentMonth - Value of the month that will be used
     */
    _setMonth: function (calendar, currentYear, currentMonth) {
        //Gets the first day of the month so we know in which cell the month should start
        var firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() - calendar.WeekStartDayNumber;
        firstDayOfMonth = firstDayOfMonth < 0 ? 7 + firstDayOfMonth : firstDayOfMonth;

        //Calculate the last day of the month
        var lastDayOfMonth = new Date(currentYear, currentMonth + 1, 1, -1).getDate();

        //Loops through all the days cell created previously and changes it's content accordingly
        for (var iDayCell = 0; iDayCell < calendar.MonthDaysArray[currentMonth].length; iDayCell++) {

            //If it's an actual day for the current month then adds the correct day if not then adds an empty string
            var dayCellContent = iDayCell >= firstDayOfMonth && iDayCell < firstDayOfMonth + lastDayOfMonth ? iDayCell - firstDayOfMonth + 1 : '';

            //Stores the Year, Month and Day no the calendar object as [yyyy, month, day]
            calendar.MonthDaysArray[currentMonth][iDayCell][1] = dayCellContent ? [currentYear, currentMonth + 1, iDayCell - firstDayOfMonth + 1] : '';
            //Adds the content to the actual Html cell
            calendar.MonthDaysArray[currentMonth][iDayCell][0].innerText = dayCellContent; //dayCellContent && dayCellContent < 10 ? '0' + dayCellContent : dayCellContent;
            //Reapply the default Css class for the day
            calendar.MonthDaysArray[currentMonth][iDayCell][0].className = calendar.CssClassDefaultDay;

            //Applies Customer dates style to the calendar
            if (dayCellContent !== '') {
                var yearValue = calendar.MonthDaysArray[currentMonth][iDayCell][1][0]; //Year index
                var monthValue = calendar.MonthDaysArray[currentMonth][iDayCell][1][1]; //Month index
                var dayValue = calendar.MonthDaysArray[currentMonth][iDayCell][1][2]; //Day index

                var currentDate = new Date(yearValue, monthValue - 1, dayValue); //Uses the previously stored date information
                calendar.MonthDaysArray[currentMonth][iDayCell][0].className += this._applyCustomDateStyle(calendar.CustomDates, currentDate);
            } else {
                //Add the class hideInMobile to the DayCell above and equal to 35 because if that cell is empty then the entire row can be hidden
                if (iDayCell >= 35 && calendar.MonthDaysArray[currentMonth][35][0].innerText === '')
                    calendar.MonthDaysArray[currentMonth][iDayCell][0].className += ' hideInMobile'; //This class will be used to hide these cell when in Mobile mode                    
            }
        }
    },
    /**
     * Checks the possible Custom dates that can be added to the Calendar
     * @param {Array} customDates - Represents the Calendar initial object
     * @param {Date} currentDate - Current date
     * @return {String} The name of the Css Class that should be applied to the day. The name will be the same as the property defined on the CustomDates object
     */
    _applyCustomDateStyle: function (customDates, currentDate) {
        var cssClassToApply = '';
        currentDate = currentDate.setHours(0, 0, 0, 0);
        //Loops through all the the properties in the CustomDates object
        for (var property in customDates) {
            if (customDates.hasOwnProperty(property)) { //Just to confirm that the object actually has the property
                //Since we have several possibities to add the array of Dates we need several checks
                //1 - If it's an object then it can be a range with start and end properties
                if (customDates[property] && customDates[property].constructor === Object) {
                    if (customDates[property].hasOwnProperty('start') && customDates[property].hasOwnProperty('end')) {
                        //Let's confirm that the values inside the start and end properties are actual dates
                        var startDate = new Date(customDates[property].start);
                        var endDate = new Date(customDates[property].end);
                        if (startDate instanceof Date && !isNaN(startDate.valueOf()) && endDate instanceof Date && !isNaN(endDate.valueOf()))
                            if (currentDate >= startDate.setHours(0, 0, 0, 0) && currentDate <= endDate.setHours(0, 0, 0, 0))
                                cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    }
                }

                //2 - If it's an array of Dates then we must apply the style to each one of them if they exist in the calendar
                if (customDates[property] && customDates[property].constructor === Array) {
                    customDates[property].forEach(function (auxDate) { //Checks if the current date exists in the Array
                        auxDate = new Date(auxDate);
                        if (auxDate instanceof Date && !isNaN(auxDate.valueOf()))  //Validates if the value is an actual date
                            if (currentDate === auxDate.setHours(0, 0, 0, 0))
                                cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    });
                }

                //3 -If it's an array of periods for the same property, for example several periods of vacations
                if (customDates[property].constructor === Array && customDates[property].length > 0 && customDates[property][0].constructor === Object) {
                    customDates[property].forEach(function (auxPeriod) { //Checks if the current date exists in the Array
                        //Let's confirm that the values inside the start and end properties are actual dates
                        var startDate = new Date(auxPeriod.start);
                        var endDate = new Date(auxPeriod.end);
                        if (startDate instanceof Date && !isNaN(startDate.valueOf()) && endDate instanceof Date && !isNaN(endDate.valueOf()))
                            if (currentDate >= startDate.setHours(0, 0, 0, 0) && currentDate <= endDate.setHours(0, 0, 0, 0))
                                cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    });
                }

                //4 - Weekdays to give special layout
                if (customDates[property] && customDates[property].constructor === String) {

                    var arrayCustomDays = customDates[property].split(',');

                    arrayCustomDays.forEach(function (customDay) {
                        var dayNumber = -1;
                        switch (customDay) {
                            case 'Sun':
                                dayNumber = 0;
                                break;
                            case 'Mon':
                                dayNumber = 1;
                                break;
                            case 'Tue':
                                dayNumber = 2;
                                break;
                            case 'Wed':
                                dayNumber = 3;
                                break;
                            case 'Thu':
                                dayNumber = 4;
                                break;
                            case 'Fri':
                                dayNumber = 5;
                                break;
                            case 'Sat':
                                dayNumber = 6;
                                break;
                        }
                        if (new Date(currentDate).getDay() === dayNumber)
                            cssClassToApply += ' ' + property; //Name of the property. A Css class with the same name should exist
                    });
                }
            }
        }
        return cssClassToApply;
    },
    /**
     * Adds the row with the Week names either to each one of the months or only one on top of the calendar
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _addWeekDayNamesRow: function (calendar) {
        //Gets an array with all the containers of the months
        var arrayDivMonths = jQuery('#' + calendar.ContainerElementId).find('[fyc_monthrow], .has-fyc_monthrow');
        //Gets an array with all the containers with the Months names
        var arrayDivMonthsNames = jQuery('#' + calendar.ContainerElementId).find('[fyc_monthname], .has-fyc_monthname');

        //Creates one container for each month
        for (var iMonth = 0; iMonth < 12; iMonth++) {
            //Creation of the containers
            var divWeekDayNames = document.createElement('div'); //Container for all the week days names
            divWeekDayNames.className = 'divWeekDayNamesMonthly';
            if (!this.ShowWeekDaysNameEachMonth)
                divWeekDayNames.style.display = 'none';

            this._addWeekDayNamesToContainer(calendar, divWeekDayNames);

            //Sets the styles for the containers
            //arrayDivMonthsNames[iMonth].style.top = arrayDivMonths[iMonth].offsetTop + 'px';
            //Adds the week names div at the start of the Month row div
            arrayDivMonths[iMonth].insertBefore(divWeekDayNames, arrayDivMonths[iMonth].firstChild);
            //Changes the height to the same as the first cell with the week day name
            arrayDivMonths[iMonth].firstChild.style.height = divWeekDayNames.firstChild.offsetHeight + 'px';
        }

        //Creates one container to be placed at the top of the calendar
        //Shows week days on top of the calendar once
        divWeekDayNames = document.createElement('div'); //Container to where the days week names will be added
        var divLeftContainer = document.createElement('div'); //Container that will be on top of the Months names
        var divRightContainer = document.createElement('div'); //Container that will actually have the Week days names
        divWeekDayNames.className = 'divWeekDayNamesYearly';

        if (this.ShowWeekDaysNameEachMonth)
            divWeekDayNames.style.display = 'none';

        //Fills the left container and adds it to the Main div
        divLeftContainer.className = calendar.CssClassMonthName;
        divLeftContainer.style.float = 'left';
        divLeftContainer.style.minWidth = 80 + 'px';
        divLeftContainer.innerHTML = '&nbsp;';
        divWeekDayNames.appendChild(divLeftContainer);

        //Fills the actual week day names and add it to the main container
        divRightContainer.className = calendar.CssClassMonthRow;
        divRightContainer.style.float = 'left';
        this._addWeekDayNamesToContainer(calendar, divRightContainer);
        divWeekDayNames.appendChild(divRightContainer);

        //Adds a clear div so the next month shows under the previous one
        var divClearFix = document.createElement('div');
        divClearFix.style.clear = 'both';
        divWeekDayNames.appendChild(divClearFix);
        //Adds the names to the top of the main Calendar container
        calendar.ContainerElement.insertBefore(divWeekDayNames, calendar.ContainerElement.firstChild);
    },
    /**
     * Creates the Html elements for the navigation toolbar and adds them to the main container at the top
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _addNavigationToolBar: function(calendar){
        /* BEGIN: TESTING NEW NAV TOOLBAR */
        var divNavToolbarWrapper = document.createElement('div'); //Container to where the days week names will be added
        divNavToolbarWrapper.className = 'fyc_NavToolbarWrapper';


        var divBlockNavLeftButton = document.createElement('div');
        divBlockNavLeftButton.className = 'fyc_NavToolbarContainer'
        var btnPreviousYear = document.createElement('button');
        btnPreviousYear.className = 'btn btn-default btn-sm';
        btnPreviousYear.title = 'Previous year';
        var iconPreviousYear = document.createElement('i');
        iconPreviousYear.className = 'fa fa-chevron-left';
        btnPreviousYear.appendChild(iconPreviousYear);
        divBlockNavLeftButton.appendChild(btnPreviousYear);

        var divBlockNavCurrentYear = document.createElement('div');
        divBlockNavCurrentYear.className = 'fyc_NavToolbarContainer'
        var spanSelectedYear = document.createElement('span');
        spanSelectedYear.className = 'fyc_NavToolbarSelectedYear';
        spanSelectedYear.innerText = 'CURRENT YEAR';
        divBlockNavCurrentYear.appendChild(spanSelectedYear);

        var divBlockNavRightButton = document.createElement('div');
        divBlockNavRightButton.className = 'fyc_NavToolbarContainer';
        var btnNextYear = document.createElement('button');
        btnNextYear.className = 'btn btn-default btn-sm';
        btnNextYear.title = 'Next year';
        //Adds the event click to the Next year button
        var currentCalendarInstance = this;
        if (btnNextYear.addEventListener) {  // all browsers except IE before version 9
            btnNextYear.addEventListener("click", function () { currentCalendarInstance._YearNavigation(calendar) }, false);
        } else {
            if (btnNextYear.attachEvent) {   // IE before version 9
                btnNextYear.attachEvent("click", this._YearNavigation);
            }
        }




        var iconNextYear = document.createElement('i');
        iconNextYear.className = 'fa fa-chevron-right';
        btnNextYear.appendChild(iconNextYear);
        divBlockNavRightButton.appendChild(btnNextYear);

        divNavToolbarWrapper.appendChild(divBlockNavLeftButton);
        divNavToolbarWrapper.appendChild(divBlockNavCurrentYear);
        divNavToolbarWrapper.appendChild(divBlockNavRightButton);

        calendar.ContainerElement.insertBefore(divNavToolbarWrapper, calendar.ContainerElement.firstChild);
        /* END: TESTING NEW NAV TOOLBAR */
    },
    /**
     * Adds the cells with the week day names with a container for each week
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Object} containerToAddWeekDayNames - Container where to place the week day names
     */
    _addWeekDayNamesToContainer: function (calendar, containerToAddWeekDayNames) {

        var divWeekRow; //Container representing the weeks, applied so the pluging could be somewhat responsive

        for (var iDay = 0; iDay <= this.TotalNumberOfDays; iDay++) {

            //Creates a new container at the start of each week
            if (iDay % 7 === 0) {
                divWeekRow = document.createElement('div');
                divWeekRow.className = 'weekContainer weekDay';
                divWeekRow.style.float = 'left';
            }

            //Week name container
            var divWeekDayName = document.createElement('div'); //Created new div for the name of the week

            divWeekDayName.innerHTML = this.WeekDayNames[iDay % 7];
            divWeekDayName.className = calendar.CssClassWeekDayName;
            divWeekDayName.setAttribute('fyc_weekdayname', 'true');
            divWeekDayName.style.height = calendar.DayWidth + 'px';
            divWeekDayName.style.minWidth = calendar.DayWidth + 'px';
            divWeekDayName.style.fontSize = parseInt(calendar.DayWidth / 2.1) + 'px';
            divWeekDayName.style.display = 'table-cell';
            divWeekDayName.style.textAlign = 'center';
            divWeekDayName.style.verticalAlign = 'middle';

            if (iDay > 37) {
                divWeekDayName.setAttribute('isdummyday', true);
                divWeekDayName.style.display = 'none';
            }

            divWeekRow.appendChild(divWeekDayName);

            containerToAddWeekDayNames.appendChild(divWeekRow);
        }
    },
    /**
     * Gets the week day number from the received name
     * @param {String} weekDayName - Name of day of the week ('Sun','Mon','Tue','Wed','Thu','Fri','Sat')
     * @returns {Number} Number representing the Week day
     */
    _getWeekDayNumberFromName: function (weekDayName) {
        switch (weekDayName) {
            case 'Sun':
                return 0;
            case 'Mon':
                return 1;
            case 'Tue':
                return 2;
            case 'Wed':
                return 3;
            case 'Thu':
                return 4;
            case 'Fri':
                return 5;
            case 'Sat':
                return 6;
            default:
                return 0;
        }
    },
    /**
     * Adds the legend to the FullYearCalendar according to each propoerty defined on the CustomDates object
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _addLegend: function (calendar) {
        if (calendar.ShowLegend !== true) return;
        var legendContainer = document.createElement('div');
        legendContainer.className = 'fyc_legendContainer';

        for (var property in calendar.CustomDates) {
            //DefaultDay container that will look similar to the Day cell on the calendar
            var divPropertyDefaultDay = document.createElement('div');
            divPropertyDefaultDay.className = property;
            divPropertyDefaultDay.style.width = calendar.DayWidth + 'px';
            divPropertyDefaultDay.style.height = calendar.DayWidth + 'px';

            //Default Day container
            var divPropertyDefaultDayContainer = document.createElement('div');
            divPropertyDefaultDayContainer.className = 'fyc_legendPropertyDay';
            divPropertyDefaultDayContainer.style.display = 'table-cell';
            divPropertyDefaultDayContainer.appendChild(divPropertyDefaultDay);

            legendContainer.appendChild(divPropertyDefaultDayContainer);

            //Property caption
            var divPropertyCaption = document.createElement('div');
            divPropertyCaption.className = 'fyc_legendPropertyCaption';

            divPropertyCaption.innerText = calendar.CustomDatesCaption && calendar.CustomDatesCaption[property] ? calendar.CustomDatesCaption[property] : property;

            divPropertyCaption.style.display = 'table-cell';
            divPropertyCaption.style.verticalAlign = 'middle';

            legendContainer.appendChild(divPropertyCaption);

            if (calendar.LegendStyle === 'Block') {
                var divClearBoth = document.createElement('div');
                divClearBoth.className = 'fyc_legendVerticalClear';
                divClearBoth.style.clear = 'both';
                legendContainer.appendChild(divClearBoth);
            }
        }

        document.getElementById('fyc_' + calendar.ContainerElementId).appendChild(legendContainer);
    },
    /**
     * Fits the calendar to the parent container size. If the calendar is too large then it will change display style to mobile
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _fitToContainer: function (calendar) {
        //Exits if the Width is set to 0, because it means that the container is not visible on screen
        if (jQuery('#' + calendar.ContainerElementId).width() === 0) return;

        if (jQuery('#' + calendar.ContainerElementId).width() < calendar.TotalCalendarWidth) {
            //This was changed because the original calc didn't work with firefox, so now it used the cantainer total width divided by six (because there are 6 weeks)
            jQuery('#' + calendar.ContainerElementId).find('[fyc_defaultday], .has-fyc_defaultday').css('width', jQuery('#' + calendar.ContainerElementId).width() / 6 + 'px');
            jQuery('#' + calendar.ContainerElementId).find('[fyc_weekdayname], .has-fyc_weekdayname').css('width', jQuery('#' + calendar.ContainerElementId).width() / 6 + 'px');

            jQuery('.weekContainer.weekDay:nth-child(n+2)').css({ 'display': 'none' });

            //Shows the dummy days because on small format they are needed - NOTE: The order between the hideInMobile and IsDummyDay can't be changed or it won't work
            jQuery('#' + calendar.ContainerElementId).find('[isdummyday], .has-isdummyday').css('display', 'table-cell');

            jQuery('.hideInMobile').css('display', 'none');

            //WeekDays names handling
            jQuery('.divWeekDayNamesMonthly').css('display', 'block');
            jQuery('.divWeekDayNamesYearly').css('display', 'none');

            jQuery('.monthName').css('text-align', 'left');
        }
        else {
            jQuery('#' + calendar.ContainerElementId).find('[fyc_defaultday], .has-fyc_defaultday').css({ 'width': calendar.DayWidth + 'px' });
            jQuery('#' + calendar.ContainerElementId).find('[fyc_weekdayname], .has-fyc_weekdayname').css({ 'width': calendar.DayWidth + 'px' });
            jQuery('.weekContainer.weekDay:nth-child(n+2)').css({ 'display': 'block' });
            //Hides the dummy days because on big format they aren't needed - NOTE: The order between the hideInMobile and IsDummyDay can't be changed or it won't work
            jQuery('.hideInMobile').css('display', 'table-cell');
            jQuery('#' + calendar.ContainerElementId).find('[isdummyday], .has-isdummyday').css('display', 'none');

            //WeekDays names handling
            jQuery('.divWeekDayNamesMonthly').css('display', 'none');
            jQuery('.divWeekDayNamesYearly').css('display', 'block');

            jQuery('.monthName').css('text-align', 'right');
        }
    },
    /**
     * Calculate the total width of the calendar using the elements width
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _calcTotalCalendarWidth: function (calendar) {
        calendar.TotalCalendarWidth = calendar.DayWidth * 41
                + jQuery('#' + calendar.ContainerElementId).find('[fyc_monthname], .has-fyc_monthname').width()
                + jQuery('#' + calendar.ContainerElementId).find('[fyc_monthname], .has-fyc_monthname').outerWidth()
                + jQuery('#' + calendar.ContainerElementId).find('[fyc_monthname], .has-fyc_monthname').innerWidth()
                - calendar.DayWidth * 4;
    },
    /**
     * Initializes the needed event handlers for the calendar
     * @param {Object} calendar - Represents the Calendar initial object
     */
    _initEventHandlers: function (calendar) {
        var currentCalendarInstance = this;

        this._calcTotalCalendarWidth(calendar);

        jQuery(document).ready(function () {
            jQuery(window).resize(function () {
                currentCalendarInstance._fitToContainer(calendar); //Resizes the calendar to the container                
            });
        });
    },
    /**
     * Associates an event to a specific day, any type of event can be added here
     * @param {Object} sender - Element of the Day to which the event should be associated
     * @param {String} eventType - Event type (click, mouseover, or any other possible type)
     * @param {String} functionToCall - Name of the function that should be called when the event is fired
     * @param {Object} containerElement - Represents the Calendar initial object
     * @param {Object} containerArray - Actual container of the day
     */
    _addDayEvent: function (sender, eventType, functionToCall, containerElement, containerArray) {
        var currentFullYearCalendar = this; //Sets a variable with the current FullYearCalendar instance

        if (sender.addEventListener) { //For newers browsers
            sender.addEventListener(eventType, function (e) { return currentFullYearCalendar[functionToCall](containerElement, containerArray); }, false);
        }
        else if (sender.attachEvent) { //For older browsers
            sender.attachEvent('on' + eventType, function (e) { return currentFullYearCalendar[functionToCall](containerElement, containerArray); });
        }
    },
    /**
     * Handles the Day click event and fires the OnDayClick function so it's possible to apply some kind of functionality on Day click
     * @param {Object} calendar - Represents the Calendar initial object
     * @param {Object} dayArray - Complete object representing the day that was clicked
     */
    _dayClick: function (calendar, dayArray) {
        //We can add default stuff here when the day is clicked. For now we will call the function
        //dayArray[0] - Full day container. Can be used to change the style on click
        //dayArray[1] - Date value for the clicked day

        if (!dayArray[1]) return; //Exists right away if it's not a valid day

        //Checked if there is already a list of selected days
        if (calendar._selectedDaysList) {
            var selectedDayIndex = calendar._selectedDaysList.indexOf(new Date(dayArray[1]).toISOString().slice(0, 10));
            if (selectedDayIndex > -1) {
                calendar._selectedDaysList.splice(selectedDayIndex, 1);
                dayArray[0].className = dayArray[0].className.replace(' ' + calendar.CssClassSelectedDay, '');
            } else {
                calendar._selectedDaysList.push(new Date(dayArray[1]).toISOString().slice(0, 10));
                dayArray[0].className += ' ' + calendar.CssClassSelectedDay;
            }
        } else {
            calendar._selectedDaysList = new Array(new Date(dayArray[1]).toISOString().slice(0, 10));
            dayArray[0].className += ' ' + calendar.CssClassSelectedDay;
        }
        calendar.OnDayClick(dayArray[0], new Date(dayArray[1]));
    }
};