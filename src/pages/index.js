import React from 'react';
import axios from 'axios';

import '../styles/application.scss';

class IndexPage extends React.Component {

    constructor() {
        super();
        this.state = {
            redditResults: null,
            searchValue: '',
            filteredResult:null
        };
        this.modifySearch = this.modifySearch.bind(this);
    }

    /**
     * This method retrieves a reddit science data feed and sets the data into state as an array of:
     *
     * {
     *     url: "https:www.reddit.com/s/some-url",
     *     thumbnail: "https://b.thumbs.redditmedia.com/YHdl2LLiNLu_h2XgBsl2XtXcvj_YE1mJRnBlt7aizeo.jpg",
     *     title: "CDC study finds e-cigarettes responsible for dramatic increase in tobacco use among middle and high school students erasing the decline in teen tobacco product use from previous years."
     * }
     *
     */
    componentDidMount() {
        const component = this;
        axios.get('https://www.reddit.com/r/science.json').then(function(response) {
            const redditResults = response.data.data.children
            .map(node => {
                const data = node.data;
                return {
                    url: `https://www.reddit.com${data.permalink}`,
                    thumbnail: data.thumbnail,
                    title: data.title,
                };
            });
            component.setState({redditResults: redditResults});
        }).catch(function(error) {
            console.log(error);
        });
    }

    modifySearch(e){
        const value = e.target.value
        this.setState({
          searchValue: value
        })
    }

    render() {
        var data = null;
        if((this.state.redditResults===null) && (this.state.searchValue === '')){
            data = null; 
        }else if(this.state.searchValue !== null){
            data = this.state.redditResults.filter((item) => {
                return item.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1;
            });
        }else{
            data = this.state.redditResults;
        }
        return (
            <section>
                <div className="searchBox">
                    <h4>Search</h4>
                    <input type="text" name="search" id="search" onKeyUp={this.modifySearch} />
                </div>

                {data ? (
                    <ul className="results">
                        {data.map(result => (
                            <li className="result-item" key={result.thumbnail}>
                                <a href={result.url}>
                                    <strong>{result.title}</strong>
                                    <img src={result.thumbnail} alt={result.title}/>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : <p>No search results</p>}
            </section>
        );
    }
}

export default IndexPage;