import React from 'react';
import Moment from "moment";

import MyMetaTags from './../components/MyMetaTags';

import './../css/Blog.css';

class Blog extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      articles: [],
      fetching: false
    }
  }
  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({fetching: true});
    fetch('/getblogs', {
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
        this.setState({fetching: false});
      }
      else
      {
        this.setState({
          fetching: false,
          articles: body.blogs
        })
      }
		});
  }

  getColor(i) {
    if(i % 2 === 0)
    {
      return "blogView blogWhite";
    }
    return "blogView blogGray";
  }

  goToArticle(id) {
    this.props.history.push(`/article/${id}`);
  }

  render() {
    return (
      <div className="blogContainer">
        <MyMetaTags page="blog"/>
        <div className="blogLanding">
        </div>
        <div className="blogBody">
          <h2 className="blogPageTitle tahomaBold">
            Move Tailors Blog
          </h2>
          <div className="blogEntries">
            {this.state.articles.map((item, index) => 
              <div className={this.getColor(index)} onClick={() => this.goToArticle(item._id)}>
                {item.cover &&
                  <div className="blogImgContainer" style={{backgroundImage: `url(${item.cover.formats.small.url})`}}>
                  </div>
                }
                <div className="blogTextView">
                  <h2 className="blogTitle tahoma">
                    {item.title}
                  </h2>
                  <p className="blogAuthor tahoma">
                    {item.author} - {Moment(item.date).format("MMM DD, YYYY")}
                    </p>
                  <p className="blogDesc tahoma">
                    {item.description}
                  </p>
                </div>
              </div>
            )}
            {this.state.fetching &&
              <div className="loaderContainer">
                <div className="loader"></div>
              </div>
            }
            {(!this.state.fetching && this.state.articles.length === 0) &&
              <p className="noBlogs tahoma">There are no posts yet, check back later.</p>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Blog;