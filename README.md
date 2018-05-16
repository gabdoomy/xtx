Instructions:

Run a simple http server using `python -m http.server 8080` in the root folder and then:

1. Open index.html
2. Both live and historic graphs (for the default EURGPB currency) should load automatically 
3. Click on an Currency
4. Historic data from that currency will load in the historic FX pricing

Testing:

All the APIs used are from the external libraries ag-grid and Highcharts so we don't have to test them, but tests might be added around the 'onSelectionChanged' and 'setData' functions.

Tests can be started by opening the SpecRunner.html. 
