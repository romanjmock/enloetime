var express = require('express');
var cors = require('cors');
var fs = require('node:fs');
var app = express();

var days = readCSV('Calendar.csv');
var headers = getCSVHeaders('Calendar.csv');

console.log(days);

app.use(cors({origin: true, credentials: true}));

app.get('/', (req, res) => {
    console.log(req.query.requestType);
    var info = {
        value: "nothing"
    };
    if(req.query.requestType == "dayType") {
        var found = false;
        days.forEach((item) => {
            console.log(item["date"] + ", " + req.query.date);
            if (item["date"] == req.query.date) {
                found = true
                console.log("item is " + item.JSON);
                info = {};
                headers.forEach((header) => {
                    info[header] = item[header];
                });
                console.log("item was " + JSON.stringify(item));
            }
        });
        if (!found) {
            console.log("not found, returning " + req.query.date);
            info = {
                date: req.query.date,
                earlyRelease: "false",
                teacherWorkday: "false",
                homeroom: "false",
                holiday: "false",
            }
        }
    }
    if (req.query.requestType == "dayTypeAB") {
        console.log("days type");
        var daysOffCount = 0;
        var requestDate = new Date(req.query.currentDate);
        console.log("request date is "+ requestDate.toUTCString());

        for (var i = 0; i < days.length; i++) {
            var dayDate = new Date(days[i]["date"])
            if (dayDate < requestDate) {
                console.log("valid day found");
                console.log("values are " + days[i]["teacherWorkday"] + ", and " + days[i]["holiday"]);
                if (days[i]["teacherWorkday"] == "true" || days[i]["holiday"] == "true") {
                    daysOffCount += 1;
                }
            }
        }
        numDays = (requestDate - new Date("9/30/2024")) / (1000 * 60 * 60 * 24);
        numDays -= daysOffCount;
        console.log("number of days is " + numDays);
        console.log("days off was " + daysOffCount);
        var dayTypeValue = "";
        if (numDays % 2 == 0) {
            dayTypeValue = "a";
        } else {
            dayTypeValue = "b";
        }
        // console.log("number of days is " + numDays);
        // console.log("days off count is " + daysOffCount);
        info = {
            date: req.query.currentDate,
            dayType: dayTypeValue
        }
    }
    value = "hello";
    res.json(info);
    console.log("get request recieved");
});

app.post('/', (req, res) => {
    console.log("post recieved");
});

app.listen(4001, () => {
    console.log("listening");
});

function readCSV(filename) {
    var result = []
    data = fs.readFileSync(filename).toString();
    var headerNames = data.substring(0, data.indexOf('\n') - 1);
    data = data.substring(data.indexOf('\n') + 1, data.length);

    var headers = []
    while (headerNames.length > 0) {
        var nextItem =  headerNames.indexOf(",");
        //console.log(nextItem);
        if (nextItem == -1) {
            headers.push(headerNames)
            headerNames = "";
        } else {
            headers.push(headerNames.substring(0, nextItem));
            headerNames = headerNames.substring(nextItem + 1, headerNames.length);
        }
        //console.log("names are " + headerNames);
    }

    while (data.length > 0) {
        var nextItem = data.indexOf("\n");
        var currentRow = "";
        var dict = [];
        if (nextItem != -1) {
            currentRow = data.substring(0, nextItem - 1);
            data = data.substring(nextItem + 1, data.length);
        } else {
            currentRow = data;
            data = "";
        }
        console.log("data is " + data);
        console.log("next item is " + nextItem);
        //console.log("current row is" + currentRow);
        for (var i = 0; i < headers.length; i++) {
            var index = currentRow.indexOf(",");
            var currentItem = "";
            //console.log("index is " + index);
            //console.log("current item is " + currentItem);
            if (index != -1) {
                currentItem = currentRow.substring(0, index);
                currentRow = currentRow.substring(index + 1, currentRow.length);
            } else {
                currentItem = currentRow;
            }
            dict[headers[i]] = currentItem;
        }
        result.push(dict);
        //console.log(currentItem + " appended");
    }
    return result;
}

function getCSVHeaders(filename) {
    data = fs.readFileSync(filename).toString();
    var headerNames = data.substring(0, data.indexOf('\n') - 1);
    data = data.substring(data.indexOf('\n') + 1, data.length);

    var headers = []
    while (headerNames.length > 0) {
        var nextItem =  headerNames.indexOf(",");
        //console.log(nextItem);
        if (nextItem == -1) {
            headers.push(headerNames)
            headerNames = "";
        } else {
            headers.push(headerNames.substring(0, nextItem));
            headerNames = headerNames.substring(nextItem + 1, headerNames.length);
        }
        //console.log("names are " + headerNames);
    }
    return headers;
}