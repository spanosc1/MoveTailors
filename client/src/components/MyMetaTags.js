import React from 'react';
import MetaTags from 'react-meta-tags';

import Meta from './../meta/meta';

class MyMetaTags extends React.Component {
  render() {
    console.log(this.props.page);
    return (
      <MetaTags>
        <title>{Meta[this.props.page].title}</title>
        <meta name="description" content={Meta[this.props.page].metaDesc} />
        <meta property="url" content={Meta[this.props.page].url} />
        <meta property="image" content="https://movetailor-blog.s3.amazonaws.com/about1_be38b84ef4.jpg"/>
      </MetaTags>
    )
  }
}

export default MyMetaTags;