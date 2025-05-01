import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function SidebarDeck({ deck, onRemoveCard, authToken }) {
    const [isSaveFormOpen, setIsSaveFormOpen] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [deckFormat, setDeckFormat] = useState('Commander'); // Default format
    const [commanderName, setCommanderName] = useState(''); // Changed from commander to commanderName
    const navigate = useNavigate(); // Initialize navigate

    const handleSaveDeckClick = () => {
        setIsSaveFormOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'deckName':
                setDeckName(value);
                break;
            case 'deckDescription':
                setDeckDescription(value);
                break;
            case 'deckFormat':
                setDeckFormat(value);
                break;
            case 'commanderName': // Updated case name
                setCommanderName(value); // Updated setter
                break;
            default:
                break;
        }
    };

    const handleSaveDeckSubmit = async (event) => { // Make the function async
        event.preventDefault();
        if (!commanderName) { // Use commanderName here
            alert('Please select a commander.');
            return;
        }

        // Find the selected commander object from the deck
        const commanderObject = deck.find(card => card.name === commanderName);
        console.log('Selected Commander Object:', commanderObject);
        if (!commanderObject) {
            alert('Selected commander not found in the deck.');
            return;
        }

        const deckToSave = {
            name: deckName,
            description: deckDescription,
            format: deckFormat,
            commander: { name: commanderObject.name, id: commanderObject.id }, // Send commander object
            cards: deck
                .filter(card => card.id !== commanderObject.id) // Exclude commander from main deck list
                .map(card => ({ name: card.name, id: card.id })),
        };
        console.log("DECK INFO: ", deckToSave)
        try {
            const response = await fetch('/api/decks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(deckToSave),
            });
            console.log("attempting fetch: ", response);
            if (response.ok) {
                const data = await response.json();
                console.log('Deck saved successfully:', data);
                console.log('Data object:', data); // Log the entire data object
                console.log('Deck ID from data:', data.deck.id); // Log the deck ID
                setIsSaveFormOpen(false); // Close the form after saving
                setDeckName('');
                setDeckDescription('');
                setCommanderName(''); // Clear commander name
                navigate(`/deck/${data.deck.id}`); // Navigate to DeckDisplay
            } else {
                const errorData = await response.json();
                console.error('Error saving deck:', errorData);
                alert(`Error saving deck: ${errorData.error || 'Something went wrong.'}`);
            }
        } catch (error) {
            console.error('There was an error saving the deck:', error);
            alert('Failed to save deck. Please try again.');
        }
    };

    if (!deck || deck.length === 0) {
        return <p>Your sidebar is empty.</p>;
    }

    const legendaryCards = deck.filter(card => card.type && card.type.startsWith('Legendary '));

    return (
        <div className="sidebar-deck">
            <h3>Your current Selections</h3>
            <ul>
                {deck.map((card, index) => (
                    <p key={index}>
                        <Button onClick={() => onRemoveCard(card.id)} className="remove-button" style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}>
                            X
                        </Button>
                        {card.name}

                    </p>
                ))}
            </ul>
            <button onClick={handleSaveDeckClick} style={{ marginTop: '20px' }}>Save Deck</button>

            {isSaveFormOpen && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h4>Save Your Deck</h4>
                    <form onSubmit={handleSaveDeckSubmit}>
                        <div>
                            <label htmlFor="deckName">Deck Name:</label>
                            <input
                                type="text"
                                id="deckName"
                                name="deckName"
                                value={deckName}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="deckDescription">Description:</label>
                            <textarea
                                id="deckDescription"
                                name="deckDescription"
                                value={deckDescription}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box', height: '80px' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="deckFormat">Format:</label>
                            <select
                                id="deckFormat"
                                name="deckFormat"
                                value={deckFormat}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' }}
                            >
                                <option value="Commander">Commander</option>
                                {/* Add more formats as needed */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="commanderName">Commander:</label>
                            <select
                                id="commanderName"
                                name="commanderName"
                                value={commanderName}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' }}
                            >
                                <option value="">-- Select a Commander --</option>
                                {legendaryCards.map((card) => (
                                    <option key={card.id} value={card.name}>{card.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={{ marginTop: '10px', padding: '8px 15px', cursor: 'pointer' }}>Save Deck</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default SidebarDeck;