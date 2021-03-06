var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;
var time = 20;
var timer;
var gvar;
var params = jQuery.deparam(window.location.search); //Gets the id from url
var selectedOption = 1;
socket.on('connect', function () {
  //Tell server that it is host connection from game view
  console.log('Player Connected..');
  socket.emit('player-join-game', params);

  socket.emit('getCurrentQuestion');
  socket.on('currentQuestion', function (data) {
    updateTimer();
    gvar = data;
    document.getElementById('question').innerHTML = gvar.data.question;
    document.getElementById('answer1').innerHTML = gvar.data.answer1;
    document.getElementById('answer2').innerHTML = gvar.data.answer2;
    document.getElementById('answer3').innerHTML = gvar.data.answer3;
    document.getElementById('answer4').innerHTML = gvar.data.answer4;
  });
  document.getElementById('answer1').style.visibility = 'visible';
  document.getElementById('answer2').style.visibility = 'visible';
  document.getElementById('answer3').style.visibility = 'visible';
  document.getElementById('answer4').style.visibility = 'visible';
});

socket.on('noGameFound', function () {
  window.location.href = '../../'; //Redirect user to 'join game' page
});

function answerSubmitted(num) {
  // clearInterval(timer);
  // document.getElementById('timerText').style.display = 'none';

  if (playerAnswered == false) {
    playerAnswered = true;
    selectedOption = num;
    socket.emit('playerAnswer', num); //Sends player answer to server

    //Hiding buttons from user
    // document.getElementById('answer1').style.visibility = 'hidden';
    // document.getElementById('answer2').style.visibility = 'hidden';
    // document.getElementById('answer3').style.visibility = 'hidden';
    // document.getElementById('answer4').style.visibility = 'hidden';
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

// socket.on('questionOver', function (data) {
//   console.log(data);
//   clearInterval(timer);
//   // if (correct == true) {
//   //   document.body.style.backgroundColor = '#4CAF50';
//   //   document.getElementById('message').style.display = 'block';
//   //   document.getElementById('message').innerHTML = 'Correct!';
//   // } else {
//   //   document.body.style.backgroundColor = '#f94a1e';
//   //   document.getElementById('message').style.display = 'block';
//   //   document.getElementById('message').innerHTML = 'Incorrect!';

//   //   var current = document.getElementById('answer' + correct).innerHTML;
//   //   console.log(current);
//   //   document.getElementById('answer' + correct).innerHTML =
//   //     '&#10004' + ' ' + current;
//   // }

//   console.log(data,correct)
//   if (correct == true) {
//     document.body.style.backgroundColor = '#4CAF50';
//     document.getElementById('message').style.display = 'block';
//     document.getElementById('message').innerHTML = 'Correct!';
//     var correctAns = document.getElementById('answer'+correct).innerHTML;
//     document.getElementById('answer'+correct).innerHTML = '&#10004' + ' ' + correctAns;
//   } else {
//     document.body.style.backgroundColor = '#F94A1E';
//     document.getElementById('message').style.display = 'block';
//     document.getElementById('message').innerHTML = 'Incorrect!';
//     var selectedAns = document.getElementById('answer'+data[0].gameData['answer']).innerHTML;
//     var correctAns = document.getElementById('answer'+correct).innerHTML;
//     console.log(correctAns)
//     console.log(selectedAns)
//     document.getElementById('answer'+correct).innerHTML = '&#10004' + ' ' + correctAns;
//     document.getElementById('answer'+data[0].gameData['answer']).innerHTML = '&#10060 ' + ' ' + selectedAns;
//   }

//   document.getElementById('timerText').style.display = 'none';
//   document.getElementById('answer1').style.visibility = 'hidden';
//   document.getElementById('answer2').style.visibility = 'hidden';
//   document.getElementById('answer3').style.visibility = 'hidden';
//   document.getElementById('answer4').style.visibility = 'hidden';
//   socket.emit('getScore');
// });

socket.on('questionOver', function (data, correctOption) {
  clearInterval(timer);
  console.log(data, correctOption);
  if (correct == true) {
    document.body.style.backgroundColor = '#4CAF50';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = 'Correct!';
    var correctAns = document.getElementById('answer' + correctOption)
      .innerHTML;
    document.getElementById('answer' + correctOption).innerHTML =
      '&#10004' + ' ' + correctAns;
  } else {
    document.body.style.backgroundColor = '#F94A1E';
    document.getElementById('message').style.display = 'block';
    document.getElementById('message').innerHTML = 'Incorrect!';
    var selectedAns = document.getElementById('answer' + selectedOption)
      .innerHTML;
    var correctAns = document.getElementById('answer' + correctOption)
      .innerHTML;
    console.log(correctAns);
    console.log(selectedAns);
    document.getElementById('answer' + correctOption).innerHTML =
      '&#10004' + ' ' + correctAns;
    document.getElementById('answer' + selectedOption).innerHTML =
      '&#10060 ' + ' ' + selectedAns;
  }
  document.getElementById('timerText').style.display = 'none';
  // document.getElementById('answer1').style.visibility = 'hidden';
  // document.getElementById('answer2').style.visibility = 'hidden';
  // document.getElementById('answer3').style.visibility = 'hidden';
  // document.getElementById('answer4').style.visibility = 'hidden';
  socket.emit('getScore');
});

socket.on('newScore', function (data) {
  console.log(data);
  document.getElementById('scoreText').innerHTML = 'Score: ' + data;
});

socket.on('nextQuestionPlayer', function (data) {
  updateTimer();
  gvar = data;
  correct = false;
  playerAnswered = false;
  document.getElementById('question').innerHTML = gvar.data.question;
  // document.getElementById('frstqa').innerHTML = gvar.data.answer1;
  // document.getElementById('scndqa').innerHTML = gvar.data.answer2;
  // document.getElementById('thrdqa').innerHTML = gvar.data.answer3;
  // document.getElementById('frthqa').innerHTML = gvar.data.answer4;

  document.getElementById('answer1').innerHTML = gvar.data.answer1;
  document.getElementById('answer2').innerHTML = gvar.data.answer2;
  document.getElementById('answer3').innerHTML = gvar.data.answer3;
  document.getElementById('answer4').innerHTML = gvar.data.answer4;
  document.getElementById('message').style.display = 'none';
  document.body.style.backgroundColor = 'white';

  document.getElementById('timerText').style.display = 'block';
  document.getElementById('num').innerHTML = '30';
  //updateTimer();
});

socket.on('hostDisconnect', function () {
  window.location.href = '../../';
});

socket.on('playerGameData', function (data) {
  console.log(data);
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
  document.getElementById('qstn').style.visibility = 'hidden';
});
function updateTimer() {
  time = 30;
  timer = setInterval(function () {
    time -= 1;
    document.getElementById('num').textContent = ' ' + time;
    if (time == 0) {
      //socket.emit('timeUp');
      clearInterval(timer);
      document.getElementById('timerText').style.display = 'none';
    }
  }, 1000);
}
