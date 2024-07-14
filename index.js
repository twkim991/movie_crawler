const axios = require("axios");
const {Builder, By, until} = require('selenium-webdriver');
const mysql = require('mysql');  // mysql 모듈 로드

// execute_script('js작성가능'), send_keys(Keys.PAGE_DOWN), find_element(By.CLASS_NAME,"")
function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}

const run = async () => {

    // 크롬 드라이버 실행 및 인스턴스 생성
    let driver = await new Builder()
        .forBrowser('chrome')
        .build();

    try {
        // 크롤링 대상 페이지
        await driver.get('https://www.megabox.co.kr/movie');

		
		while(true) {
			await sleep(1000);
			let addbuttondiv = await driver.findElement(By.id('addMovieDiv'))
			let isdisplay = await driver.executeScript("return arguments[0].style.display;", addbuttondiv);
			console.log(isdisplay)
			if(isdisplay === 'none') {
				break;
			}
			let addbutton = await addbuttondiv.findElement(By.id('btnAddMovie'))
			await driver.wait(until.elementIsEnabled(addbutton), 20000);
			await sleep(1000);
			await addbutton.click();
		};




        // 각 영화의 제목과 개봉일 가져오기
        let ol = await driver.findElement(By.css('ol'))
		await driver.wait(until.elementIsVisible(ol), 20000);
		let lielements = await ol.findElements(By.css('li'));
        for (let li of lielements) {
            try {
				await driver.wait(until.elementIsVisible(li), 20000);
				let titarea = await li.findElement(By.className('tit-area'))
				await driver.wait(until.elementIsVisible(titarea), 20000);
                let title = await titarea.findElement(By.className('tit'))
				let titletext = await title.getText();
				let date = await li.findElement(By.className('date'))
				let datetext = await date.getText();
                console.log(titletext, datetext);
            } catch (e) {
                // p.tit 태그가 없는 경우 예외 처리
				console.log(e)
                console.log('데이터를 찾을 수 없음');
            }
        }
        // *****이후 이쪽에 아래 예시 코드들을 삽입하세요******

    } catch (e) {
        console.log(e);
    } finally {
        console.log('종료')
        // 완료되면 자동으로 브라우저 종료
        driver.quit(); 
    }
}

run();



//     console.log("bodyList : ", ulList);
    // var first = $("div#contents").first();
    // var first2 = first.find('h2').text();
    // // var first = $("p.tit", "ol.list").first().text();
    // var title = $("ol.list > div.tit-area:first-child > p.tit").text().replace(/\s/g, "")
    // console.log(first2)
