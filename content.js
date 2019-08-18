chrome.runtime.onMessage.addListener(function(request){

  //message gets sent, to execute code in main function, when button is pressed in the popup.js

  if (request === 'message sent'){

//runs the main loop which gets all the averages, then sends that information to the report-popup
  main()
  .then((resolvedVal)=>{
    var data = resolvedVal;
    chrome.runtime.sendMessage(data);

  })

  }

});

function main(){
   return new Promise(function(resolve, reject) {



//global variables
var pagePriceArr = document.getElementsByClassName('list-card-price');
var propDetails = document.getElementsByClassName('list-card-details');

//object prototype for each property
const property = {
  price:'',
  beds:'',
  baths:'',
  sqft:''
};

//object to store averages for price,beds,baths,sqft
var data = {
  priceAvg:'',
  bedAvg:'',
  bathAvg:'',
  sqftAvg:''
};

//used in for loops
var i = 0;

//An array of 'property' objects
var propertiesArr = [];

//holds the details of each property as an array before it goes into an object
var propDetailsArr = [];

//sum and average initializers
var priceSum = 0;
var bedSum = 0;
var bathSum = 0;
var sqftSum = 0;

var priceAvg = 0;
var bedAvg = 0;
var bathAvg = 0;
var sqftAvg = 0;


 function checkPage(){
   //this function goes back to the first page of the search results

  return new Promise (function(resolve,reject){
    setTimeout(function(){
      //if theres only one page, it doesnt execute the click function
      if (document.querySelector('[aria-label="Page 1"]')){
        document.querySelector('[aria-label="Page 1"]').click();
      }
      resolve();
    },500);

  });
}


function updatePrices(){
  //gets all property details on current page
  pagePriceArr = document.getElementsByClassName('list-card-price');
  propDetails = document.getElementsByClassName('list-card-details');

//adds each house's details on the page to propertiesArr and converts the price from a string to a float
for (i = 0; i < pagePriceArr.length; i++){
  var currentPriceVal = (pagePriceArr[i].innerHTML);

  currentPriceVal = parseFloat(currentPriceVal.replace(/\$|,/g, ''));

  //propDetailsArr is the formatted version of propDetails
  propDetailsArr = propDetails[i].innerText.replace(/bds|ba|sqft/g,'').split(" ");

  //creates an object for each property
  var currentProp = Object.create(property);
  currentProp.price = currentPriceVal;
  currentProp.beds = propDetailsArr[0];
  currentProp.baths = propDetailsArr[1];
  currentProp.sqft = propDetailsArr[2];

    //changes it from a string to a float, then replaces the dollar sign and comma with nothing
     currentProp.beds = parseFloat(currentProp.beds.replace(/\$|,/g, ''));
     currentProp.baths = parseFloat(currentProp.baths.replace(/\$|,/g, ''));
     currentProp.sqft = parseFloat(currentProp.sqft.replace(/\$|,/g, ''));

  propertiesArr.push(currentProp);
}

//filter out values that are NaN(prices apear as NaN when they are estimates or pre-forclosure)
propertiesArr = propertiesArr.filter(function(prop){
  if(!(Number.isNaN(prop.price)) && !(Number.isNaN(prop.beds)) && !(Number.isNaN(prop.baths)) && !(Number.isNaN(prop.sqft))){
    return true
  }
})

}

function calcAvg(){
  console.log('calc was called')
  //sums all data within the propertiesArr
  for (i=0;i<propertiesArr.length;i++){
    priceSum += propertiesArr[i].price;
    bedSum += propertiesArr[i].beds;
    bathSum += propertiesArr[i].baths;
    sqftSum += propertiesArr[i].sqft;
  }

  //calculates averages
  priceAvg = priceSum / (propertiesArr.length);
  priceAvg = Math.floor(priceAvg);
  data.priceAvg = priceAvg;

  bedAvg = bedSum / (propertiesArr.length);
  bedAvg = Math.floor(bedAvg);
  data.bedAvg = bedAvg;

  bathAvg = bathSum / (propertiesArr.length);
  bathAvg = Math.floor(bathAvg);
  data.bathAvg = bathAvg;

  sqftAvg = sqftSum / (propertiesArr.length);
  sqftAvg = Math.floor(sqftAvg);
  data.sqftAvg = sqftAvg;
}

function nextPage(){
  //this function handles moving throughout the pages of the search results and stops when
  //Next page button is no longer valid
  //it uses a timer to allow time for the data on each page of the search results to load
  //its a recursive function that will continue to go to the next page until it cant anymore
  //then it unwinds the recursion and resolves everything
  return new Promise((resolve,reject) =>{

    //initializes the next button
    var nextBtn = document.querySelector('[aria-label="NEXT Page"]');

   if (document.querySelector('[aria-label="NEXT Page"]')){

      setTimeout(() =>{

      updatePrices();
       nextBtn.click();
       nextPage()
       .then(()=>{
         resolve();
       });

     },500);

   }else{
     setTimeout(()=>{

      updatePrices();
      resolve();
     },500)
   }

})
 }


checkPage()

.then(()=>{
return nextPage()
  })

.then(()=>{
   calcAvg();
   //resolve main promise
   resolve(data);
 });






   });
}
