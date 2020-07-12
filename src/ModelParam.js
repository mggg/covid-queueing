import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

class ModelParam extends React.Component {
    render() {
        return (
            <Form.Group key={this.props.controlId} className="model-param" controlId={this.props.controlId}>
                <Row>
                    <Col md={4}></Col>
                    <Col md={2}>
                        <Form.Control type="number"
                                      value={this.props.value}
                                      onChange={this.props.onChange}
                                      isInvalid={!!this.props.errors}
                        />
                    </Col>
                <Form.Label column md={3}>{this.props.label}</Form.Label>
                </Row>
                {(() => {
                    if (!!this.props.errors) {
                        return (<Form.Control.Feedback type="invalid">
                                    <Row>
                                        <Col md={4}></Col>
                                        <Col md={4}><p>{this.props.errors}</p></Col>
                                    </Row>
                                </Form.Control.Feedback>
                        );
                    }
                })()}
            </Form.Group>
        );
    }
}

export default ModelParam;
