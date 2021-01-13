import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, Row, Label, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent'; 


const required = val => val && val.length; 
const maxLength = len => val => !val || (val.length <= len); 
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props); 

        this.state ={
            rating: '', 
            author: '', 
            text: '', 
            isModalOpen: false       
        }
        this.toggleModal = this.toggleModal.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this); 
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text); 
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        }); 
    }

    render() {
        return (
            <>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="form-group">
                                <Label htmlfor="rating">Rating</Label>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                            </div>
                            <div className="form-group">
                                <Label htmlfor="author">Author</Label>
                                <Control.text model=".author" id="author" name="author" className="form-control"
                                    validators={{
                                        required, 
                                        minLength: minLength(2), 
                                        maxLength: maxLength(15)
                                    }}
                                /> 
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required', 
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be at least 15 characters'
                                    }}
                                /> 
                
                            </div>
                            <div className="form-group">
                                <Label htmlfor="text">Comments</Label>
                                <Control.textarea model=".text" id="text" name="text"
                                    rows="6"
                                    className="form-control"
                                />
                            </div>
                            <Button type="submit" color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Button outline onClick={this.toggleModal}>
                    < i className=" fa fa-pencil fa-lg"> Submit Comments</i>
                </Button>
            </>
        )
    }
}

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    )
}

function RenderComments({comments, addComment, campsiteId}) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                {comments.map(comment => {
                    return (
                        <div key={comment.id}>
                            <p>{comment.text} <br />
                                {comment.author} {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
                        </div>
                    );
                })}
                <CommentForm campsiteId={campsiteId} addComment={addComment} /> 
            </div>
        );
    }
    return <div />
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        ); 
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                </div>
            </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        addComment={props.addComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }
    return <div />;
}


export default CampsiteInfo; 