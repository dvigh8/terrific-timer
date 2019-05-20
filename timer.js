var t_time = [0];
var vals = {}
var place = 0
var timerVar;
var t_timerVar;
var sound;
var state = [[5]]
var colors = ['blue']


function start_timer() {
  clearInterval(timerVar)
  clearInterval(t_timerVar)

  place = 0;
  t_time = [0]
  state = [[5]]
  colors = ['blue']
  rar = $('#rest_after').prop('checked');
  sound = new Audio('beep.wav')

  vals = {
    'rounds': parseInt($('#num_rounds').val()), // 0
    'sets': parseInt($('#num_sets').val()), // 1
    'time_active': parseInt($('#time_active_m').val()) * 60 + parseInt($('#time_active_s').val()), // 2
    'time_rest': parseInt($('#time_rest_m').val()) * 60 + parseInt($('#time_rest_s').val()), // 3
    'set_rest': parseInt($('#set_rest_m').val()) * 60 + parseInt($('#set_rest_s').val()) // 4
  }

  for(i = 1; i <= vals['sets']; i++){
    for(j = 1; j <= vals['rounds']; j++){

      if(vals['time_active'] != 0){
        state.push([vals['time_active']]);
        colors.push('red');
      }

      if(j < vals['rounds'] && vals['time_rest'] != 0){
        state.push([vals['time_rest']]);
        colors.push('green');
      }else if(j == vals['rounds'] && rar && vals['time_rest'] != 0){
        state.push([vals['time_rest']]);
        colors.push('green');
      }
    }
    if(i < vals['sets'] && vals['set_rest'] != 0){
      state.push([vals['set_rest']]);
      colors.push('blue');
    }else if(i == vals['sets'] && rar && vals['set_rest'] != 0){
      state.push([vals['set_rest']]);
      colors.push('blue');
    }
  }
  state.forEach(function(element){
    t_time[0] += element[0];
  })

  next_operation();
}

function next_operation(){
  color = ''
  if(place < state.length){
    t_timerVar = setInterval(function() {
      count_down('t_time', t_time)
    }, 1000)

    time = [state[place]]
    timerVar = setInterval(function() {
      count_down('time', time)
    }, 1000)
    color = colors[place]
    place++;
  }else{
    color = 'black'
  }
  setTimeout(function() {
    update_ui(color)
  }, 990)

}

function update_ui(color) {

  $('#round').html(state['round']);
  $('#set').html(state['set']);
  $('#time').css('color', color)

  if (color == 'black') {
    $('#time').html('00:00')
    $('#t_time').html('00:00')

    clearInterval(timerVar)
    clearInterval(t_timerVar)
  }
  if(place != 1){
    sound.play();
  }
}

function count_down(obj, t) {
  if (t[0] <= 1) {
    if (obj == 'time') {
      clearInterval(timerVar)
      clearInterval(t_timerVar)
      next_operation()
    } else {
      clearInterval(t_timerVar)
    }
  }
  $('#' + obj).html(pad(Math.floor(t[0] / 60), 2) + ':' + pad(t[0] % 60, 2));
  t[0] = t[0] - 1;
}

function pad(a, b) {
  return (1e15 + a + "").slice(-b)
}

function presets(t) {
  if (t == 'tabata') {
    $('#num_rounds').val(8);
    $('#time_active_m').val(0);
    $('#time_active_s').val(20);
    $('#time_rest_m').val(0);
    $('#time_rest_s').val(10);
    $('#num_sets').val(1);
    $('#set_rest_m').val(1);
    $('#set_rest_s').val(0);
    $( "#rest_after" ).prop( "checked", false);

  } else if (t == 't') {
    $('#num_rounds').val(2);
    $('#time_active_m').val(0);
    $('#time_active_s').val(10);
    $('#time_rest_m').val(0);
    $('#time_rest_s').val(5);
    $('#num_sets').val(2);
    $('#set_rest_m').val(0);
    $('#set_rest_s').val(10);
    $( "#rest_after" ).prop( "checked", false);

  }else if(t == 'pizza'){
    $('#num_rounds').val(1);
    $('#time_active_m').val(0);
    $('#time_active_s').val(0);
    $('#time_rest_m').val(3);
    $('#time_rest_s').val(0);
    $('#num_sets').val(1);
    $('#set_rest_m').val(8);
    $('#set_rest_s').val(0);
    $( "#rest_after" ).prop( "checked", true );
  }
}
