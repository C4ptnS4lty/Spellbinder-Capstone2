import Container from 'react-bootstrap/Container';
import { useNavigate, Link } from 'react-router-dom';
import { useState,useEffect } from 'react'
import { autofill, fetchScryfallData } from '../api.js';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import './Layout.css'

import SidebarDeck from '../middleware/SideBarDeck';

function Layout({ isLoggedIn, user, authToken, onLogout, sidebarDeck, isSidebarOpen, onSidebarToggle, onRemoveCard}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleClose = () => onSidebarToggle();
    const handleShow = () => onSidebarToggle();

    const navigate = useNavigate();

    // Query Control Componenets
    useEffect(() => {
        if (searchQuery.length > 2) { // Only fetch suggestions after 3+ characters
            const fetchSuggestions = async () => {
                const results = await autofill(searchQuery);
                setSuggestions(results);
            };

            fetchSuggestions();
        } else {
            setSuggestions([]); // Clear suggestions if search is empty
        }
    }, [searchQuery]);

    const handleSelect = async (name) => {
        setSearchQuery('');
        try {
        const cardData = await fetchScryfallData(name);
        navigate(`/card/${encodeURIComponent(name)}`, {state: {card: cardData}}); //navigates to card page when clicked
        } catch (err) {
            console.error("Error fetching card:", err);
        }
    };


    return (
        <header>
            <Navbar expand="lg" sticky = "top" className="bg-body-tertiary navbar-dark spell-nav border justify-content-between">
                <Container>
                <Navbar.Brand className='white' onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/`)}}>Spellbinder</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <NavDropdown title="Cards" id="basic-nav-dropdown " className = "Cards">
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/white`, {state: {rule: 'c:white'}})}}
                            >White</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/blue`, {state: {rule: 'c:blue'}})}}
                            >Blue</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/black`, {state: {rule: 'c:black'}})}}
                            >Black</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/red`, {state: {rule: 'c:red'}})}}
                            >Red</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/green`, {state: {rule: 'c:green'}})}}
                            >Green</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/creatures`, {state: {rule: 't:creature'}})}}
                            >Creatures</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/artifacts`, {state: {rule: 't:artifact'}})}}
                            >Artifacts</NavDropdown.Item>
                                <NavDropdown.Item onClick={(event) => {
                                            event.preventDefault();
                                            navigate(`/list/enchantments`, {state: {rule: 't:enchantment'}})}}
                                >Enchantments</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/instants`, {state: {rule: 't:instant'}})}}
                            >Instants</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/sorceries`, {state: {rule: 't:sorcery'}})}}
                            >Sorceries</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/planeswalkers`, {state: {rule: 't:planeswalker'}})}}
                            >Planeswalkers</NavDropdown.Item>
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/list/lands`, {state: {rule: 't:land'}})}}
                            >Lands</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Decks" id="basic-nav-dropdown" className = "Decks">
                            <NavDropdown.Item onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/decks`)}}>Commander</NavDropdown.Item>
                        </NavDropdown>
                        <Navbar.Collapse className="justify-content-end">
                            {isLoggedIn ? (
                                <Navbar.Text>
                                    Signed in: {user?.username}
                                </Navbar.Text>
                            ) : (
                                <button className = 'register' onClick={() => {navigate(`/register`, {state: {user: ''}})}}> Sign Up</button>
                            )}
                            {isLoggedIn ? (
                                <button onClick={onLogout}>Logout</button>
                            ) : (
                                <button onClick={() => {navigate(`/login`, {state: {user: ''}})}}> Log In</button>
                            )}
                            </Navbar.Collapse>
                    </Navbar.Collapse>
                    <Button variant ="primary" onClick={handleShow}>
                        Cards: {sidebarDeck.length}
                    </Button>
                    <Offcanvas show={isSidebarOpen} onHide={handleClose} placement="end">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Saved Cards</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <SidebarDeck deck={sidebarDeck} onRemoveCard={onRemoveCard} authToken={authToken}/>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Container>
            </Navbar>
            <div className="search-container">
                <InputGroup size="lg" className="search m-auto">
                    <InputGroup.Text id="inputGroup-sizing-lg" className="m-auto">
                        Search
                    </InputGroup.Text>

                    <Form.Control
                        aria-label="Large"
                        aria-describedby="inputGroup-sizing-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a card name"
                        className= 'search-display'
                    />
                    <div className = {suggestions.length > 0 ? 'suggestions' : 'hidden'}>
                        {suggestions.length > 0 && (
                            <ul>
                                {suggestions.map((name, index) => (
                                    <li key={index} onClick={() => handleSelect(name)}>{name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </InputGroup>
            </div>
        </header>
    );
}

export default Layout;