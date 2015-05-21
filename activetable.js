var ActiveTable = (function () {
    var  NUMERIC, STRING, check_response, placeholder;

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

    // Placeholder strings for the different input types
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

        // Classes used on cells that contain input fields, based on their
        // correctness.
        var cell_classes = {}, $row;
        cell_classes[undefined] = 'unchecked';
        cell_classes[true] = 'right-answer';
        cell_classes[false] = 'wrong-answer';

        function makeHeadRow(row_state) {
            // Generate and return the title row of the table
            var $row = $('<tr>');
            for (var j = 0; j < row_state.length; j++) {
                $row.append($('<th>').text(row_state[j]));
            }
            return $row;
        }

        function makeInput(cell_state) {
            return $('<input/>', {
                type: 'text',
                value: cell_state.value,
                placeholder: placeholder[cell_state.type],
                // The input will always fill the whole width of the table cell,
                // but some browsers will use the size value as a minimum, and
                // assume a default if you don't set the size, so we have to set
                // it to a small value.
                size: '1',
            }).data(cell_state);
        }

        function makeRow(row_state) {
            var $row, cell_state, $cell;
            $row = $('<tr>');
            for (var j = 0; j < row_state.length; j++) {
                cell_state = row_state[j];
                $cell = $('<td>');
                $cell.attr('id', 'cell_' + i + '_' + j);
                if (typeof cell_state === 'object') {
                    $cell.addClass('active');
                    $cell.addClass(cell_classes[cell_state.correct]);
                    $cell.append(makeInput(cell_state));
                } else {
                    $cell.text(cell_state);
                }
                $row.append($cell);
            }
            return $row;
        }

        state = JSON.parse(state);
        makeHeadRow(state[0]).appendTo('#activeTable thead');
        for (var i = 1; i < state.length; i++) {
            $row = makeRow(state[i]);
            if (i % 2 === 0) {
                $row.addClass('odd');
            }
            $row.appendTo('#activeTable tbody');
        }
    }

    return {
        grade: grade,
        getState: getState,
        setState: setState,
    };
}());
