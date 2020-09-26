var d = new Date();
var month = {
    0 : "January",
    1 : "February",
    2 : "March",
    3 : "April",
    4 : "May",
    5 : "June",
    6 : "July",
    7 : "August",
    8 : "September",
    9 : "October",
    10 : "November",
    11 : "December"
}
var day = {
    0 : "Sunday",
    1 : "Monday",
    2 : "Tuesday",
    3 : "Wednesday",
    4 : "Thursday",
    5 : "Friday",
    6 : "Saturday",
}
var myList = [];
getDataFromLocal();
var dispDate = month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + "<br>" + day[d.getDay()];
document.getElementById("curr_date").innerHTML = dispDate;

// get data from local storage
function getDataFromLocal(){
    const data = localStorage.getItem("myList");
    if(data){
        myList = JSON.parse(data);
    }
    showTasks();
    openTasks();
}

// add data to local storage
function addDataToLocal(){
    localStorage.setItem("myList", JSON.stringify(myList));
    showTasks();
    openTasks();
}

// display tasks
function showTasks(){
    var list = document.getElementById("myTask");
    var checked = "";
    list.innerHTML = "";
    for(var i=0; i<myList.length; i++){
        const li = document.createElement("li");
        li.setAttribute("type", "none"); 
        li.setAttribute("class", "item");
        // li.setAttribute("class", "d-flex flex-row")
        if(myList[i].complete){
            checked = "checked";
        }
        else{
            checked = null;
        }
        due = new Date(myList[i].due);
        var date = month[due.getMonth()] + " " + due.getDate() + ", " + due.getFullYear();
        li.innerHTML = `
        <div>
                <input type="checkbox" class="check" onclick="taskDone(${myList[i].id})" ${checked}>
                &nbsp;&nbsp;
                <span>${myList[i].name}</span>
                <button class="btn btn-danger float-right delete_task text-center" onclick="removeTask(${myList[i].id})" task-id="${myList[i].id}">x</button>
                <p class="p_date float-right">${date}&nbsp;&nbsp;&nbsp;&nbsp;</p>
        </div>
        <div>
            <p class="p_desp">${myList[i].description}</p>
        </div><hr> 
        `
        list.append(li);
    }
}

// add tasks to to do list
function addTaskToList(){
    var new_task = document.getElementById("addTask").value.trim();
    var desp = document.getElementById("desp").value.trim();
    var due = new Date(document.getElementById("date").value.trim());
    var today = new Date();
    if(new_task.length == 0 || desp.length == 0){   // validate entry
        alert("Empty!");
    }
    else if (due.getTime() < today.getTime()) 
        alert("Due date already gone!");  
    else{   // add the task to the list
        var task = {
            "id" : Date.now(),
            "name" : new_task,
            "description" : desp,
            "due" : due,
            "complete" : false
        }
        myList.push(task);
    }
    addDataToLocal();
    document.getElementById("addTask").value = "";
}

// get index of task in array
function getIndex(key, val){
    for(var i = 0; i<myList.length; i++){
        if(myList[i][key] == val){
            return i;
        }
    }
    return -1;
}

// delete task from list
function removeTask(id){
    var index = getIndex("id", id);
    if(index != -1){
        myList.splice(index, 1);
    }
    addDataToLocal();
}

// done tasks
function taskDone(id){
    var index = getIndex("id", id);
    if(index != -1){
        myList[index].complete = !(myList[index].complete);
    }
    addDataToLocal();
}

function openTasks(){
    var open = 0;
    for(var i=0; i<myList.length; i++){
        if(!myList[i].complete){
            open++;
        }
    }
    makeChart(open, myList.length-open);
}

// doughnut chart
function makeChart(open, close){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Open', 'Closed'],
            datasets: [{
                data: [open, close],
                backgroundColor: [
                    'rgba(52, 161, 206, 0.6)',
                    'rgba(0, 17, 51, 0.6)',
                    
                ],
                borderColor: [
                    'rgba(52, 161, 206, 1)',
                    'rgba(0, 17, 51, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 16
                }
            },
            responsive: false
        }
    });
}