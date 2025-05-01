import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListFilter.css';

export default function Filter() {
    const [orderBy, setOrderBy] = useState('');
    const [color, setColor] = useState('');
    const [legendary, setLegendary] = useState('');
    const [type, setType] = useState('');
    const [extraParams, setExtraParams] = useState(''); // New state for extra parameters
    const navigate = useNavigate();

    const handleFilter = () => {
        let queryParts = [];

        if (orderBy) {
            queryParts.push(orderBy);
            queryParts.push('&q=');
        }
        if (color) {
            queryParts.push(color);
            queryParts.push(' ');
        }
        if (legendary) {
            queryParts.push(legendary);
            queryParts.push(' ');
        }
        if (type) {
            queryParts.push(type);
            queryParts.push(' ');
        }

        // Add extra parameters if the field is not empty
        if (extraParams) {
            queryParts.push('t:'+extraParams);
        }

        const queryString = (queryParts.length >= 2) ? queryParts.join(''): '';


        if (queryString) {
            navigate('/list/:rule', { state: { rule: queryString } });
        } else {
            alert("Please include at least two options in filter selection.");
        }
    };

    return (
        <div className="filter-container row">
            <select className="col-md-auto" aria-label="order" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                <option value="order=name">Order by: A-Z (default)</option>
                <option value="order=edhrec">Order by: Popularity</option>
                <option value="order=cmc">Order by: CMC</option>
            </select>
            <select className="col-md-auto" aria-label="color" value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="">Color: </option>
                <option value="c:white">White</option>
                <option value="c:blue">Blue</option>
                <option value="c:black">Black</option>
                <option value="c:red">Red</option>
                <option value="c:green">Green</option>
            </select>
            <select className="col-md-auto" aria-label="legendary" value={legendary} onChange={(e) => setLegendary(e.target.value)}>
                <option value="">Legendary/Non-Legendary </option>
                <option value="t:legend">Legendary</option>
                <option value="-t:legend">Non-Legendary</option>
            </select>
            <select className="col-md-auto" aria-label="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Type: </option>
                <option value="t:artifact">Artifacts</option>
                <option value="t:creature">Creatures</option>
                <option value="t:enchantment">Enchantments</option>
                <option value="t:instant">Instants</option>
                <option value="t:sorcery">Sorceries</option>
                <option value="t:land">Lands</option>
                <option value="t:planeswalker">Planeswalkers</option>
            </select>
            {/* New text field for extra parameters */}
            <input
                type="text"
                className="col-sm-auto"
                placeholder="Extra Parameters (e.g., insect)"
                value={extraParams}
                onChange={(e) => setExtraParams(e.target.value)}
            />
            <button className="filter-button col-md-auto" onClick={handleFilter}>Filter</button>
        </div>
    );
}