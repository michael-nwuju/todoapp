const themeChanger = document.querySelector('.todo-theme-changer');
const todoHead = document.querySelector('.todo-head');
const input = document.querySelector('.todo-input input');
const lists = document.querySelector('.todo-lists');
const todoBody = document.querySelector('.todo-body');
const Body = document.querySelector('body');
const listsMobile = document.querySelector('.todo-list-meta-mobile-wrap');
const check = document.querySelector('.todo-check');
const listWrap = document.querySelector('.todo-list-wrap');
const listWrapper = document.querySelector('.todo-lists');
const listCount = document.querySelector('.todo-count');
const countItem = document.querySelector('.todo-count-item');
const todoAlls = document.querySelectorAll('.todo-action-all')
const todoActives = document.querySelectorAll('.todo-action-active')
const todoCompletes = document.querySelectorAll('.todo-action-complete');
const todoClear = document.querySelector('.todo-action-clear');
const popUpWrap = document.querySelector('.todo-popup-wrap');
const todoDate = document.querySelector('.todo-date');
const checked = "checked"
const del = "del"
const reminded = 'reminded';
const promptWrap = document.querySelector('.prompt-wrap');
const ReminderWrap = document.querySelector('.todo-reminder');
const countDown = document.querySelector('.countdown');
const chars = /['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']/
let todoStore, id;
let data = localStorage.getItem('TODOS');
let timerStore;
let timeData = localStorage.getItem('timerStore');
listCount.textContent = 0
function TodoDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    const today = new Date();
    todoDate.innerHTML = today.toLocaleDateString('en-US', options) + ' ' + today.getFullYear();
}
TodoDate();
themeChanger.addEventListener('click', changeTheme);
function changeTheme() {
    themeChanger.classList.toggle('dark');
    todoHead.classList.toggle('dark');
    input.classList.toggle('dark');
    lists.classList.toggle('dark');
    Body.classList.toggle('dark');
    listsMobile.classList.toggle('dark');
    todoDate.classList.toggle('dark');
}
async function registerSW() {
    if (`serviceWorker` in navigator) {
        try {
            await navigator.serviceWorker.register('sw.js');
        } catch (err) {
            console.log(err);
        }
    }
}
window.addEventListener('load', () => {
    todoAlls.forEach((elem) => {
        elem.classList.add('active');
        elem.classList.add('all');
    })
    registerSW();
})
if (data) {
    todoStore = JSON.parse(data);
    id = todoStore.length;
    if (timeData) {
        timerStore = JSON.parse(timeData);
        loadTodos(todoStore);
    }
}
else {
    todoStore = [];
    id = 0;
    timerStore = [];
}


async function addTodo() {
    check.classList.add('checked');
    setTimeout(() => {
        check.classList.remove('checked');
    }, 1000);

    const Job = input.value;
    if (input.value === "" || input.value === null || chars.test(input.value) === false) {
        return;
    }
    if (Job) {
        todo(Job, id, false, false, 0);

        todoStore.push(
            {
                name: Job,
                id: id,
                done: false,
                trash: false,
            }
        )
        timerStore.push(
            {
                id: id,
                startTimer: 0
            }
        )
        localStorage.setItem('TODOS', JSON.stringify(todoStore));
        localStorage.setItem('timerStore', JSON.stringify(timerStore));
        id++;
        input.value = ""
        Notification.requestPermission();
    }
}


async function loadTodos(array) {
    array.forEach(function (item) {
        todo(item.name, item.id, item.done, item.trash, timerStore[item.id].startTimer);
    });
    const reminderDivs = document.querySelectorAll('.todo-list-reminder');
    reminderDivs.forEach((reminderDiv) => {
        const job = reminderDiv.parentNode.parentNode.childNodes[3].textContent;
        let startTimer = timerStore[reminderDiv.id].startTimer;
        const reminderButton = reminderDiv.childNodes[0];
        if (startTimer == 0 || startTimer < 0 || reminderDiv.parentNode.parentNode.childNodes[1].classList.contains('checked') === true) {
            return;
        }
        else if (startTimer !== 0) {
            const timerInterval = setInterval(() => {
                reminderDiv.classList.add('reminding');
                reminderButton.classList = '';
                const today = new Date();
                let hours = new Date().getHours();
                hours = hours < 10 ? '0' + hours : hours;
                const startMinutes = new Date().getMinutes();
                let endMinutes = startMinutes + startTimer;
                endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes;
                const date = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + today.getFullYear();
                const countDowner = new Date(date + ' ' + hours + ':' + (endMinutes)).getTime();
                const now = new Date().getTime();
                const gap = countDowner - now;
                const second = 1000;
                const minute = second * 60;
                const hour = minute * 60;
                let minutes = Math.floor((gap % hour) / minute);
                let seconds = Math.floor((gap % minute) / second);
                createTimer(reminderButton, minutes, seconds);
                if (seconds < 1 && startTimer !== 0) {
                    startTimer--;
                }
                timerStore[reminderDiv.id].startTimer = startTimer;
                localStorage.setItem('timerStore', JSON.stringify(timerStore));
                if (true) {
                    reminderButton.parentNode.parentNode.parentNode.childNodes[1].addEventListener('click', ()=>{
                        clearInterval(timerInterval);
                        reminderButton.parentNode.classList.remove('reminding');
                        reminderButton.classList = 'fa fa-clock-o';
                        reminderButton.innerHTML = '';
                        timerStore[reminderButton.parentNode.id].startTimer = 0;
                        localStorage.setItem('timerStore', JSON.stringify(timerStore));
                    })
                }
                if (gap < 1000) {
                    displayNotification(job);
                    clearInterval(timerInterval);
                    reminderDiv.classList.remove('reminding');
                    reminderButton.classList = 'fa fa-clock-o';
                    reminderButton.innerHTML = '';
                    timerStore[reminderDiv.id].startTimer = 0;
                    localStorage.setItem('timerStore', JSON.stringify(timerStore));
                }
            }, 1000);
        }
    })

}

async function todo(job, id, done, trash, timer) {
    if (trash) {
        return;
    }

    timer = -1;
    const DONE = done ? checked : "";
    const LINE = done ? del : "";
    const REMIND = done ? reminded : "";
    const timerDisplay = `${Math.floor(timer / 60)} : ${Math.floor(timer % 60)}`;
    const TIMER = timer < 0 ? `<i job="remind" class="fa fa-clock-o"></i>` : timerDisplay;

    const list =
        `<div class="todo-list">
    <span class="todo-list-check ${DONE}" job="complete" id="${id}"></span>
    <p id="todo-list-job" class="${LINE}">${job}</p>
    <div class="todo-list-actions">
    <span class="todo-list-reminder ${REMIND}" id="${id}">${TIMER}</span>
    <button class="todo-list-close" job="delete" id="${id}"></button>
    </div>
    </div>`

    const divider = `<span class="divider"></span>`

    const lists = document.querySelectorAll('.todo-list');

    listCount.textContent = lists.length + 1;
    if (listCount.textContent < 0) {
        listCount.textContent = 0
    }
    if (listCount.textContent === '1') {
        countItem.innerHTML = 'item'
    }
    else {
        countItem.innerHTML = 'items'
    }

    listWrap.insertAdjacentHTML('beforeend', list);
    listWrap.insertAdjacentHTML('beforeend', divider);

    lists.forEach((list)=>{
        const listJob = list.childNodes[3];
        if (listJob.textContent.length > 20 && listJob.textContent.length < 25) {
            listJob.style.fontSize = '0.9em'
        }
        if (listJob.textContent.length > 25 && listJob.textContent.length <= 30) {
            listJob.style.fontSize = '0.7em'
        }
    })
}

async function completeTodo(element) {
    element.classList.toggle(checked);
    element.parentNode.querySelector('.todo-list-reminder').classList.toggle(reminded);
    element.parentNode.querySelector('#todo-list-job').classList.toggle(del);
    todoStore[element.id].done = todoStore[element.id].done ? false : true;
}

async function removeTodo(list, listCheck, listClose, divider) {
    if (true) {
        listClose.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete this todo?');
            if (confirmDelete === true) {
                listWrap.removeChild(list);
                listWrap.removeChild(divider);
                todoStore[listCheck.attributes.id.value].trash = true;
                listCount.textContent--;
                if (listCount.textContent === '1') {
                    countItem.innerHTML = 'item'
                }
                else {
                    countItem.innerHTML = 'items'
                }
            }
            else {
                return;
            }
        })
    }
}

todoBody.addEventListener('click', function (event) {
    const element = event.target;
    const elementJob = element.attributes.job.value;

    if (elementJob == "complete") {
        completeTodo(element);
    }
    if (elementJob == 'delete') {
        const lists = document.querySelectorAll('.todo-list');
        lists.forEach((list) => {
            const listCheck = list.childNodes[1];
            const listClose = list.childNodes[5];
            const divider = list.nextElementSibling;
            removeTodo(list, listCheck, listClose, divider);
        })
    }
    if (elementJob == 'clear') {
        todoClear.classList.add('active')
        todoClear.classList.add('clear');
        function todoClearList(list, listCheck, divider) {
            const confirmResult = confirm("Are you sure you want to clear all your completed Todos?");
            if (confirmResult == true) {
                if (list.classList.contains('completed') && list.classList.contains('uncompleted') === false) {
                    listWrap.removeChild(divider);
                    listWrap.removeChild(list);
                    listCount.textContent--;
                }
                if (listCheck.classList.contains('checked')) {
                    listWrap.removeChild(divider);
                    listWrap.removeChild(list);
                    listCount.textContent--;
                    todoStore[listCheck.attributes.id.value].trash = true;
                }
                if (listCount.textContent === '1') {
                    countItem.innerHTML = 'item'
                }
                else {
                    countItem.innerHTML = 'items'
                }
                setTimeout(() => {
                    todoClear.classList.remove('active');
                    todoClear.classList.remove('clear');
                }, 500)
            }
            else {
                return;
            }
        }
        const lists = document.querySelectorAll('.todo-list');
        lists.forEach((list) => {
            const listCheck = list.childNodes[1];
            const divider = list.nextElementSibling;
            todoClearList(list, listCheck, divider);
        })
    }
    if (elementJob == 'active') {
        todoActives.forEach((todoActive) => {
            todoActive.addEventListener('click', () => {
                todoActive.classList.add('active');

                todoAlls.forEach((todoAll) => {
                    if (todoAll.classList.contains('active')) {
                        todoAll.classList.remove('active');
                    }
                })

                todoCompletes.forEach((todoComplete) => {
                    if (todoComplete.classList.contains('active')) {
                        todoComplete.classList.remove('active');
                    }
                });
                function todoActiveFilter(list, listCheck, listJob, divider) {
                    if (listJob.classList.contains('del') || listCheck.classList.contains('checked')) {
                        list.classList.add('hide');
                        divider.classList.add('hide');
                    }
                    if (list.classList.contains('return')) {
                        list.classList.remove('return');
                        divider.classList.remove('return');
                    }
                    if (list.classList.contains('completed')) {
                        list.classList.remove('completed');
                        divider.classList.remove('completed');
                    }
                    if (list.classList.contains('uncompleted')) {
                        list.classList.add('hide');
                        divider.classList.add('hide');
                    }
                    if (true) {
                        listCheck.addEventListener('click', () => {
                            if (list.classList.contains('hide') === false && list.classList.contains('completed') === false) {
                                list.classList.remove('completed');
                                divider.classList.remove('completed');
                                list.classList.add('hide');
                                divider.classList.add('hide');
                            }
                            if (list.classList.contains('uncompleted') && list.classList.contains('hide')) {
                                list.classList.remove('uncompleted');
                                divider.classList.remove('uncompleted');
                            }
                        })
                    }
                }
                const lists = document.querySelectorAll('.todo-list');
                lists.forEach((list) => {
                    const listCheck = list.childNodes[1];
                    const listJob = list.childNodes[3];
                    const divider = list.nextElementSibling;
                    todoActiveFilter(list, listCheck, listJob, divider);
                })
            })
        })
    }
    if (elementJob == 'all') {
        todoAlls.forEach((todoAll) => {
            todoAll.addEventListener('click', () => {
                todoAll.classList.add('active');
                todoAll.classList.add('all');
                todoActives.forEach((todoActive) => {
                    if (todoActive.classList.contains('active')) {
                        todoActive.classList.remove('active');
                    }
                })
                todoCompletes.forEach((todoComplete) => {
                    if (todoComplete.classList.contains('active')) {
                        todoComplete.classList.remove('active');
                    }
                })
                function todoAllFilter(list, listCheck, listJob, divider) {
                    if (listJob.classList.contains('del') === false && listCheck.classList.contains('checked') === false) {
                        list.classList.add('return');
                        divider.classList.add('return');
                    }
                    if (list.classList.contains('hide') || listJob.classList.contains('del')) {
                        list.classList.remove('hide');
                        divider.classList.remove('hide');
                        list.classList.add('return');
                        divider.classList.add('return');
                    }
                    if (list.classList.contains('uncompleted') && listJob.classList.contains('del') === false && listCheck.classList.contains('checked') === false) {
                        list.classList.remove('uncompleted');
                        divider.classList.remove('uncompleted');
                        list.classList.add('return');
                        divider.classList.add('return');
                    }
                    if (list.classList.contains('completed')) {
                        list.classList.remove('completed');
                        divider.classList.remove('completed');
                        list.classList.add('return');
                        divider.classList.add('return');
                    }
                    if (listJob.classList.contains('del')) {
                        list.classList.remove('uncompleted');
                        divider.classList.remove('uncompleted');
                        list.classList.add('return');
                        divider.classList.add('return');
                    }
                    if (true) {
                        listCheck.addEventListener('click', () => {
                            if (list.classList.contains('return') && list.classList.contains('hide')) {
                                list.classList.remove('hide');
                                divider.classList.remove('hide');
                            }
                            if (list.classList.contains('return') && list.classList.contains('uncompleted')) {
                                list.classList.remove('uncompleted');
                                divider.classList.remove('uncompleted');
                            }
                        })
                    }
                }
                const lists = document.querySelectorAll('.todo-list');
                lists.forEach((list) => {
                    const listCheck = list.childNodes[1];
                    const listJob = list.childNodes[3];
                    const divider = list.nextElementSibling;
                    todoAllFilter(list, listCheck, listJob, divider);
                })
            })
        })
    }
    if (elementJob == 'completed') {
        todoCompletes.forEach((todoComplete) => {
            todoComplete.addEventListener('click', () => {
                todoComplete.classList.add('active');
                todoComplete.classList.add('completed');
                todoActives.forEach((todoActive) => {
                    if (todoActive.classList.contains('active')) {
                        todoActive.classList.remove('active');
                    }
                });
                todoAlls.forEach((todoAll) => {
                    if (todoAll.classList.contains('active')) {
                        todoAll.classList.remove('active');
                    }
                })
                function todoCompleteFilter(list, listCheck, listJob, divider) {
                    if (listJob.classList.contains('del')) {
                        list.classList.add('completed');
                        divider.classList.add('completed');
                    }
                    if (listJob.classList.contains('del') === false || listCheck.classList.contains('checked') === false) {
                        list.classList.add('uncompleted');
                        divider.classList.add('uncompleted');
                    }
                    if (list.classList.contains('hide') || list.classList.contains('hide uncompleted')) {
                        list.classList.remove('hide');
                        divider.classList.remove('hide');
                    }
                    if (list.classList.contains('return')) {
                        list.classList.remove('return');
                        divider.classList.remove('return');
                    }
                    if (list.classList == 'uncompleted completed' || list.classList == 'completed uncompleted' && listJob.classList.contains('del') === false && listCheck.classList.contains('checked') === false) {
                        list.classList.remove('completed');
                        divider.classList.remove('completed');
                    }
                    if (true) {
                        listCheck.addEventListener('click', () => {
                            if (list.classList.contains('hide') || list.classList.contains('completed')) {
                                list.classList.remove('hide');
                                divider.classList.remove('hide');
                                list.classList.remove('completed');
                                divider.classList.remove('completed');
                                list.classList.add('uncompleted');
                                divider.classList.add('uncompleted');
                            }
                        })
                    }
                }
                const lists = document.querySelectorAll('.todo-list');
                lists.forEach((list) => {
                    const listCheck = list.childNodes[1];
                    const listJob = list.childNodes[3];
                    const divider = list.nextElementSibling;
                    todoCompleteFilter(list, listCheck, listJob, divider);
                })
            })
        })
    }
    localStorage.setItem('TODOS', JSON.stringify(todoStore))
})

function timerDeploy() {
    const lists = document.querySelectorAll('.todo-list');
    lists.forEach((list) => {
        Setalarmer(list);
    })
}

timerDeploy();

function Setalarmer(list) {
    const reminderButton = list.childNodes[5].childNodes[1].childNodes[0];
    const listClose = list.childNodes[5].childNodes[3];
    themeChanger.addEventListener('click', () => {
        reminderButton.parentNode.classList.toggle('dark');
        listClose.classList.toggle('dark');
    })
    reminderButton.addEventListener('click', () => {
        const alarmMain = document.createElement('div');
        const alarmHead = document.createElement('p');
        const alarmDiv = document.createElement('div');
        const alarmInput = document.createElement('input');
        const alarmButton = document.createElement('button');

        alarmHead.classList.add('reminder-head');
        alarmHead.innerHTML = 'Set a Reminder for your Todo';
        alarmDiv.classList.add('reminder');
        alarmInput.setAttribute('placeholder', 'Input time in Minutes');
        alarmInput.classList.add('reminder-input');
        alarmButton.classList.add('add-reminder');
        alarmButton.innerHTML = `<i class="fa fa-chevron-right"></i>`
        alarmDiv.appendChild(alarmInput);
        alarmDiv.appendChild(alarmButton);
        alarmMain.appendChild(alarmHead);
        alarmMain.appendChild(alarmDiv);
        ReminderWrap.appendChild(alarmMain);

        alarmHead.classList.add('slide-in');
        setTimeout(() => {
            alarmHead.classList.remove('slide-in');
            alarmHead.classList.add('slide-out');
        }, 2500);
        setTimeout(() => {
            alarmHead.parentNode.removeChild(alarmHead);
        }, 4000);
        themeChanger.addEventListener('click', () => {
            alarmInput.classList.toggle('dark');
            alarmButton.classList.toggle('dark');
        });
        setTimer(alarmInput, alarmButton, reminderButton);
    }, { once: true })
}

function setTimer(alarmInput, alarmButton, reminderButton) {
    const job = reminderButton.parentNode.parentNode.parentNode.childNodes[3].textContent;
    if (true) {
        alarmButton.addEventListener('click', () => {
            alarmInput.parentNode.removeChild(alarmInput);
            alarmButton.parentNode.removeChild(alarmButton);
            let startTimer = parseInt(alarmInput.value);
            reminderButton.parentNode.classList.add('reminding');
            reminderButton.classList = '';
            const timerInterval = setInterval(() => {
                const today = new Date();
                let hours = new Date().getHours();
                hours = hours < 10 ? '0' + hours : hours;
                const startMinutes = new Date().getMinutes();
                let endMinutes = startMinutes + startTimer;
                endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes;
                const date = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + today.getFullYear();
                const countDowner = new Date(date + ' ' + hours + ':' + (endMinutes)).getTime();
                const now = new Date().getTime();
                const gap = countDowner - now;
                const second = 1000;
                const minute = second * 60;
                const hour = minute * 60;
                let minutes = Math.floor((gap % hour) / minute);
                let seconds = Math.floor((gap % minute) / second);
                createTimer(reminderButton, minutes, seconds);
                if (seconds < 1 && startTimer !== 0) {
                    startTimer--;
                }
                timerStore[reminderButton.parentNode.id].startTimer = startTimer;
                localStorage.setItem('timerStore', JSON.stringify(timerStore));
                if (true) {
                    reminderButton.parentNode.parentNode.parentNode.childNodes[1].addEventListener('click', ()=>{
                        clearInterval(timerInterval);
                        reminderButton.parentNode.classList.remove('reminding');
                        reminderButton.classList = 'fa fa-clock-o';
                        reminderButton.innerHTML = '';
                        timerStore[reminderButton.parentNode.id].startTimer = 0;
                        localStorage.setItem('timerStore', JSON.stringify(timerStore));
                    })
                }
                if (gap < 1000) {
                    displayNotification(job);
                    clearInterval(timerInterval);
                    reminderButton.parentNode.classList.remove('reminding');
                    reminderButton.classList = 'fa fa-clock-o';
                    reminderButton.innerHTML = '';
                    timerStore[reminderButton.parentNode.id].startTimer = 0;
                    localStorage.setItem('timerStore', JSON.stringify(timerStore));
                }
            }, 1000);
        })
        alarmInput.addEventListener('keyup', event => {
            if (event.keyCode == '13') {
                alarmInput.parentNode.removeChild(alarmInput);
                alarmButton.parentNode.removeChild(alarmButton);
                let startTimer = parseInt(alarmInput.value);
                reminderButton.parentNode.classList.add('reminding');
                reminderButton.classList = '';
                const timerInterval = setInterval(() => {
                    const today = new Date();
                    let hours = new Date().getHours();
                    hours = hours < 10 ? '0' + hours : hours;
                    const startMinutes = new Date().getMinutes();
                    let endMinutes = startMinutes + startTimer;
                    endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes;
                    const date = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + today.getFullYear();
                    const countDowner = new Date(date + ' ' + hours + ':' + (endMinutes)).getTime();
                    const now = new Date().getTime();
                    const gap = countDowner - now;
                    const second = 1000;
                    const minute = second * 60;
                    const hour = minute * 60;
                    let minutes = Math.floor((gap % hour) / minute);
                    let seconds = Math.floor((gap % minute) / second);
                    createTimer(reminderButton, minutes, seconds);
                    if (seconds < 1 && startTimer !== 0) {
                        startTimer--;
                    }
                    timerStore[reminderButton.parentNode.id].startTimer = startTimer;
                    localStorage.setItem('timerStore', JSON.stringify(timerStore));
                    if (true) {
                        reminderButton.parentNode.parentNode.parentNode.childNodes[1].addEventListener('click', ()=>{
                            clearInterval(timerInterval);
                            reminderButton.parentNode.classList.remove('reminding');
                            reminderButton.classList = 'fa fa-clock-o';
                            reminderButton.innerHTML = '';
                            timerStore[reminderButton.parentNode.id].startTimer = 0;
                            localStorage.setItem('timerStore', JSON.stringify(timerStore));
                        })
                    }
                    if (gap < 1000) {
                        console.log('send Notification');
                        clearInterval(timerInterval);
                        reminderButton.parentNode.classList.remove('reminding');
                        reminderButton.classList = 'fa fa-clock-o';
                        reminderButton.innerHTML = '';
                        timerStore[reminderButton.parentNode.id].startTimer = 0;
                        localStorage.setItem('timerStore', JSON.stringify(timerStore));
                    }
                }, 1000);
            }
        })
    }
}


function createTimer(reminderButton, minutes, seconds) {
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    reminderButton.innerHTML = `${minutes} : ${seconds}`;
}
function clearStorage() {
    todoStore = [];
    id = 0;
    timerStore = [];
    timerId = 0;
    localStorage.clear();
    location.reload();
}

check.addEventListener('click', addTodo);
input.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
        addTodo();
    }
})

    input.addEventListener('keyup', event =>{
        if (event.keyCode == 13) {
            Notification.requestPermission(status =>{
                if (status == 'granted') {
                    alert('Notification permission Status: ' + status);
                }
                else if(status == 'denied'){
                    alert('Notification permission Status: ' + status);
                }
            })
        }
    }, {once: true});


let defferedPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    promptWrap.classList.add('slide-in');
    e.preventDefault();
    defferedPrompt = e;
    const buttonPrompt = document.createElement('button');
    buttonPrompt.classList.add('button-prompt');
    buttonPrompt.innerHTML = `<span>Install Todo App by Milexpro on your device</span><i class="fas fa-download"></i>`
    promptWrap.appendChild(buttonPrompt);
    themeChanger.addEventListener('click', () => {
        buttonPrompt.classList.toggle('dark');
    });
    buttonPrompt.addEventListener('click', (e) => {
        defferedPrompt.prompt();
        defferedPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                if (promptWrap.classList.contains('slide-in')) {
                    promptWrap.classList.remove('slide-in');
                }
                promptWrap.classList.add('slide-out');
                promptWrap.style.display = 'none';
            }
            else {
                promptWrap.classList.remove('slide-in');
                promptWrap.classList.add('slide-out');
                promptWrap.style.display = 'none';
            }
            defferedPrompt = null;
        });
    });
}, { once: true });

self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
    console.log('Closed notification:' + primaryKey);
})


async function displayNotification(job) {
    const options = {
        body: `It's time to ${job}`,
        icon: 'images/logo.png',
        timeout: 5000,
        onClick: function() {
            window.focus();
            this.close();
        }
    };

    if (Notification.permission === 'granted') {
        Push.create('Todo App by Milexpro', options)
    }
}
