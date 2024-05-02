import React from 'react';
import Card from 'react-bootstrap/Card';
import { Col, Row } from 'react-bootstrap'; 

export default function BlogComments({ comment }) {
    return (
        <div>
            <Card className='my-3 py-1'>
                <Row className='d-flex flex-row justify-content-start align-items-center '>
                    <Col xs={2}>
                        <Card.Title className='p-0 m-0'>{comment.user}</Card.Title>
                    </Col>
                    <Col xs={9}>
                        <Card.Body className='p-0 m-0'>{comment.comment_content}</Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
