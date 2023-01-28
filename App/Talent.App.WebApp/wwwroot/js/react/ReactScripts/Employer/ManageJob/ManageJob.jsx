import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        this.loadData(() =>
           this.setState({ loaderData })
        );

        this.state.loaderData.isLoading = false;
        
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
       $.ajax({
        url: link,
        headers:{
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        data:{
            activePage:this.state.activePage, 
            sortbyDate:true, 
            showActive:this.state.filter.showActive, 
            showClosed:this.state.filter.showClosed , 
            showDraft: this.state.filter.showDraft , 
            showExpired: this.state.filter.showExpired, 
            showUnexpired: this.state.filter.showUnexpired
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            console.log(res.myJobs);
            let resArray=null;
                if (res.myJobs) {
                    // let newSD = [Object.assign({}, this.state.loadJobs, res.myJobs)]
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

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                console.log('unbliading')
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handleChange(e, { value }){
        console.log(value);
    }

    render() {

        const filters = [
            { key: 1, text: 'Choose Filter', value: "" },
            { key: 2, text: 'Show Active', value: this.state.filter.showActive },
            { key: 3, text: 'Show Closed', value: this.state.filter.showClosed },
            { key: 4, text: 'Show Expired', value: this.state.filter.showExpired },
            { key: 5, text: 'Show Unexpired', value: this.state.filter.showUnexpired },
        ]

        const dateFilter = [
            { key: 1, text: 'Newest First', value: "asc" },
            { key: 2, text: 'Oldest First', value: "desc" },
        ]

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div style={{width:'70%', margin:'0px auto'}}>
                <h1>List of Jobs</h1>
                <div style={{marginBottom:'10px', marginTop:'30px', display:'flex'}}>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <Icon name="filter"/>Filter: 
                        <Dropdown
                            placeholder='Choose Filter'
                            selection
                            options={filters}
                            onChange={this.handleChange}
                            style={{marginLeft:'5px', marginRight:'10px'}}
                        />
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <Icon name="calendar alternate"/>Sort by date: 
                        <Dropdown
                            placeholder='Choose Filter'
                            selection
                            options={dateFilter}
                            onChange={this.handleChange}
                            style={{marginLeft:'5px', marginRight:'10px'}}
                        />
                    </div>
                </div>
                <Card.Group itemsPerRow={3}>
                    {this.state.loadJobs.map((item)=>{
                        return (<JobSummaryCard key={item.id} item={item}/>)
                    })}
                </Card.Group>
               </div>
            </BodyWrapper>
        )
    }
}