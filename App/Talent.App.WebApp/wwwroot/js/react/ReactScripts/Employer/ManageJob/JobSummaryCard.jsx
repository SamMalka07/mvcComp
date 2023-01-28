import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button, Label, Icon, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }


    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        var url= 'http://localhost:51689/listing/listing/closeJob';
        console.log(id);

        $.ajax({
            url,
            headers:{
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            data:JSON.stringify(id),
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res);
                let resArray=null;
                    if (res.myJobs) {
                        resArray = [...res.myJobs]
                    }
                    this.setState({
                        loadJobs: resArray
                    })
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
           })
    }

    render() {
        const {item} = this.props;
        return (
            <Card>
                <Card.Content>
                    <Card.Header>{item.title}</Card.Header>
                    <Card.Meta style={{marginTop:'20px'}}>{item.location.city}, {item.location.country}</Card.Meta>
                    <Card.Description>
                        {item.summary}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra style={{marginTop:'30px'}}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div style={{width:'20%'}}>
                            <Label color='red'>
                                Expired
                            </Label>
                        </div>
                        <div className='ui three buttons' style={{width:'75%'}}>
                            <Button basic color='blue' onClick={()=>this.selectJob(item.id)}>
                                <div style={{display:'flex'}}>
                                    <Icon name='edit outline'/> 
                                    <span>Close</span>
                                </div>
                            </Button>
                            <Button basic color='blue' style={{display: 'inline-block'}}>
                                <div style={{display:'flex'}}>
                                    <Icon name='edit outline'/> 
                                    <span>Edit</span>
                                </div>
                                
                            </Button>
                            <Button basic color='blue'>
                                <div style={{display:'flex'}}>
                                        <Icon name='copy outline'/> 
                                        <span>Copy</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                    
                </Card.Content>
            </Card>
                
        )
    }
}