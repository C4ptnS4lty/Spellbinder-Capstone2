import { useEffect, useState } from "react";
import { fetchDropDown } from "../api";
import { useLocation, useNavigate } from 'react-router-dom';
import MagicCard from "../middleware/MagicCard";

function CardList({ addToSidebar }) { // Receive addToSidebar as a prop
    const [cards, setCards] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const location = useLocation();
    const rule = location.state?.rule;
    const navigate = useNavigate();
    const [loadingNextPage, setLoadingNextPage] = useState(false);

    const handleCardClick = (card) => {
        navigate(`/card/${card.id}`, { state: { card: card } });
    };

    const handleNextPage = async () => {
        if (nextPageUrl) {
            setLoadingNextPage(true);
            try {
                const data = await fetchDropDown(nextPageUrl);
                console.log('Next Page API Data:', data); // Add this for debugging
                if (Array.isArray(data)) {
                    setCards(prevCards => [...prevCards, ...data]);
                    setNextPageUrl(data.next_page);
                } else if (data && Array.isArray(data.data)) {
                    setCards(prevCards => [...prevCards, ...data.data]);
                    setNextPageUrl(data.next_page);
                } else if (data && data.data) {
                    setCards(prevCards => [...prevCards, ...data.data]);
                    setNextPageUrl(data.next_page);
                } else {
                    console.error("Invalid data structure from API for next page:", data);
                }
            } catch (error) {
                console.error("Error fetching next page:", error);
            } finally {
                setLoadingNextPage(false);
            }
        }
    };

    useEffect(() => {
        const initialFetch = async () => {
            const initialUrl = `${rule}`;
            try {
                const data = await fetchDropDown(initialUrl);
                if (Array.isArray(data)) {
                    setCards(data);
                    setNextPageUrl(data.next_page); // Check if next_page is directly on the array
                } else if (data && Array.isArray(data.data)) {
                    setCards(data.data);
                    setNextPageUrl(data.next_page);
                } else if (data && data.data) {
                    setCards(data.data);
                    setNextPageUrl(data.next_page);
                } else {
                    console.error("Invalid initial data structure from API:", data);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        initialFetch();
    }, [rule]);

    return (
        <div>
            <h1>Magic Cards</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {cards.map((card) => (
                    <div
                        key={card.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCardClick(card)}
                    >
                        <MagicCard card={card} onAddToSidebar={addToSidebar} /> {/* Use the prop */}
                    </div>
                ))}
            </div>
            {nextPageUrl && (
                <button onClick={handleNextPage} disabled={loadingNextPage}>
                    {loadingNextPage ? 'Loading next page...' : 'Next Page'}
                </button>
            )}
        </div>
    );
}

export default CardList;