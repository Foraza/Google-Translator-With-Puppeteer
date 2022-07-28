const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const accents = require('remove-accents');

async function translate(){
    const browser = await puppeteer.launch({headless: true});

    const page = await browser.newPage();
    await page.goto('https://translate.google.com.br');

    var setBaseLang;
    var setFinalLang;

    //-----SET THE BASE LANGUAGE------
    do{

        if(setBaseLang == 'BLNF'){
            console.log('Base language not found. Insert again!');
        }
        var baseLang = readlineSync.question('Base language: ');

        setBaseLang = await page.evaluate((baseLang) => {
            var found = false
            var countLang = 0;

            document.querySelectorAll('div.Llmcnf').forEach((lang) => {
                if(lang.innerHTML.toLowerCase() == baseLang.toLowerCase()){
                    countLang++;

                    if(countLang == 1){
                        found = true;
                        return lang.click();
                    }
                }
            });

            if(!found){
                //Base Language Not Found
                return 'BLNF';
            }
        }, baseLang, accents);

    }while(setBaseLang == 'BLNF');

    //-----SET THE FINAL LANGUAGE------
    do{

        if(setFinalLang == 'FLNF'){
            console.log('Final language not found. Insert again!');
        }
        var finalLang = readlineSync.question('Translate to: ');

        setFinalLang = await page.evaluate((finalLang) => {
            var found = false
            var countLang = 0;
    
            document.querySelectorAll('div.Llmcnf').forEach((lang) => {
                if(lang.innerHTML.toLowerCase() == finalLang.toLowerCase()){
                    countLang++;
                    
                    if(countLang == 2){
                        found = true;
                        return lang.click();
                    }
                }
            });
    
            if(!found){
                //Final Language Not Found
                return 'FLNF';
            }
        }, finalLang);

    }while(setFinalLang == 'FLNF');

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