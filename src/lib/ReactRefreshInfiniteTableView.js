import React from 'react'
import ReactDOM from 'react-dom'
import './spinner.css'
import $ from 'jquery'

export default class ReactRefreshInfiniteTableView extends React.Component {

  constructor(props) {
    super(props)
    this.viewDidScroll = this.viewDidScroll.bind(this)
    this.state = {
      isRefreshing : false,
      isLoadingMore : false
    }
  }

  render() {
    // override this to render your own components
    return (
      <div/>
    )
  }

  findNodeIndex(dom) {
    var targetNodeIndex = 0
    var nodes = document.getElementsByClassName(dom.className)
    for (var i=0; i< nodes.length; i++) {
      if (nodes[i]==dom) {
        targetNodeIndex = i
        break
      }
    }
    return targetNodeIndex
  }

  viewDidScroll(event) {
    console.log("onscroll", this);
    

    function getDocumentHeight(argDom) {
      const body = document.body;
      const html = argDom;
      return Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight
      );
    };
    
    function getScrollTop(argDom) {
      if (argDom.scrollTop !== undefined && argDom.scrollTop != 0) 
        return argDom.scrollTop
      else
        return (window.pageYOffset !== undefined) ? window.pageYOffset : (argDom || document.body.parentNode || document.body).scrollTop;
    }


    // vars for calculation p.scrollTop()
    var dom = ReactDOM.findDOMNode(this)
    var scrollviewOffsetY = getScrollTop(dom);
    var scrollviewContentHeight = getDocumentHeight(dom) - window.innerHeight
    console.log(dom.scrollTop !== undefined, window.pageYOffset) ;
    console.log(scrollviewOffsetY, scrollviewContentHeight);
    console.log(scrollviewOffsetY +">="+  scrollviewContentHeight);
    //alert(scrollviewOffsetY +">="+  scrollviewContentHeight);
  
    if (scrollviewOffsetY <= 0  ) {
      
      if (!this.props.onScrollToTop) { return }
      if (this.state.isRefreshing) { return }
      this.setState({isRefreshing: true})

      // event
      this.props.onScrollToTop(function() { this.setState({isRefreshing: false}) }.bind(this))

    } else if (scrollviewOffsetY +57 >= scrollviewContentHeight) {

      if (!this.props.onScrollToBottom) { return }
      if (this.state.isLoadingMore) { return }
      this.setState({isLoadingMore: true})

      // event
      this.props.onScrollToBottom(function() { this.setState({isLoadingMore: false}) }.bind(this))
      
    }

  }
}

ReactRefreshInfiniteTableView.defaultProps = {
  useDefaultIndicator: true
}