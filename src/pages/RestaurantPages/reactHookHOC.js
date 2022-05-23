import React from 'react';
import {Link, useLocation} from 'react-router-dom';

function reactHookHOC(Component) {
    return function WrappedComponent(props) {
      const location = useLocation();
      return <Component {...props} location={location} />;
    }
}

class MyComponent extends React.Component {
    render(){
      const location = this.props.location;
      return <div>{location}</div>;
    }
}

export default withMyHook(MyComponent);