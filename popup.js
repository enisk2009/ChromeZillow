document.addEventListener('DOMContentLoaded', function(){
  document.querySelector('button').addEventListener('click',onclick,false)

  function onclick(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      //sends message to content script to execute function which gets the averages
      chrome.tabs.sendMessage(tabs[0].id, 'message sent')

      //inserts loading gif when button pressed
      const img = document.createElement('img');
      img.src = "loading.gif";
      img.setAttribute('class','loading-gif');
      document.body.appendChild(img);

  });


    chrome.runtime.onMessage.addListener(function(request){

      //adds commas to the price and square footage(1000 => 1,000)
       request.sqftAvg = numberWithCommas(request.sqftAvg);
       request.priceAvg = numberWithCommas(request.priceAvg);

       //converts the request value(data) into JSON format and stores in localStorage
      request = JSON.stringify(request);
      localStorage.setItem( 'data', request );

      //links to the popup-report page
      window.location.href = 'popup-report.html';
    })
  }

  function numberWithCommas(x) {
    //function which takes in an input number and returns that number with commas in the appropriate places
    //e.g. 100000 => 100,000
      x = x.toString();
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(x))
          x = x.replace(pattern, "$1,$2");
      return x;
  }

},false)
