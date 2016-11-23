var pictionary = function() {
    var canvas, context;
    var socket = io();
    var drawing = false;
    var newGuess = $('#new-guess');
    var randomButton = $('#randomButton');

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };
    
    var addMessage = function(notice) {
      $('#notify').html('You are a ' + notice);
      if(notice === 'Drawer') {
        $('#randomButton').css('visibility', 'visible');  
      }
      else {
          $('#randomButton').css('visibility', 'hidden');
      }
    };
    
    var addGuess = function(guess) {
        newGuess.text(guess);
    };
    
    var displayRandomWord = function(word) {
        $('#randomWord').text('Draw a: '+word);
    };
    
    randomButton.on('click', function(event) {
       event.preventDefault();
       socket.emit('random');
       randomButton.attr('disabled', 'true');
    });
    
    socket.on('random', displayRandomWord);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function(event) {
        drawing = true;
    });
    canvas.on('mouseup', function(event) {
        drawing = false;
    })
    canvas.on('mousemove', function(event) {
        if(drawing) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};
            draw(position);
            socket.emit('draw', position);
        }
    });
    socket.on('draw', draw);
    
    var guessBox;

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        var guess = guessBox.val();
        socket.emit('guess', guess);
        console.log(guessBox.val());
        guessBox.val('');
    };
    
    socket.on('guess',addGuess);
    socket.on('message', addMessage);
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
};

$(document).ready(function() {
    pictionary();
});