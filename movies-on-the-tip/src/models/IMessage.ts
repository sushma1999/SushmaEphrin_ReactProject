export default interface IMessage {
    title?: string;
    body: string;
    type?: 'error' | 'success';
}