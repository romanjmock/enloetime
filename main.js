//const { URL, URLSearchParams } = require('url');

//console.log("testing to prove that this script is recognized");
const aLunch = {
  "1Start": toSeconds(7, 25, 0),
  "1End": toSeconds(8, 52, 0),
  "2Start": toSeconds(8, 58, 0),
  "2End": toSeconds(10, 35, 0),
  "3Start": toSeconds(10, 41, 0),
  "3End": toSeconds(11, 16, 0),
  "4Start": toSeconds(11, 20, 0),
  "4End": toSeconds(12, 47, 0),
  "5Start": toSeconds(12, 53, 0),
  "5End": toSeconds(14, 20, 0)
}
const bLunch = {
  "1Start": toSeconds(7, 25, 0),
  "1End": toSeconds(8, 52, 0),
  "2Start": toSeconds(8, 58, 0),
  "2End": toSeconds(10, 35, 0),
  "3Start": toSeconds(10, 41, 0),
  "3End": toSeconds(12, 8, 0),
  "4Start": toSeconds(12, 12, 0),
  "4End": toSeconds(12, 47, 0),
  "5Start": toSeconds(12, 53, 0),
  "5End": toSeconds(14, 20, 0)
}
var currentSchedule = aLunch;
var dayType = "";

timeLoop();
setupPeriods();
getData();
document.getElementById("lunchSelectorSwitch").addEventListener("click", toggleLunch);
document.getElementById("menuButton").addEventListener("click", toggleMenu);

function timeLoop() {
  //console.log("setting the time");
  var timer = document.getElementById("timer");
  var progressBar = document.getElementById("progressBar");
  var periodContainer = document.getElementById("periodContainer");
  var currentTime = new Date();
  //currentTime.setHours(10);
  //currentTime.setMinutes(15);
  //currentTime.setSeconds(0);
  //currentTime.setHours(currentTime.getHours() - 14);
  //currentTime.setMinutes(currentTime.getMinutes() - 26);
  //currentTime.setSeconds(currentTime.getSeconds() - 40);
  var hour = currentTime.getHours().toString();
  var minute = currentTime.getMinutes().toString();
  var seconds = currentTime.getSeconds().toString();
  if (hour.length == 1) {
    hour = "0" + hour
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (seconds.length == 1) {
    seconds = "0" + seconds;
  }
  //console.log("currentTime is " + currentTime);
  timer.children[0].innerHTML = hour + ":" + minute + ":" + seconds;

  var progressBarSize = toSeconds(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
  progressBarSize -= toSeconds(7, 25, 0);
  //console.log(progressBarSize);
  progressBarSize = (progressBarSize / (toSeconds(14, 20, 0) - toSeconds(7, 20, 0))) * 100;
  //console.log(progressBarSize);
  if (progressBarSize < 0) {
    progressBarSize = 0;
  }
  if (progressBarSize > 100) {
    progressBarSize = 100;
  }
  progressBar.style.height = (progressBarSize).toString() + "%";
  //console.log("progress bar size is " + progressBarSize.toString());

  periodContainer.style.top = "-" + progressBarSize.toString() + "%";

  var currentSeconds = toSeconds(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

  var period1Marker = document.getElementById("period1Complete");
  var period2Marker = document.getElementById("period2Complete");
  var period3Marker = document.getElementById("period3Complete");
  var period4Marker = document.getElementById("period4Complete");
  var period5Marker = document.getElementById("period5Complete");
  var period6Marker = document.getElementById("period6Complete");
  var timeRemainingText = document.getElementById("timeRemainingText");

  var transition1 = document.getElementById("transition1");
  var transition2 = document.getElementById("transition2");
  var transition3 = document.getElementById("transition3");
  var transition4 = document.getElementById("transition4");
  var transition5 = document.getElementById("transition5");
  var transition6 = document.getElementById("transition6");

  //transition3.style.strokeDasharray = "100 0";
  
  var timeRemaining = 0;

  // var firstPeriod = toSeconds(7, 25, 0);
  // var secondPeriod = toSeconds(8, 52, 0);
  // var thirdPeriod = toSeconds(10, 35, 0);
  // var fourthPeriod = toSeconds(12, 8, 0);
  // var fifthPeriod = toSeconds(14, 20, 0);

  var firstPeriod = currentSchedule["1Start"];
  var secondPeriod = currentSchedule["1End"];
  var thirdPeriod = currentSchedule["2End"];
  var fourthPeriod = currentSchedule["3End"];
  var fifthPeriod = currentSchedule["4End"];
  var sixthPeriod = currentSchedule["5End"];
  if (currentSeconds >= firstPeriod) {
    period1Marker.style.backgroundColor = "green";
    timeRemaining = secondPeriod - currentSeconds;
    //console.log("in first period");
  }
  if (currentSeconds > secondPeriod && currentSeconds <= currentSchedule["2Start"]) {
    var percentage = (currentSeconds - secondPeriod) / (currentSchedule["2Start"] - secondPeriod) * 100;
    transition2.style.strokeDasharray = "100 " + (100 - percentage).toString();
    //console.log("in transition time between 1 and 2, percentage is " + percentage + ", |" + window.getComputedStyle(transition1).strokeDashArray + "|");
    timeRemaining = currentSchedule["2Start"] - currentSeconds;
  }
  if (currentSeconds >= secondPeriod) {
    period2Marker.style.backgroundColor = "green";
    if (currentSeconds > currentSchedule["2Start"]) {
      timeRemaining = thirdPeriod - currentSeconds;
      transition2.style.strokeDasharray = "100 0";
    }
    //console.log("in second period");
  }
  if (currentSeconds > thirdPeriod && currentSeconds <= currentSchedule["3Start"]) {
    var percentage = (currentSeconds - thirdPeriod) / (currentSchedule["3Start"] - thirdPeriod) * 100;
    transition3.style.strokeDasharray = "100 " + (100 - percentage).toString();
    //console.log("in transition time between periods, percentage is " + percentage);
    timeRemaining = currentSchedule["3Start"] - currentSeconds;
  }
  if (currentSeconds >= thirdPeriod) {
    period3Marker.style.backgroundColor = "green";
    if (currentSeconds > currentSchedule["3Start"]) {
      timeRemaining = fourthPeriod - currentSeconds;
      transition3.style.strokeDasharray = "100 0";
    }
    //console.log("in third period");
  }
  if (currentSeconds > fourthPeriod && currentSeconds <= currentSchedule["4Start"]) {
    var percentage = (currentSeconds - fourthPeriod) / (currentSchedule["4Start"] - fourthPeriod) * 100;
    transition4.style.strokeDasharray = "100 " + (100 - percentage).toString();
    //console.log("in transition time between 1 and 2, percentage is " + percentage + ", |" + window.getComputedStyle(transition1).strokeDashoffset + "|");
    timeRemaining = currentSchedule["4Start"] - currentSeconds;

  }
  if (currentSeconds >= fourthPeriod) {
    period4Marker.style.backgroundColor = "green";
    if (currentSeconds > currentSchedule["4Start"]) {
      timeRemaining = fifthPeriod - currentSeconds;
      transition4.style.strokeDasharray = "100 0";
    }
    //console.log("in fourth period " + currentSeconds + ", " + fourthPeriod);
  }
  if (currentSeconds > fifthPeriod && currentSeconds <= currentSchedule["5Start"]) {
    var percentage = (currentSeconds - fifthPeriod) / (currentSchedule["5Start"] - fifthPeriod) * 100;
    transition5.style.strokeDasharray = "100 " + (100 - percentage).toString();
    //console.log("in transition time between 1 and 2, percentage is " + percentage + ", |" + window.getComputedStyle(transition1).strokeDashoffset + "|");
    timeRemaining = currentSchedule["5Start"] - currentSeconds;
  }
  if (currentSeconds >= fifthPeriod) {
    period5Marker.style.backgroundColor = "green";
    if (currentSeconds > currentSchedule["5Start"]) {
      timeRemaining = sixthPeriod - currentSeconds;
      transition5.style.strokeDasharray = "100 0";
    }
    //console.log("in fifth period");
  }
  if (currentSeconds > sixthPeriod) {
    period6Marker.style.backgroundColor = "green";
    timeRemaining = -1;
    transition6.style.strokeDasharray = "100 0";
    //console.log("in fifth period");
  }

  if (timeRemaining == -1) {
    timeRemainingText.innerHTML = "";
  } else {
    //console.log("time remaining is " + timeRemaining + ", currentSeconds is " + currentSeconds);
    //console.log("time remaining is " + timeRemaining);
    timeRemainingText.innerHTML = fromSeconds(timeRemaining);
  }

  setTimeout(() => timeLoop(), 1000)
}

function setupPeriods() {
  var totalSeconds = toSeconds(14, 20, 0) - toSeconds(7, 25, 0);

  var period1 = document.getElementById("period1");
  var period2 = document.getElementById("period2");
  var period3 = document.getElementById("period3");
  var period4 = document.getElementById("period4");
  var period5 = document.getElementById("period5");
  var period6 = document.getElementById("period6");

  // var period1Pos = ((toSeconds(7, 25, 0) - toSeconds(7, 25, 0))) / totalSeconds * 100;
  // var period2Pos = ((toSeconds(8, 52, 0) - toSeconds(7, 25, 0))) / totalSeconds * 100;
  // var period3Pos = ((toSeconds(10, 35, 0) - toSeconds(7, 25, 0))) / totalSeconds * 100;
  // var period4Pos = ((toSeconds(12, 8, 0) - toSeconds(7, 25, 0))) / totalSeconds * 100;
  // var period5Pos = 100;

  //console.log("current schedule " + currentSchedule["1End"] + ", " + currentSchedule["1Start"]);
  //console.log(toSeconds(8, 52, 0) + ", " + toSeconds(7, 25, 0));

  var screenWidth = window.screen.width;
  var barHeight = document.getElementById("periodContainer").offsetHeight;
  //console.log("bar height is " + barHeight);

  var period1Pos = ((currentSchedule["1Start"] - currentSchedule["1Start"])) / totalSeconds;
  var period2Pos = ((currentSchedule["1End"] - toSeconds(7, 25, 0))) / totalSeconds * barHeight - period1.offsetHeight * 1;
  var period3Pos = ((currentSchedule["2End"] - toSeconds(7, 25, 0))) / totalSeconds * barHeight - period1.offsetHeight * 2;
  var period4Pos = ((currentSchedule["3End"] - toSeconds(7, 25, 0))) / totalSeconds * barHeight - period1.offsetHeight * 3;
  var period5Pos = ((currentSchedule["4End"] - toSeconds(7, 25, 0))) / totalSeconds * barHeight - period1.offsetHeight * 4;
  var period6Pos = barHeight - period1.offsetHeight * 5;
  //((screenWidth - period1.offsetHeight) / screenWidth) * 400;


  //console.log("period 1 position is " + period1Pos);
  //console.log("period 1 height is " + period1.offsetHeight + " offset is " + ((screenWidth - period1.offsetHeight) / screenWidth));

  period1.style.top = period1Pos.toString() + "px";
  period2.style.top = period2Pos.toString() + "px";
  period3.style.top = period3Pos.toString() + "px";
  //console.log("period3 is " + period1.style.top.toString() + " position is " + period3Pos);
  period4.style.top = period4Pos.toString() + "px";
  period5.style.top = period5Pos.toString() + "px";
  period6.style.top = period6Pos.toString() + "px";

  //console.log("period 5 position is " + period5Pos.toString());

  document.getElementById("transition1").style.strokeDasharray = "100 0";
  //document.getElementById("transition2").style.strokeDasharray = "100 0";
  //document.getElementById("transition3").style.strokeDasharray = "100 0";
  //document.getElementById("transition4").style.strokeDasharray = "100 0";
  //document.getElementById("transition5").style.strokeDasharray = "100 0";
  //document.getElementById("transition6").style.strokeDasharray = "100 0";
}

function getUserData() {
  //console.log("document cookies " + document.cookie);
  var aDayLunch = getCookie("aDayLunch");
  var bDayLunch = getCookie("bDayLunch");
  var icon = document.getElementById("lunchSelectorIcon");
  console.log("lunches are " + aDayLunch, bDayLunch + "|");
  if (aDayLunch == "") {
    setCookie("aDayLunch", "1", 180);
  }
  if (bDayLunch == "") {
    setCookie("bDayLunch", "1", 180);
  }
  console.log("the values are " + aDayLunch + ", and " + dayType);
  if (aDayLunch == "2" && dayType == "a") {
    toggleLunch();
  }
  if (bDayLunch == "2" && dayType == "b") {
    toggleLunch();
  }
}

function toggleLunch() {
  //console.log("lunch clicked");
  var icon = document.getElementById("lunchSelectorIcon");
  //var currentDay = "aDayLunch";
  var currentDay = dayType + "DayLunch"
  console.log("current lunch day is " + currentDay);
  if (currentSchedule == aLunch) {
    currentSchedule = bLunch;
    icon.classList.remove("untoggled");
    icon.classList.add("toggled");
    setCookie(currentDay, "2", "365");
    //console.log(icon.classList);
  } else if (currentSchedule == bLunch) {
    currentSchedule = aLunch;
    icon.classList.remove("toggled");
    icon.classList.add("untoggled");
    setCookie(currentDay, "1", "365");
    //console.log("untoggling");
  }
  setupPeriods();
}

function getData() {
  var url = new URL("http://localhost:4001/");
  var daysOffCount = 0;
  var currentDate = new Date();
  //var currentDate = new Date("10/4/2024");
  var currentDateString = currentDate.toLocaleDateString();

  var params = {
    requestType: "dayTypeAB",
    currentDate: currentDateString,
  }
  url.search = new URLSearchParams(params).toString();
  fetch(url).then((response) => {
    return response.json();
  }).then((response) => {
    console.log(response);
    dayType = response.dayType;
    getUserData();
  }).catch((error) => {
    dayType = "a";
    getUserData();
  });
}

function sendData() {
  fetch("http://localHost:4001/", {
    method: "POST",
    body: JSON.stringify({
      info: "this is some information"
    }),
    headers: {
      "content-type": "application/json charset=UTF-8"
    }
  });
}

function toggleMenu() {
  var menu = document.getElementById("menu");
  var menuArrow = document.getElementById("menuArrowIcon");
  var menuButton = document.getElementById("menuButton");
  if (menu.classList.contains("hidden")) {
    console.log("menu being shown");
    menu.classList.remove("hidden");
    menu.classList.add("shown");
    menuArrow.innerHTML = "keyboard_double_arrow_up";
    menuArrow.classList.add("toggled");
    menuButton.style.marginBottom = "20px";
  } else {
    menu.classList.remove("shown");
    menu.classList.add("hidden");
    menuArrow.innerHTML = "keyboard_double_arrow_down";
    menuArrow.classList.remove("toggled");
    menuButton.style.marginBottom = "70px";
  }
}

function toSeconds(hour, minute, seconds) {
  return seconds + minute * 60 + hour * 60 * 60;
}

function fromSeconds(seconds) {
  var hour = parseInt(seconds / (60 * 60), 10);
  var minute = parseInt((seconds - hour * 60 * 60) / 60, 10);
  var second = seconds - hour * 60 * 60 - minute * 60;

  //console.log("fromSeconds " + seconds + ", " + minute + ", ");
  
  hour = hour.toString();
  minute = minute.toString();
  second = second.toString();

  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  return hour + ":" + minute + ":" + second;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}