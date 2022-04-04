import React from 'react';
import Plot from "react-plotly.js"
import axios from "axios"

import "./App.css"

export default class PullPlot extends React.Component {

    state = {
        data: []
    }

    componentDidMount() {
        axios.get(`http://localhost:3001/chart-data`)
            .then(res => {
                console.log(res.data);
                this.setState({ data: res.data });
                console.log("State: ", this.state.data.data[0])
            })
    }

    render() {
        return (
            <div>
                <Plot
                    className='Plot'
                    data={this.state.data.data}
                    layout={
                        {
                            title: {
                                text: 'Number of Pulls per Topic',
                                font: {
                                    color: "#afafaf"
                                }
                            },
                            paper_bgcolor: "#111111",
                            plot_bgcolor: "#111111",
                            showlegend: false
                        }
                    }
                    config={{ displayModeBar: false }}
                />
            </div>
        )
    }
}