interface AbstractComponentLogic {
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any, snapshot: any): void;
    componentWillUnmount(): void;
}

export default AbstractComponentLogic;