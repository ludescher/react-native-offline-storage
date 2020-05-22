abstract class AbstractRepository {
    async Put<T>(): Promise<T> {
        return new Promise(() => {});
    }

    async Post<T>(): Promise<T> {
        return new Promise(() => {});
    }

    async Get<T>(): Promise<T> {
        return new Promise(() => {});
    }

    async Delete<T>(): Promise<T> {
        return new Promise(() => {});
    }
}

export default AbstractRepository;