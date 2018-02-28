export default function calculate(state) {
    let { rulesDefinitions, shiftRules, timeoff, employees } = state;
    console.log(generateSchedule(shiftRules, timeoff, employees));
    return;
}
let generatedSchedule = [], weeklySchedule, employeeWeeklySchedule, EMPLOYEES_PER_SHIFT;
//implementing Features 1 & 2 - EMPLOYEES_PER_SHIFT rule and granting days off as per given requests
function generateSchedule(shiftRules, timeoff, employees){
    /*let employeesPerShift used as an array where the value in each index represents the number of employees scheduled 
    for a shift where index 0 is monday and index 6 is sunday
    serves to keep track of number of employees already assigned to a shift so as to uphold an EMPLOYEES_PER_SHIFT rule
    */
    let employeesPerShift; 

    //checking EMPLOYEES_PER_SHIFT value
    for (let i = 0; i < shiftRules.length; i++){
        if(shiftRules[i].rule_id === 7){
            EMPLOYEES_PER_SHIFT =  shiftRules[i].value;
        }
    }

    //loop for each week of the month of June (weeks 23-26)
    for(let w = 0; w < 4; w++){

        //initialize a new week object for every new week
        weeklySchedule = {
            "week": 23+w,
            "schedules": []
        }

        //set or reset our employees per shift tracking array
        employeesPerShift = [0, 0, 0, 0, 0, 0, 0];

        //check for each employee if they can work for any given day of the week
        for(let e = 0; e < employees.length; e++){

            //initialize a new employeeWeeklySchedule object for every employee
            employeeWeeklySchedule = {
                "employee_id": null,
                "schedule": []
            }

            //check if current employee has time-off requests for the week
            let r = requestsForWeek(23+w, e, timeoff, employees);

            //if they do have requests...
            if(r.length > 0){
                //loop for each day of the week and keep track of the days an employee can work
                for(let d = 1; d < 8; d++){
                    //if there not already enough employees assigned to this shift per the EMPLOYEES_PER_SHIFT rule...
                    if(employeesPerShift[d-1] < EMPLOYEES_PER_SHIFT){
                        //if there is no time-off request for today, schedule the employee for the day
                        if(!timeOffRequestContains(r, d, timeoff)){
                            employeeWeeklySchedule.employee_id = employees[e].id;
                            employeeWeeklySchedule.schedule.push(d); 
                            employeesPerShift[d-1] =  employeesPerShift[d-1] + 1;    
                        } 
                    }
                } 

                if(employeeWeeklySchedule.employee_id != null){
                    weeklySchedule.schedules.push(employeeWeeklySchedule);
                }
            }
            //else, schedule them for every day of that week
            else{
                for(let d = 1; d < 8; d++){
                    //if there not already enough employees assigned to this shift per the EMPLOYEES_PER_SHIFT rule...
                    if(employeesPerShift[d-1] < EMPLOYEES_PER_SHIFT){
                        employeeWeeklySchedule.employee_id = employees[e].id;
                        employeeWeeklySchedule.schedule.push(d);
                        employeesPerShift[d-1] =  employeesPerShift[d-1] + 1;
                    }
                }
                
                if(employeeWeeklySchedule.employee_id != null){
                    weeklySchedule.schedules.push(employeeWeeklySchedule);
                }
            }
        }
        generatedSchedule.push(weeklySchedule);
    }
};

//a helper function to determine whether a list of time off requests contains a given day
function timeOffRequestContains(indicesList, day, timeoff){
    let contains = false;

    //if there is more than one request object, loop through every list
    if(indicesList.length > 1){
        for(let i = 0; i < indicesList.length; i++){
            for(let j = 0; j < timeoff[indicesList[i]].days.length; j++){
                if(timeoff[indicesList[i]].days[j] === day){
                    contains = true;
                }
            }
        }
    }
    //else, just loop through the single request object
    else{
        let index = indicesList[0];
        for(let i = 0; i < timeoff[index].days.length; i++){
            if(timeoff[index].days[i] === day){
                contains = true;
            }
        }
    }

    return contains;
}

/*helper function to determine whether a given employee has time-off requests for a given week
returns an array of index locations of ALL time-off requests, if array is empty no requests have been made
*/
function requestsForWeek(currentWeek, employee, timeoff, employees){
    let requests = [];

    for(let i = 0; i < timeoff.length; i++){
        //if there exists a request of the same week, and same employee then store its index
        if(timeoff[i].week === currentWeek && timeoff[i].employee_id === employees[employee].id){
            requests.push(i);
        }
    }
    return requests;
}