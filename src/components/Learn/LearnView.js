import React from 'react';
import { useState, useEffect } from "react";
import Api from "../../api";
import { ListGroup, Spinner } from "react-bootstrap";
import TopicCards from "./TopicCards";
import './LearnView.css'
import {useNavigate} from 'react-router-dom';
import GroupCards from "./GroupCards";

function LearnView() {

    const navigate = useNavigate();
    useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
        navigate('/fp/login');
    }
    }, []);

    const [tags, setTags] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [filterCondition, setFilterCondition] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const api = new Api();

    useEffect(() => {
        getTags();
    }, []);

    useEffect(() => {
        filterTags();
    }, [filterCondition]);

    function getTags() {
        let tags = []
        api.getTags().then(result => {
            let data = result.data
            Object.keys(data).forEach(function(key) {
                let tag = {}
                let val = data[key]
                tag.tagId = val.tagId
                tag.tagName = val.tagName
                tag.topics = val.topics
                tags.push(tag)
            })
            setTags(tags)
            setFilteredTags(tags)
            setLoading(false)
        })
    }

    function filterTags() {
        if(filterCondition.length !== 0) {
            let filtered = tags.filter(tag => filterCondition.includes(tag.tagName))
            setFilteredTags(filtered)
        }
        else {
            setFilteredTags(tags)
        }
    }

    if(isLoading) {
        return (
            <div style={{textAlign: "center", padding: "100px" ,fontFamily: "Solway"}}>
                <Spinner animation="border" variant="primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        ) 
    }
    return (
        <>
        <div className = "learn-container">
        <div className = "group-container">
            <GroupCards tags = {tags} filterCondition = {filterCondition} setFilterCondition = {setFilterCondition}/>
        </div>
        {filteredTags.map((tag) =>
            <ListGroup key={tag.tagId}>
                <ListGroup.Item className = "tag-container">{tag.tagName}</ListGroup.Item>
                { (filterCondition.length !== 1) ? 
                    <div className = "topics-container">
                        <TopicCards topics = {tag.topics} />
                    </div> :
                    <div>
                        <TopicCards topics = {tag.topics}/>
                    </div> 
                }  
            </ListGroup>
        )}   
        </div>
        </>
    )
}

export default LearnView;