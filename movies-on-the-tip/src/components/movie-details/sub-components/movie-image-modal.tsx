import { Modal, Image } from 'react-bootstrap';

type Props = {
    show: boolean,
    movieName: string,
    movieImageSrc: string,
    handleClose: () => void
};

export default function MovieImageModal({
    show,
    movieName,
    movieImageSrc,
    handleClose
}: Props) {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            className="d-flex"
            centered
        >
            <Modal.Body className="p-0">
                <Image
                    src={movieImageSrc}
                    alt={movieName}
                    className="rounded"
                />
            </Modal.Body>
        </Modal>
    );
}