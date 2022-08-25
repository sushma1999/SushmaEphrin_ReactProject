import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from '../navigation';
import MoviesList from '../movies-list';
import MovieDetails from '../movie-details';
import NavItems from '../navigation/constants/nav-items';

export default function App() {
    return (
        <Container
            className="p-0"
            fluid
        >
            <Navigation />
            <Routes>
                <Route
                    path="/:category"
                    element={<MoviesList />}
                />
                <Route
                    path={`/:category/:movieId`}
                    element={<MovieDetails />}
                />
                <Route
                    path="*"
                    element={<Navigate to={NavItems[0].url} replace />}
                />
            </Routes>
        </Container>
    );
}