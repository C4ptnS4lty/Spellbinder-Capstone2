import React, { useState, useEffect } from 'react';
import { fetchScryfallData } from '../api'; // Assuming this function fetches card data from Scryfall by name
import { Link } from 'react-router-dom';

function UserDeckListDisplay({ user, authToken }) { // Receive authToken as a prop
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commanderImages, setCommanderImages] = useState({});

    useEffect(() => {
        const fetchUserDecks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/decks/user/${user?.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Include the token in the header
                    },
                });
                if (!response.ok) {
                    console.error('API Error:', errorMessage);
                    throw new Error(`HTTP error! status: ${response.status}`);

                }
                const data = await response.json();
                setDecks(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && authToken) { // Only fetch if user and authToken are available
            fetchUserDecks();
        }
    }, [user, authToken]); // Re-fetch if the user object or authToken changes

    useEffect(() => {
        const fetchCommanderImageUrls = async () => {
            const images = {};
            for (const deck of decks) {
                if (deck.commander_card && deck.commander_card.name) {
                    try {
                        const card = await fetchScryfallData(deck.commander_card.name);
                        let imageUrl = null;
                        if (card) {
                            if (card.layout === "modal_dfc" || card.layout === "transform") {
                                imageUrl = card.card_faces[0]?.image_uris?.small;
                            } else {
                                imageUrl = card.image_uris?.small;
                            }
                            if (imageUrl) {
                                images[deck.commander_card.name] = imageUrl;
                            } else {
                                console.warn(`Could not find image URL for commander: ${deck.commander_card.name}`);
                            }
                        }
                    } catch (e) {
                        console.error(`Error fetching Scryfall data for ${deck.commander_card.name}: `, e);
                    }
                }
            }
            setCommanderImages(images);
        };

        if (!loading && decks.length > 0) {
            fetchCommanderImageUrls();
        }
    }, [decks, loading]);

    if (loading) {
        return <div>Loading your decks...</div>;
    }

    if (error) {
        return <div>Error loading decks: {error}</div>;
    }

    return (
        <div>
            <h1>Your Decks</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {decks.map(deck => (
                    <div key={deck.deck_id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        <h3><Link to={`/deck/${deck.deck_id}`}>{deck.deck_title}</Link></h3>
                        <p>Owner: {deck.owner_username}</p>
                        {deck.commander_card && deck.commander_card.name && (
                            <div>
                                <h4>Commander: {deck.commander_card.name}</h4>
                                {commanderImages[deck.commander_card.name] && (
                                    <img
                                        src={commanderImages[deck.commander_card.name]}
                                        alt={deck.commander_card.name}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                )}
                                {!commanderImages[deck.commander_card.name] && <p>Image not available.</p>}
                            </div>
                        )}
                        {!deck.commander_card || !deck.commander_card.name && <p>Commander information not available.</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserDeckListDisplay;