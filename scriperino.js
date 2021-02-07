const puppeteer = require('puppeteer');
const dotenv = require('dotenv/config'); 
const fs = require('fs');


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://carrier.realtimefreight.com/')
  await page.screenshot({path: 'example.png'});
  await page.type('#txtUName', process.env.USNAME);
  await page.type('#txtPw', process.env.PASS);
  await page.click('#btnSubmit');
  await page.waitForNavigation({waitUntil: 'load'});
  //const tableOfLoads = await page.$('#nl_rtfloadboard');
  //console.log(tableOfLoads); nl_rtfloadboard tbody tr td
  const result = await page.$$eval('#nl_rtfloadboard tbody tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  });

  const output = fs.readFileSync('matching-table.txt', 'utf8')
  const matchTable = output.trim('\r').split('\r\n').map(x => x)
  console.log('*******tabla de matches********');
  console.log(matchTable)
  let listResult = []
  for(let i=0; i < result.length; i++){
    listResult.push(result[i][7]+' -- '+result[i][8]);
  }
  console.log('****juntando result en un solo array****');
  console.log(listResult);
  let matches = [];
  for(let i=1; i < listResult.length; i++){
    for(let j=1; j < matchTable.length; j++){
      if(listResult[i].toLowerCase() == matchTable[j].toLowerCase()){
        matches.push(i);
      }
    }
  }
  console.log('%%%%%%%%%%%%%%%%%');
  for (let t = 0; t < matches.length; t++) {
    console.log(result[matches[t]]);
  }
  //console.log(result)
  
  await page.goto('https://carrier.realtimefreight.com/Logout.aspx');
  
  await browser.close();
})();

