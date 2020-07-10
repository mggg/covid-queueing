import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

class ModelParam extends React.Component {
    render() {
        return (
            <Form.Group as={Row} key={this.props.controlId} className="model-param" controlId={this.props.controlId}>
                <Col sm={4}></Col>
                <Col sm={2}>
                    <Form.Control type="number"
                                  defaultValue={this.props.defaultValue}
                                  onChange={this.props.onChange} />
                </Col>
                <Form.Label column sm={3}>{this.props.label}</Form.Label>
            </Form.Group>
        );
    }
}

export default ModelParam;
