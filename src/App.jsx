import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CardPage from './routes/CardPage';
import Layout from './routes/Layout';
import CardList from './routes/CardList';
import Filter from './middleware/ListFilter';
import Register from './routes/Register';
import Login from './routes/Login';
import DeckDisplay from './routes/DeckDisplay';
import DeckListDisplay from './routes/DeckListDisplay'; // Import the new component
import UserDeckList from './routes/UserDeckList';

function App() {
    const [sidebarDeck, setSidebarDeck] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    //User Control Components
    useEffect(() => {
        // Check local storage on component mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        if (storedUser && storedToken) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setUser(userData.user);
        setAuthToken(userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('authToken', userData.token);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    //Sidebar control
    useEffect(() => {
        const storedDeck = localStorage.getItem('sidebarDeck');
        if (storedDeck) {
            setSidebarDeck(JSON.parse(storedDeck));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarDeck', JSON.stringify(sidebarDeck));
    }, [sidebarDeck]);

    const addToSidebar = (name, Id, type_line) => {
        const newCard = { name, id: Id ,type: type_line};
        setSidebarDeck(prevDeck => {
            if (!prevDeck.some(c => c.id === Id)) {
                return [...prevDeck, newCard];
            }
            return prevDeck;
        });
    };

    const removeFromSidebar = (IdToRemove) => {
        setSidebarDeck(prevDeck => {
            const newDeck = prevDeck.filter(card => card.id !== IdToRemove);
            console.log('New Sidebar Deck:', newDeck);
            return newDeck;
        });
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <Layout
                sidebarDeck={sidebarDeck}
                isSidebarOpen={isSidebarOpen}
                onSidebarToggle={handleSidebarToggle}
                onRemoveCard={removeFromSidebar}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                user={user}
                authToken={authToken}
            />
            <Filter />
            <Routes>
            <Route path="/" element={!user ? <DeckListDisplay authToken={authToken} /> : <UserDeckList user={user} authToken={authToken} />} />

                <Route path='/register' element={<Register />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

                <Route path="/card/:cardName" element={<CardPage addToSidebar={addToSidebar} />} />
                <Route path="/list/:rule" element={<CardList addToSidebar={addToSidebar} />} />
                <Route path="/decks" element={<DeckListDisplay authToken={authToken} />} />
                <Route path='/deck/:deckId' element={<DeckDisplay
                    currentUser={user}
                    authToken={authToken}
                />} />
            </Routes>
        </Router>
    );
}

export default App;