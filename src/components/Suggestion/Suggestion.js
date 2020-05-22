import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
class Suggestion extends React.Component {
    render() {
        return (
            <ListGroup align="left">
                {this.props.list.map(suggestion => {
                    return <ListGroup.Item value={suggestion} action variant="light" onClick={this.props.onClick}>{suggestion}</ListGroup.Item>
                })}
            </ListGroup>
        );
    }
}

export default Suggestion;