const puppeteer = require('puppeteer');
const dotenv = require('dotenv/config'); 


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://realtimefreight.com/login/')
  await page.screenshot({path: 'example.png'});
  await page.click('#mk-button-7');
  await page.screenshot({path: 'example2.png'});
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
  
  console.log(result[2][1]+ ' - ' + result[2][8]);
  
  //result.forEach(rowline => rowline[7]=='' && rowline[8]=='' ? console.log("hi"): console.log('ok'));
  await page.screenshot({path: 'example3.png'});
  
  
  await page.goto('https://carrier.realtimefreight.com/Logout.aspx');
  
  await browser.close();
})();