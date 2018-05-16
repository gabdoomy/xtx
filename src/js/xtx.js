var selectedCurrency= "EURGBP";
var historicData = [];

// specify the columns
var columnDefs = [
  {headerName: "Currency", field: "currency"},
  {headerName: "Mid", field: "mid"},
  {headerName: "Buy", field: "buy"},
  {headerName: "Sell", field: "sell"}
];

// specify the data
var rowData = [];

// let the grid know which columns and what data to use
var gridOptions = {
  columnDefs: columnDefs,
  enableSorting: true,
  enableFilter: true,
  refreshCells: true,
  enableCellChangeFlash: true,
  onGridReady: function(params) {
    params.api.sizeColumnsToFit();
    data = rowData;
    params.api.setRowData(data);
  },
  rowSelection: 'single',
  onSelectionChanged: onSelectionChanged
};

// lookup the container we want the Grid to use
var eGridDiv = document.querySelector('#myGrid');
var chart ;

loadComponents()

function loadComponents(){
  LoadHighchart();
  loadGrid();
  setTimeout(function () {
    setData();
  }, 1100);
}

function LoadHighchart(){

  Highcharts.setOptions({
      global: {
          useUTC: false
      }
  });

  // Create the chart
  chart = Highcharts.stockChart('highcharts', {
      chart: {
          events: {
              load: function () {

                historicData = [];
                var series = this.series;
                
                setInterval(function () {
                    $.ajax({
                        type: "GET",
                        url: "http://xtx-web-challenge.herokuapp.com/live",
                        async: false
                    }).done(function(data){
                        
                        rowData = [];
                        for (var key in data) {
                          var row =  {currency: key, mid: data[key].mid, buy: data[key].buy, sell: data[key].sell, time: new Date().getTime()};
                          rowData.push(row);
                          var x = (new Date()).getTime();
                          if(key == selectedCurrency){
                            series[0].addPoint([x, data[key].mid], true, true);
                            series[1].addPoint([x, data[key].buy], true, true);
                            series[2].addPoint([x, data[key].sell], true, true);
                          }

                        }
                        historicData.push(rowData);
                        historicData = historicData.slice(-60);
                        gridOptions.api.setRowData(rowData);
                    });
                  }, 1000);

              }
          }
      },

      rangeSelector: {
          buttons: [ {
              type: 'all',
              text: 'All'
          }],
          inputEnabled: false,
          selected: 0
      },

      title: {
          text: 'Live data for EURGBP'
      },


      series: [{
          name: 'Mid',
          data: (function () {
              var data = [],
                  time = (new Date()).getTime(),
                  i;

              for (i = 0; i <= 60; i += 1) {
                  data.push([
                      time + i * 1000,
                      0
                  ]);
              }
              return data;
          }()),
          visible: false
      },
      {
          name: 'Buy',
          data: (function () {
              var data = [],
                  time = (new Date()).getTime(),
                  i;

              for (i = -60; i <= 0; i += 1) {
                  data.push([
                      time + i * 1000,
                      0
                  ]);
              }
              return data;
          }()),
          visible: false
      },
      {
          name: 'Sell',
          data: (function () {
              var data = [],
                  time = (new Date()).getTime(),
                  i;

              for (i = -60; i <= 0; i += 1) {
                  data.push([
                      time + i * 1000,
                      0
                  ]);
              }
              return data;
          }()),
          visible: false
      }]
  });

}

function loadGrid(){
  // create the grid passing in the div to use together with the columns & data we want to use
  var grid = new agGrid.Grid(eGridDiv, gridOptions);
}

function setData(){
  var dataMid = [], dataBuy = [], dataSell = [],
    time = (new Date()).getTime(),
    i;

  historicData.forEach(function(value){
     for (var key in value) {
        if(value[key].currency == selectedCurrency) {
            for (var i = -60; i <= 0; i += 1) {
              dataMid.push([
                  value[key].time,
                  value[key].mid
              ]);
              dataBuy.push([
                  value[key].time,
                  value[key].buy
              ]);
              dataSell.push([
                  value[key].time,
                  value[key].sell
              ]);
            }
        }
     }
  })    
 
  chart.series[0].setData(dataMid);
  chart.series[1].setData(dataBuy);
  chart.series[2].setData(dataSell);
  chart.series[0].setVisible(true);
  chart.series[1].setVisible(true);
  chart.series[2].setVisible(true);
  chart.setTitle({text: "Live data for "+ selectedCurrency});

}

function onSelectionChanged() {
  var selectedRows = gridOptions.api.getSelectedRows() ;
  selectedCurrency = selectedRows[0].currency;
  setData();
}

export { loadComponents, loadGrid, LoadHighchart, setData, onSelectionChanged, selectedCurrency, historicData}

