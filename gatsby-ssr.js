const React = require("react")
const loading = require('./src/loading-web-cargo.gif')

// const HeadComponents = [
//   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw" />,
//   <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw&libraries=places" />,
//   <div
//     key={`loader`}
//     id="___loader"
//     style={{
//       alignItems: "center",
//       backgroundColor: "#F2F2F2",
//       display: "flex",
//       justifyContent: "center",
//       position: "absolute",
//       left: 0,
//       top: 0,
//       right: 0,
//       bottom: 0,
//       zIndex: 100,
//     }}
//   >
//     <img
//       // src={"https://i.pinimg.com/originals/65/ba/48/65ba488626025cff82f091336fbf94bb.gif"}
//       src={loading}
//       alt="loading spinner"
//       height="500px"
//     />
//   </div>
// ]


exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  // setHeadComponents(HeadComponents)
}
