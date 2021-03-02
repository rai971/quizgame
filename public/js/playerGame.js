var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;
var gvar;
var params = jQuery.deparam(window.location.search); //Gets the id from url

socket.on('connect', function () {
  //Tell server that it is host connection from game view
  console.log('Player Connected..');
  socket.emit('player-join-game', params);

  socket.emit('getCurrentQuestion');
  socket.on('currentQuestion', function (data) {
    gvar = data;
    console.log(data);
    document.getElementById('question').innerHTML = gvar.data.question;
    document.getElementById('frstqa').innerHTML = gvar.data.answer1;
    document.getElementById('scndqa').innerHTML = gvar.data.answer2;
    document.getElementById('thrdqa').innerHTML = gvar.data.answer3;
    document.getElementById('frthqa').innerHTML = gvar.data.answer4;
    updateTimer();
  });
  document.getElementById('answer1').style.visibility = 'visible';
  document.getElementById('answer2').style.visibility = 'visible';
  document.getElementById('answer3').style.visibility = 'visible';
  document.getElementById('answer4').style.visibility = 'visible';
});
function updateTimer() {
  time = 20;
  timer = setInterval(function () {
    time -= 1;
    document.getElementById('num').textContent = ' ' + time;
    if (time == 0) {
      socket.emit('timeUp');
    }
  }, 1000);
}
socket.on('noGameFound', function () {
  window.location.href = '../../'; //Redirect user to 'join game' page
});

function answerSubmitted(num) {
  clearInterval(timer);
  document.getElementById('timerText').style.display = 'none';

  if (playerAnswered == false) {
    playerAnswered = true;

    socket.emit('playerAnswer', num); //Sends player answer to server

    //Hiding buttons from user
    document.getElementById('answer1').style.visibility = 'hidden';
    document.getElementById('answer2').style.visibility = 'hidden';
    document.getElementById('answer3').style.visibility = 'hidden';
    document.getElementById('answer4').style.visibility = 'hidden';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML =
      'Answer Submitted! Waiting on other players...';
  }
}

//Get results on last question
socket.on('answerResult', function (data) {
  if (data == true) {
    correct = true;
  }
});

socket.on('questionOver', function (data) {
  if (correct == true) {
    document.body.style.backgroundColor = '#4CAF50';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = 'Correct!';
  } else {
    document.body.style.backgroundColor = '#f94a1e';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = 'Incorrect!';
  }
  clearInterval(timer);
  document.getElementById('timerText').style.display = 'none';
  // document.getElementById('qstn').style.visibility = 'hidden';
  document.getElementById('answer1').style.visibility = 'hidden';
  document.getElementById('answer2').style.visibility = 'hidden';
  document.getElementById('answer3').style.visibility = 'hidden';
  document.getElementById('answer4').style.visibility = 'hidden';
  socket.emit('getScore');
});

socket.on('newScore', function (data) {
  document.getElementById('scoreText').innerHTML = 'Score: ' + data;
});

socket.on('nextQuestionPlayer', function (data) {
  gvar = data;
  correct = false;
  playerAnswered = false;
  console.log(data);
  document.getElementById('question').innerHTML = gvar.data.question;
  document.getElementById('frstqa').innerHTML = gvar.data.answer1;
  document.getElementById('scndqa').innerHTML = gvar.data.answer2;
  document.getElementById('thrdqa').innerHTML = gvar.data.answer3;
  document.getElementById('frthqa').innerHTML = gvar.data.answer4;

  document.getElementById('answer1').style.visibility = 'visible';
  document.getElementById('answer2').style.visibility = 'visible';
  document.getElementById('answer3').style.visibility = 'visible';
  document.getElementById('answer4').style.visibility = 'visible';
  document.getElementById('message').style.display = 'none';
  document.body.style.backgroundColor = 'white';
  document.getElementById('timerText').style.display = 'block';
  document.getElementById('num').innerHTML = ' 20';
  updateTimer();
});

socket.on('hostDisconnect', function () {
  window.location.href = '../../';
});

socket.on('playerGameData', function (data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].playerId == socket.id) {
      document.getElementById('nameText').innerHTML = 'Name: ' + data[i].name;
      document.getElementById('scoreText').innerHTML =
        'Score: ' + data[i].gameData.score;
    }
  }
});

socket.on('GameOver', function () {
  document.body.style.backgroundColor = '#FFFFFF';
  document.getElementById('answer1').style.visibility = 'hidden';
  document.getElementById('answer2').style.visibility = 'hidden';
  document.getElementById('answer3').style.visibility = 'hidden';
  document.getElementById('answer4').style.visibility = 'hidden';
  document.getElementById('message').style.display = 'block';
  document.getElementById('message').innerHTML = 'GAME OVER';
  document.getElementById('qstn').style.display = 'none';
});

// function gamess() {
//   socket.emit('host-join-game', params);
// }
