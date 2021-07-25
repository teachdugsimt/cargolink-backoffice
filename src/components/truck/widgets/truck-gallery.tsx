import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import { Gallery, Item } from 'react-photoswipe-gallery'
import styled from 'styled-components';

import { Icon } from 'react-icons-kit'
import { images } from 'react-icons-kit/icomoon/images'
import mediaApi from '../../../services/media-api';

interface TruckGalleryWidgetProps {
  truckPhotos?: {
    front: string | null
    back: string | null
    left: string | null
    right: string | null
  } | null | undefined
}

const TruckGalleryWidget = observer((props: TruckGalleryWidgetProps) => {

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

  // useEffect(() => {
  // const truckType = truckTypesStore.truckTypeNameById(props.truckPhotos)
  // setTruckTypeName(truckType?.name || '')
  // }, [truckTypesStore.data])

  return <Gallery>
    <ImageWrapper>
      <ImageItem>
        <ImageThumb>
          {leftImage ? <Item
            original={leftImage}
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }}
                ref={ref} onClick={open}
                src={leftImage} />
            )}
          </Item> :
            <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
          }
        </ImageThumb>
        <ImageLabel>ซ้าย</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          {rightImage ? <Item
            original={rightImage}
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }}
                ref={ref} onClick={open}
                src={rightImage} />
            )}
          </Item> :
            <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
          }
        </ImageThumb>
        <ImageLabel>ขวา</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          {frontImage ? <Item
            original={frontImage}
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }}
                ref={ref} onClick={open}
                src={frontImage} />
            )}
          </Item> :
            <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
          }
        </ImageThumb>
        <ImageLabel>หน้า</ImageLabel>
      </ImageItem>
      <ImageItem>
        <ImageThumb>
          {backImage ? <Item
            original={backImage}
            width="1024"
            height="768"
          >
            {({ ref, open }) => (
              <img style={{ width: 150, height: 130, objectFit: 'contain' }}
                ref={ref} onClick={open}
                src={backImage} />
            )}
          </Item> :
            <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
          }
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
