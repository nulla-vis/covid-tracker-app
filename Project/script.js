window.onload = () => {
    getCountryData();
    getHistoricalData();
    getGlobalCoronaData();
}

let map;
let infoWindow;
let coronaCountryData;
let mapCircles = [];
//warna lingkaran di map, harus diperbaiki warnanya ama besar lingkarannya di bawah
const caseColor = {
    confirmed: '#0D2F54',
    recovered: '#8BCF51',
    deaths: '#EC0E0E'
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 36, lng: 138 },
        zoom: 6,
        styles: mapStyle
    });
    infoWindow = new google.maps.infoWindow();
}

const changeData = (caseType, color) => {
    resetMap();
    showDataOnMap(coronaCountryData,caseType, color)
}

const resetMap = () => {
    mapCircles.forEach(circle => {
        circle.setMap(null);
    })
}

const getCountryData = () => {
    fetch("https://disease.sh/v3/covid-19/jhucsse")
    .then((response) => {
        return response.json();
    }).then((data) => {
        coronaCountryData = data;
        showDataOnMap(data);
        showTableData(data);
    });
}

const getHistoricalData = () => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120") //10分ごとにデータが更新されます
    .then((response) => {
        return response.json();
    }).then((data) => {
        let chartData = buildChartData(data);
        buildChart(chartData);
    });
}

const openInfoWindow = () => {
    infoWindow.open(map);
}

const getGlobalCoronaData = () => {
    fetch("https://disease.sh/v3/covid-19/all") //10分ごとにデータが更新されます
    .then((response) => {
        return response.json();
    }).then((data) => {
        setStatsData(data);
        buildPieChart(data);
    });
}

const setStatsData = (data) => {
    let addedConfirmed = numeral(data.todayCases).format('+0,0');
    let addedRecovered = numeral(data.todayRecovered).format('+0,0');
    let addedDeaths = numeral(data.todayDeaths).format('+0,0');
    document.querySelector('.total-confirmed').textContent = addedConfirmed;
    document.querySelector('.total-recovered').textContent = addedRecovered;
    document.querySelector('.total-death').textContent = addedDeaths;

    let confirmedTotal = numeral(data.cases).format('0,0');
    let recoveredTotal = numeral(data.recovered).format('0,0');
    let deathsTotal = numeral(data.deaths).format('0,0');
    document.querySelector('.confirmed-total').textContent = `合計 ${confirmedTotal}`;
    document.querySelector('.recovered-total').textContent = `合計 ${recoveredTotal}`;
    document.querySelector('.deaths-total').textContent = `合計 ${deathsTotal}`;
}

const showDataOnMap = (data, caseType = "confirmed") => {

    data.map((country) => {
        let countryCenter = {
            lat : Number(country.coordinates.latitude),
            lng : Number(country.coordinates.longitude)
        }

        const countryCircle = new google.maps.Circle({
            strokeColor: caseColor[caseType], //warna lingkaran sesuai array di atas
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: caseColor[caseType], //warna lingkaran sesuai array di atas
            fillOpacity: 0.35,
            map,
            center: countryCenter,
            radius: Math.sqrt(country.stats[caseType]) * 100, //harus diperbaiki, lingkaran terlalu kecil (terutama kalau death, walaupun angkanya kecil, lingkarannya setidaknya bisa kelihatan tanpa di zoom)
        });

        mapCircles.push(countryCircle);

        let html = `
        <div class="info-container">
            <div class="info-name">
                ${country.country}
            </div>`
        if(country.province) {
            html += `
            <div class="info-province">
                ${country.province}
            </div>
            `
        }
        html +=`
            <div class="info-cases">
                cases : ${country.stats.confirmed}
            </div>
            <div class="info-recovered">
                recovered : ${country.stats.recovered}
            </div>
            <div class="info-deaths">
                deaths : ${country.stats.deaths}
            </div>
        </div>
        `
        let infoWindow = new google.maps.InfoWindow({
            content : html,
            position: countryCircle.center
        });

        google.maps.event.addListener(countryCircle, 'mouseover', () => {
            infoWindow.open(map);
        });
        google.maps.event.addListener(countryCircle, 'mouseout', () => {
            infoWindow.close(map);
        });
    })
}

const showTableData = (data) => {
    let tbody = '';
    data.forEach((country) => {
        tbody += `
        <tr>
            <td>${country.country}</td>
        `
        if(country.province) {
            tbody += `
            <td>${country.province}</td>
            `
        }else {
            tbody += `
            <td> - </td>
            `
        }
        tbody +=`
            <td>${numeral(country.stats.confirmed).format('0,0')}</td>
        </tr>
        `
    });

    document.getElementById('table-data').innerHTML = tbody;
}


