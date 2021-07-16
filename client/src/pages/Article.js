import React from 'react';
import Moment from "moment";

import MyMetaTags from './../components/MyMetaTags';

import './../css/Article.css';

class Article extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      article: {}
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    if(this.props.match.params.id)
    {
      fetch(`/getarticle/${this.props.match.params.id}`, {
      	method: 'GET',
      	headers: {
      		'Accept': 'application/json',
      		'Content-Type': 'application/json'
      	}
      }).then((response) => {
      	return response.json();
      }).then((body) => {
        if(body.message !== 'Success')
        {
          console.log(body.message);
        }
        else
        {
          this.setState({article: body.article});
        }
      });
    }
  }

  render() {
    return (
      <div className="articleContainer">
        <MyMetaTags page="blog"/>
        <div className="articleCover" style={{backgroundImage: `url(${this.state.article.cover ? this.state.article.cover.url : ""}`}}>
        </div>
        <div className="articleContent">
          <h2 className="articleTitle tohomaBold">{this.state.article.title}</h2>
          <p className="articleAuthor tahoma">{this.state.article.author} - {Moment(this.state.article.date).format("MMM DD, YYYY")}</p>
          <div className="articleBody tahoma" dangerouslySetInnerHTML={{__html: this.state.article.body}}></div>
        </div>
      </div>
    )
  }
}

export default Article;