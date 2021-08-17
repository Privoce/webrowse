import React from 'react';
import styled from 'styled-components';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import IconArrowLeft from '../icons/ArrowLeft';
import IconArrowRight from '../icons/ArrowRight';
import Camera from '../Camera';
import { VeraStatus } from '../hooks/useEmitter';
SwiperCore.use([Navigation]);
const tipNext = chrome.i18n.getMessage('tipNext');
const tipPrev = chrome.i18n.getMessage('tipPrev');

const StyledWrapper = styled.div``;
export default function CameraList({
  joined = false,
  peerId = null,
  panelRef,
  layout,
  streams = {},
  remoteUsers = [],
  dataConnections,
  mediaConnections
}) {
  const renderCameras = () => {
    console.log({ remoteUsers });
    // if (!panelRef.current) return null;
    let count = joined ? Object.keys(streams).length : 0;
    const remotes = count
      ? remoteUsers.map(({ peerId: pid, username = 'Guest' }) => {
        let st = streams[pid];
        let dataConn = dataConnections[pid];
        let mediaConn = mediaConnections[pid];
        console.log('current camera username', username);
        const status = st ? VeraStatus.STREAMING : mediaConn ? VeraStatus.JOINING : VeraStatus.WAITING;
        return count > 2 ? (
          <SwiperSlide key={pid}>
            <Camera
              status={status}
              username={{ value: username }}
              peerId={pid}
              key={pid}
              dataConnection={dataConn}
              mediaStream={st}
            />
          </SwiperSlide>
        ) : (
          <Camera
            status={status}
            username={{ value: username }}
            peerId={pid}
            key={pid}
            dataConnection={dataConn}
            mediaStream={st}
          />
        );
      })
      : [];
    return count > 2 ? (
      <Swiper
        // direction={'vertical'}
        direction={layout == 'vt' ? 'vertical' : 'horizontal'}
        observer={true}
        resizeObserver={true}
        slidesPerView={layout == 'one' ? 1 : 3}
        spaceBetween={layout == 'one' ? 0 : 15}
        navigation={{
          prevEl: panelRef.current.querySelector('.cameras .nav.prev'),
          nextEl: panelRef.current.querySelector('.cameras .nav.next')
        }}
        onUpdate={() => {
          console.log('swiper update');
        }}
        onDestroy={() => {
          console.log('swiper destory');
        }}
      >
        <SwiperSlide>
          <Camera dataConnections={dataConnections} peerId={peerId} remote={false} />
        </SwiperSlide>
        {remotes}
      </Swiper>
    ) : (
      [
        <Camera key={peerId} dataConnections={dataConnections} peerId={peerId} remote={false} />,
        ...remotes
      ]
    );
  };
  let remoteCount = remoteUsers.length;
  let cameraSlides = remoteCount > 2;
  let camerasStyle = cameraSlides
    ? layout == 'vt'
      ? { height: 'calc(60em + 30px)' }
      : layout == 'one'
        ? { width: '20em' }
        : { width: 'calc(60em + 30px)' }
    : {};
  return (
    <StyledWrapper
      className={`cameras ${cameraSlides ? 'slides' : ''}`}
      data-count={`+ ${remoteCount - 2}`}
      style={camerasStyle}
    >
      {cameraSlides && (
        <div className="nav prev" title={tipNext}>
          <IconArrowLeft />
        </div>
      )}
      {renderCameras()}
      {cameraSlides && (
        <div className="nav next" title={tipPrev}>
          <IconArrowRight />
        </div>
      )}
    </StyledWrapper>
  );
}
