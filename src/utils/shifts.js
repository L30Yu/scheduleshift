import moment from 'moment';

export default function calculate(state) {
    let { rulesDefinitions, shiftRules, timeoff, employees } = state;
    let employeesPerShift = getEmployeesPerShift(shiftRules, rulesDefinitions);
    let result = generateSchedule(employeesPerShift, timeoff, employees);
    return result;
}

function getEmployeesPerShift(shiftRules, rulesDefinitions, ruleName = 'EMPLOYEES_PER_SHIFT') {
    let rule = rulesDefinitions.find(item => item.value === ruleName);
    if (!rule) console.error('No ' + ruleName + ' rule found in Rules Definitions!!!')
    let ruleId = rule.id;

    let shiftRule = shiftRules.find(item => item.rule_id === ruleId);
    if (!shiftRule) console.error('No ' + ruleName + ' shift rule value found!!!')
    return shiftRule.value;
}

let generatedSchedule = [], weeklySchedule, employeeWeeklySchedule, events=[];

function generateSchedule(EMPLOYEES_PER_SHIFT, timeoff, employees) {

    let employeesPerShift;

    //loop for each week of the month of June (weeks 23-26)
    for (let w = 0; w < 4; w++) {
        let dateOfWeek = moment('2015-06-01','YYYY-MM-DD').day("Monday");
        //initialize a new week object for every new week
        weeklySchedule = {
            "week": 23 + w,
            "schedules": []
        }

        //set or reset our employees per shift tracking array
        employeesPerShift = [0, 0, 0, 0, 0, 0, 0];

        //check for each employee if they can work for any given day of the week
        for (let e = 0; e < employees.length; e++) {

            //initialize a new employeeWeeklySchedule object for every employee
            employeeWeeklySchedule = {
                "employee_id": null,
                "schedule": []
            }

            //check if current employee has time-off requests for the week
            let r = requestsForWeek(23 + w, e, timeoff, employees);

            //if they do have requests...
            if (r.length > 0) {
                //loop for each day of the week and keep track of the days an employee can work
                for (let d = 1; d < 8; d++) {
                    //if there not already enough employees assigned to this shift per the EMPLOYEES_PER_SHIFT rule...
                    if (employeesPerShift[d - 1] < EMPLOYEES_PER_SHIFT) {
                        //if there is no time-off request for today, schedule the employee for the day
                        if (!timeOffRequestContains(r, d, timeoff)) {
                            employeeWeeklySchedule.employee_id = employees[e].id;
                            employeeWeeklySchedule.schedule.push(d);
                            events.push({
                                id: events.length,
                                title: employees[e].name,
                                allDay: true,
                                start: dateOfWeek.add(d-1, 'day').toDate(),
                                end: dateOfWeek.add(d, 'day').toDate(),
                                
                            });
                            employeesPerShift[d - 1] = employeesPerShift[d - 1] + 1;
                        }
                    }
                }

                if (employeeWeeklySchedule.employee_id != null) {
                    weeklySchedule.schedules.push(employeeWeeklySchedule);
                }
            }
            //else, schedule them for every day of that week
            else {
                for (let d = 1; d < 8; d++) {
                    //if there not already enough employees assigned to this shift per the EMPLOYEES_PER_SHIFT rule...
                    if (employeesPerShift[d - 1] < EMPLOYEES_PER_SHIFT) {
                        employeeWeeklySchedule.employee_id = employees[e].id;
                        employeeWeeklySchedule.schedule.push(d);
                        events.push({
                            id: events.length,
                            title: employees[e].name,
                            allDay: true,
                            start: dateOfWeek.add(d-1, 'day').toDate(),
                            end: dateOfWeek.add(d, 'day').toDate(),
                        });
                        employeesPerShift[d - 1] = employeesPerShift[d - 1] + 1;
                    }
                }

                if (employeeWeeklySchedule.employee_id != null) {
                    weeklySchedule.schedules.push(employeeWeeklySchedule);
                }
            }
        }
        generatedSchedule.push(weeklySchedule);
    }
    return {schedule: generatedSchedule, events};
};

//a helper function to determine whether a list of time off requests contains a given day
function timeOffRequestContains(indicesList, day, timeoff) {
    let contains = false;

    //if there is more than one request object, loop through every list
    if (indicesList.length > 1) {
        for (let i = 0; i < indicesList.length; i++) {
            for (let j = 0; j < timeoff[indicesList[i]].days.length; j++) {
                if (timeoff[indicesList[i]].days[j] === day) {
                    contains = true;
                }
            }
        }
    }
    //else, just loop through the single request object
    else {
        let index = indicesList[0];
        for (let i = 0; i < timeoff[index].days.length; i++) {
            if (timeoff[index].days[i] === day) {
                contains = true;
            }
        }
    }

    return contains;
}

/*helper function to determine whether a given employee has time-off requests for a given week
returns an array of index locations of ALL time-off requests, if array is empty no requests have been made
*/
function requestsForWeek(currentWeek, employee, timeoff, employees) {
    let requests = [];

    for (let i = 0; i < timeoff.length; i++) {
        //if there exists a request of the same week, and same employee then store its index
        if (timeoff[i].week === currentWeek && timeoff[i].employee_id === employees[employee].id) {
            requests.push(i);
        }
    }
    return requests;
}