import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import MagicCard from "../middleware/MagicCard";
import { fetchCardData } from '../api.js';

function DeckDisplay({ currentUser, authToken }) { // Receive user as a prop
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commanderCard, setCommanderCard] = useState(null);
    const [legendaries, setLegendaries] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [creatures, setCreatures] = useState([]);
    const [enchantments, setEnchantments] = useState([]);
    const [instants, setInstants] = useState([]);
    const [sorceries, setSorceries] = useState([]);
    const [landsBasic, setLandsBasic] = useState([]);
    const [lands, setLands] = useState([]);

    useEffect(() => {
        const fetchDeck = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/decks/${deckId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDeck(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [deckId]);

    useEffect(() => {
        const fetchCardDetails = async () => {
            if (deck) {
                const commanderData = await fetchCardData(deck.commander_card.id);
                setCommanderCard(commanderData);

                const fetchCategory = async (oracleIds, setCategory) => {
                    const cards = [];
                    if (oracleIds && oracleIds.length > 0) {
                        for (const id of oracleIds) {
                            const card = await fetchCardData(id);
                            if (card) {
                                cards.push(card);
                            }
                        }
                    }
                    setCategory(cards);
                };

                await fetchCategory(deck.legendaries, setLegendaries);
                await fetchCategory(deck.artifacts, setArtifacts);
                await fetchCategory(deck.creatures, setCreatures);
                await fetchCategory(deck.enchantments, setEnchantments);
                await fetchCategory(deck.instants, setInstants);
                await fetchCategory(deck.sorceries, setSorceries);
                await fetchCategory(deck.lands_basic, setLandsBasic);
                await fetchCategory(deck.lands, setLands);
            }
        };

        fetchCardDetails();
    }, [deck]);

    const handleDeleteDeck = async () => {
        if (window.confirm("Are you sure you want to delete this deck?")) {
            try {
                const response = await fetch(`/api/decks/${deckId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Include the token for delete as well
                    },
                });

                if (response.ok) {
                    console.log('Deck deleted successfully');
                    navigate('/'); // Redirect to home page after deletion
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to delete deck.');
                    console.error('Failed to delete deck:', errorData);
                }
            } catch (error) {
                setError('Network error. Please try again later.');
                console.error('Error deleting deck:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading deck...</div>;
    }

    if (error) {
        return <div>Error loading deck: {error}</div>;
    }

    if (!deck) {
        return <div>Deck not found.</div>;
    }

    const isOwner = currentUser && deck.user_owner === currentUser.id;

    return (
        <div>
            <h1>{deck.deck_title}</h1>
            {isOwner && (
                <button onClick={handleDeleteDeck} style={{ marginBottom: '10px', backgroundColor: 'red', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Delete Deck
                </button>
            )}
            <h2>Legal Deck: {deck.legal ? 'Yes' : 'No'}</h2>
                {deck.legalityReasons && deck.legalityReasons.length > 0 && (
                    <div>
                        <h3>Legality Issues:</h3>
                            <ul>
                                {deck.legalityReasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                ))}
                            </ul>
                    </div>
                    )}
            {commanderCard && (
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Commander</h2>

                    <MagicCard card={commanderCard} />

                </div>
            )}

            {legendaries.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Legendaries</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {legendaries.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {artifacts.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Artifacts</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {artifacts.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {creatures.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Creatures</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {creatures.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {enchantments.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Enchantments</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {enchantments.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {instants.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Instants</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {instants.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {sorceries.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Sorceries</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {sorceries.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {landsBasic.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Basic Lands</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {landsBasic.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lands.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <h2>Lands</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {lands.map((card) => (
                            <div key={card.id} style={{ cursor: 'pointer' }}>
                                <MagicCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
}

export default DeckDisplay;