import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsernameLocation, getUsernameFromString } from '../firebase/databaseUser'
import { communityPageDisplay } from '../firebase/databaseCommunity'

export default function CommunityArticlesSearch() { 

    const [communityList, setCommunityList] = useState([]);

    useEffect(() => {
        communityPageDisplay()
            .then((data) => {
                setCommunityList(data.reverse());
            }).catch((error) => {
                console.log('Error fetching articles: ', error);
            });
    }, []);


    const getLinkValue = (item) => {
        localStorage.removeItem('inputString');
        localStorage.setItem('inputString', item);
        console.log(getUsernameFromString(item));
        getUsernameLocation(getUsernameFromString(item)).then((data) => { 
            localStorage.setItem('RefLocation', data);
        })
    }

    return (
    <>
            <input className="communitySearchBar"
                placeholder="Community Search Bar..."
                    /*on change HERE*/ />
            {communityList.length === 0 ? (
                <p>No Community Entries</p>
            ) : (
                communityList.length > 0 ? (
                    <ol>
                        {communityList.map((item, index) => (
                            <Link to={'/communityJournalEntryView'} onClick={() => getLinkValue(JSON.stringify(item))}><li key={index}>{item}</li></Link>
                        ))}
                    </ol>
                ) : (
                    <p>Loading...</p>
                )
            )}
        </>
)
}