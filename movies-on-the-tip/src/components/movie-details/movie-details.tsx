import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Loader from '../loader';
import Message from '../message';
import MovieImageModal from './sub-components/movie-image-modal';
import { getMovies } from '../../services/movies';
import IMessage from '../../models/IMessage';
import IMovie from '../../models/IMovie';
import './movie-details.css';

const imageBaseURL = `${process.env.REACT_APP_MOVIES_API_BASE_URL}/assets/images`;

export default function MovieDetails() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [movieDetails, setMovieDetails] = useState<IMovie | null>(null);
    const [showImageModal, setShowImageModal] = useState<boolean>(false);
    const { category, movieId } = useParams();

    const removeMessage = (messageIndex: number) => {
        setMessages((messages: IMessage[]) => {
            messages.splice(messageIndex, 1);
            return [...messages];
        });
    };

    useEffect(() => {
        async function fetchMovies(url: string) {
            let movieDetails = null;

            try {
                setIsLoading(true);
                const movieDetailsResponse = await getMovies(url);
                movieDetails = movieDetailsResponse as IMovie;
            } catch (error) {
                setMessages((messages: IMessage[]) => {
                    messages.push({
                        type: 'error',
                        body: 'Error in fetching movie details'
                    });
                    return [...messages];
                });
            } finally {
                setIsLoading(false);
                setMovieDetails(movieDetails);
            }
        }

        fetchMovies(`${category}/${movieId}`);
    }, [category, movieId]);

    return (
        <Container fluid>
            {isLoading && (
                <Loader />
            )}

            {!isLoading && messages.length > 0 && (
                <Message
                    messages={messages}
                    onClose={removeMessage}
                />
            )}

            {!isLoading && (
                <Container
                    className="mb-3"
                    fluid
                >
                    <Link
                        to={`/${category as string}`}
                        className="back-link"
                    >
                        Go Back To List
                    </Link>
                </Container>
            )}

            {!isLoading && !movieDetails && (
                <div className="no-data">No Data Found</div>
            )}

            {!isLoading && movieDetails && (
                <>
                    <Row className="m-0">
                        <Col
                            sm="12"
                            md="6"
                            lg="4"
                            xl="3"
                            className="mr-3 mb-3"
                        >
                            <Container
                                className="p-0 movie-image-container"
                                fluid
                            >
                                <Image
                                    src={`${imageBaseURL}/${movieDetails.poster}`}
                                    alt={movieDetails.title}
                                    className="w-100"
                                />
                                <Container
                                    className="image-overlay"
                                    onClick={() => setShowImageModal(true)}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                    <span className="overlay-title">Preview</span>
                                </Container>
                            </Container>
                        </Col>
                        <Col className="px-3">
                            <Row>
                                <h3 className="mb-3">{movieDetails.title} ({movieDetails.year})</h3>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Imdb Rating</Col>
                                <Col>{movieDetails.imdbRating}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Content Rating</Col>
                                <Col>{movieDetails.contentRating}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Average Rating</Col>
                                <Col>{movieDetails.averageRating}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Duration</Col>
                                <Col>{movieDetails.duration}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Genres</Col>
                                <Col>{movieDetails.genres.join(', ')}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Actors</Col>
                                <Col>{movieDetails.actors.join(', ')}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Release Date</Col>
                                <Col>{movieDetails.releaseDate}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col
                                    xs="6"
                                    sm="5"
                                    lg="4"
                                    xl="3"
                                >Story Line</Col>
                                <Col>{movieDetails.storyline}</Col>
                            </Row>
                        </Col>
                    </Row >
                    <MovieImageModal
                        show={showImageModal}
                        movieName={movieDetails.title}
                        movieImageSrc={`${imageBaseURL}/${movieDetails.poster}`}
                        handleClose={() => setShowImageModal(false)}
                    />
                </>
            )}
        </Container>
    );
}