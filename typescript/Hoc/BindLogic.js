import { Component } from 'react';

function BindLogic(WrappedComponent, Controller) {

    console.log("BindLogic()", { WrappedComponent, Controller });

    return class extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (<WrappedComponent {...this.props} />);
        }
    };
}

export default BindLogic;