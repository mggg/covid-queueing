import React from 'react';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

class ModelParamTwoCol extends React.Component {
    render() {
        return (
            <Form.Row className="model-param">
                <Col sm="2" />
                <Col sm="3">
                    <Form.Group key={this.props.controlIdLeft} controlId={this.props.controlIdLeft}>
                        <Form.Control type="number"
                                      className="mb-1"
                                      defaultValue={this.props.defaultValueLeft}
                                      onChange={this.props.onChange} />
                        <Form.Label>{this.props.labelLeft}</Form.Label>
                    </Form.Group>
                </Col>
                <Col sm="1" />
                <Col sm="3">
                    <Form.Group key={this.props.controlIdRight} controlId={this.props.controlIdRight}>
                        <Form.Control type="number"
                                      defaultValue={this.props.defaultValueRight}
                                      onChange={this.props.onChange} />
                        <Form.Label>{this.props.labelRight}</Form.Label>
                    </Form.Group>
                </Col>
            </Form.Row>
        );
    }
}

export default ModelParamTwoCol;
