$(document).ready(function () {
    var appID = "4b89e63757fac5f57fc59983f887eb05";
    var weather = "";
    var photo = "";
    var city = "";
    var current_date = moment().format("L");
    var history = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));

    console.log(history);
    console.log(current_date);

    
    function currentWeather() {


        if ($(this).attr("id") === "submit-city") {
            city = $("#city").val();
        } else {
            city = $(this).text();
        }

        weather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + appID;
        console.log(history.indexOf(city));

        if (history.indexOf(city) === -1) {

            history.push(city);
        }

        console.log(history);
        localStorage.setItem("cities", JSON.stringify(history));

        $.getJSON(weather, function (json) {
            var temp = (json.main.temp - 273.15) * (9 / 5) + 32;
            var windspeed = json.wind.speed * 2.237;

            $("#current-city").text(json.name + " " + current_date);
            $("#weather-img").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").text(temp.toFixed(2) + "°F");
            $("#humidity").text(json.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(2) + " " + "mph");
        });
    }

    function fiveDayForecast() {
        var five_day_forecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=" + appID;
       
        var day_counter = 1;

        $.ajax({
            url: five_day_forecast,
            method: "GET"
        }).then(function (response) {

            for (var i = 0; i < response.list.length; i++) {

                var date_and_time = response.list[i].dt_txt;
                var date = date_and_time.split(" ")[0];
                var time = date_and_time.split(" ")[1];

                if (time === "15:00:00") {
                    var year = date.split("-")[0];
                    var month = date.split("-")[1];
                    var day = date.split("-")[2];
                    $("#day-" + day_counter).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#day-" + day_counter).children(".weather-icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day-" + day_counter).children(".weather-temp").text("Temp: " + ((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(2) + "°F");
                    $("#day-" + day_counter).children(".weather-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    day_counter++;
                }
            }
        });
    }

    function displaySearchHistory() {

        $("#search-history").empty();
        history.forEach(function (city) {

            console.log(history);
            var history_item = $("<li>");

            history_item.addClass("list-group-item btn btn-light");
            history_item.text(city);

            $("#search-history").prepend(history_item);
        });
        $(".btn").click(currentWeather);
        $(".btn").click(fiveDayForecast);

    }
    displaySearchHistory();

    function clearSearch() {
        $("#search-history").empty();
        history = [];
        localStorage.setItem("cities", JSON.stringify(history));
    }
    $("#clear").click(clearSearch);
    $("#submit-city").click(displaySearchHistory);
});