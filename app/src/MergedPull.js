import React from 'react';

import axios from 'axios';

import "./App.css"

export default class MergedList extends React.Component {
    state = {
        merged: []
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/`)
            .then(res => {
                const merged = res.data;
                this.setState({ merged });
            })
    }

    render() {
        return (
            <div>
                {
                    this.state.merged.map((pull, index) => {
                        return (
                            <div key={index} className='Pull'>
                                <img style={{ borderRadius: "50%" }} alt="avatar" src={pull.author.avatar}></img>
                                <div className='Pull-Info'>
                                    <div>
                                        <p className='Pull-Category'>{pull.category}</p>
                                        <p className='Pull-Title'>{pull.title}</p>
                                    </div>
                                    <a className='Pull-Author' href={pull.author.url}><p className='Pull-Author'>{pull.author.username}</p></a>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}