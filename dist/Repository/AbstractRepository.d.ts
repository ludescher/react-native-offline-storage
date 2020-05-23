declare abstract class AbstractRepository {
    Put<T>(): Promise<T>;
    Post<T>(): Promise<T>;
    Get<T>(): Promise<T>;
    Delete<T>(): Promise<T>;
}
export default AbstractRepository;
