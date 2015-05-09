var ActiveTable = (function () {
    var  NUMERIC, STRING, check_response;

    // Input type values must match the type values in the Python code.
    NUMERIC = 1;
    STRING = 2;

    // Correctness checks for numeric and string inputs.  These functions are
    // reimplementations of the corresponding functions in the Python code.
    check_response = {};
    check_response[NUMERIC] = function(self, student_response) {
        var r = parseFloat(student_response);
        if (isNaN(r)) return false;
        return Math.abs(r - self.answer) <= self.abs_tolerance;
    };
    check_response[STRING] = function(self, student_response) {
        return student_response == self.answer;
    };

    placeholder = {}
    placeholder[NUMERIC] = 'number'
    placeholder[STRING] = 'answer'

    function grade(state) {
        // This function attaches correctness information to each input field.
        // This information is later used to colour the input cells.  The Python
        // function embedded in XML determines correctness independently of this
        // function.
        $('#activeTable input').each(function() {
            var $input = $(this), data = $input.data();
            $input.data('correct', check_response[data.type](data, this.value));
        });
        return state;
    }

    function getState() {
        // Extract the current state of the table.  The state includes the
        // complete problem description and the values entered by the student.
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
        // Regenerate the table based on the state data.  This function is also
        // responsible for initially generating the table based on the initial
        // state exported by the Python code and for setting the background
        // colour of input fields based on the correctness information stored
        // by the grader.
        var row_state, $row, cell_state, $cell, $input;
        state = JSON.parse(state);
        for (var i = 0; i < state.length; i++) {
            row_state = state[i];
            $row = $('<tr>');
            if (i % 2 === 0) {
                $row.addClass('odd');
            }
            for (var j = 0; j < row_state.length; j++) {
                cell_state = row_state[j];
                if (i === 0) {
                    $cell = $('<th>');
                } else {
                    $cell = $('<td>');
                }
                if (typeof cell_state === 'object') {
                    if (cell_state.hasOwnProperty('correct')) {
                        if (cell_state.correct) {
                            $cell.addClass('right-answer');
                        } else {
                            $cell.addClass('wrong-answer');
                        }
                    } else {
                        $cell.addClass('active');
                    }
                    $input = $('<input/>', {
                        type: 'text',
                        value: cell_state.value,
                        placeholder: placeholder[cell_state.type],
                        size: '10',
                    });
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
}());
