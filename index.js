const { read } = require('fs');
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const accents = require('remove-accents');

async function translate(){
    const browser = await puppeteer.launch({headless: true});

    const page = await browser.newPage();
    await page.goto('https://translate.google.com.br');

    var langIndex;

    //-----SET THE BASE LANGUAGE------
    do{
        if(langIndex == 0){
            console.log('Base language not found. Insert again!');
        }

        var baseLang = await readlineSync.question('Base language: ');
        var langs = [];
       
        langs = await page.evaluate((langs) => {
            document.querySelectorAll('div.Llmcnf').forEach((lang) => {
                langs.push(lang.innerHTML.toLowerCase());
            });
            return langs;
        },langs);
        
        var langIndex = countLang = 0;
        langs.forEach((lang, i) => {
            if(accents.remove(lang.toLowerCase()) == baseLang.toLowerCase()){
                countLang++;

                if(countLang == 1){
                    langIndex = i;
                    return;
                }
            }
        });

        await page.evaluate((langIndex) => {
            return document.querySelectorAll('div.Llmcnf')[langIndex].click();
        }, langIndex);

    }while(langIndex == 0);

    //-----SET THE FINAL LANGUAGE------
    do{

        if(langIndex == 0){
            console.log('Final language not found. Insert again!');
        }
        var finalLang = readlineSync.question('Translate to: ');
        var langs = [];
       
        langs = await page.evaluate((langs) => {
            document.querySelectorAll('div.Llmcnf').forEach((lang) => {
                langs.push(lang.innerHTML.toLowerCase());
            });
            return langs;
        },langs);
        
        var langIndex = countLang = 0;
        langs.forEach((lang, i) => {
            if(accents.remove(lang.toLowerCase()) == finalLang.toLowerCase()){
                countLang++;

                if(countLang == 2){
                    langIndex = i;
                    return;
                }
            }
        });

        await page.evaluate((langIndex) => {
            return document.querySelectorAll('div.Llmcnf')[langIndex].click();
        }, langIndex);

    }while(langIndex == 0);

    var phrase = readlineSync.question('Phrase to translate: ');
    //-----INSERTS THE PHRASE ON THE GOOGLE TRANSLATOR------
    await page.type('.er8xn', phrase);

    //-----GET THE TRANSLATED PHRASE------
    await page.waitForSelector('.Q4iAWc');

    var translation = await page.evaluate(() => {
        return document.querySelector('.Q4iAWc').innerHTML;
    });

    console.log(`Translation: ${translation}`);

    await browser.close();
}

translate();