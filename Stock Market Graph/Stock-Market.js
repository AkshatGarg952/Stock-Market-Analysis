import getstocksdata from "./getstocksdata.js";
import getstocksprofiledata from "./getstocksprofiledata.js";
import getstockstatsdata from "./getstockstatsdata.js";

let stocks = {};
let stocksProfileData = {};
let stocksStatsData = {};

let currentStock;
let periodList = ["1mo", "3mo", "1y", "5y"];
let currentStockPeriod = periodList[0];

async function fetchStocks() {
  try {
    throw new Error("Failed to fetch Stocks");
    
  
  } catch (error) {
    stocks = getstocksdata.stocksData[0];
    stocksProfileData = getstocksprofiledata.stocksProfileData[0];
    stocksStatsData = getstockstatsdata.stocksStatsData[0];

  } finally {
    updateStockData();
  }
}

function addStockBtn(stock) {
  let div = document.createElement("div");

  let btn = document.createElement("button");
  btn.textContent = stock;
  btn.classList.add("stock");
  btn.addEventListener("click", () => {
    currentStock = stock;
    updateGraph();
    updateStockInfo();
  });
  div.appendChild(btn);

  if (!currentStock) {
    currentStock = stock;
    updateGraph();
    updateStockInfo();
  }

  let span = document.createElement("span");
  span.innerHTML = `
    <span style="color:${
      stocksStatsData[stock]["profit"] > 0 ? "green" : "red"
    }">${stocksStatsData[stock]["profit"].toFixed(2)}%</span>
    <span>$${stocksStatsData[stock]["bookValue"].toFixed(2)}</span>`;

  div.appendChild(span);
  document.querySelector("#stocks").appendChild(div);
}

function addPeriodsBtn() {
  periodList.forEach((period) => {
    let btn = document.createElement("button");
    btn.textContent = period;
    btn.classList.add("period");
    btn.addEventListener("click", () => {
      currentStockPeriod = period;
      updateGraph();
    });
    document.querySelector("#periods").appendChild(btn);
  });
}

function updateStockData() {
  for (let stock of Object.keys(stocks)) {
    if (stock === "_id") {
      continue;
    }

    for (let period of Object.keys(stocks[stock])) {
      if (period === "_id") {
        continue;
      }
      let timeStampArr = stocks[stock][period]["timeStamp"].map((date) => {
        return new Date(date * 1000).toLocaleDateString();
      });
      stocks[stock][period]["timeStamp"] = timeStampArr;
    }

    addStockBtn(stock);
  }
  addPeriodsBtn();
}

function updateGraph() {
  var trace = {
    type: "scatter",
    x: stocks[currentStock][currentStockPeriod]["timeStamp"],
    y: stocks[currentStock][currentStockPeriod]["value"],
    mode: "lines",
    line: {
      color: "rgb(219, 64, 82)",
      width: 2,
    },
  };

  var data = [trace];
  Plotly.newPlot("graphDiv", data);
}

function updateStockInfo() {
  document.querySelector("#stockInfo").innerHTML = `
    <span id='name'>${currentStock}</span>
    <span id='profit' style="color:${
      stocksStatsData[currentStock]["profit"] > 0 ? "green" : "red"
    }">${stocksStatsData[currentStock]["profit"]}%</span>
    <span id='bookValue'>$${stocksStatsData[currentStock]["bookValue"]}</span>`;

  document.querySelector("#summary").textContent =
    stocksProfileData[currentStock]["summary"];
}

fetchStocks();
