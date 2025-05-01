import { useEffect, useState } from "react";
import { fetchScryfallData } from "./api";

function CardList() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function getData() {
            const data = await fetchScryfallData("/cards/search?q=c%3Awhite+mv%3D1"); // Fetching a list
            if (data && data.data) setCards(data.data); // Extract the actual list
        }

        getData();
    }, []);

    return (
        <div>
        <h1>Magic Cards</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {cards.map((card) => (
                <div key={card.id} >
                    <h2>{card.name}</h2>
                    {card.image_uris ? (
                        <img src={card.image_uris.normal} alt={card.name} width="150" />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
            ))}
        </div>
    </div>
    );
}

export default CardList;
