#[Yelper](http://yelper1945.herokuapp.com/)
An web app that allows you to search up businesses like restaurants, spas, arcades, etc.
![Demo](demo/Demo.png?raw=true)
How to run:
```
git clone https://github.com/long-ht/yelper  
cd yelper  
npm install  
sign up for Yelp api key : https://www.yelp.ca/developers  
sign up for Places api key : https://developers.google.com/places/web-service/get-api-key  
echo "REACT_APP_PLACES_API_KEY={your_places_api_key}" > .env  
echo "REACT_APP_YELP_API_KEY={your_yelp_api_key}" | tee -a .env  
npm start  
```