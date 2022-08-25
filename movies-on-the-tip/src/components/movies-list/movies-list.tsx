import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faHeart, faXmarkSquare } from '@fortawesome/free-solid-svg-icons';
import { AxiosError } from 'axios';
import Loader from '../loader';
import Message from '../message';
import { getMovies, addFavourites, removeFavourites } from '../../services/movies';
import IMessage from '../../models/IMessage';
import IMovie from '../../models/IMovie';
import './movies-list.css';

const imageBaseURL = `${process.env.REACT_APP_MOVIES_API_BASE_URL}/assets/images`;

export default function MoviesList() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const { category } = useParams();
    const navigate = useNavigate();

    const removeMessage = (messageIndex: number) => {
        setMessages((messages: IMessage[]) => {
            messages.splice(messageIndex, 1);
            return [...messages];
        });
    };

    const fetchMovies = async (url: string) => {
        let movies: IMovie[] = [];

        try {
            setIsLoading(true);
            const moviesResponse = await getMovies(url);
            movies = moviesResponse as IMovie[];
        } catch (error) {
            setMessages((messages: IMessage[]) => {
                messages.push({
                    type: 'error',
                    body: 'Error in fetching movies'
                });
                return [...messages];
            });
        } finally {
            setIsLoading(false);
            setMovies(movies);
            setSearchText('');
        }
    }

    const addToFavourites = async (movie: IMovie) => {
        const message: IMessage = {
            type: 'success',
            body: 'Movie added to favourites'
        };

        try {
            setIsLoading(true);
            await addFavourites(movie);
        } catch (error) {
            message.type = 'error';

            if (error instanceof AxiosError && error.response?.data.includes('duplicate id')) {
                message.body = 'Movie already added in favourites';
            } else {
                message.body = 'Error in adding movie to favourites';
            }
        } finally {
            setIsLoading(false);
            setMessages((messages: IMessage[]) => {
                messages.push(message);
                return [...messages];
            });
        }
    };

    const removeFromFavourites = async (movieId: IMovie["id"]) => {
        const message: IMessage = {
            type: 'success',
            body: 'Movie removed from favourites'
        };

        try {
            setIsLoading(true);
            await removeFavourites(movieId);
            await fetchMovies(category as string);
        } catch (error) {
            message.type = 'error';
            message.body = 'Error in removing movie from favourites';
        } finally {
            setIsLoading(false);
            setMessages((messages: IMessage[]) => {
                messages.push(message);
                return [...messages];
            });
        }
    };

    useEffect(() => {
        fetchMovies(category as string);
    }, [category]);

    useEffect(() => {
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(
            searchText.toLowerCase()
        ));
        setFilteredMovies(filteredMovies);
    }, [searchText, movies]);

    return (
        <>
            {isLoading && (
                <Loader />
            )}

            {!isLoading && messages.length > 0 && (
                <Message
                    messages={messages}
                    onClose={removeMessage}
                />
            )}

            {!isLoading && movies.length > 0 && (
                <Container fluid>
                    <Container
                        className="search-contianer mb-3"
                        fluid
                    >
                        <Form.Control
                            type="text"
                            placeholder="Search movies by title"
                            className="search-input"
                            value={searchText}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="search-icon"
                        />
                    </Container>
                    <Row
                        xxl="6"
                        xl="5"
                        lg="4"
                        md="3"
                        sm="2"
                        xs="1"
                        className="m-0"
                    >
                        {
                            filteredMovies.map((movie, index) => (
                                <Col
                                    key={`${movie.id}-${movie.title}-${index}`}
                                    className="d-flex"
                                >
                                    <Card
                                        className="flex-fill mb-3 movie-card"
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={`${imageBaseURL}/${movie.poster}`}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                        <Card.Body>
                                            <Card.Title className="movie-title">{movie.title}</Card.Title>
                                            <div className="d-grid gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => navigate(movie.id)}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                    <span className="movie-button-text">View Details</span>
                                                </Button>
                                                {
                                                    category === 'favourites'
                                                        ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() => removeFromFavourites(movie.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faXmarkSquare} />
                                                                <span className="movie-button-text">Remove From Favourites</span>
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() => addToFavourites(movie)}
                                                            >
                                                                <FontAwesomeIcon icon={faHeart} />
                                                                <span className="movie-button-text">Add To Favourites</span>
                                                            </Button>
                                                        )
                                                }
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </Container>
            )}

            {!isLoading && (movies.length === 0 || filteredMovies.length === 0) && (
                <div className="no-data">No Data Found</div>
            )}
        </>
    );
}