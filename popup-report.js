document.addEventListener('DOMContentLoaded', function(){

//gets the data from local storage
var data = JSON.parse(localStorage.getItem('data'));
var priceAvg = data.priceAvg;
var bedAvg = data.bedAvg;
var bathAvg = data.bathAvg;
var sqftAvg = data.sqftAvg;

//creates a p tag element for each piece of data
const p_price = document.createElement('P');
const p_beds = document.createElement('P');
const p_baths = document.createElement('P');
const p_sqft = document.createElement('P');

//changes the innerHTML of each p tag to include the averages
p_price.innerHTML = '<pre>Average price&Tab;&Tab;&Tab;&Tab;&Tab;'+'$'+priceAvg+'</pre>';
p_beds.innerHTML = '<pre>Average beds&Tab;&Tab;&Tab;&Tab;&Tab;'+bedAvg+'</pre>';
p_baths.innerHTML = '<pre>Average baths&Tab;&Tab;&Tab;&Tab;&Tab;'+bathAvg+'</pre>';
p_sqft.innerHTML = '<pre>Average Square-footage&Tab;&Tab;&Tab;'+sqftAvg+'</pre>';

//sets the classes of the p tags to report-p for styling
p_price.setAttribute('class', 'report-p');
p_beds.setAttribute('class', 'report-p');
p_baths.setAttribute('class', 'report-p');
p_sqft.setAttribute('class', 'report-p');

//adds the p tags to the page
document.body.appendChild(p_price);
document.body.appendChild(p_beds);
document.body.appendChild(p_baths);
document.body.appendChild(p_sqft);


},false)
