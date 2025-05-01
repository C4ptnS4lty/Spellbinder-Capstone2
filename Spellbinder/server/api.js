//Helper function to reduce GET redundancy
async function getter(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
                // User-Agent cannot be set in browser fetch
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching Scryfall data:", error);
        return null;
    }
}

//Retrieve 20 similarly matching card names based on String Param
export async function autofill(param) {
    const url = `https://api.scryfall.com/cards/autocomplete?q=${param}`;

    const response = await getter(url);

    if(response.object === "catalog" && Array.isArray(response.data)) {
        const results = response.data; // Now a simple array of names
        return results;
    } else {
        return ["No results"];
    }
    
}

//Retrieves all info for one card based on name. Uses Fuzzy in case user tries their own spelling
export async function fetchScryfallData(name) {
    
    //make sure string is in proper format for named search
    const convertName = name.replaceAll(' ', '+');

    const url =`https://api.scryfall.com/cards/named?fuzzy=${convertName}`;

   const response = await getter(url);

   return response;
}

//Retrieves all info for one specific card based on id, which is specific to every card
export async function fetchCardData(id) {
    const url = `https://api.scryfall.com/cards/${id}`;

    const response = await getter(url);

    return response;
}

export async function fetchCopies(url) {
    const response = await getter(url);
    return response.data;
}

//Retrieves all cards of a specified nature based on dropdown option chosen
export async function fetchDropDown(query) {
    let url ='';

    if(query.includes('order=')) {
        url = `https://api.scryfall.com/cards/search?${query}`;
    } else {
        url = `https://api.scryfall.com/cards/search?q=${query}`;
    }
    console.log(url);
    const response = await getter(url);
    console.log('Did it grab the list: '+response.data);
    return response.data
}