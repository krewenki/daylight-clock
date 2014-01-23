var canvas = document.getElementById('clock');
var context = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var radius = 70;
var sunrise_start_circle = 0
var sunrise_end_circle = 0;
var sunset_start_circle = 0;
var sunset_end_circle = 0;
var night_start_circle = 0;
var night_end_circle = 0;

var number_of_points = 48;

var lat = 0;
var lng = 0;

var lg_rad = (width/2) * .85;
var lg_circ = 2*Math.PI*lg_rad;
var sm_rad = (lg_circ / number_of_points) / 2.25;

navigator.geolocation.getCurrentPosition(setLatLng)

function Draw(){
	SetupSunriseAndSunset();
	context.clearRect(0,0,width,height);

	var current_hour = new Date().getHours();
	var current_minute = new Date().getMinutes();

	var date_string = ('0' + current_hour).slice(-2) + ':' + ('0' + current_minute).slice(-2) + ':' + ('0' + new Date().getSeconds()).slice(-2);
	context.font="60px Verdana";
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#000';
	context.fillText(date_string, centerX, centerY);

	var current_circle = (current_hour*2) + Math.floor(current_minute/30);

	for (var i = 0; i < number_of_points; i++) {
	  context.beginPath();
	  var angle = i*2*Math.PI/number_of_points + (Math.PI/2) ;
	  var x = centerX + Math.cos(angle) * lg_rad;
	  var y = centerY + Math.sin(angle) * lg_rad;
	  context.arc(x, y, sm_rad, 0, 2*Math.PI, false);
	  context.strokeStyle = '#000000'
	  if(i == current_circle){
		  context.fillStyle = '#00FF00';
	  } else if (i > sunrise_end_circle && i <sunset_start_circle){
		  context.fillStyle = '#FFFF00';
	  } else if(i >= sunrise_start_circle && i<= sunrise_end_circle){
		  context.fillStyle = '#D5493E';
	  } else if(i <= sunset_start_circle && i>= sunset_end_circle){
	  	  context.fillStyle = '#D5493E';
	  } else {
	  	context.fillStyle = '#266FA4';
	  }
	  context.stroke();
	  context.fill();
	}
	
	requestAnimationFrame(Draw);
}

function setLatLng(p){
	lat = p.coords.latitude;
	lng = p.coords.longitude;
	
	Draw();
}

function SetupSunriseAndSunset(){
	var times = SunCalc.getTimes(new Date(), lat, lng);
	sunrise_start_circle = (times.sunrise.getHours() * 2) + Math.floor(times.sunrise.getMinutes() / 30);
	sunrise_end_circle = (times.sunriseEnd.getHours() * 2) + Math.floor(times.sunriseEnd.getMinutes() / 30);
	sunset_start_circle = (times.sunsetStart.getHours() * 2) + Math.floor(times.sunsetStart.getMinutes() / 30);
	sunset_end_circle = (times.sunset.getHours() * 2) + Math.floor(times.sunset.getMinutes() / 30);
	night_start_circle = (times.night.getHours() * 2) + Math.floor(times.night.getMinutes() /30 );
	night_end_circle = (times.nightEnd.getHours * 2) + Math.floor(times.nightEnd.getMinutes() / 30);
}