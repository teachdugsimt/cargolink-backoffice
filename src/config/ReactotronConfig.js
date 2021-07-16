import Reactotron from 'reactotron-react-js'
import apisaucePlugin from 'reactotron-apisauce'
// import { mst } from 'reactotron-mst'


process.env.MODE == 'development' && Reactotron
  .configure() // we can use plugins here -- more on this later
  .use(apisaucePlugin({

  }))
  // .use(mst())
  .connect() // let's connect!
