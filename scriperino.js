//const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer'
//const dotenv = require('dotenv/config'); 
import dotenv from 'dotenv'
dotenv.config();
//const fs = require('fs');
import fs from 'fs';


const times = 0;
// setInterval(() => {
//   // runs every 2 seconds
// }, 2000)


async function lookUp(times){
  //AUTOLOG A RTF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://carrier.realtimefreight.com/')
  await page.screenshot({path: 'example.png'});
  await page.type('#txtUName', process.env.USNAME);
  await page.type('#txtPw', process.env.PASS);
  await page.click('#btnSubmit');
  await page.waitForNavigation({waitUntil: 'load'});

  //ORDENANDO EL NODO TOMADO EN LA VARIABLE RESULT
  const result = await page.$$eval('#nl_rtfloadboard tbody tr', rows => {
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.innerText);
    });
  });

  //TOMANDO DATOS DEL ARCHIVO MATCHING-TABLE.TXT
  const output = fs.readFileSync('matching-table.txt', 'utf8');
  const matchTable = output.trim('\r').split('\r\n').map(x => x);
  console.log('*******tabla de matches********');
  console.log(matchTable);

  //PARSEANDO RESULT IN LIST RESULT PARA DAR UN FORMATO IGUAL A MATCHTABLE
  let listResult = [];
  for(let i=0; i < result.length; i++){
    listResult.push(result[i][7]+' -- '+result[i][8]);
  }
  console.log('****juntando result en un solo array****');
  console.log(listResult);

  //COMPARANDO LISTRESULT Y MATCHTABLE Y GUARDANDO EN MATCHES
  let matches = [];
  for(let i=1; i < listResult.length; i++){
    for(let j=1; j < matchTable.length; j++){
      if(listResult[i].toLowerCase() == matchTable[j].toLowerCase()){
        matches.push(i);
      }
    }
  }

  //(PARA BORRAR) MUESTRA POR CONSOLA LO QUE SE ENVIARA A TOAST/NOTIFICATIONS
  console.log('%%%%%%%%%%%%%%%%%'+matches);
  if(matches == 0){
      console.log('no se han encontrados cargas de interes disponibles')
  }else{
    for (let t = 0; t < matches.length; t++) {
      console.log(result[matches[t]]);
    }
  }
  
  
  await page.goto('https://carrier.realtimefreight.com/Logout.aspx');
  times = times++;
  await browser.close();
  setTimeout(lookUp,6000);
  console.log('se supone que aqui no llego xD')
  return matches;
};

setTimeout(lookUp,6000)
console.log(times);

