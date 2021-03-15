import React from "react"
import PropTypes from "prop-types"

export default class HTML extends React.Component {
  render() {
    const allScript = this.props.body
    const addScript = JSON.stringify(allScript) + `<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw"></script>`
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          {this.props.headComponents}
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: addScript }}
          />
          {/* <div
            key={`loader`}
            id="___loader"
            style={{
              alignItems: "center",
              backgroundColor: "#F2F2F2",
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 100,
            }}
          >
            <h1>Loading</h1>
          </div> */}
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}