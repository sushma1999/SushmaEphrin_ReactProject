import { ToastContainer, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import IMessage from '../../models/IMessage';
import './message.css';

type Props = {
    messages: Array<IMessage>,
    onClose: (messageIndex: number) => void
};

export default function Message({
    messages,
    onClose
}: Props) {
    const getMessageVariant = (messageType: IMessage["type"]) => {
        switch (messageType) {
            case 'error':
                return 'danger';
            case 'success':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const getMessageIcon = (messageType: IMessage["type"]) => {
        switch (messageType) {
            case 'error':
                return faCircleXmark;
            case 'success':
                return faCircleCheck;
            default:
                return faCircleInfo;
        }
    };

    const getMessageTitle = (message: IMessage) => {
        if (message.title) {
            return message.title;
        }

        switch (message.type) {
            case 'error':
                return 'Error';
            case 'success':
                return 'Success';
            default:
                return 'Message';
        }
    };

    return (
        <ToastContainer
            className="position-fixed m-2 message-container"
            position="bottom-end"
        >
            {
                messages.map((message: IMessage, index: number) => (
                    <Toast
                        key={index}
                        onClose={() => onClose(index)}
                        show={true}
                        bg={getMessageVariant(message.type)}
                        delay={5000}
                        autohide
                    >
                        <Toast.Header>
                            <FontAwesomeIcon
                                icon={getMessageIcon(message.type)}
                                className="me-2"
                            />
                            <strong className="me-auto">{getMessageTitle(message)}</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">{message.body}</Toast.Body>
                    </Toast>
                ))
            }
        </ToastContainer>
    );
}