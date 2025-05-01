import './MagicCard.css';
import React, { useState, useEffect, useCallback } from 'react';
import rotate from "../assets/icons/buttons/rotate-icon.png";
import add from "../assets/icons/buttons/add-button.png";
import remove from ".//assets/icons/buttons/remove-button.png";

export default function MagicCard({ card, onAddToSidebar }) { // Changed to onAddToSidebar
    const [rotation, setRotation] = useState(0);
    const [reversed, setReversed] = useState(false);
    const [toggleFunction, setToggleFunction] = useState(null);
    let cardContent;

    const splitToggle = useCallback(() => {
        setRotation(prevRotation => (prevRotation === 0 ? 90 : 0));
    }, []);

    const flipToggle = useCallback(() => {
        setRotation(prev => (prev + 180) % 360);
    }, []);

    const doubleSidedToggle = useCallback(() => {
        setReversed(prev => !prev);
    }, []);

    useEffect(() => {
        if (card?.layout === 'transform' || card?.layout === 'modal_dfc') {
            setToggleFunction(() => doubleSidedToggle);
        } else if (card?.layout === 'flip') {
            setToggleFunction(() => flipToggle);
        } else if (card?.layout === 'split') {
            setToggleFunction(() => splitToggle);
        } else {
            setToggleFunction(null);
        }
    }, [card, doubleSidedToggle, flipToggle, splitToggle]);

    const handleAddClick = (btn) => {
        if(btn == add) {
            onAddToSidebar(card.name, card.id, card.type_line);
        } else {
            removeFromSidebar(card.id);
        }
    };;

    if (card?.layout === 'transform' || card?.layout === 'modal_dfc') {
        cardContent = (
            <div className="card-container">
                <div className={`doubleSidedCard ${reversed ? 'flipped' : ''}`} onClick={toggleFunction}>
                    <img
                        src={reversed ? card?.card_faces?.[1]?.image_uris?.normal : card?.card_faces?.[0]?.image_uris?.normal}
                        alt={reversed ? card?.card_faces?.[1]?.name : card?.card_faces?.[0]?.name}
                        className="card-image"
                    />
                    <img
                        src={rotate}
                        alt="rotate-icon"
                        className="rotate-icon"
                        onClick={(e) => { e.stopPropagation(); doubleSidedToggle(); }}
                    />
                    <img src = {add}
                        alt="add-button"
                        className="add-button"
                        onClick = {(e) => { e.stopPropagation(); handleAddClick(add); }}
                />
                </div>
            </div>
        );
    } else if (toggleFunction) {
        cardContent = (
            <div className="card-container">
                <img
                    src={card?.image_uris?.normal}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    alt={card?.name}
                    className="card-image"
                />
                <img
                    src={rotate}
                    alt="rotate-icon"
                    className="rotate-icon"
                    onClick={toggleFunction}
                />

                <img src = {add}
                    alt="add-button"
                    className="add-button"
                    onClick = {(e) => { e.stopPropagation(); handleAddClick(); }}
                />
            </div>
        );
    } else {
        cardContent = (
            <div className="card-container">
                {card?.image_uris && <img src={card?.image_uris?.normal} alt={card?.name} className="card-image"/>}
                <img src = {add}
                    alt="add-button"
                    className="add-button"
                    onClick = {(e) => { e.stopPropagation(); handleAddClick(); }}
                />
            </div>
        );
    }

    return cardContent;
}