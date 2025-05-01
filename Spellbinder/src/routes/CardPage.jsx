import { useLocation, useNavigate } from 'react-router-dom';
import './CardPage.css';
import MagicCard from '../middleware/MagicCard';
import { fetchCopies } from '../api.js';
import { useState, useEffect } from 'react';

function CardPage({ addToSidebar }) { // Receive addToSidebar as a prop
    const location = useLocation();
    const card = location.state?.card;
    const [reprints, setReprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getReprints = async () => {
            if (card && card.prints_search_uri) {
                try {
                    const data = await fetchCopies(card.prints_search_uri);

                    if (Array.isArray(data)) {
                        setReprints(data);
                    } else {
                        setError('API returned non-array data');
                    }
                } catch (err) {
                    console.error('Error fetching reprints:', err);
                    setError('Failed to fetch reprints');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        getReprints();
    }, [card?.prints_search_uri]);

    if (!card) return <p>Loading card details...</p>;

    const handleImageClick = (reprint) => {
        if (reprint) {
            navigate(`/card/${reprint.id}`, { state: { card: reprint } });
        }
    };


    return (
        <div className="cardPage">
            <h1>{card.name} </h1>
            <div className="header">
                <MagicCard card={card} onAddToSidebar={addToSidebar} /> {/* Use the prop */}
                <div className="basicInfo">
                    <div className="formats">
                        <h5 className="format-title">Formats</h5>
                        {Object.entries(card.legalities).map(([format, legality]) => (
                            <li key={format} className={legality === 'legal' ? 'legal' : 'not-legal'}>
                                {format}
                            </li>
                        ))}
                    </div>
                    <div className="prints-container">
                        <h5 className="prints-title">Card Printings and Prices</h5>
                        <ul className="prints-grid">
                            {loading ? (
                                <p>Loading reprints...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                reprints.map((reprint) => (
                                    <li
                                        key={reprint.id}
                                        onClick={() => handleImageClick(reprint)}
                                        className="reprint-item"
                                    >
                                        {reprint.set_name}: {!reprint.prices?.usd ? 'Not Available' : '$' + reprint.prices?.usd}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardPage;