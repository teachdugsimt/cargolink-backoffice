import React from 'react';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { CSSProperties } from 'styled-components';
import LottieView from 'react-lottie';

const FLEX_ALLCENTER: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
const FRAME_MESSAGE: CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }


const SuccessAnimate = (props: any) => (
  <LottieView
    options={{
      autoplay: true,
      loop: false,
      animationData: require(`../../images/animations/${props.point}.json`),
    }}
    // width={30}
    // height={30}
  />
);


const Success = (props: any) => {
  const { location } = props
  const { state } = location
  const { title, content } = state
  console.log("Props success screen :: ", props)
  return <Row style={{ width: '100%' }}>
    <Col breakPoint={{ xs: 12 }}>
      <Row center="xs">
        <Col breakPoint={{ xs: 10, lg: 10 }} style={FLEX_ALLCENTER}>
          <div style={FRAME_MESSAGE}>
            <SuccessAnimate point={"success-animation"}/>
            <h1>{title}</h1>
            <span>{content}</span>
          </div>
        </Col>
      </Row>
    </Col>
  </Row>
};
export default Success;
