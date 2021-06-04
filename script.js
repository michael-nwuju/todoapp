const themeChanger = document.querySelector('.todo-theme-changer');
const todoHead = document.querySelector('.todo-head');
const input = document.querySelector('.todo-input input');
const lists = document.querySelector('.todo-lists');
const todoBody = document.querySelector('.todo-body');
const Body = document.querySelector('body');
const listsMobile = document.querySelector('.todo-list-meta-mobile-wrap');
const check = document.querySelector('.todo-check');
const listWrap = document.querySelector('.todo-list-wrap');
const listCount = document.querySelector('.todo-count');
const countItem = document.querySelector('.todo-count-item');
const todoAlls = document.querySelectorAll('.todo-action-all')
const todoActives = document.querySelectorAll('.todo-action-active')
const todoCompletes = document.querySelectorAll('.todo-action-complete');
const todoClear = document.querySelector('.todo-action-clear');
themeChanger.addEventListener('click', changeTheme);
    function changeTheme(){
        themeChanger.classList.toggle('dark');    
        todoHead.classList.toggle('dark');    
        input.classList.toggle('dark');    
        lists.classList.toggle('dark');    
        Body.classList.toggle('dark');    
        listsMobile.classList.toggle('dark');
    }
check.addEventListener('click', todo);
input.addEventListener('keyup', event=>{
    if (event.keyCode === 13) {
        todo();    
    }     
})



window.addEventListener('load', ()=>{
    todoAlls.forEach((elem)=>{
        elem.classList.add('active');
        elem.classList.add('all');
    })    
})

listCount.textContent = 0;

const chars = /['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']/
function todo() {
    if (input.value === "" || input.value === null || chars.test(input.value) === false){
        return
    }
    check.classList.add('checked');
    setTimeout(()=>{
        check.classList.remove('checked');
        input.value = ""
    }, 1000);
    const list = document.createElement('div');
    const listCheck = document.createElement('span')
    const listJob = document.createElement('p');
    const listClose = document.createElement('button');
    const divider = document.createElement('span');
    
    list.classList.add('todo-list');
    listCount.textContent = document.querySelectorAll('.todo-list').length + 1;
    list.addEventListener('mouseover', ()=>{
        if (listClose.classList.contains('show')) {
            listClose.classList.remove('show')
        }
        else{
            listClose.classList.add('show')
        }    
    })
    themeChanger.addEventListener('click', ()=>{
        listClose.classList.toggle('dark');
    });
    listCheck.classList.add('todo-list-check');
    listJob.textContent = input.value;
    listClose.classList.add('todo-list-close');
    divider.classList.add('divider');
    list.appendChild(listCheck);
    list.appendChild(listJob);
    list.appendChild(listClose);
    listWrap.appendChild(list);
    listWrap.appendChild(divider);
    listClose.addEventListener('click', ()=>{
        listWrap.removeChild(divider);
        listWrap.removeChild(list);
    })
    let count = 0;
    for (count = 0; count < 1 ; count++) {
        listClose.addEventListener('click', ()=>{
            listCount.textContent--;
        })
    }
    if (listCount.textContent < 0) {
        listCount.textContent = 0;
    }
    if (listCount.textContent === '1') {
        countItem.innerHTML = 'item';
    }
    else{
        countItem.innerHTML = 'items';
    }
    if(true) {
        listClose.addEventListener('click', ()=>{
            if (listCount.textContent === '1'){
                countItem.textContent = 'item'
            }
            if (listCount.textContent === '0') {
                countItem.innerHTML = 'items';
            }
        })
    }
    
    if (true) {
        listCheck.addEventListener('click', ()=>{
            listCheck.classList.toggle('checked');
            listJob.classList.toggle('del');
        })
    }
    if (true) {
        todoActives.forEach((todoActive)=>{
            todoActive.addEventListener('click', ()=>{
                // listCount.textContent = (document.querySelectorAll('.todo-list').length + 1) - (document.querySelectorAll('.todo-list.hide').length + 1);
                todoActive.classList.add('active');

                todoAlls.forEach((todoAll)=>{
                    if (todoAll.classList.contains('active')) {
                        todoAll.classList.remove('active');
                    }
                })

                todoCompletes.forEach((todoComplete)=>{
                    if (todoComplete.classList.contains('active')) {
                        todoComplete.classList.remove('active');
                    }
                })
                
                if(listJob.classList.contains('del') || listCheck.classList.contains('checked')){
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
                    listCheck.addEventListener('click', ()=>{
                        if (list.classList.contains('hide') === false && list.classList.contains('completed') === false){
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
            })
        })
    }
    if (true) {
        todoAlls.forEach((todoAll)=>{
            todoAll.addEventListener('click', ()=>{
                // listCount.textContent = document.querySelectorAll('.todo-list.return').length + 1;
                todoAll.classList.add('active');
                todoAll.classList.add('all');
                todoActives.forEach((todoActive)=>{
                    if (todoActive.classList.contains('active')) {
                        todoActive.classList.remove('active');
                    }
                })
                todoCompletes.forEach((todoComplete)=>{
                    if (todoComplete.classList.contains('active')) {
                        todoComplete.classList.remove('active');
                    }
                })
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
                if(true){
                    listCheck.addEventListener('click', ()=>{
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
            })
        })
    }
    if (true) {
        todoCompletes.forEach((todoComplete)=>{
            todoComplete.addEventListener('click', ()=>{
                // listCount.textContent = document.querySelectorAll('.todo-list.completed').length + 1;
                todoComplete.classList.add('active');
                todoComplete.classList.add('completed');
                todoActives.forEach((todoActive)=>{
                    if (todoActive.classList.contains('active')) {
                        todoActive.classList.remove('active');
                    }
                })
                todoAlls.forEach((todoAll)=>{
                    if (todoAll.classList.contains('active')) {
                        todoAll.classList.remove('active');
                    }
                })
                if (listJob.classList.contains('del')) {
                    list.classList.add('completed');
                    divider.classList.add('completed');
                }
                if(listJob.classList.contains('del') === false || listCheck.classList.contains('checked') === false){
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
                if (true) {
                    listCheck.addEventListener('click', ()=>{
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
            })
        })
    }
    if (true) {
        todoClear.addEventListener('click', ()=>{
            todoClear.classList.add('active')
            todoClear.classList.add('clear');
            if (list.classList.contains('completed') && list.classList.contains('uncompleted') === false ){
                listWrap.removeChild(divider);
                listWrap.removeChild(list);
                listCount.textContent--;
            }
            if(listCheck.classList.contains('checked')){
                listWrap.removeChild(divider);
                listWrap.removeChild(list);   
                listCount.textContent--;
            }
            if (listCount.textContent === '1') {
                countItem.innerHTML = 'item'
            }
            else{
                countItem.innerHTML = 'items'
            }
            setTimeout(()=>{
                todoClear.classList.remove('active');
                todoClear.classList.remove('clear');
            }, 500)
        })
    }
}