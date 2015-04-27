//Standard edX JSinput functions
getState = function(){
    var state={};
    state = getInput();
    statestr = JSON.stringify(state);        
    
    // //START-PASS STATE TO IPYTHON KERNEL    
    // document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
    // var command = "state = '" + statestr + "'";
    // //console.log(command);
    
    // var kernel = IPython.notebook.kernel;
    // kernel.execute(command);
    // //END-PASS STATE TO IPYTHON KERNEL
    
    return statestr;
}

getInput = function() {
    var i;
    var data = {};
    data['response'] = {};
    
    //Colors
    data['colors'] = {};
    
    var cells = document.getElementsByClassName('Active');
    for (i=0;i<cells.length;i++) {
        data['response'][cells[i].id] = cells[i].value;
        data['colors'][cells[i].id] = 'white';
    }
    //console.log(data);
    return JSON.stringify(data);
}

setState = function(statestr){
    var ID='',state={};
    state = JSON.parse(statestr);
    
    for (ID in state['response']) {
        //console.log(state['response'][ID]);
        console.log(statestr);
        document.getElementById(ID).value = state['response'][ID];
        document.getElementById(ID).style.backgroundColor = state['colors'][ID];
    }
}

    
