import React, { Component } from 'react'
import Method from '../../home/Methods/Method'

export default class ShowSelectMetods extends Component {


  state = {
    methods: null,
     tag: null
  }


  async aaa() {
    const tag = this.props.tag;
    const response = await fetch('http://localhost:5000/method/getmethods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag })
    });
    const data = await response.json()

    this.setState({ methods: data, tag: this.props.tag })

  }

  render() {
    if(this.state.tag  !== this.props.tag){
      this.aaa()
    }


    return (
      <>
        {this.state.methods && this.state.methods.methods.map(method => {
          return <Method method={method} />
        })}
      </>
    )
  }
}

