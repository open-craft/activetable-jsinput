var ActiveTableGen = function () {
    var  NUMERIC, STRING, check_response;

    // Input type values must match the type values in the Python code.
    NUMERIC = 1;
    STRING = 2;

    check_response = {};
    check_response[NUMERIC] = function(self, student_response) {
        var r = parseFloat(student_response);
        if (isNaN(r)) return false;
        return Math.abs(r - self.answer) <= self.abs_tolerance;
    };
    check_response[STRING] = function(self, student_response) {
        return student_response == self.answer;
    };

    function grade(state) {
        console.log(state);
        $('#activeTable input').each(function() {
            var $input = $(this), data = $input.data();
            $input.data('correct', check_response[data.type](data, this.value));
        });
        return state;
    }

    function getState() {
        var state = [];
        function appendRow() {
            var row_state = [];
            $(this).children().each(function() {
                var $cell = $(this), $input = $('input', this), data;
                if (typeof $input[0] === 'undefined') {
                    row_state.push($cell.text());
                } else {
                    data = $input.data()
                    data.value = $('input', this)[0].value;
                    row_state.push(data);
                }
            });
            state.push(row_state);
        }
        $('#activeTable thead tr').each(appendRow);
        $('#activeTable tbody tr').each(appendRow);
        return JSON.stringify(state);
    }

    function setState(state) {
        var row_state, $row, cell_state, $cell, $input;
        console.log(state);
        state = JSON.parse(state);
        for (var i = 0; i < state.length; i++) {
            row_state = state[i];
            $row = $('<tr>');
            for (var j = 0; j < row_state.length; j++) {
                cell_state = row_state[j];
                $cell = $('<td>');
                if (typeof cell_state === 'object') {
                    $input = $('<input/>', {
                        type: 'text',
                        class: 'active',
                        value: cell_state.value,
                    });
                    if (cell_state.hasOwnProperty('correct')) {
                        if (cell_state.correct) {
                            $input.addClass('right-answer');
                        } else {
                            $input.addClass('wrong-answer');
                        }
                    }
                    $input.data(cell_state);
                    $cell.append($input);
                } else {
                    $cell.text(cell_state);
                }
                $row.append($cell);
            }
            if (i === 0) {
                $row.appendTo('#activeTable thead');
            } else {
                $row.appendTo('#activeTable tbody');
            }
        }
    }

    return {
        grade: grade,
        getState: getState,
        setState: setState,
    };
};

ActiveTable = ActiveTableGen();
