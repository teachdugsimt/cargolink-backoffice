import React, { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import { Gallery, Item } from 'react-photoswipe-gallery'
import styled from 'styled-components';

import mediaApi from '../../../services/media-api';
import UploadVehicleSlot, { DeleteVehicleImageButton, ReplaceVehicleImageButton } from './upload-vehicle-slott';
import { UploadFilePath } from '../../../services/upload-api';
import { TruckNonPersistStore } from '../../../stores/truck-non-persist-store';

interface TruckGalleryWidgetProps {
  id: string
  truckPhotos?: {
    front: string | null
    back: string | null
    left: string | null
    right: string | null
  } | null | undefined
}
const IMG_HEIGHT: number = 130
const TruckGalleryWidget = observer((props: TruckGalleryWidgetProps) => {
  const { truckStore } = useMst()
  const [frontImage, setFrontImage] = useState('')
  const [backImage, setBackImage] = useState('')
  const [leftImage, setLeftImage] = useState('')
  const [rightImage, setRightImage] = useState('')

  async function fetchImage(front: any, back: any, left: any, right: any) {
    if (front) {
      const frontUriResponse = await mediaApi.getFileUrlByAttachCode({ attached_code: front })
      console.log(frontUriResponse)
      setFrontImage(frontUriResponse.ok ? frontUriResponse.data.uri : '')
    } else {
      setFrontImage('')
    }

    if (back) {
      const backUriResponse = await mediaApi.getFileUrlByAttachCode({ attached_code: back })
      console.log(backUriResponse)
      setBackImage(backUriResponse.ok ? backUriResponse.data.uri : '')
    } else {
      setBackImage('')
    }

    if (left) {
      const leftUriResponse = await mediaApi.getFileUrlByAttachCode({ attached_code: left })
      console.log(leftUriResponse)
      setLeftImage(leftUriResponse.ok ? leftUriResponse.data.uri : '')
    } else {
      setLeftImage('')
    }

    if (right) {
      const rightUriResponse = await mediaApi.getFileUrlByAttachCode({ attached_code: right })
      console.log(rightUriResponse)
      setRightImage(rightUriResponse.ok ? rightUriResponse.data.uri : '')
    } else {
      setRightImage('')
    }
  }


  useEffect(() => {
    fetchImage(
      props.truckPhotos?.front,
      props.truckPhotos?.back,
      props.truckPhotos?.left,
      props.truckPhotos?.right
    )
  }, [])

  useEffect(() => {
    fetchImage(
      props.truckPhotos?.front,
      props.truckPhotos?.back,
      props.truckPhotos?.left,
      props.truckPhotos?.right
    )
  }, [props.truckPhotos])

  type positionType = 'left' | 'right' | 'front' | 'back'
  type actionType = 'REPLACE' | 'NEW' | 'NO_CHANGE' | 'DELETE'

  const onUploadDocument = (event: any, position: positionType, action: actionType) => {
    console.log(`🚀  ->  action`, action);
    console.log(`🚀  ->  position`, position);
    event.persist();
    setTimeout(() => {
      let fileObject = event?.target?.files[0] || undefined;
      if (fileObject) {
        console.log("HAHAH Pick file success :: ", fileObject)
        const realPath = position == 'front' ? UploadFilePath.VEHICLE_IMAGE_FRONT :
          position == 'back' ? UploadFilePath.VEHICLE_IMAGE_BACK :
            position == 'left' ? UploadFilePath.VEHICLE_IMAGE_LEFT :
              UploadFilePath.VEHICLE_IMAGE_RIGHT
        TruckNonPersistStore.uploadVehicleImage(realPath, fileObject, position, action, props.id).then(() =>
          truckStore.getTruckById({ truckId: props.id })
        );
      }
    }, 200);
  }

  const onDeleteImage = (position: positionType, action: actionType) => {
    console.log("On delete position :: ", position, action)
    TruckNonPersistStore.uploadVehicleImage(null, null, position, action, props.id).then(() =>
      truckStore.getTruckById({ truckId: props.id })
    );
  }

  const _renderSlotImage = (position: positionType, imageUri: string | null | undefined) => {
    if (imageUri)
      return <Item
        original={imageUri}
        width="1024"
        height="768"
      >
        {({ ref, open }) => (
          <>
            <Row>
              <DeleteVehicleImageButton containerStyles={{ backgroundColor: 'transparent' }}
                position={position} action={"DELETE"} onClick={onDeleteImage} />
            </Row>
            <img style={{ width: 150, height: IMG_HEIGHT, objectFit: 'contain' }}
              key={position + "-image"}
              id={'id-' + position + "-image"}
              ref={ref}
              onClick={open}
              src={imageUri} />
          </>
        )}
      </Item>
    else
      return <>
        <UploadVehicleSlot
          isLoading={TruckNonPersistStore.tmp_position_upload == position
            && TruckNonPersistStore.loading_img}
          position={position}
          action={"NEW"}
          onChange={onUploadDocument}
          containerStyles={{ backgroundColor: 'transparent' }}
        />
      </>
  }

  return <Gallery>
    <ImageWrapper>
      <ImageItem>
        <ImageThumb>
          {_renderSlotImage('left', leftImage)}
        </ImageThumb>
        <ImageLabel>ซ้าย</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          {_renderSlotImage('right', rightImage)}
        </ImageThumb>
        <ImageLabel>ขวา</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          {_renderSlotImage('front', frontImage)}
        </ImageThumb>
        <ImageLabel>หน้า</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          {_renderSlotImage('back', backImage)}
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

const Row = styled.div`
  position: absolute;
  margin-top: -${IMG_HEIGHT + 20}px;
  margin-right: -${IMG_HEIGHT + 30}px;
`
