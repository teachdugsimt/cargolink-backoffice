import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import { Gallery, Item } from 'react-photoswipe-gallery'
import styled from 'styled-components';

interface TruckGalleryWidgetProps {
  truckPhotos: object | null | undefined
}

const TruckGalleryWidget = observer((props: TruckGalleryWidgetProps) => {

  // const { truckTypesStore } = useMst()
  // const [truckTypeName, setTruckTypeName] = useState('')

  useEffect(() => {
    // const truckType = truckTypesStore.truckTypeNameById(props.truckPhotos)
    // setTruckTypeName(truckType?.name || '')
  }, [props.truckPhotos])

  // useEffect(() => {
  // const truckType = truckTypesStore.truckTypeNameById(props.truckPhotos)
  // setTruckTypeName(truckType?.name || '')
  // }, [truckTypesStore.data])

  return <Gallery>
    <ImageWrapper>
      <ImageItem>
        <ImageThumb>
          <Item
            original="https://cargolink-documents.s3.ap-southeast-1.amazonaws.com/VEHICLE_IMAGE/BACK/ACTIVE/VEHICLE_IMAGE-BACK-1624537044500"
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }} ref={ref} onClick={open} src="https://cargolink-documents.s3.ap-southeast-1.amazonaws.com/VEHICLE_IMAGE/BACK/ACTIVE/VEHICLE_IMAGE-BACK-1624537044500" />
            )}
          </Item>
        </ImageThumb>
        <ImageLabel>ซ้าย</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          <Item
            original="https://placekitten.com/1024/768?image=2"
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }} ref={ref} onClick={open} src="https://placekitten.com/80/60?image=2" />
            )}
          </Item>
        </ImageThumb>
        <ImageLabel>ขวา</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          <Item
            original="https://placekitten.com/1024/768?image=2"
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }} ref={ref} onClick={open} src="https://placekitten.com/80/60?image=2" />
            )}
          </Item>
        </ImageThumb>
        <ImageLabel>หน้า</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          <Item
            original="https://placekitten.com/1024/768?image=2"
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }} ref={ref} onClick={open} src="https://placekitten.com/80/60?image=2" />
            )}
          </Item>
        </ImageThumb>
        <ImageLabel>หลัง</ImageLabel>
      </ImageItem>
    </ImageWrapper>
  </Gallery>
})

export default TruckGalleryWidget

const ImageWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const ImageItem = styled.div`
  width: 150px;
  height: 150px;
  padding: 10px;
  border: 1px dashed gray;
  border-radius: 5px;
  margin: 5px;
  flex-direction: column;
  display: flex;
  align-items: center;
`;

const ImageThumb = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ImageLabel = styled.span`
  color: gray;
  height: 20px;
`;
