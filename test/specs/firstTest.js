var assert = require('assert');

describe('Booking.com testing: ', function() {

    beforeEach('open url', function() {
        browser.url('https://www.booking.com');
    }, 1000);

    it('User is able to specify age of each child', function () {

        browser.click('#xp__guests__toggle');

        //set a random amount of children
        function randomChildAmount(){

          browser.waitForVisible('#group_children option', 4000)
          var childrenList = $$('#group_children option')
          // it is not required to parenthesize an expression..
          var i = Math.floor(Math.random()*childrenList.length)+2
          //.. and indexing operator expression also
          var value = childrenList[i].getValue()
          return value
        }

        //get the amount of "age input" fields
        var children = randomChildAmount().toString();
        $('#group_children').selectByVisibleText(children);

        var removeChildrenText = -8
        var childrenFinalAmount = $('#xp__guests__toggle span span:only-child').getText().slice(0, removeChildrenText).trim();
        var ageInputs = $$('[name="age"]').length;

        //check the conditions
        assert.equal(childrenFinalAmount, children);
        assert.equal(children, ageInputs);
    });

    it('User is provided with the same search form at search results page', function () {

        var countryName = 'France';
        browser.setValue('#ss', countryName);

        browser.click('.c2-wrapper-s-checkin .sb-searchbox__input');

        //get a randon month index (0-7)
        var nextMonthButton = $('.xp__dates__checkin .c2-button-further ');
        function randomMonth(){
          var months = 7
          var len = (Math.floor(Math.random()*months))
          for (var i = 0; i < len; i ++){
            nextMonthButton.click()
          }
          return len
        }

        //select random month and checkin day
        var monthIndex = randomMonth();
        var checkinDays = $$('.xp__dates__checkin .c2-months-table > .c2-month')[monthIndex].$$('.c2-day');
        var randomCheckinDayIndex = (Math.floor(Math.random()*checkinDays.length));
        checkinDays[randomCheckinDayIndex].click();

        //select random checkout day
        browser.click('.c2-wrapper-s-checkout .sb-searchbox__input');
        var checkoutDays = $$('.xp__dates__checkout .c2-months-table > .c2-month')[monthIndex].$$('.c2-day');
        checkoutDays[randomCheckinDayIndex + (Math.floor(Math.random()*(checkoutDays.length - randomCheckinDayIndex)))].click();

        //get the dates of the trip in ms
        browser.click('.xp__dates-inner .sb-searchbox__input')[0];
        var checkinDayMonth = browser.getText('.c2-wrapper-s-checkin .sb-date-field__display');
        var checkoutDayMonth = browser.getText('.c2-wrapper-s-checkout .sb-date-field__display');
        var removeMonthText = -4;
        var year = $$('.xp__dates__checkin .c2-month-header')[monthIndex].getText().slice(removeMonthText);
        var checkinDate = checkinDayMonth + ", " + year;
        var checkoutDate = checkoutDayMonth + ", " + year;
        checkinDate = Date.parse(checkinDate);
        checkoutDate = Date.parse(checkoutDate);
        console.log(checkinDate, checkoutDate);
        browser.click('.xp__dates-inner .sb-searchbox__input')[0];

        browser.click('#xp__guests__toggle');

        //set a random amount of children
        function randomChildAmount(){
          var childrenList = $$('#group_children option')
          var i = (Math.floor(Math.random()*childrenList.length)+2) //more than 2 children
          var value = (childrenList[i]).getValue()
          return value
        }
        var children = randomChildAmount();
        $('#group_children').selectByVisibleText(children);

        //set a random amount of adults
        function randomAdultAmount(){
          var adultList = $$('#group_adults option')
          var i = (Math.floor(Math.random()*adultList.length))
          var value = (adultList[i]).getValue()
          return value
        }
        var adults = randomAdultAmount();
        $('#group_adults').selectByVisibleText(adults);

        browser.click('.sb-searchbox__button ');

        //check that all data that were entered previously match to the current search results
        assert.equal(browser.getValue('#ss'), countryName);
        assert.equal(browser.getValue('#group_adults'), adults);
        assert.equal(browser.getValue('#group_children'), children);
        var checkoutDateSearch = browser.getText('.c2-wrapper-s-checkout .sb-date-field__display');
        var checkinDateSearch = browser.getText('.c2-wrapper-s-checkin .sb-date-field__display');
        checkinDateSearch = Date.parse(checkinDateSearch);
        checkoutDateSearch = Date.parse(checkoutDateSearch);
        assert.equal(checkoutDate, checkoutDateSearch);
        assert.equal(checkinDate, checkinDateSearch);

    });

    it('Resulting search entries are taken based on filter', function () {

        var countryName = 'France';
        browser.setValue('#ss', countryName);
        browser.click('.sb-searchbox__button ');

        //select stars rating option
        var starsList = $$('#filter_class .css-checkbox');
        var randomStarsIndex = (Math.floor(Math.random()*(starsList.length-1))); //without Unrated hotels

        var numberOfHotels = browser.getText('.sr_header h1')
        starsList[randomStarsIndex].click();
        browser.waitUntil(function(){
          var newNumberOfHotels = browser.getText('.sr_header h1')
          return numberOfHotels != newNumberOfHotels
        }, 4000)

        starsList = $$('#filter_class .css-checkbox');
        var starNumber = 1
        var numberOfStars = starsList[randomStarsIndex].getText().trim().slice(0,starNumber);
        var hotelsList = $$('.sr_item_content [class*="-sprite-ratings_stars"] + span');
        for (var i = 0; i < hotelsList.length; i++){
          var hotelStars = hotelsList[i].getText().trim().slice(0,starNumber)
          console.log('text for logs: ', hotelStars, numberOfStars)
          assert.equal(hotelStars, numberOfStars)
        }

        starsList[randomStarsIndex].click();

        //select review score option
        var scoreList = $$("#filter_review [data-id^='review_score']");
        var randomScoreIndex = (Math.floor(Math.random()*(scoreList.length-1))); //without Unrated hotels

        numberOfHotels = browser.getText('.sr_header h1')
        scoreList[randomScoreIndex].click();

        // the same mentioned above - default timeout for wait* methods is 500ms. Make sure it is enough everywhere where waits applied
        browser.waitUntil(function(){
          var newNumberOfHotels = browser.getText('.sr_header h1')
          return numberOfHotels != newNumberOfHotels
        }, 4000)

        scoreList = $$("#filter_review [data-id^='review_score']");
        var hotelsScoreList = $$('.sr_main_score_badge .review-score-badge');
        var removeScoreText = -2
        var removeScorePlus = -1
        var scoreNumber = 1
        var amountOfScore = scoreList[randomScoreIndex].getText().trim().slice(removeScoreText, removeScorePlus);
        amountOfScore = parseFloat(amountOfScore)
        for (var i = 0; i < hotelsScoreList.length; i++){
          var rating = hotelsScoreList[i].getText().trim().slice(0,scoreNumber)
          rating = parseFloat(rating)
          console.log('text for logs: ', rating, amountOfScore)
          assert.equal(rating >= amountOfScore, true)
        }

        //some more features
        // var pagesList = browser.getText('.bui-pagination__pages .bui-pagination__list li:last-of-type').trim();
        // pagesList = parseInt(pagesList);
        // for (var j = 0; j < pagesList-1; j++){
        //
        //   browser.click('.bui-pagination__next-arrow a')
        //   browser.waitForExist('.sr-usp-overlay__loading')
        //   browser.waitForExist('.sr-usp-overlay__loading', true)
        // }
    });

    it('User is required to specify booking date to see booking price', function () {

        var cities = $$('.unified-postcard__header');
        var i = Math.floor(Math.random()*cities.length);
        cities[i].click();

        //assertions can be shortened. Use logical-specific assertions
        assert.equal(browser.isVisible('#hotellist_inner'), 4000, true);
        assert.equal(browser.isVisible('.c2-calendar-body'), 4000, true);
        assert.equal(browser.isVisible('.room_details  .price'), 4000, false);
        assert.equal(browser.isVisible('.sold_out_property'), 4000, false);

        browser.click('.c2-calendar-close-button-icon');

        var hotelsPrices = $$("[data-click-store-id^='sr-compset']");

        //hmmm.. var redefinition
        var i = Math.floor(Math.random()*hotelsPrices.length);
        hotelsPrices[i].click();

        assert.equal(browser.waitForVisible('.c2-calendar-body'), 4000, true);

        //get a randon month index (0-7)
        var nextMonthButton = $('.c2-button-further ');
        var months = 7
        function randomMonth(){
          var len = (Math.floor(Math.random()*months))
          for (var i = 0; i < len; i ++){
            nextMonthButton.click()
          }
          return len
        }
        var monthIndex = randomMonth();

        //select random month and checkin day
        var checkinDays = $$('.c2-wrapper-s-checkin .c2-months-table > .c2-month ')[monthIndex].$$('.c2-day');
        var randomCheckinDayIndex = (Math.floor(Math.random()*checkinDays.length));
        checkinDays[randomCheckinDayIndex].click();

        //select random checkout day
        browser.click('.c2-wrapper-s-checkout .sb-date-field__display');
        var checkoutDays = $$('.c2-wrapper-s-checkout .c2-months-table > .c2-month ')[monthIndex].$$('.c2-day');
        checkoutDays[randomCheckinDayIndex + (Math.floor(Math.random()*(checkoutDays.length - randomCheckinDayIndex)))].click();

        browser.click('.sb-searchbox__button ');

        var allHotels = $$('.sr_item_content').length;
        var hotelsWithPrice = $$('.room_details  .price').length;
        var soldOutHotels = $$('.sold_out_property').length;

        assert.equal(allHotels - hotelsWithPrice === soldOutHotels, true);
    });

});
