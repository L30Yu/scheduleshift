const rootUrl = "http://interviewtest.replicon.com";

export function getEmployees(id) {
    let url = rootUrl + "/employees";
    if (id) {
        url += "/" + id;
    }
    return fetch(url).then(response => response.json());
}

export function getTimeOff() {
    let url = rootUrl + "/time-off/requests";
    return fetch(url).then(response => response.json());
}

export function getWeeks(week_number) {
    let url = rootUrl + "/weeks";
    if (week_number) {
        url += "/" + week_number;
    }
    return fetch(url).then(response => response.json());
}

export function getRuleDefinitions() {
    let url = rootUrl + "/rule-definitions";
    return fetch(url).then(response => response.json());
}

export function getShiftRules() {
    let url = rootUrl + "/shift-rules";
    return fetch(url).then(response => response.json());
}

export function postData(data) {
    let url = rootUrl + "/submit";
    let name = 'test';
    let email = 'test@test.com';
    let features = '&features[]=1&features=2';
    url += `?name=${name}&email=${email}${features}`;

    // Default options are marked with *
    return fetch(url, { 
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, PUT, DELETE, etc.
        redirect: 'follow', // *manual, error
        referrer: 'no-referrer', // *client
    })
        .then(response => response.json()) // parses response to JSON
}