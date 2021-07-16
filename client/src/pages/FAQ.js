import React from 'react';
import Collapse from '@kunukn/react-collapse';

import MyMetaTags from './../components/MyMetaTags';

import "./../css/FAQ.css";

class FAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faq: []
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    // this.setState({faq: faq});
    fetch('/getfaq', {
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
        this.setState({faq: body.faqs});
      }
		});
  }

  toggleCategory(index) {
    this.setState({[index]: !this.state[index]});
  }

  render() {
    return (
      <div className="faqContainer">
        <MyMetaTags page="faq"/>
        <div className="faqLanding">
        </div>
        <div className="questionsContainer">
          <div className="questionsContent">
            <div className="questionsTitleView">
              <h2 className="questionsTitle tahomaBold">
                Frequently asked questions (FAQs)
              </h2>
              <p className="questionsSubTitle tahoma">
                Here you can find the most commonly requested information about moving and our services.
              </p>
            </div>
            <div className="questionsView">
              {this.state.faq.map((item, index) => 
                <div className="categoryContainer" key={`c${index}`}>
                  <button className="categoryTab" onClick={() => this.toggleCategory(index)}>
                    <h3 className="categoryName tahomaBold">{item.title}</h3>
                    <p className="categoryPlus tahomaBold">{this.state[index] ? "-" : "+"}</p>
                  </button>
                  <Collapse isOpen={this.state[index]}>
                    <div className="categoryQuestions">
                      {item.faq_items.map((item, index) =>
                        <div key={`c${index}`}>
                          <button className="questionButton tahomaBold" onClick={() => this.toggleCategory(`q${index}`)}>
                            - {item.question}
                          </button>
                          <Collapse isOpen={this.state[`q${index}`]}>
                            <p className="answer">
                              {item.answer}
                            </p>
                          </Collapse>
                        </div>
                      )}
                    </div>
                  </Collapse>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FAQ;