import axios from 'axios';
import IMovie from '../models/IMovie';

const baseURL = process.env.REACT_APP_MOVIES_API_BASE_URL;

export async function getMovies(url: string) {
    const response = await axios.get<IMovie[] | IMovie>(`${baseURL}/${url}`);
    return response.data;
}

export async function addFavourites(movie: IMovie) {
    const response = await axios.post<IMovie>(`${baseURL}/favourites`, movie, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export async function removeFavourites(movieId: string) {
    const response = await axios.delete<IMovie>(`${baseURL}/favourites/${movieId}`);
    return response.data;
}