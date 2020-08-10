const apiKey = process.env.YELP_API_KEY;
const CORS = 'https://cors-anywhere.herokuapp.com/';
const Yelp = {
    search: async (term, location, sortBy) => {
        const endpoint = `${CORS}https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
        try {
            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.businesses) {
                    return jsonResponse.businesses.map(business =>{
                        return {
                            id: business.id,
                            url: business.url,
                            imageSrc: business.image_url,
                            name: business.name,
                            address: business.location.address1,
                            city: business.location.city,
                            state: business.location.state,
                            zipCode: business.location.zip_code,
                            category: business.categories[0].title,
                            rating: business.rating,
                            reviewCount: business.review_count,
                        };
                    });
                }
            }
        }
        catch (error) {
            console.log(error)
        }
        return [];
    }
}
export default Yelp;
