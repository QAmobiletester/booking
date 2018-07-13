var assert = require('assert');

describe('Booking.com testing: ', function() {

    it('User is able to specify age of each child', function () {
        browser.url('https://www.booking.com');
        browser.click('#xp__guests__toggle');

        //set a random amount of children
        function randomChildAmount(){
          browser.waitForVisible('#group_children option')
          var childrenList = $$('#group_children option')
          var i = (Math.floor(Math.random()*childrenList.length)+2)
          var value = (childrenList[i]).getValue()
          return value
        }

        //get the amount of "age input" fields
        var children = randomChildAmount().toString();
        $('#group_children').selectByVisibleText(children);
        var childrenFinalAmount = $('#xp__guests__toggle span span:only-child').getText().slice(0, -8).trim();
        var ageInputs = $$('[name="age"]').length;

        //check the conditions
        assert.equal(childrenFinalAmount, children);
        assert.equal(children, ageInputs);
    });

    it('User is provided with the same search form at search results page', function () {
        browser.url('https://www.booking.com');
        var countryName = 'France';
        browser.setValue('#ss', countryName);

        browser.click('.c2-wrapper-s-checkin .sb-searchbox__input');

        //get a randon month index (0-7)
        var nextMonthButton = $('.xp__dates__checkin .c2-button-further ');
        function randomMonth(){
          var len = (Math.floor(Math.random()*7))
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
        var year = $$('.xp__dates__checkin .c2-month-header')[monthIndex].getText().slice(-4);
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
          var i = (Math.floor(Math.random()*childrenList.length)+2)
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

        browser.url('https://www.booking.com');
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
        })

        starsList = $$('#filter_class .css-checkbox');
        var numberOfStars = starsList[randomStarsIndex].getText().trim().slice(0,1);
        var hotelsList = $$('.sr_item_content [class*="-sprite-ratings_stars"] + span');
        for (var i = 0; i < hotelsList.length; i++){
          var hotelStars = hotelsList[i].getText().trim().slice(0,1)
          console.log('text for logs: ', hotelStars, numberOfStars)
          assert.equal(hotelStars, numberOfStars)
        }

        (starsList[randomStarsIndex]).click();

        //select review score option
        var scoreList = $$("#filter_review [data-id^='review_score']");
        var randomScoreIndex = (Math.floor(Math.random()*(scoreList.length-1))); //without Unrated hotels

        numberOfHotels = browser.getText('.sr_header h1')
        scoreList[randomScoreIndex].click();
        browser.waitUntil(function(){
          var newNumberOfHotels = browser.getText('.sr_header h1')
          return numberOfHotels != newNumberOfHotels
        })

        scoreList = $$("#filter_review [data-id^='review_score']");
        var hotelsScoreList = $$('.sr_main_score_badge .review-score-badge');
        var amountOfScore = scoreList[randomScoreIndex].getText().trim().slice(-2, -1);
        amountOfScore = parseFloat(amountOfScore)
        for (var i = 0; i < hotelsScoreList.length; i++){
          var rating = hotelsScoreList[i].getText().trim().slice(0,1)
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

        browser.url('https://www.booking.com');
        var cities = $$('.unified-postcard__header');
        var i = Math.floor(Math.random()*cities.length);
        cities[i].click();

        assert.equal(browser.isVisible('#hotellist_inner'), true);
        assert.equal(browser.isVisible('.c2-calendar-body'), true);
        assert.equal(browser.isVisible('.room_details  .price'), false);
        assert.equal(browser.isVisible('.sold_out_property'), false);

        browser.click('.c2-calendar-close-button-icon');

        var hotelsPrices = $$("[data-click-store-id^='sr-compset']");
        var i = Math.floor(Math.random()*hotelsPrices.length);
        hotelsPrices[i].click();

        assert.equal(browser.waitForVisible('.c2-calendar-body'), true);

        //get a randon month index (0-7)
        var nextMonthButton = $('.c2-button-further ');
        function randomMonth(){
          var len = (Math.floor(Math.random()*7))
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
